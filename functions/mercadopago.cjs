const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const admin = require('firebase-admin');

// Inicializar Firebase Admin se ainda não foi
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Configurar Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

const preferenceClient = new Preference(client);
const paymentClient = new Payment(client);

/**
 * Criar preferência de pagamento (assinatura mensal)
 */
async function createPreference(req, res) {
  try {
    const { uid, email } = req.body;

    if (!uid || !email) {
      return res.status(400).json({
        error: 'UID e email são obrigatórios'
      });
    }

    console.log(`📝 Criando preferência para usuário: ${uid} (${email})`);

    // Criar preferência de pagamento
    const preference = await preferenceClient.create({
      body: {
        items: [
          {
            id: 'geeklogg-premium-monthly',
            title: 'GeekLogg Premium - Assinatura Mensal',
            description: 'Acesso completo aos recursos Premium do GeekLogg',
            category_id: 'digital_content',
            quantity: 1,
            unit_price: 9.90, // R$ 9,90/mês
            currency_id: 'BRL',
          }
        ],
        payer: {
          email: email,
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL || 'https://geeklog-26b2c.web.app'}/premium-success`,
          failure: `${process.env.FRONTEND_URL || 'https://geeklog-26b2c.web.app'}/premium-cancel`,
          pending: `${process.env.FRONTEND_URL || 'https://geeklog-26b2c.web.app'}/premium-pending`,
        },
        auto_return: 'approved',
        external_reference: uid, // Salvar UID do usuário
        notification_url: `${process.env.CLOUD_FUNCTION_URL || 'https://us-central1-geeklog-26b2c.cloudfunctions.net/api'}/mercadopago-webhook`,
        statement_descriptor: 'GEEKLOGG PREMIUM',
        metadata: {
          user_id: uid,
          plan: 'premium-monthly',
        },
      }
    });

    console.log(`✅ Preferência criada: ${preference.id}`);

    // Salvar preferência no Firestore para referência
    await db.collection('payment_preferences').doc(preference.id).set({
      userId: uid,
      email: email,
      preferenceId: preference.id,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      init_point: preference.init_point,
      preference_id: preference.id,
    });

  } catch (error) {
    console.error('❌ Erro ao criar preferência:', error);
    res.status(500).json({
      error: 'Erro ao criar preferência de pagamento',
      details: error.message
    });
  }
}

/**
 * Atualizar usuário para Premium após pagamento confirmado
 */
async function updateUserPremium(req, res) {
  try {
    const { uid, preference_id } = req.body;

    if (!uid || !preference_id) {
      return res.status(400).json({
        error: 'UID e preference_id são obrigatórios'
      });
    }

    console.log(`👑 Atualizando usuário ${uid} para Premium`);

    // Verificar se a preferência existe e está paga
    const preferenceDoc = await db.collection('payment_preferences').doc(preference_id).get();
    
    if (!preferenceDoc.exists) {
      return res.status(404).json({
        error: 'Preferência de pagamento não encontrada'
      });
    }

    const preferenceData = preferenceDoc.data();

    if (preferenceData.status !== 'approved') {
      return res.status(400).json({
        error: 'Pagamento ainda não foi aprovado',
        status: preferenceData.status
      });
    }

    // Atualizar usuário para Premium
    await db.collection('users').doc(uid).update({
      isPremium: true,
      premiumSince: admin.firestore.FieldValue.serverTimestamp(),
      premiumPlan: 'monthly',
      lastPaymentDate: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`✅ Usuário ${uid} atualizado para Premium`);

    res.status(200).json({
      success: true,
      message: 'Usuário atualizado para Premium com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar usuário:', error);
    res.status(500).json({
      error: 'Erro ao atualizar usuário para Premium',
      details: error.message
    });
  }
}

/**
 * Webhook do Mercado Pago para processar notificações de pagamento
 */
async function handleWebhook(req, res) {
  try {
    console.log('🔔 Webhook recebido do Mercado Pago');
    console.log('Query params:', req.query);
    console.log('Body:', req.body);

    const { type, data } = req.body;

    // Responder imediatamente ao Mercado Pago
    res.status(200).send('OK');

    // Processar notificação de forma assíncrona
    if (type === 'payment') {
      const paymentId = data.id;
      console.log(`💳 Processando pagamento: ${paymentId}`);

      // Buscar informações do pagamento
      const payment = await paymentClient.get({ id: paymentId });
      
      console.log('Detalhes do pagamento:', {
        id: payment.id,
        status: payment.status,
        external_reference: payment.external_reference,
      });

      if (payment.status === 'approved') {
        const userId = payment.external_reference; // UID do usuário
        const preferenceId = payment.metadata?.preference_id;

        if (userId) {
          console.log(`✅ Pagamento aprovado para usuário: ${userId}`);

          // Atualizar preferência
          if (preferenceId) {
            await db.collection('payment_preferences').doc(preferenceId).update({
              status: 'approved',
              paymentId: payment.id,
              approvedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
          }

          // Atualizar usuário para Premium
          await db.collection('users').doc(userId).update({
            isPremium: true,
            premiumSince: admin.firestore.FieldValue.serverTimestamp(),
            premiumPlan: 'monthly',
            lastPaymentDate: admin.firestore.FieldValue.serverTimestamp(),
            lastPaymentId: payment.id,
          });

          console.log(`👑 Usuário ${userId} promovido para Premium!`);
        }
      } else if (payment.status === 'rejected' || payment.status === 'cancelled') {
        console.log(`❌ Pagamento ${payment.status}: ${paymentId}`);
        
        const preferenceId = payment.metadata?.preference_id;
        if (preferenceId) {
          await db.collection('payment_preferences').doc(preferenceId).update({
            status: payment.status,
            paymentId: payment.id,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      }
    }

  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    // Não retornar erro para o Mercado Pago (já respondemos 200)
  }
}

/**
 * Cancelar assinatura Premium
 */
async function cancelPremium(req, res) {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({
        error: 'UID é obrigatório'
      });
    }

    console.log(`🚫 Cancelando Premium do usuário: ${uid}`);

    await db.collection('users').doc(uid).update({
      isPremium: false,
      premiumCancelledAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'Assinatura Premium cancelada'
    });

  } catch (error) {
    console.error('❌ Erro ao cancelar Premium:', error);
    res.status(500).json({
      error: 'Erro ao cancelar assinatura',
      details: error.message
    });
  }
}

module.exports = {
  createPreference,
  updateUserPremium,
  handleWebhook,
  cancelPremium,
};
