import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4242;

// Servidor simplificado - pagamentos agora usam link direto do MercadoPago

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

// RAWG API é acessada diretamente do frontend, não precisa de proxy

// API simplificada - MercadoPago agora usa link direto

// Endpoint de status para verificar se o servidor está ativo
app.get('/status', (req, res) => {
  res.status(200).json({
    status: 'active',
    message: 'GeekLog API está funcionando!',
    timestamp: new Date().toISOString()
  });
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
