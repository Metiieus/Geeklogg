// Sistema de log condicional - apenas em desenvolvimento
// Em produção, logs sensíveis são silenciados para segurança

const isDevelopment = import.meta.env.DEV;

/**
 * Log de desenvolvimento - só aparece em modo dev
 * Silenciado em produção para não expor dados sensíveis
 */
export const devLog = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  error: (...args: any[]) => {
    // Erros sempre aparecem, mas sem dados sensíveis em produção
    if (isDevelopment) {
      console.error(...args);
    } else {
      // Em produção, mostra apenas mensagem genérica
      console.error('Erro na aplicação. Verifique os logs do servidor.');
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
};

/**
 * Log de produção - sempre aparece, mas sem dados sensíveis
 * Use apenas para informações não-sensíveis
 */
export const prodLog = {
  log: console.log.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
  info: console.info.bind(console),
};

// Export padrão para uso fácil
export default devLog;
