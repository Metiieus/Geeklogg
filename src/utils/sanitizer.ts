/**
 * Utilitário de sanitização para prevenir ataques XSS
 * Remove ou escapa conteúdo HTML/JavaScript malicioso
 */

/**
 * Remove todas as tags HTML de uma string
 */
export const stripHtml = (str: string): string => {
  if (!str) return "";
  return str.replace(/<[^>]*>/g, "");
};

/**
 * Escapa caracteres HTML perigosos
 */
export const escapeHtml = (str: string): string => {
  if (!str) return "";

  const htmlEscapes: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };

  return str.replace(/[&<>"'\/]/g, (match) => htmlEscapes[match]);
};

/**
 * Sanitiza entrada de texto removendo scripts e conteúdo perigoso
 */
export const sanitizeText = (input: string, maxLength?: number): string => {
  if (!input) return "";

  let sanitized = input;

  // Remove tags script
  sanitized = sanitized.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    "",
  );

  // Remove javascript: links
  sanitized = sanitized.replace(/javascript:/gi, "");

  // Remove event handlers (onclick, onload, etc)
  sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "");

  // Remove style tags
  sanitized = sanitized.replace(
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
    "",
  );

  // Remove iframe, object, embed tags
  sanitized = sanitized.replace(
    /<(iframe|object|embed)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi,
    "",
  );

  // Escape HTML restante
  sanitized = escapeHtml(sanitized);

  // Normaliza espaços múltiplos mas preserva espaços únicos
  sanitized = sanitized.replace(/\s+/g, ' ');

  // Remove espaços apenas do início e fim
  sanitized = sanitized.trim();

  // Aplicar limite de caracteres se especificado
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
};

/**
 * Valida e sanitiza URLs
 */
export const sanitizeUrl = (url: string): string | null => {
  if (!url) return null;

  try {
    const urlObj = new URL(url);

    // Permitir apenas protocolos seguros
    const allowedProtocols = ["http:", "https:"];
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return null;
    }

    // Bloquear domínios suspeitos (pode ser expandido)
    const blockedDomains = ["javascript", "data", "vbscript"];
    if (blockedDomains.some((domain) => urlObj.hostname.includes(domain))) {
      return null;
    }

    return urlObj.toString();
  } catch (e) {
    return null;
  }
};

/**
 * Sanitiza tags (arrays de strings)
 */
export const sanitizeTags = (tags: string[]): string[] => {
  if (!Array.isArray(tags)) return [];

  return tags
    .map((tag) => sanitizeText(tag, 50)) // Limite de 50 chars por tag
    .filter((tag) => tag.length > 0 && tag.length <= 50)
    .slice(0, 20); // Máximo 20 tags
};

/**
 * Valida e sanitiza entrada de arquivo
 */
export const validateFileInput = (
  file: File,
): { isValid: boolean; error?: string } => {
  if (!file) {
    return { isValid: false, error: "Nenhum arquivo selecionado" };
  }

  // Tamanho máximo: 10MB
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { isValid: false, error: "Arquivo muito grande (máximo 10MB)" };
  }

  // Tipos permitidos
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "text/plain",
    "application/json",
  ];

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: "Tipo de arquivo não permitido" };
  }

  // Verificar extensão também (double-check)
  const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".pdf",
    ".txt",
    ".json",
  ];
  const fileExtension = file.name
    .toLowerCase()
    .substring(file.name.lastIndexOf("."));

  if (!allowedExtensions.includes(fileExtension)) {
    return { isValid: false, error: "Extensão de arquivo não permitida" };
  }

  return { isValid: true };
};

/**
 * Sanitiza dados do formulário genericamente
 */
export const sanitizeFormData = (
  data: Record<string, any>,
): Record<string, any> => {
  const sanitized: Record<string, any> = {};

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (typeof value === "string") {
      sanitized[key] = sanitizeText(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === "string" ? sanitizeText(item) : item,
      );
    } else {
      sanitized[key] = value;
    }
  });

  return sanitized;
};

export default {
  stripHtml,
  escapeHtml,
  sanitizeText,
  sanitizeUrl,
  sanitizeTags,
  validateFileInput,
  sanitizeFormData,
};
