/**
 * Utilitários para manipulação segura de datas
 */

export const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const parseDate = (
  timestamp: string | number | Date | undefined | null,
): Date => {
  if (!timestamp) {
    return new Date(); // Retorna data atual se timestamp for inválido
  }

  try {
    const date = new Date(timestamp);
    return isValidDate(date) ? date : new Date();
  } catch {
    return new Date();
  }
};

export const formatTimeAgo = (
  timestamp: string | number | Date | undefined | null,
): string => {
  const date = parseDate(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60),
  );

  if (diffInMinutes < 1) return "Agora";
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatDate = (
  timestamp: string | number | Date | undefined | null,
): string => {
  const date = parseDate(timestamp);
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateShort = (
  timestamp: string | number | Date | undefined | null,
): string => {
  const date = parseDate(timestamp);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const getTimestamp = (): string => {
  return new Date().toISOString();
};

export const normalizeTimestamp = (notification: any): any => {
  // Normaliza notificações antigas que podem ter createdAt ao invés de timestamp
  if (notification && !notification.timestamp && notification.createdAt) {
    return {
      ...notification,
      timestamp: notification.createdAt,
    };
  }
  return notification;
};
