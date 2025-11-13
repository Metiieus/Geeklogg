const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripeService = require("./stripe.cjs");

const app = express();

// Middlewares
app.use(cors({ origin: true }));

// Webhook do Stripe precisa do raw body
app.post("/stripe-webhook", express.raw({ type: "application/json" }), (req, res) => {
  req.rawBody = req.body;
  stripeService.handleWebhook(req, res);
});

// JSON parser para outras rotas
app.use(express.json());

// --- ROTAS ---

app.get("/health", (req, res) => {
  res.status(200).send("Backend está no ar! 🚀");
});

// --- ROTAS DO STRIPE ---

// Criar sessão de checkout do Stripe
app.post("/stripe-create-checkout", stripeService.createCheckoutSession);

// Criar portal de gerenciamento de assinatura
app.post("/stripe-customer-portal", stripeService.createCustomerPortal);

// --- EXPORTAÇÃO DA FUNÇÃO ---
exports.api = functions.https.onRequest(app);
