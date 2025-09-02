import { useEffect } from "react";

export const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (isLocked) {
      // Salvar a posição atual de scroll
      const scrollY = window.scrollY;

      // Adicionar classe modal-open ao body
      document.body.classList.add("modal-open");

      // Aplicar estilos para bloquear scroll - MAIS AGRESSIVO
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
      document.body.style.overflow = "hidden";

      // Para iOS Safari - Previne bounce scroll
      document.body.style.webkitOverflowScrolling = "auto";
      document.body.style.overscrollBehavior = "none";

      // Bloquear scroll no HTML também
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.height = "100%";

      // Prevenir eventos de scroll e touch
      const preventScroll = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };

      // Adicionar listeners para prevenir scroll
      document.addEventListener("scroll", preventScroll, { passive: false });
      document.addEventListener("touchmove", preventScroll, { passive: false });
      document.addEventListener("wheel", preventScroll, { passive: false });

      return () => {
        // Remover classe modal-open
        document.body.classList.remove("modal-open");

        // Restaurar estilos do body
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        document.body.style.height = "";
        document.body.style.overflow = "";
        document.body.style.webkitOverflowScrolling = "";
        document.body.style.overscrollBehavior = "";

        // Restaurar estilos do HTML
        document.documentElement.style.overflow = "";
        document.documentElement.style.height = "";

        // Remover listeners
        document.removeEventListener("scroll", preventScroll);
        document.removeEventListener("touchmove", preventScroll);
        document.removeEventListener("wheel", preventScroll);

        // Restaurar posição de scroll
        window.scrollTo(0, scrollY);
      };
    }
  }, [isLocked]);
};
