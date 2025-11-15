const { onRequest } = require("firebase-functions/v2/https");
const express = require("express");
const cors = require("cors");
const stripeService = require("./stripe.cjs");

const app = express();

// Middlewares - CORS configurado para aceitar localhost e produção
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requisições sem origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);

    // Lista de origens permitidas explicitamente
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "http://localhost:4173",
      "https://geeklogg.com",
      "https://www.geeklogg.com",
      "https://geeklog-diary.web.app",
      "https://geeklog-diary.firebaseapp.com",
    ];

    const isExplicitlyAllowed = allowedOrigins.includes(origin);
    const isGeekloggSubdomain = /^https:\/\/[a-z0-9-]+\.geeklogg\.com$/i.test(origin);

    if (isExplicitlyAllowed || isGeekloggSubdomain) {
      callback(null, true);
    } else {
      console.log("⚠️ Origem bloqueada por CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Webhook do Stripe precisa do raw body
app.post("/stripe-webhook", express.raw({ type: "application/json" }), (req, res) => {
  req.rawBody = req.body;
  stripeService.handleWebhook(req, res);
});

// JSON parser para outras rotas
app.use(express.json());

// --- ROTAS ---

app.get("/health", (req, res) => {
  res.status(200).send("Backend Gen 2 está no ar! 🚀");
});

// --- ROTAS DO STRIPE ---

// Criar sessão de checkout do Stripe
app.post("/stripe-create-checkout", stripeService.createCheckoutSession);

// Criar portal de gerenciamento de assinatura
app.post("/stripe-customer-portal", stripeService.createCustomerPortal);

// --- EXPORTAÇÃO DA FUNÇÃO (Gen 2) ---
exports.api = onRequest(
  {
    memory: "256MiB",
    timeoutSeconds: 60,
    maxInstances: 10,
    cors: true,
  },
  app
);
