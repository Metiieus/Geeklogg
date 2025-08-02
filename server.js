import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MercadoPagoConfig, Preference } from 'mercadopago';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4242;

// Configuração da IGDB API (via Twitch OAuth)
const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID || '';
const IGDB_ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN || '';

// Configuração do MercadoPago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-1234567890-123456-abcdef1234567890abcdef1234567890-123456789'
});
const preference = new Preference(client);

// Middlewares
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://geeklog-26b2c.web.app',
    'https://geeklog-26b2c.firebaseapp.com'
  ],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend está funcionando!' });
});

// Proxy para IGDB API com query corrigida e expand
app.post('/api/igdb/games', async (req, res) => {
  try {
    let { query } = req.body;

    console.log('📨 Received IGDB request body:', req.body);

    if (!query) {
      return res.status(400).json({
        error: 'Query é obrigatória',
        message: 'O campo query deve estar presente no body da requisição'
      });
    }

    // Limpar e formatar a query
    query = query.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    console.log('✅ Query formatada:', query);

    if (!IGDB_CLIENT_ID || !IGDB_ACCESS_TOKEN) {
      console.warn('🟡 IGDB credentials not configured');
      return res.status(503).json({
        error: 'IGDB API not configured',
        message: 'Configure IGDB_CLIENT_ID e IGDB_ACCESS_TOKEN nas variáveis de ambiente'
      });
    }

    const response = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': IGDB_CLIENT_ID,
        'Authorization': `Bearer ${IGDB_ACCESS_TOKEN}`,
        'Content-Type': 'text/plain',
      },
      body: query,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na resposta da IGDB:', errorText);
      return res.status(response.status).json({
        error: `IGDB API error: ${response.status}`,
        message: errorText
      });
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('🚨 ERRO no proxy IGDB:', error);
    res.status(500).json({
      error: 'Erro no proxy IGDB',
      message: error.message,
    });
  }
});

// IGDB API Health Check
app.get('/api/igdb/status', async (req, res) => {
  try {
    if (!IGDB_CLIENT_ID || !IGDB_ACCESS_TOKEN) {
      return res.status(503).json({
        status: 'not_configured',
        message: 'IGDB credentials not configured'
      });
    }

    const response = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': IGDB_CLIENT_ID,
        'Authorization': `Bearer ${IGDB_ACCESS_TOKEN}`,
        'Content-Type': 'text/plain',
      },
      body: 'fields id; limit 1;',
    });

    if (response.ok) {
      res.json({ status: 'ok', message: 'IGDB API disponível' });
    } else {
      const errorText = await response.text();
      res.status(503).json({
        status: 'error',
        message: `IGDB API error: ${response.status} - ${errorText}`
      });
    }

  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: error.message
    });
  }
});

// Criar preferência de pagamento MercadoPago
app.post('/create-preference', async (req, res) => {
  try {
    const { uid, email } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ error: 'UID e Email são obrigatórios.' });
    }

    const isDev = req.get('host')?.includes('localhost');
    const baseUrl = isDev 
      ? 'http://localhost:5173' 
      : 'https://geeklog-26b2c.web.app';

    const preferenceData = {
      items: [{
        title: "GeekLog Premium",
        description: "Assinatura Premium do GeekLog",
        quantity: 1,
        currency_id: "BRL",
        unit_price: 19.99,
      }],
      payer: { email },
      back_urls: {
        success: `${baseUrl}/premium/success`,
        failure: `${baseUrl}/premium/failure`,
        pending: `${baseUrl}/premium/pending`,
      },
      auto_return: "approved",
      external_reference: uid,
    };

    const result = await preference.create({ body: preferenceData });

    res.status(200).json({
      init_point: result.init_point,
      preference_id: result.id,
    });

  } catch (error) {
    console.error('🚨 ERRO em /create-preference:', error);
    const errorMessage = error.cause?.error?.message || error.message || 'Erro desconhecido.';
    res.status(500).json({ error: errorMessage });
  }
});

// Atualizar status premium do usuário
app.post('/update-premium', async (req, res) => {
  try {
    const { uid, preference_id } = req.body;

    if (!uid || !preference_id) {
      return res.status(400).json({ error: 'UID e Preference ID são obrigatórios.' });
    }

    console.log(`Atualizando usuário ${uid} para premium com preference ${preference_id}`);

    res.status(200).json({ 
      success: true, 
      message: 'Premium ativado com sucesso!' 
    });

  } catch (error) {
    console.error('🚨 ERRO em /update-premium:', error);
    res.status(500).json({ error: error.message || 'Erro ao atualizar premium.' });
  }
});

// Webhook MercadoPago
app.post('/webhook', (req, res) => {
  console.log('📨 Webhook recebido:', req.body);
  res.status(200).send('OK');
});

// Middleware de erro global
app.use((error, req, res, next) => {
  console.error('Erro não tratado:', error);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Start do servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app;
