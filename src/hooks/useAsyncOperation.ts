import { useState, useCallback } from 'react';
import { useToast } from '../context/ToastContext';

interface AsyncOperationOptions {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const useAsyncOperation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const execute = useCallback(async <T>(
    operation: () => Promise<T>,
    options: AsyncOperationOptions = {}
  ): Promise<T | undefined> => {
    const {
      successMessage,
      errorMessage = 'Ocorreu um erro inesperado',
      onSuccess,
      onError
    } = options;

    setIsLoading(true);

    try {
      const result = await operation();
      
      if (successMessage) {
        showSuccess('Sucesso!', successMessage);
      }
      
      onSuccess?.(;
      return result;
    } catch (error: any) {
      console.error('Operação falhou:', error);
      
      const message = error.message || errorMessage;
      showError('Erro', message);
      
      onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [showSuccess, showError]);

  return {
    execute,
    isLoading
  };
};

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { showSuccess, showError, showWarning } = useToast();

  const uploadFile = useCallback(async (
    file: File,
    options: {
      maxSizeInMB?: number;
      allowedTypes?: string[];
      maxWidth?: number;
      maxHeight?: number;
      compressionQuality?: number;
      onProgress?: (progress: number) => void;
    } = {}
  ) => {
    const {
      maxSizeInMB = 5,
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxWidth = 2048,
      maxHeight = 2048,
      compressionQuality = 0.8,
      onProgress
    } = options;

    setIsUploading(true);
    onProgress?.(0);

    try {
      // Import validation functions
      const { validateFile, compressImage } = await import('../utils/fileValidation');
      
      onProgress?.(20);

      // Validar arquivo
      const validation = await validateFile(file, {
        maxSizeInMB,
        allowedTypes,
        maxWidth,
        maxHeight
      });

      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      onProgress?.(40);

      // Comprimir se necessário
      let processedFile = file;
      if (file.size > 1024 * 1024) { // > 1MB
        showWarning('Otimizando imagem', 'A imagem está sendo comprimida para melhor performance');
        processedFile = await compressImage(file, maxWidth, maxHeight, compressionQuality);
      }

      onProgress?.(80);

      // Converter para base64 ou retornar arquivo processado
      const result = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          resolve(result);
        };
        reader.onerror = () => reject(new Error('Erro ao processar arquivo'));
        reader.readAsDataURL(processedFile);
      });

      onProgress?.(100);
      showSuccess('Upload concluído!', 'Arquivo carregado com sucesso');
      
      return {
        base64: result,
        file: processedFile,
        originalFile: file
      };

    } catch (error: any) {
      console.error('Erro no upload:', error);
      showError('Erro no upload', error.message || 'Não foi possível processar o arquivo');
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [showSuccess, showError, showWarning]);

  return {
    uploadFile,
    isUploading
  };
};