import { Capacitor } from "@capacitor/core";
import { devLog } from "../utils/logger";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Keyboard, KeyboardStyle, KeyboardResize } from "@capacitor/keyboard";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Network } from "@capacitor/network";

/**
 * Service para gerenciar funcionalidades do Capacitor
 */
class CapacitorService {
  private isNative = Capacitor.isNativePlatform();

  /**
   * Inicializa as configurações do Capacitor para mobile
   */
  async initialize() {
    if (!this.isNative) {
      devLog.log(
        "🌐 Executando no navegador - plugins Capacitor não disponíveis",
      );
      return;
    }

    devLog.log("📱 Inicializando Capacitor para dispositivo móvel");

    // Marcar o HTML com classes específicas para estilos mobile/Capacitor
    document.documentElement.classList.add("capacitor-app");
    document.documentElement.classList.add(
      Capacitor.getPlatform() === "ios" ? "platform-ios" : "platform-android",
    );

    try {
      // Configurar StatusBar
      await this.setupStatusBar();

      // Configurar Keyboard
      await this.setupKeyboard();

      // Configurar SplashScreen
      await this.setupSplashScreen();

      // Monitorar network
      await this.setupNetworkMonitoring();

      devLog.log("✅ Capacitor inicializado com sucesso");
    } catch (error) {
      devLog.warn("⚠️ Erro ao inicializar Capacitor:", error);
    }
  }

  /**
   * Configura a StatusBar
   */
  private async setupStatusBar() {
    try {
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: "#1e293b" });
      devLog.log("✅ StatusBar configurada");
    } catch (error) {
      devLog.warn("⚠️ Erro ao configurar StatusBar:", error);
    }
  }

  /**
   * Configura o Keyboard
   */
  private async setupKeyboard() {
    try {
      await Keyboard.setStyle({ style: KeyboardStyle.Dark });
      await Keyboard.setResizeMode({ mode: KeyboardResize.Body });
      devLog.log("✅ Keyboard configurado");
    } catch (error) {
      devLog.warn("⚠️ Erro ao configurar Keyboard:", error);
    }
  }

  /**
   * Configura a SplashScreen
   */
  private async setupSplashScreen() {
    try {
      // Ocultar splash screen após inicialização
      setTimeout(async () => {
        await SplashScreen.hide();
        devLog.log("✅ SplashScreen ocultada");
      }, 2000);
    } catch (error) {
      devLog.warn("⚠️ Erro ao configurar SplashScreen:", error);
    }
  }

  /**
   * Monitora conexão de rede
   */
  private async setupNetworkMonitoring() {
    try {
      // Verificar status inicial
      const status = await Network.getStatus();
      devLog.log("🌐 Status da rede:", status);

      // Monitorar mudanças
      Network.addListener("networkStatusChange", (status) => {
        devLog.log("🌐 Mudança na rede:", status);
        if (!status.connected) {
          this.showOfflineNotification();
        }
      });

      devLog.log("✅ Monitoramento de rede configurado");
    } catch (error) {
      devLog.warn("⚠️ Erro ao configurar monitoramento de rede:", error);
    }
  }

  /**
   * Feedback háptico
   */
  async hapticFeedback(style: "light" | "medium" | "heavy" = "light") {
    if (!this.isNative) return;

    try {
      const impactStyle =
        style === "light"
          ? ImpactStyle.Light
          : style === "medium"
            ? ImpactStyle.Medium
            : ImpactStyle.Heavy;

      await Haptics.impact({ style: impactStyle });
    } catch (error) {
      devLog.warn("⚠️ Erro no feedback háptico:", error);
    }
  }

  /**
   * Vibração simples
   */
  async vibrate(duration: number = 100) {
    if (!this.isNative) return;

    try {
      await Haptics.vibrate({ duration });
    } catch (error) {
      devLog.warn("⚠️ Erro na vibração:", error);
    }
  }

  /**
   * Verifica se está executando em dispositivo nativo
   */
  isNativePlatform(): boolean {
    return this.isNative;
  }

  /**
   * Verifica se é Android
   */
  isAndroid(): boolean {
    return Capacitor.getPlatform() === "android";
  }

  /**
   * Verifica se é iOS
   */
  isIOS(): boolean {
    return Capacitor.getPlatform() === "ios";
  }

  /**
   * Oculta StatusBar temporariamente
   */
  async hideStatusBar() {
    if (!this.isNative) return;

    try {
      await StatusBar.hide();
    } catch (error) {
      devLog.warn("⚠️ Erro ao ocultar StatusBar:", error);
    }
  }

  /**
   * Mostra StatusBar
   */
  async showStatusBar() {
    if (!this.isNative) return;

    try {
      await StatusBar.show();
    } catch (error) {
      devLog.warn("⚠️ Erro ao mostrar StatusBar:", error);
    }
  }

  /**
   * Mostra notificação de offline
   */
  private showOfflineNotification() {
    // Este método pode ser integrado com o sistema de toast da aplicação
    devLog.warn("⚠️ Dispositivo offline");
  }

  /**
   * Obter informações da rede
   */
  async getNetworkStatus() {
    if (!this.isNative) {
      return { connected: navigator.onLine, connectionType: "unknown" };
    }

    try {
      return await Network.getStatus();
    } catch (error) {
      devLog.warn("⚠️ Erro ao obter status da rede:", error);
      return { connected: true, connectionType: "unknown" };
    }
  }
}

// Instância singleton
export const capacitorService = new CapacitorService();

// Inicializar automaticamente se for nativo
if (capacitorService.isNativePlatform()) {
  capacitorService.initialize();
}
