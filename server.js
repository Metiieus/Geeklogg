// server.js
import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

// --- 1) CONFIGURAÇÃO DO MERCADO PAGO ---
if (!process.env.MP_ACCESS_TOKEN) {
  console.error("❌ MP_ACCESS_TOKEN não definido em .env");
  process.exit(1);
}
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
const preference = new Preference(client);
const payment = new Payment(client);
console.log("✅ MercadoPago configurado");

// --- 2) CONFIGURAÇÃO DO FIREBASE ADMIN ---
let db = null;
let isFirebaseInitialized = false;

try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } else if (process.env.FIREBASE_PROJECT_ID) {
    // Inicialização alternativa sem service account para desenvolvimento
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  } else {
    throw new Error("No Firebase credentials or project ID provided");
  }

  db = admin.firestore();
  isFirebaseInitialized = true;
  console.log("✅ Firebase Admin inicializado");
} catch (error) {
  console.warn(
    "⚠️ Firebase Admin não inicializado:", error.message +
    " Webhook de ativação de plano não funcionará."
  );
}

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

    const preferenceData = {
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
        `${process.env.SERVER_URL || "http://localhost:8080"}/api/webhook`,
    };

    const { body } = await preference.create({ body: preferenceData });
    return res.json({
      init_point: body.init_point,
      preference_id: body.id,
    });
  } catch (err) {
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
      const paymentResponse = await payment.get({ id: mpBody.data.id });
      console.log("✅ Payment detail:", paymentResponse.body.status);
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
    if (!isFirebaseInitialized) {
      return res.status(503).json({
        error: "Firebase Admin não inicializado. Configure as credenciais do Firebase."
      });
    }

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

// --- 7) ROTA: IGDB PROXY ---
app.post("/api/igdb/:endpoint", async (req, res) => {
  try {
    const { endpoint } = req.params;
    const { query } = req.body;

    const igdbClientId = process.env.VITE_IGDB_CLIENT_ID;
    const igdbToken = process.env.VITE_IGDB_ACCESS_TOKEN;

    if (!igdbClientId || !igdbToken) {
      return res.status(500).json({ error: "IGDB credentials not configured" });
    }

    const response = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
      method: "POST",
      headers: {
        "Client-ID": igdbClientId,
        "Authorization": `Bearer ${igdbToken}`,
        "Content-Type": "application/json",
      },
      body: query,
    });

    if (!response.ok) {
      throw new Error(`IGDB API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("🚨 IGDB proxy error:", error);
    res.status(500).json({ error: error.message || error.toString() });
  }
});

// --- 8) HEALTHCHECK & START SERVER ---
app.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`🚀 Server rodando em http://localhost:${PORT}`)
);
