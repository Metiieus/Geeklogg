/**
 * Logger seguro para produção
 * Remove logs sensíveis quando em ambiente de produção
 */

const isProduction = import.meta.env.PROD;

// Lista de palavras-chave que indicam dados sensíveis
const SENSITIVE_KEYWORDS = [
  'token', 'key', 'secret', 'password', 'email', 'uid', 
  'firebase', 'api', 'credential', 'auth', 'preference_id'
];

// Função para verificar se um log contém dados sensíveis
const containsSensitiveData = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  return SENSITIVE_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
};

// Função para sanitizar dados sensíveis
const sanitizeLogData = (data: any): any => {
  if (typeof data === 'string') {
    return containsSensitiveData(data) ? '[REDACTED]' : data;
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (SENSITIVE_KEYWORDS.some(keyword => key.toLowerCase().includes(keyword))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeLogData(value);
      }
    }
    return sanitized;
  }
  
  return data;
};

export const secureLog = {
  info: (message: string, ...args: any[]) => {
    if (isProduction && containsSensitiveData(message)) {
      return; // Não loga dados sensíveis em produção
    }
    console.log(message, ...args.map(sanitizeLogData));
  },
  
  warn: (message: string, ...args: any[]) => {
    if (isProduction && containsSensitiveData(message)) {
      console.warn('[SECURITY] Tentativa de log com dados sensíveis bloqueada');
      return;
    }
    console.warn(message, ...args.map(sanitizeLogData));
  },
  
  error: (message: string, ...args: any[]) => {
    // Errors sempre são logados, mas dados sensíveis são sanitizados
    console.error(message, ...args.map(sanitizeLogData));
  },
  
  debug: (message: string, ...args: any[]) => {
    if (isProduction) {
      return; // Debug logs não aparecem em produção
    }
    console.log(`[DEBUG] ${message}`, ...args);
  }
};

// Função para substituir console.log em produção
export const initSecureLogging = () => {
  if (isProduction) {
    // Substitui console.log por versão segura em produção
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      const message = args[0]?.toString() || '';
      if (containsSensitiveData(message)) {
        return; // Bloqueia logs sensíveis
      }
      originalLog(...args.map(sanitizeLogData));
    };
  }
};
