export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FileValidationOptions {
  maxSizeInMB?: number;
  allowedTypes?: string[];
  maxWidth?: number;
  maxHeight?: number;
}

export const validateFile = async (
  file: File,
  options: FileValidationOptions = {},
): Promise<FileValidationResult> => {
  const {
    maxSizeInMB = 5,
    allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
    maxWidth = 2048,
    maxHeight = 2048,
  } = options;

  // Validar tipo de arquivo
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Tipo de arquivo não permitido. Use apenas: ${allowedTypes.map((type) => type.split("/")[1]).join(", ")}`,
    };
  }

  // Validar tamanho do arquivo
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return {
      isValid: false,
      error: `Arquivo muito grande. Tamanho máximo permitido: ${maxSizeInMB}MB. Tamanho atual: ${(file.size / 1024 / 1024).toFixed(1)}MB`,
    };
  }

  // Validar dimensões da imagem (se for uma imagem)
  if (file.type.startsWith("image/")) {
    try {
      const dimensions = await getImageDimensions(file);
      if (dimensions.width > maxWidth || dimensions.height > maxHeight) {
        return {
          isValid: false,
          error: `Imagem muito grande. Dimensões máximas: ${maxWidth}x${maxHeight}px. Dimensões atuais: ${dimensions.width}x${dimensions.height}px`,
        };
      }
    } catch (error) {
      return {
        isValid: false,
        error: "Não foi possível verificar as dimensões da imagem",
      };
    }
  }

  return { isValid: true };
};

export const getImageDimensions = (
  file: File,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Não foi possível carregar a imagem"));
    };

    img.src = url;
  });
};

export const compressImage = (
  file: File,
  maxWidth: number = 1024,
  maxHeight: number = 1024,
  quality: number = 0.8,
): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();

    img.onload = () => {
      // Calcular dimensões mantendo aspect ratio
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Desenhar imagem redimensionada
      ctx.drawImage(img, 0, 0, width, height);

      // Converter para blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        quality,
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};
