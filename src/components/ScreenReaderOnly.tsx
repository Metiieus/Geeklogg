import React from 'react';

interface ScreenReaderOnlyProps {
  children: React.ReactNode;
}

/**
 * Componente para texto que deve ser lido apenas por screen readers
 * Seguindo padrões WCAG para conteúdo visualmente oculto
 */
export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({ children }) => {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
};

export default ScreenReaderOnly;
