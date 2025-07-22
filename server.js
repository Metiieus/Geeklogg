// server.js
import express from "express";
import cors from "cors";
import mercadopago from "mercadopago";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

// --- 1) CONFIGURAÇÃO DO MERCADO PAGO ---
if (!process.env.MP_ACCESS_TOKEN) {
  console.error("❌ MERCADO_PAGO_ACCESS_TOKEN não definido em .env");
  process.exit(1);
}
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});
console.log("✅ MercadoPago configurado");

// --- 2) CONFIGURAÇÃO DO FIREBASE ADMIN ---
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.warn(
    "⚠️ GOOGLE_APPLICATION_CREDENTIALS não definido. " +
    "Webhook de ativação de plano poderá falhar."
  );
}
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
const db = admin.firestore();
console.log("✅ Firebase Admin inicializado");

// --- 3) APP & MIDDLEWARES ---
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

// --- 4) ROTA: CREATE PREFERENCE ---
app.post("/api/create-preference", async (req, res) => {
  try {
    const { uid, email } = req.body;
    if (!uid || !email) {
      return res
        .status(400)
        .json({ error: "Parâmetros uid e email são obrigatórios" });
    }

    const preference = {
      items: [
        {
          title: "GeekLog Premium",
          description: "Assinatura Premium do GeekLog",
          quantity: 1,
          currency_id: "BRL",
          unit_price: 9.90, // Preço em Reais
          picture_url: "https://example.com/logo.png", // URL da imagem do produto
        },
      ],
      external_reference: uid,
      payer: { email },
      back_urls: {
        success: `${process.env.CLIENT_URL}/premium/success`,
        failure: `${process.env.CLIENT_URL}/premium/failure`,
        pending: `${process.env.CLIENT_URL}/premium/pending`,
      },
      auto_return: "approved",
      notification_url:
        `${process.env.SERVER_URL || "http://localhost:4242"}/api/webhook`,
    };

    const { body } = await mercadopago.preferences.create(preference);
    return res.json({
      init_point: body.init_point,
      preference_id: body.id,
    });
  } catch (err: any) {
    console.error("🚨 /api/create-preference error:", err);
    return res.status(500).json({ error: err.message || err.toString() });
  }
});

// --- 5) ROTA: WEBHOOK MP ---
app.post("/api/webhook", async (req, res) => {
  try {
    const mpBody = req.body;
    console.log("🔔 Webhook MP recebido:", mpBody);

    // Exemplo mínimo de tratamento
    if (mpBody.type === "payment" && mpBody.data?.id) {
      const payment = await mercadopago.payment.get(mpBody.data.id);
      console.log("✅ Payment detail:", payment.body.status);
      // Você pode atualizar o Firestore aqui, por ex. ativar premium se aprovado
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error("🚨 /api/webhook error:", err);
    return res.sendStatus(400);
  }
});

// --- 6) ROTA: ATUALIZAÇÃO DO PLANO NO FIRESTORE ---
app.post("/api/update-premium", async (req, res) => {
  try {
    const { uid, preference_id } = req.body;
    if (!uid || !preference_id) {
      return res
        .status(400)
        .json({ error: "uid e preference_id são obrigatórios" });
    }

    await db
      .collection("users")
      .doc(uid)
      .set(
        {
          plano: {
            status: "ativo",
            tipo: "premium",
            mercadoPagoPreferenceId: preference_id,
            activatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
        },
        { merge: true }
      );

    console.log("🎉 Premium ativado para:", uid);
    return res.json({ success: true });
  } catch (err) {
    console.error("🚨 /api/update-premium error:", err);
    return res.status(500).json({ error: err.message || err.toString() });
  }
});

// --- 7) HEALTHCHECK & START SERVER ---
app.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () =>
  console.log(`🚀 Server rodando em http://localhost:${PORT}`)
);
