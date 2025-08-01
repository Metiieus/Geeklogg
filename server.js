import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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

// Criar preferência de pagamento
app.post('/create-preference', async (req, res) => {
  try {
    const { uid, email } = req.body;
    
    if (!uid || !email) {
      return res.status(400).json({ error: 'UID e Email são obrigatórios.' });
    }

    // URLs de retorno baseadas no ambiente
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

    // Aqui você integraria com Firebase para atualizar o usuário
    // Por enquanto, apenas simula sucesso
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

// Webhook do MercadoPago (opcional)
app.post('/webhook', (req, res) => {
  console.log('📨 Webhook recebido:', req.body);
  res.status(200).send('OK');
});

// Middleware de erro global
app.use((error, req, res, next) => {
  console.error('Erro não tratado:', error);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app;
