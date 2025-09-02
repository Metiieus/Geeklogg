import React, { useState, useCallback, memo } from "react";

interface OptimizedImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  loading?: "lazy" | "eager";
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = memo(
  ({
    src,
    alt,
    className = "",
    fallbackSrc,
    loading = "lazy",
    onLoad,
    onError,
  }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);

    const handleLoad = useCallback(() => {
      setIsLoading(false);
      setHasError(false);
      onLoad?.();
    }, [onLoad]);

    const handleError = useCallback(() => {
      setIsLoading(false);
      setHasError(true);

      // Tentar fallback se disponível
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        setIsLoading(true);
        setHasError(false);
        return;
      }

      onError?.();
    }, [fallbackSrc, currentSrc, onError]);

    // Skeleton loader
    if (isLoading) {
      return (
        <div className={`animate-pulse bg-gray-700 ${className}`}>
          {currentSrc && (
            <img
              src={currentSrc}
              alt={alt}
              loading={loading}
              onLoad={handleLoad}
              onError={handleError}
              className="opacity-0 absolute"
            />
          )}
        </div>
      );
    }

    // Fallback quando não há src ou erro
    if (!currentSrc || hasError) {
      return (
        <div
          className={`bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center ${className}`}
        >
          <span className="text-slate-400 text-sm">
            {alt.charAt(0).toUpperCase()}
          </span>
        </div>
      );
    }

    return (
      <img
        src={currentSrc}
        alt={alt}
        loading={loading}
        className={className}
        onLoad={handleLoad}
        onError={handleError}
      />
    );
  },
);

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;
