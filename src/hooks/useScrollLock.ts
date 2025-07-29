import { useEffect } from 'react';

export const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (isLocked) {
      // Salvar a posição atual de scroll
      const scrollY = window.scrollY;
      
      // Aplicar estilos para bloquear scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      
      // Para iOS Safari
      document.body.style.webkitOverflowScrolling = 'touch';
      
      return () => {
        // Restaurar estilos
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        document.body.style.webkitOverflowScrolling = '';
        
        // Restaurar posição de scroll
        window.scrollTo(0, scrollY);
      };
    }
  }, [isLocked]);
};
