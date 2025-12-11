/**
 * Utilitários para melhorar gestos e interações em mobile
 */

interface SwipeDirection {
  direction: "left" | "right" | "up" | "down";
  distance: number;
  duration: number;
}

interface SwipeOptions {
  threshold?: number; // Distância mínima para considerar um swipe
  maxTime?: number; // Tempo máximo para considerar um swipe
  onSwipe?: (direction: SwipeDirection) => void;
}

/**
 * Adiciona detecção de swipe a um elemento
 */
export function addSwipeDetection(
  element: HTMLElement,
  options: SwipeOptions = {},
) {
  const { threshold = 50, maxTime = 500, onSwipe } = options;

  let startX = 0;
  let startY = 0;
  let startTime = 0;

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) return;

    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    startTime = Date.now();
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (e.changedTouches.length !== 1) return;

    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const endTime = Date.now();

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const deltaTime = endTime - startTime;

    // Verificar se está dentro dos limites de tempo
    if (deltaTime > maxTime) return;

    // Calcular distâncias
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Verificar se passou do threshold
    if (distance < threshold) return;

    // Determinar direção principal
    let direction: SwipeDirection["direction"];
    if (absX > absY) {
      direction = deltaX > 0 ? "right" : "left";
    } else {
      direction = deltaY > 0 ? "down" : "up";
    }

    // Chamar callback
    if (onSwipe) {
      onSwipe({
        direction,
        distance,
        duration: deltaTime,
      });
    }
  };

  element.addEventListener("touchstart", handleTouchStart, { passive: true });
  element.addEventListener("touchend", handleTouchEnd, { passive: true });

  // Retorna função de cleanup
  return () => {
    element.removeEventListener("touchstart", handleTouchStart);
    element.removeEventListener("touchend", handleTouchEnd);
  };
}

/**
 * Adiciona feedback háptico usando Capacitor ou vibração web
 */
export async function triggerHapticFeedback(
  type: "light" | "medium" | "heavy" = "light",
) {
  // Tentar usar Capacitor primeiro
  try {
    const { capacitorService } = await import("../services/capacitorService");
    if (capacitorService.isNativePlatform()) {
      await capacitorService.hapticFeedback(type);
      return;
    }
  } catch (error) {
    console.warn("Capacitor haptics não disponível:", error);
  }

  // Fallback para vibração web
  if ("vibrate" in navigator) {
    const duration = type === "light" ? 25 : type === "medium" ? 50 : 100;
    navigator.vibrate(duration);
  }
}

/**
 * Melhora a responsividade de touch em elementos
 */
export function enhanceTouchResponse(element: HTMLElement) {
  // Adicionar classes para melhor responsividade
  element.classList.add("touch-responsive");

  // Feedback visual ao toque
  const handleTouchStart = () => {
    element.style.transform = "scale(0.98)";
    element.style.opacity = "0.8";
    triggerHapticFeedback("light");
  };

  const handleTouchEnd = () => {
    element.style.transform = "";
    element.style.opacity = "";
  };

  element.addEventListener("touchstart", handleTouchStart, { passive: true });
  element.addEventListener("touchend", handleTouchEnd, { passive: true });
  element.addEventListener("touchcancel", handleTouchEnd, { passive: true });

  // Retorna função de cleanup
  return () => {
    element.removeEventListener("touchstart", handleTouchStart);
    element.removeEventListener("touchend", handleTouchEnd);
    element.removeEventListener("touchcancel", handleTouchEnd);
  };
}

/**
 * Detecta se o usuário está usando touch ou mouse
 */
export function detectInputMethod(): "touch" | "mouse" {
  // Verificar se há suporte a touch
  const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // Verificar media queries
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  return hasTouch || isTouchDevice ? "touch" : "mouse";
}

/**
 * Adiciona eventos de long press
 */
export function addLongPressDetection(
  element: HTMLElement,
  callback: () => void,
  duration: number = 500,
) {
  let pressTimer: NodeJS.Timeout | null = null;
  let moved = false;

  const startPress = (e: TouchEvent | MouseEvent) => {
    moved = false;
    pressTimer = setTimeout(() => {
      if (!moved) {
        triggerHapticFeedback("medium");
        callback();
      }
    }, duration);
  };

  const endPress = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  };

  const movePress = () => {
    moved = true;
    endPress();
  };

  // Touch events
  element.addEventListener("touchstart", startPress, { passive: true });
  element.addEventListener("touchend", endPress, { passive: true });
  element.addEventListener("touchmove", movePress, { passive: true });
  element.addEventListener("touchcancel", endPress, { passive: true });

  // Mouse events (para desktop)
  element.addEventListener("mousedown", startPress);
  element.addEventListener("mouseup", endPress);
  element.addEventListener("mousemove", movePress);
  element.addEventListener("mouseleave", endPress);

  // Retorna função de cleanup
  return () => {
    endPress();
    element.removeEventListener("touchstart", startPress);
    element.removeEventListener("touchend", endPress);
    element.removeEventListener("touchmove", movePress);
    element.removeEventListener("touchcancel", endPress);
    element.removeEventListener("mousedown", startPress);
    element.removeEventListener("mouseup", endPress);
    element.removeEventListener("mousemove", movePress);
    element.removeEventListener("mouseleave", endPress);
  };
}

/**
 * Previne scroll bounce em iOS
 */
export function preventScrollBounce() {
  document.body.style.overscrollBehavior = "none";
  document.documentElement.style.overscrollBehavior = "none";
}

/**
 * Otimiza performance de scroll em containers específicos
 */
export function optimizeScrollContainer(container: HTMLElement) {
  (container.style as any).webkitOverflowScrolling = "touch";
  container.style.overscrollBehavior = "contain";
  container.style.scrollBehavior = "smooth";

  // Adicionar classe para CSS específico
  container.classList.add("mobile-scroll");
}
