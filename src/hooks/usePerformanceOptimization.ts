import React, { useCallback, useMemo, useRef, useEffect, useState } from "react";

/**
 * Hook para otimização de performance com debounce, throttle e memoização
 */
export const usePerformanceOptimization = () => {
  /**
   * Debounce function para limitar execuções frequentes
   */
  const useDebounce = <T extends (...args: any[]) => any>(
    callback: T,
    delay: number,
  ): T => {
    const timeoutRef = useRef<NodeJS.Timeout>();

    return useCallback(
      ((...args: Parameters<T>) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          callback(...args);
        }, delay);
      }) as T,
      [callback, delay],
    );
  };

  /**
   * Throttle function para limitar taxa de execução
   */
  const useThrottle = <T extends (...args: any[]) => any>(
    callback: T,
    delay: number,
  ): T => {
    const lastExecutedRef = useRef<number>(0);

    return useCallback(
      ((...args: Parameters<T>) => {
        const now = Date.now();

        if (now - lastExecutedRef.current >= delay) {
          lastExecutedRef.current = now;
          callback(...args);
        }
      }) as T,
      [callback, delay],
    );
  };

  /**
   * Memoização de objetos complexos para evitar re-renderizações
   */
  const useMemoizedObject = <T extends Record<string, any>>(obj: T): T => {
    return useMemo(() => obj, Object.values(obj));
  };

  /**
   * Lazy loading de componentes
   */
  const useLazyComponent = (importFn: () => Promise<any>) => {
    return useMemo(() => {
      return React.lazy(importFn);
    }, [importFn]);
  };

  /**
   * Otimização de eventos de scroll
   */
  const useOptimizedScroll = (
    callback: (event: Event) => void,
    options: { passive?: boolean; throttle?: number } = {},
  ) => {
    const { passive = true, throttle = 16 } = options;
    const throttledCallback = useThrottle(callback, throttle);

    useEffect(() => {
      const element = window;
      element.addEventListener("scroll", throttledCallback, { passive });

      return () => {
        element.removeEventListener("scroll", throttledCallback);
      };
    }, [throttledCallback, passive]);
  };

  /**
   * Otimização de redimensionamento de janela
   */
  const useOptimizedResize = (
    callback: (event: Event) => void,
    delay: number = 250,
  ) => {
    const debouncedCallback = useDebounce(callback, delay);

    useEffect(() => {
      window.addEventListener("resize", debouncedCallback);

      return () => {
        window.removeEventListener("resize", debouncedCallback);
      };
    }, [debouncedCallback]);
  };

  /**
   * Cleanup de recursos para evitar memory leaks
   */
  const useCleanup = (cleanupFn: () => void) => {
    const cleanupRef = useRef(cleanupFn);
    cleanupRef.current = cleanupFn;

    useEffect(() => {
      return () => {
        cleanupRef.current();
      };
    }, []);
  };

  return {
    useDebounce,
    useThrottle,
    useMemoizedObject,
    useLazyComponent,
    useOptimizedScroll,
    useOptimizedResize,
    useCleanup,
  };
};

/**
 * Hook específico para otimização de imagens
 */
export const useImageOptimization = () => {
  /**
   * Preload de imagens críticas
   */
  const preloadImages = useCallback((urls: string[]) => {
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  /**
   * Lazy loading com Intersection Observer
   */
  const useLazyImage = (src: string, threshold: number = 0.1) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
      const img = imgRef.current;
      if (!img) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isLoaded && !error) {
            const imageLoader = new Image();

            imageLoader.onload = () => {
              img.src = src;
              setIsLoaded(true);
            };

            imageLoader.onerror = () => {
              setError(true);
            };

            imageLoader.src = src;
            observer.unobserve(img);
          }
        },
        { threshold },
      );

      observer.observe(img);

      return () => {
        observer.disconnect();
      };
    }, [src, threshold, isLoaded, error]);

    return { imgRef, isLoaded, error };
  };

  return {
    preloadImages,
    useLazyImage,
  };
};
