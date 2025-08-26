import { useState, useEffect } from 'react';

/**
 * Hook para debounce de valores
 * Útil para otimizar campos de busca e evitar muitas re-renderizações
 * 
 * @param value - Valor a ser "debounced"
 * @param delay - Delay em millisegundos (padrão: 300ms)
 * @returns Valor com debounce aplicado
 */
function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura timer para atualizar o valor após o delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timer se o valor ou delay mudarem
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
