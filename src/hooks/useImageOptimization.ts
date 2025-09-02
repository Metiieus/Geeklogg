import { useState, useEffect, useCallback } from "react";

interface UseImageOptimizationOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: "webp" | "jpeg" | "png";
}

/**
 * Hook para otimização de imagens
 * Comprime e redimensiona imagens para melhor performance
 */
export const useImageOptimization = (
  options: UseImageOptimizationOptions = {},
) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    quality = 0.8,
    maxWidth = 1200,
    maxHeight = 1200,
    format = "jpeg",
  } = options;

  const optimizeImage = useCallback(
    async (file: File): Promise<File> => {
      setIsLoading(true);

      try {
        return new Promise((resolve) => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const img = new Image();

          img.onload = () => {
            // Calcular dimensões otimizadas
            let { width, height } = img;

            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }

            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }

            canvas.width = width;
            canvas.height = height;

            // Desenhar imagem otimizada
            ctx?.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const optimizedFile = new File([blob], file.name, {
                    type: `image/${format}`,
                    lastModified: Date.now(),
                  });
                  resolve(optimizedFile);
                } else {
                  resolve(file); // Fallback para arquivo original
                }
                setIsLoading(false);
              },
              `image/${format}`,
              quality,
            );
          };

          img.onerror = () => {
            setIsLoading(false);
            resolve(file); // Fallback para arquivo original
          };

          img.src = URL.createObjectURL(file);
        });
      } catch (error) {
        console.error("Erro ao otimizar imagem:", error);
        setIsLoading(false);
        return file; // Fallback para arquivo original
      }
    },
    [quality, maxWidth, maxHeight, format],
  );

  const optimizeImageDataUrl = useCallback(
    async (dataUrl: string): Promise<string> => {
      setIsLoading(true);

      try {
        return new Promise((resolve) => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const img = new Image();

          img.onload = () => {
            let { width, height } = img;

            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }

            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }

            canvas.width = width;
            canvas.height = height;

            ctx?.drawImage(img, 0, 0, width, height);

            const optimizedDataUrl = canvas.toDataURL(
              `image/${format}`,
              quality,
            );
            setIsLoading(false);
            resolve(optimizedDataUrl);
          };

          img.onerror = () => {
            setIsLoading(false);
            resolve(dataUrl); // Fallback para data URL original
          };

          img.src = dataUrl;
        });
      } catch (error) {
        console.error("Erro ao otimizar data URL:", error);
        setIsLoading(false);
        return dataUrl; // Fallback para data URL original
      }
    },
    [quality, maxWidth, maxHeight, format],
  );

  return {
    optimizeImage,
    optimizeImageDataUrl,
    isLoading,
  };
};
