const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { MercadoPagoConfig, Preference } = require("mercadopago");

// As variáveis de ambiente são lidas automaticamente em produção
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
const preference = new Preference(client);

const app = express();

// Middlewares
app.use(cors({ origin: true }));
app.use(express.json());

// --- ROTAS (sem o prefixo /api) ---

app.get("/health", (req, res) => {
    res.status(200).send("Backend está no ar!");
});

app.post("/create-preference", async (req, res) => {
    try {
        const { uid, email } = req.body;
        if (!uid || !email) {
            return res.status(400).json({ error: "UID e Email são obrigatórios." });
        }

        const preferenceData = {
            items: [{
                title: "GeekLog Premium",
                description: "Assinatura Mensal do GeekLog Premium",
                quantity: 1,
                currency_id: "BRL",
                unit_price: 12.90,
            }],
            payer: { email },
            back_urls: {
                success: `${process.env.CLIENT_URL}/premium/success`,
                failure: `${process.env.CLIENT_URL}/premium/failure`,
                pending: `${process.env.CLIENT_URL}/premium/pending`,
            },
            auto_return: "approved",
        };
        
        const result = await preference.create({ body: preferenceData });
        return res.status(200).json({
            init_point: result.init_point,
            preference_id: result.id,
        });

    } catch (err) {
        console.error("🚨 ERRO em /create-preference:", err);
        const errorMessage = err.cause?.error?.message || err.message || 'Erro desconhecido.';
        return res.status(500).json({ error: errorMessage });
    }
});

app.post("/update-premium", (req, res) => {
    // Sua lógica de atualização aqui
    console.log("Atualizando plano do usuário para Premium.");
    res.status(200).json({ success: true });
});

// --- EXPORTAÇÃO DA FUNÇÃO ---
exports.api = functions.https.onRequest(app);