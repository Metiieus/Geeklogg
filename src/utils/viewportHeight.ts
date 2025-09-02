/**
 * Utilitário para definir altura correta do viewport em dispositivos móveis
 * Resolve o problema do 100vh em mobile onde a barra de endereço altera a altura
 */

let isInitialized = false;

/**
 * Define a variável CSS --vh com a altura real do viewport
 */
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

/**
 * Inicializa o sistema de viewport height
 * Deve ser chamado uma vez no início da aplicação
 */
export function initializeViewportHeight() {
  if (isInitialized) return;

  // Definir altura inicial
  setViewportHeight();

  // Atualizar quando a janela redimensionar
  window.addEventListener("resize", setViewportHeight);

  // Atualizar quando a orientação mudar
  window.addEventListener("orientationchange", () => {
    // Pequeno delay para aguardar a mudança de orientação
    setTimeout(setViewportHeight, 100);
  });

  // Para iOS Safari - detectar mudanças na barra de endereço
  if (typeof window !== "undefined" && "visualViewport" in window) {
    window.visualViewport?.addEventListener("resize", setViewportHeight);
  }

  isInitialized = true;
  console.log("✅ Viewport height utility inicializado");
}

/**
 * Remove os listeners (para cleanup se necessário)
 */
export function cleanupViewportHeight() {
  if (!isInitialized) return;

  window.removeEventListener("resize", setViewportHeight);
  window.removeEventListener("orientationchange", setViewportHeight);

  if (typeof window !== "undefined" && "visualViewport" in window) {
    window.visualViewport?.removeEventListener("resize", setViewportHeight);
  }

  isInitialized = false;
}

/**
 * Força uma atualização da altura do viewport
 */
export function updateViewportHeight() {
  setViewportHeight();
}

/**
 * Retorna a altura atual do viewport em pixels
 */
export function getViewportHeight(): number {
  return window.innerHeight;
}

/**
 * Verifica se estamos em um dispositivo móvel
 */
export function isMobileDevice(): boolean {
  return (
    window.innerWidth <= 768 ||
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
  );
}

// Auto-inicializar se estiver no browser
if (typeof window !== "undefined") {
  // Inicializar após o DOM estar pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeViewportHeight);
  } else {
    initializeViewportHeight();
  }
}
