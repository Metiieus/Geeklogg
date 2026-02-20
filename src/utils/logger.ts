/**
 * Utilitário de logging condicional
 * Logs só aparecem em desenvolvimento
 */

const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: any[]) => {
    if (isDev) logger.log(...args);
  },
  
  warn: (...args: any[]) => {
    if (isDev) logger.warn(...args);
  },
  
  error: (...args: any[]) => {
    // Sempre logar erros
    console.error(...args);
  },
  
  info: (...args: any[]) => {
    if (isDev) logger.info(...args);
  },
  
  debug: (...args: any[]) => {
    if (isDev) console.debug(...args);
  },
};

export default logger;
