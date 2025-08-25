import { useEffect, useRef } from 'react';

/**
 * Hook melhorado para bloquear scroll que funciona melhor em iOS
 * e permite scroll interno em modais
 */
export const useImprovedScrollLock = (isLocked: boolean) => {
  const scrollYRef = useRef<number>(0);
  const originalStylesRef = useRef<{
    position: string;
    top: string;
    left: string;
    right: string;
    width: string;
    overflow: string;
  } | null>(null);

  useEffect(() => {
    if (isLocked) {
      // Salvar posição atual e estilos originais
      scrollYRef.current = window.scrollY;
      const body = document.body;
      
      originalStylesRef.current = {
        position: body.style.position,
        top: body.style.top,
        left: body.style.left,
        right: body.style.right,
        width: body.style.width,
        overflow: body.style.overflow,
      };

      // Aplicar estilos para bloquear scroll de forma mais suave
      body.style.position = 'fixed';
      body.style.top = `-${scrollYRef.current}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
      body.style.overflow = 'hidden';

      // Adicionar classe para CSS customizado
      body.classList.add('scroll-locked');

      // Para iOS - configurar viewport
      const viewport = document.querySelector('meta[name="viewport"]');
      const originalViewport = viewport?.getAttribute('content') || '';
      
      if (viewport) {
        viewport.setAttribute('content', originalViewport + ', user-scalable=no');
      }

      // Função mais suave de prevenção
      const preventScroll = (e: TouchEvent) => {
        // Permitir scroll dentro de elementos com classe 'allow-scroll'
        let target = e.target as Element;
        while (target && target !== document.body) {
          if (target.classList?.contains('allow-scroll') || 
              target.classList?.contains('modal-scroll')) {
            return;
          }
          target = target.parentElement as Element;
        }
        
        // Prevenir apenas scroll na página principal
        if (e.touches.length > 1) return; // Permitir gestos multi-touch
        e.preventDefault();
      };

      // Adicionar listener apenas para touchmove
      document.addEventListener('touchmove', preventScroll, { passive: false });

      return () => {
        // Restaurar estilos originais
        const body = document.body;
        if (originalStylesRef.current) {
          Object.assign(body.style, originalStylesRef.current);
        }

        // Remover classe
        body.classList.remove('scroll-locked');

        // Restaurar viewport
        if (viewport) {
          viewport.setAttribute('content', originalViewport);
        }

        // Remover listener
        document.removeEventListener('touchmove', preventScroll);

        // Restaurar posição de scroll de forma suave
        requestAnimationFrame(() => {
          window.scrollTo({
            top: scrollYRef.current,
            behavior: 'auto'
          });
        });
      };
    }
  }, [isLocked]);
};
