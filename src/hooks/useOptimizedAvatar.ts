import { useState, useEffect, useCallback } from 'react';

interface UseOptimizedAvatarProps {
  avatarUrl?: string;
  fallbackText: string;
  size?: 'sm' | 'md' | 'lg';
}

interface UseOptimizedAvatarReturn {
  displayAvatar: string | null;
  fallbackInitial: string;
  isLoading: boolean;
  hasError: boolean;
  handleImageError: () => void;
}

/**
 * Hook otimizado para gerenciar avatares com fallbacks e lazy loading
 */
export const useOptimizedAvatar = ({
  avatarUrl,
  fallbackText,
  size = 'md'
}: UseOptimizedAvatarProps): UseOptimizedAvatarReturn => {
  const [displayAvatar, setDisplayAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(avatarUrl));
  const [hasError, setHasError] = useState(false);

  // Gerar inicial do fallback de forma otimizada
  const fallbackInitial = useCallback(() => {
    return fallbackText?.charAt(0)?.toUpperCase() || 'U';
  }, [fallbackText]);

  // Pre-carregar imagem de forma otimizada
  useEffect(() => {
    if (!avatarUrl) {
      setDisplayAvatar(null);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    // Criar uma nova instância de Image para pré-carregar
    const img = new Image();
    
    const handleLoad = () => {
      setDisplayAvatar(avatarUrl);
      setIsLoading(false);
      setHasError(false);
    };

    const handleError = () => {
      setDisplayAvatar(null);
      setIsLoading(false);
      setHasError(true);
      console.warn(`Falha ao carregar avatar: ${avatarUrl}`);
    };

    img.onload = handleLoad;
    img.onerror = handleError;
    
    // Otimizar carregamento com timeout para evitar loading infinito
    const timeout = setTimeout(() => {
      handleError();
    }, 5000);

    img.src = avatarUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
      clearTimeout(timeout);
    };
  }, [avatarUrl]);

  const handleImageError = useCallback(() => {
    setDisplayAvatar(null);
    setHasError(true);
    setIsLoading(false);
  }, []);

  return {
    displayAvatar,
    fallbackInitial: fallbackInitial(),
    isLoading,
    hasError,
    handleImageError
  };
};
