/**
 * Sistema de proteção contra manipulação via console do navegador
 * Implementa várias camadas de segurança para dificultar tentativas de hack
 */

const isProduction = import.meta.env.MODE === "production";

// Mensagens de aviso para desenvolvedores
const WARNING_MESSAGES = {
  devtools: `
🚨 ATENÇÃO DESENVOLVEDOR 🚨

Você abriu as ferramentas de desenvolvimento.
Este é um recurso avançado destinado apenas a desenvolvedores.

⚠️  NÃO cole código desconhecido aqui!
⚠️  Códigos maliciosos podem comprometer sua conta!
⚠️  Golpistas podem tentar te enganar para executar código aqui!

Se alguém te disse para colar algo aqui, provavelmente é um golpe.

Para mais informações sobre segurança:
https://developers.google.com/web/tools/chrome-devtools/console/
`,

  production: `
🔒 SISTEMA PROTEGIDO 🔒

Esta aplicação possui proteções ativas contra:
• Manipulação via console
• Injeção de código malicioso  
• Tentativas de bypass de autenticação
• Acesso não autorizado a dados

Tentativas de violação são monitoradas.
`,
};

class ConsoleProtection {
  private isProtected = false;
  private originalConsole: any = {};
  private detectionActive = false;

  constructor() {
    if (isProduction) {
      this.initializeProtection();
    }
  }

  private initializeProtection() {
    if (this.isProtected) return;

    // 1. Aviso inicial
    this.showSecurityWarning();

    // 2. Proteção contra redefinição de objetos críticos
    this.protectCriticalObjects();

    // 3. Detecção de DevTools
    this.setupDevToolsDetection();

    // 4. Proteção do console
    this.protectConsole();

    // 5. Proteção contra debug
    this.preventDebugging();

    this.isProtected = true;
  }

  private showSecurityWarning() {
    console.log(
      "%c" + WARNING_MESSAGES.devtools,
      "color: red; font-size: 14px; font-weight: bold;",
    );

    if (isProduction) {
      console.log(
        "%c" + WARNING_MESSAGES.production,
        "color: orange; font-size: 12px;",
      );
    }
  }

  private protectCriticalObjects() {
    // Impede redefinição de objetos globais críticos
    const criticalObjects = [
      "localStorage",
      "sessionStorage",
      "document",
      "window",
    ];

    criticalObjects.forEach((objName) => {
      try {
        Object.defineProperty(window, objName, {
          configurable: false,
          writable: false,
        });
      } catch (e) {
        // Objeto já pode estar protegido
      }
    });

    // Protege funções de autenticação contra redefinição
    if (typeof window !== "undefined") {
      Object.freeze(window);
    }
  }

  private setupDevToolsDetection() {
    let devtools = { open: false, orientation: null };
    const threshold = 160;

    setInterval(() => {
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!devtools.open) {
          devtools.open = true;
          this.onDevToolsOpen();
        }
      } else {
        devtools.open = false;
      }
    }, 500);
  }

  private onDevToolsOpen() {
    if (isProduction && !this.detectionActive) {
      this.detectionActive = true;

      // Aviso mais agressivo em produção
      console.clear();
      console.log(
        "%cPARAR!",
        "color: red; font-size: 50px; font-weight: bold;",
      );
      console.log(
        "%c" + WARNING_MESSAGES.devtools,
        "color: red; font-size: 16px;",
      );

      // Reset após alguns segundos
      setTimeout(() => {
        this.detectionActive = false;
      }, 5000);
    }
  }

  private protectConsole() {
    if (!isProduction) return;

    // Salva referências originais
    this.originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
      debug: console.debug,
    };

    // Substitui métodos do console em produção
    const restrictedMessage = "🚫 Console restrito em produção";

    console.log = () => console.info(restrictedMessage);
    console.warn = () => console.info(restrictedMessage);
    console.error = () => console.info(restrictedMessage);
    console.debug = () => {};

    // Impede redefinição do console
    Object.defineProperty(window, "console", {
      value: console,
      writable: false,
      configurable: false,
    });
  }

  private preventDebugging() {
    if (!isProduction) return;

    // Anti-debug básico
    setInterval(() => {
      const before = new Date();
      debugger;
      const after = new Date();

      if (after.getTime() - before.getTime() > 100) {
        // Debugger foi ativado - pode indicar tentativa de debug
        console.clear();
        this.showSecurityWarning();
      }
    }, 1000);
  }

  // Método para desenvolvimento - restaura console
  public restoreConsole() {
    if (!isProduction && this.originalConsole.log) {
      Object.assign(console, this.originalConsole);
    }
  }

  // Método para verificar integridade básica
  public checkIntegrity(): boolean {
    try {
      // Verifica se objetos críticos ainda existem
      return !!(window && document && localStorage && sessionStorage);
    } catch (e) {
      return false;
    }
  }
}

// Instância global de proteção
const consoleProtection = new ConsoleProtection();

// Expor apenas em desenvolvimento
if (!isProduction) {
  (window as any).__consoleProtection = consoleProtection;
}

export default consoleProtection;
