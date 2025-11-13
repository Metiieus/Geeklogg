const admin = require("firebase-admin");
const { defineSecret } = require("firebase-functions/v2/params");
const stripeLib = require("stripe");

// Definir secrets para Gen 2 (opcional, mas recomendado)
// const stripeSecretKey = defineSecret('STRIPE_SECRET_KEY');
// const stripeWebhookSecret = defineSecret('STRIPE_WEBHOOK_SECRET');

// Inicializar Stripe de forma lazy (apenas quando necessário)
let stripe = null;
function getStripe() {
  if (!stripe) {
    // Gen 2: usar process.env diretamente (configurado via Firebase Console ou CLI)
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY não configurada. Configure via: firebase functions:secrets:set STRIPE_SECRET_KEY');
    }
    stripe = stripeLib(secretKey);
  }
  return stripe;
}

// Inicializar Firebase Admin se ainda não foi inicializado
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Criar sessão de checkout do Stripe
 */
async function createCheckoutSession(req, res) {
  try {
    const { userId, email, priceId } = req.body;

    if (!userId || !email) {
      return res.status(400).json({ error: "userId e email são obrigatórios" });
    }

    // Usar o priceId fornecido ou o padrão
    const stripePriceId = priceId || process.env.STRIPE_PRICE_ID;

    if (!stripePriceId) {
      return res.status(500).json({ 
        error: "STRIPE_PRICE_ID não configurado" 
      });
    }

    // Verificar se o usuário já tem um customer ID do Stripe
    const userDoc = await db.collection("users").doc(userId).get();
    let customerId = userDoc.data()?.stripeCustomerId;

    // Criar customer no Stripe se não existir
    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: email,
        metadata: {
          firebaseUID: userId,
        },
      });
      customerId = customer.id;

      // Salvar customer ID no Firestore
      await db.collection("users").doc(userId).set(
        { stripeCustomerId: customerId },
        { merge: true }
      );
    }

    // Criar sessão de checkout
    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/premium/cancel`,
      metadata: {
        firebaseUID: userId,
      },
      subscription_data: {
        metadata: {
          firebaseUID: userId,
        },
      },
    });

    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("❌ Erro ao criar checkout session:", error);
    return res.status(500).json({ 
      error: error.message || "Erro ao criar sessão de checkout" 
    });
  }
}

/**
 * Criar portal de gerenciamento de assinatura
 */
async function createCustomerPortal(req, res) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId é obrigatório" });
    }

    // Buscar customer ID do Stripe
    const userDoc = await db.collection("users").doc(userId).get();
    const customerId = userDoc.data()?.stripeCustomerId;

    if (!customerId) {
      return res.status(404).json({ 
        error: "Cliente não encontrado no Stripe" 
      });
    }

    // Criar sessão do portal
    const session = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.CLIENT_URL}/profile`,
    });

    return res.status(200).json({
      url: session.url,
    });
  } catch (error) {
    console.error("❌ Erro ao criar portal session:", error);
    return res.status(500).json({ 
      error: error.message || "Erro ao criar portal de gerenciamento" 
    });
  }
}

/**
 * Webhook do Stripe para processar eventos
 */
async function handleWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verificar assinatura do webhook
    event = getStripe().webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("❌ Erro na verificação do webhook:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Processar evento
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdate(event.data.object);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;

      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`⚠️ Evento não tratado: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("❌ Erro ao processar webhook:", error);
    return res.status(500).json({ error: "Erro ao processar webhook" });
  }
}

/**
 * Processar checkout completado
 */
async function handleCheckoutCompleted(session) {
  console.log("✅ Checkout completado:", session.id);

  const userId = session.metadata.firebaseUID;
  const customerId = session.customer;
  const subscriptionId = session.subscription;

  if (!userId) {
    console.error("❌ userId não encontrado nos metadados");
    return;
  }

  // Atualizar usuário no Firestore
  await db.collection("users").doc(userId).set(
    {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      subscriptionTier: "premium",
      subscriptionStatus: "active",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  console.log(`✅ Usuário ${userId} atualizado para Premium`);
}

/**
 * Processar atualização de assinatura
 */
async function handleSubscriptionUpdate(subscription) {
  console.log("🔄 Assinatura atualizada:", subscription.id);

  const userId = subscription.metadata.firebaseUID;

  if (!userId) {
    console.error("❌ userId não encontrado nos metadados");
    return;
  }

  const status = subscription.status;
  const tier = ["active", "trialing"].includes(status) ? "premium" : "free";

  await db.collection("users").doc(userId).set(
    {
      stripeSubscriptionId: subscription.id,
      subscriptionTier: tier,
      subscriptionStatus: status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  console.log(`✅ Assinatura do usuário ${userId} atualizada: ${tier} (${status})`);
}

/**
 * Processar cancelamento de assinatura
 */
async function handleSubscriptionDeleted(subscription) {
  console.log("❌ Assinatura cancelada:", subscription.id);

  const userId = subscription.metadata.firebaseUID;

  if (!userId) {
    console.error("❌ userId não encontrado nos metadados");
    return;
  }

  await db.collection("users").doc(userId).set(
    {
      subscriptionTier: "free",
      subscriptionStatus: "canceled",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  console.log(`✅ Usuário ${userId} voltou para Free`);
}

/**
 * Processar pagamento bem-sucedido
 */
async function handlePaymentSucceeded(invoice) {
  console.log("💰 Pagamento bem-sucedido:", invoice.id);

  const customerId = invoice.customer;
  const subscriptionId = invoice.subscription;

  // Buscar usuário pelo customer ID
  const usersSnapshot = await db
    .collection("users")
    .where("stripeCustomerId", "==", customerId)
    .limit(1)
    .get();

  if (usersSnapshot.empty) {
    console.error("❌ Usuário não encontrado para customer:", customerId);
    return;
  }

  const userId = usersSnapshot.docs[0].id;

  await db.collection("users").doc(userId).set(
    {
      subscriptionTier: "premium",
      subscriptionStatus: "active",
      lastPaymentDate: new Date(invoice.created * 1000),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  console.log(`✅ Pagamento processado para usuário ${userId}`);
}

/**
 * Processar falha de pagamento
 */
async function handlePaymentFailed(invoice) {
  console.log("⚠️ Falha no pagamento:", invoice.id);

  const customerId = invoice.customer;

  // Buscar usuário pelo customer ID
  const usersSnapshot = await db
    .collection("users")
    .where("stripeCustomerId", "==", customerId)
    .limit(1)
    .get();

  if (usersSnapshot.empty) {
    console.error("❌ Usuário não encontrado para customer:", customerId);
    return;
  }

  const userId = usersSnapshot.docs[0].id;

  await db.collection("users").doc(userId).set(
    {
      subscriptionStatus: "past_due",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  console.log(`⚠️ Status atualizado para past_due: ${userId}`);
}

module.exports = {
  createCheckoutSession,
  createCustomerPortal,
  handleWebhook,
};
