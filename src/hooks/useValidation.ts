import { useState, useCallback, useMemo } from 'react';
import { VALIDATION_PATTERNS, ERROR_MESSAGES, DATA_LIMITS } from '../constants';

interface ValidationRule {
  test: (value: any) => boolean;
  message: string;
}

interface ValidationConfig {
  [field: string]: ValidationRule[];
}

interface ValidationErrors {
  [field: string]: string;
}

export const useValidation = (config: ValidationConfig) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Regras de validação comuns
  const commonRules = useMemo(() => ({
    required: (message = ERROR_MESSAGES.REQUIRED_FIELD): ValidationRule => ({
      test: (value) => value !== undefined && value !== null && value !== '',
      message,
    }),
    
    email: (message = ERROR_MESSAGES.INVALID_EMAIL): ValidationRule => ({
      test: (value) => !value || VALIDATION_PATTERNS.EMAIL.test(value),
      message,
    }),
    
    strongPassword: (message = ERROR_MESSAGES.WEAK_PASSWORD): ValidationRule => ({
      test: (value) => !value || VALIDATION_PATTERNS.STRONG_PASSWORD.test(value),
      message,
    }),
    
    minLength: (min: number, message?: string): ValidationRule => ({
      test: (value) => !value || value.length >= min,
      message: message || `Mínimo de ${min} caracteres`,
    }),
    
    maxLength: (max: number, message?: string): ValidationRule => ({
      test: (value) => !value || value.length <= max,
      message: message || `Máximo de ${max} caracteres`,
    }),
    
    fileSize: (maxSize = DATA_LIMITS.MAX_FILE_SIZE): ValidationRule => ({
      test: (file: File) => !file || file.size <= maxSize,
      message: ERROR_MESSAGES.FILE_TOO_LARGE,
    }),
    
    url: (message = 'URL inválida'): ValidationRule => ({
      test: (value) => !value || VALIDATION_PATTERNS.URL.test(value),
      message,
    }),
    
    numeric: (message = 'Deve ser um número'): ValidationRule => ({
      test: (value) => !value || !isNaN(Number(value)),
      message,
    }),
    
    range: (min: number, max: number, message?: string): ValidationRule => ({
      test: (value) => {
        if (!value) return true;
        const num = Number(value);
        return num >= min && num <= max;
      },
      message: message || `Valor deve estar entre ${min} e ${max}`,
    }),
  }), []);

  const validateField = useCallback((field: string, value: any): string => {
    const rules = config[field];
    if (!rules) return '';

    for (const rule of rules) {
      if (!rule.test(value)) {
        return rule.message;
      }
    }
    return '';
  }, [config]);

  const validateAll = useCallback((values: Record<string, any>): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(config).forEach(field => {
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [config, validateField]);

  const validateSingle = useCallback((field: string, value: any): boolean => {
    const error = validateField(field, value);
    
    setErrors(prev => ({
      ...prev,
      [field]: error,
    }));

    return !error;
  }, [validateField]);

  const setFieldTouched = useCallback((field: string, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [field]: isTouched,
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const hasError = useCallback((field: string): boolean => {
    return !!errors[field];
  }, [errors]);

  const getError = useCallback((field: string): string => {
    return errors[field] || '';
  }, [errors]);

  const isFieldTouched = useCallback((field: string): boolean => {
    return !!touched[field];
  }, [touched]);

  const shouldShowError = useCallback((field: string): boolean => {
    return isFieldTouched(field) && hasError(field);
  }, [isFieldTouched, hasError]);

  return {
    // Estado
    errors,
    touched,
    
    // Validação
    validateAll,
    validateSingle,
    validateField,
    
    // Utilitários
    setFieldTouched,
    clearErrors,
    clearFieldError,
    hasError,
    getError,
    isFieldTouched,
    shouldShowError,
    
    // Regras comuns
    rules: commonRules,
  };
};

export default useValidation;
