/**
 * Sistema de logging seguro - evita exposição de dados sensíveis em produção
 */

const isDevelopment = import.meta.env.MODE === "development";

export const secureLog = {
  /**
   * Log para desenvolvimento - não exibe em produção
   */
  dev: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Log de informações gerais (sempre exibido, mas sem dados sensíveis)
   */
  info: (message: string, safeData?: any) => {
    console.log(message, safeData);
  },

  /**
   * Log de erro seguro - filtra informações sensíveis
   */
  error: (message: string, error: any) => {
    if (isDevelopment) {
      console.error(message, error);
    } else {
      // Em produção, só loga o código do erro e mensagem básica
      console.error(message, {
        code: error?.code || "unknown",
        type: error?.name || "Error",
      });
    }
  },

  /**
   * Log de warning seguro
   */
  warn: (message: string, safeData?: any) => {
    console.warn(message, safeData);
  },

  /**
   * Log de dados do usuário - apenas UID em produção
   */
  userAction: (action: string, userId?: string, extraData?: any) => {
    if (isDevelopment) {
      console.log(`👤 ${action}:`, { userId, ...extraData });
    } else {
      console.log(`👤 ${action} - UID: ${userId || "anonymous"}`);
    }
  },

  /**
   * Log de API calls - sem dados sensíveis
   */
  api: (endpoint: string, method: string, success: boolean) => {
    const status = success ? "✅" : "❌";
    console.log(`${status} API ${method.toUpperCase()} ${endpoint}`);
  },
};

// Função para sanitizar objetos removendo dados sensíveis
export const sanitizeForLog = (obj: any): any => {
  if (!obj || typeof obj !== "object") return obj;

  const sensitive = [
    "password",
    "token",
    "key",
    "secret",
    "email",
    "phone",
    "credit",
  ];
  const sanitized = { ...obj };

  Object.keys(sanitized).forEach((key) => {
    const lowerKey = key.toLowerCase();
    if (sensitive.some((word) => lowerKey.includes(word))) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof sanitized[key] === "object") {
      sanitized[key] = sanitizeForLog(sanitized[key]);
    }
  });

  return sanitized;
};

export default secureLog;
