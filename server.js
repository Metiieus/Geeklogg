// server.js (VERSÃO CORRIGIDA E FUNCIONAL)
import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";
import dotenv from "dotenv";
import admin from "firebase-admin";

// 1. Carrega variáveis de ambiente
dotenv.config();

// 2. Loga as principais variáveis
console.log("[CONFIG] Lendo variáveis de ambiente...");
console.log(`[CONFIG] CLIENT_URL lida: ${process.env.CLIENT_URL}`);
console.log(`[CONFIG] MP_ACCESS_TOKEN lido: ${process.env.MP_ACCESS_TOKEN ? 'Sim' : 'Não'}`);

// 3. Valida as variáveis obrigatórias
if (!process.env.MP_ACCESS_TOKEN) {
  console.error("❌ ERRO FATAL: MP_ACCESS_TOKEN não definido em .env");
  process.exit(1);
}
if (!process.env.CLIENT_URL) {
  console.error("❌ ERRO FATAL: CLIENT_URL não definido em .env");
  process.exit(1);
}

// 4. Configura Mercado Pago
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
const preference = new Preference(client);
console.log("✅ MercadoPago configurado");

// 5. Firebase Admin (opcional)
let db = null;
try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.GOOGLE_APPLICATION_CREDENTIALS.includes('caminho/para')) {
    admin.initializeApp({ credential: admin.credential.applicationDefault() });
  } else if (process.env.FIREBASE_PROJECT_ID) {
    admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });
  } else {
    throw new Error("Credenciais do Firebase não encontradas");
  }
  db = admin.firestore();
  console.log("✅ Firebase Admin inicializado");
} catch (error) {
  console.warn("⚠️ Firebase Admin não inicializado:", error.message);
}

// 6. Inicializa o app
const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

// 7. Rota de criação de preferência Mercado Pago
app.post("/api/create-preference", async (req, res) => {
  console.log("➡️  Requisição recebida: /api/create-preference");
  try {
    const { uid, email } = req.body;
    if (!uid || !email) {
      return res.status(400).json({ error: "Parâmetros uid e email são obrigatórios" });
    }

    const clientUrl = process.env.CLIENT_URL;
    console.log(`[PREFERENCE] Usando CLIENT_URL: ${clientUrl}`);

    const preferenceData = {
      items: [{
        title: "GeekLog Premium",
        description: "Assinatura Mensal do GeekLog Premium",
        quantity: 1,
        currency_id: "BRL",
        unit_price: 12.90,
      }],
      external_reference: uid,
      payer: { email },
      back_urls: {
        success: `${clientUrl}/premium/success`,
        failure: `${clientUrl}/premium/failure`,
        pending: `${clientUrl}/premium/pending`,
      },
      auto_return: "approved",
      // notification_url: `${process.env.SERVER_URL}/api/webhook` // opcional
    };

    // Log para depuração
    console.log("[DEBUG] Dados enviados ao Mercado Pago:", JSON.stringify(preferenceData, null, 2));

    const result = await preference.create({ body: preferenceData });

    console.log("✅ Preferência criada com sucesso!");
    return res.json({
      init_point: result.init_point,
      preference_id: result.id,
    });
  } catch (err) {
    console.error("🚨 Erro ao criar preferência:", err);
    const errorMessage = err.cause?.error?.message || err.message || "Erro desconhecido ao criar preferência.";
    return res.status(500).json({ error: errorMessage });
  }
});

// 8. Webhook e outras rotas
app.post("/api/webhook", (req, res) => {
  console.log("🔔 Webhook Mercado Pago recebido:", req.body);
  res.sendStatus(200);
});

app.post("/api/update-premium", async (req, res) => {
  // ... sua lógica aqui ...
});

app.post("/api/igdb/:endpoint", async (req, res) => {
  // ... sua lógica aqui ...
});

// 9. Healthcheck
app.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

// 10. Inicia o servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server rodando em http://localhost:${PORT}`);
});
