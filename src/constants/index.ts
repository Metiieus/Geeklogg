/**
 * Constantes globais da aplicação
 */

// Configurações de tempo
export const TIME_CONSTANTS = {
  NOTIFICATION_POLLING_INTERVAL: 30000, // 30 segundos
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutos
  DEBOUNCE_DELAY: 300, // 300ms
  TOAST_DURATION: 3000, // 3 segundos
} as const;

// Limites de dados
export const DATA_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILENAME_LENGTH: 255,
  MAX_BIO_LENGTH: 500,
  MAX_TITLE_LENGTH: 100,
  MAX_REVIEW_LENGTH: 2000,
  MAX_MILESTONE_DESCRIPTION: 300,
} as const;

// Configurações de interface
export const UI_CONSTANTS = {
  MOBILE_BREAKPOINT: 768,
  TOUCH_TARGET_SIZE: 44,
  MAX_NOTIFICATIONS_DISPLAY: 10,
  ANIMATION_DURATION: 300,
} as const;

// Tipos de mídia
export const MEDIA_TYPES = {
  GAMES: "games",
  ANIME: "anime",
  SERIES: "series",
  BOOKS: "books",
  MOVIES: "movies",
} as const;

// Status de mídia
export const MEDIA_STATUS = {
  COMPLETED: "completed",
  IN_PROGRESS: "in-progress",
  DROPPED: "dropped",
  PLANNED: "planned",
} as const;

// Cores dos tipos de mídia
export const MEDIA_TYPE_COLORS = {
  [MEDIA_TYPES.GAMES]: "from-purple-500 to-indigo-600",
  [MEDIA_TYPES.ANIME]: "from-pink-500 to-red-500",
  [MEDIA_TYPES.SERIES]: "from-blue-500 to-cyan-500",
  [MEDIA_TYPES.BOOKS]: "from-green-500 to-teal-500",
  [MEDIA_TYPES.MOVIES]: "from-yellow-500 to-orange-500",
} as const;

// Configurações de validação
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  STRONG_PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE: /^\+?[\d\s\-\(\)]{10,}$/,
  URL: /^https?:\/\/.+/,
} as const;

// Mensagens de erro padrão
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "Este campo é obrigatório",
  INVALID_EMAIL: "Endereço de email inválido",
  WEAK_PASSWORD:
    "A senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e símbolo",
  FILE_TOO_LARGE: "Arquivo muito grande. Tamanho máximo: 5MB",
  INVALID_FILE_TYPE: "Tipo de arquivo não suportado",
  NETWORK_ERROR: "Erro de conexão. Verifique sua internet",
  UNKNOWN_ERROR: "Ocorreu um erro inesperado",
} as const;

// Configurações de API
export const API_CONFIG = {
  TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo
} as const;

// Features flags
export const FEATURE_FLAGS = {
  SOCIAL_FEATURES: false, // Em desenvolvimento
  PREMIUM_FEATURES: true,
  ANALYTICS: true,
  OFFLINE_MODE: false, // Futuro
} as const;

// Configurações de acessibilidade
export const A11Y_CONFIG = {
  MIN_CONTRAST_RATIO: 4.5, // WCAG AA
  FOCUS_OUTLINE_WIDTH: 2,
  SCREEN_READER_DELAY: 100,
} as const;

export default {
  TIME_CONSTANTS,
  DATA_LIMITS,
  UI_CONSTANTS,
  MEDIA_TYPES,
  MEDIA_STATUS,
  MEDIA_TYPE_COLORS,
  VALIDATION_PATTERNS,
  ERROR_MESSAGES,
  API_CONFIG,
  FEATURE_FLAGS,
  A11Y_CONFIG,
};
