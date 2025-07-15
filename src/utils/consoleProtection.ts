/**
 * Proteção silenciosa contra inspeção e uso indevido do console em produção.
 * Silencia o console, detecta debugger e DevTools, e recarrega a página se ativados.
 */

const isProduction = import.meta.env.MODE === "production";

class ConsoleProtection {
  private detectionActive = false;

  constructor() {
    if (isProduction) {
      this.disableConsole();
      this.preventDebugging();
      this.detectDevTools();
    }
  }

  private disableConsole() {
    try {
      const noop = () => {};
      console.log = noop;
      console.warn = noop;
      console.error = noop;
      console.info = noop;
      console.debug = noop;

      // Impede reatribuição do console
      Object.defineProperty(window, "console", {
        value: console,
        writable: false,
        configurable: false,
      });
    } catch (_) {
      // Silêncio em caso de erro
    }
  }

  private preventDebugging() {
    setInterval(() => {
      const start = performance.now();
      debugger;
      const duration = performance.now() - start;

      if (duration > 100) {
        location.reload(); // Se alguém pausou com debugger, força reload
      }
    }, 1000);
  }

  private detectDevTools() {
    const threshold = 160;

    setInterval(() => {
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!this.detectionActive) {
          this.detectionActive = true;
          location.reload(); // Força reload ao abrir DevTools
        }
      }
    }, 1000);
  }
}

// Ativa a proteção imediatamente
new ConsoleProtection();
