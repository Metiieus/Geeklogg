import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4242;

// Configuração da IGDB API (via Twitch OAuth)
const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID || '';
const IGDB_ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN || '';
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET || '';

// Rate limiting para IGDB (4 requests/second)
class IGDBRateLimiter {
  constructor() {
    this.requests = [];
    this.maxRequests = 4;
    this.timeWindow = 1000; // 1 segundo
  }

  async throttle() {
    const now = Date.now();
    
    // Remove requests antigas do time window
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    // Se atingiu o limite, aguarda
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.timeWindow - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.throttle(); // Tenta novamente
    }
    
    // Registra a request atual
    this.requests.push(now);
  }
}

const rateLimiter = new IGDBRateLimiter();

// Cache para token refreshed
let tokenCache = {
  token: IGDB_ACCESS_TOKEN,
  expiresAt: null
};

// Validar e refresh token se necessário
async function validateAndRefreshToken() {
  try {
    // Se não tem token, gerar um novo
    if (!tokenCache.token || (tokenCache.expiresAt && Date.now() >= tokenCache.expiresAt)) {
      console.log('🔄 Refreshing IGDB access token...');
      
      const response = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: IGDB_CLIENT_ID,
          client_secret: TWITCH_CLIENT_SECRET,
          grant_type: 'client_credentials'
        })
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data = await response.json();
      tokenCache = {
        token: data.access_token,
        expiresAt: Date.now() + (data.expires_in * 1000) - 300000 // -5 min buffer
      };
      
      console.log('✅ IGDB token refreshed successfully');
    }

    return tokenCache.token;
  } catch (error) {
    console.error('🚨 Failed to refresh IGDB token:', error);
    throw error;
  }
}

// Validar headers antes da request
function validateHeaders(clientId, token) {
  const errors = [];
  
  if (!clientId || typeof clientId !== 'string') {
    errors.push('Client-ID header is missing or invalid');
  }
  
  if (!token || typeof token !== 'string') {
    errors.push('Authorization token is missing or invalid');
  } else if (!token.startsWith('Bearer ')) {
    errors.push('Authorization header must start with "Bearer "');
  }
  
  return errors;
}

// Middleware para logs de autenticação
function logAuthAttempt(req, clientId, hasToken) {
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  console.log(`🔐 IGDB Auth Attempt:`, {
    ip,
    userAgent: userAgent.substring(0, 50) + '...',
    clientId: clientId ? `${clientId.substring(0, 8)}***` : 'MISSING',
    hasToken: hasToken,
    timestamp: new Date().toISOString()
  });
}

// IGDB API Proxy (✔️ MELHORADO)
app.post('/api/igdb/games', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ 
        error: 'Query é obrigatória',
        details: 'O campo "query" deve conter uma query válida da IGDB'
      });
    }

    // Validar configuração básica
    if (!IGDB_CLIENT_ID) {
      console.error('🚨 IGDB_CLIENT_ID not configured');
      return res.status(503).json({
        error: 'IGDB API not configured',
        message: 'Configure IGDB_CLIENT_ID environment variable'
      });
    }

    // Aplicar rate limiting
    await rateLimiter.throttle();

    // Obter token válido (refresh se necessário)
    let accessToken;
    try {
      accessToken = await validateAndRefreshToken();
    } catch (tokenError) {
      console.error('🚨 Token validation failed:', tokenError);
      return res.status(503).json({
        error: 'Authentication failed',
        message: 'Failed to obtain valid IGDB access token'
      });
    }

    // Log da tentativa de autenticação
    logAuthAttempt(req, IGDB_CLIENT_ID, !!accessToken);

    // Validar headers antes da request
    const headerErrors = validateHeaders(IGDB_CLIENT_ID, `Bearer ${accessToken}`);
    if (headerErrors.length > 0) {
      console.error('🚨 Header validation failed:', headerErrors);
      return res.status(400).json({
        error: 'Invalid headers',
        details: headerErrors
      });
    }

    const response = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': IGDB_CLIENT_ID,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'text/plain',
        'User-Agent': 'GeekLog/1.0' // Identificar a aplicação
      },
      body: query,
    });

    // Log detalhado da resposta
    console.log(`📊 IGDB Response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      
      // Casos específicos de erro de autenticação
      if (response.status === 401) {
        console.error('🚨 IGDB Authentication failed - Invalid token');
        // Limpar cache do token para forçar refresh na próxima tentativa
        tokenCache = { token: null, expiresAt: null };
      } else if (response.status === 403) {
        console.error('🚨 IGDB Forbidden - Check Client-ID');
      } else if (response.status === 429) {
        console.error('🚨 IGDB Rate limit exceeded');
      }
      
      throw new Error(`IGDB API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ IGDB Request successful - ${data.length || 0} results`);
    res.json(data);

  } catch (error) {
    console.error('🚨 ERRO no proxy IGDB:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({
      error: 'Erro no proxy IGDB',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// IGDB API Health Check (✔️ MELHORADO)
app.get('/api/igdb/status', async (req, res) => {
  try {
    if (!IGDB_CLIENT_ID) {
      return res.status(503).json({
        status: 'not_configured',
        message: 'IGDB_CLIENT_ID not configured',
        details: 'Configure environment variables'
      });
    }

    // Tentar obter token válido
    let accessToken;
    try {
      accessToken = await validateAndRefreshToken();
    } catch (tokenError) {
      return res.status(503).json({
        status: 'token_error',
        message: 'Failed to obtain valid access token',
        details: tokenError.message
      });
    }

    // Aplicar rate limiting
    await rateLimiter.throttle();

    const response = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': IGDB_CLIENT_ID,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'text/plain',
        'User-Agent': 'GeekLog/1.0'
      },
      body: 'fields id; limit 1;',
    });

    if (response.ok) {
      res.json({ 
        status: 'ok', 
        message: 'IGDB API disponível',
        tokenCached: !!tokenCache.token,
        tokenExpiresAt: tokenCache.expiresAt ? new Date(tokenCache.expiresAt).toISOString() : null
      });
    } else {
      const errorText = await response.text();
      
      let errorDetails = 'Unknown error';
      if (response.status === 401) {
        errorDetails = 'Invalid or expired access token';
      } else if (response.status === 403) {
        errorDetails = 'Invalid Client-ID or insufficient permissions';
      } else if (response.status === 429) {
        errorDetails = 'Rate limit exceeded (max 4 req/sec)';
      }
      
      res.status(503).json({
        status: 'error',
        message: `IGDB API error: ${response.status} - ${errorText}`,
        details: errorDetails
      });
    }

  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint para forçar refresh do token (útil para debug)
app.post('/api/igdb/refresh-token', async (req, res) => {
  try {
    // Limpar cache
    tokenCache = { token: null, expiresAt: null };
    
    // Obter novo token
    const newToken = await validateAndRefreshToken();
    
    res.json({
      success: true,
      message: 'Token refreshed successfully',
      expiresAt: tokenCache.expiresAt ? new Date(tokenCache.expiresAt).toISOString() : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🎮 IGDB Status: http://localhost:${PORT}/api/igdb/status`);
});

export default app;
