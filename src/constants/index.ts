export const Colors = {
  primary: "#7c3aed",
  primaryLight: "#8b5cf6",
  background: "#0a0a0f",
  card: "#12121a",
  border: "#2a2a3e",
  text: "#e2e8f0",
  textMuted: "#94a3b8",
  success: "#10b981",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",
  cyan: "#06b6d4",
  pink: "#ec4899",
  gold: "#f59e0b",
} as const;

export const MediaTypes = [
  { id: "movie", label: "Filmes", icon: "film" },
  { id: "series", label: "Séries", icon: "tv" },
  { id: "anime", label: "Animes", icon: "star" },
  { id: "game", label: "Games", icon: "game-controller" },
  { id: "book", label: "Livros", icon: "book" },
  { id: "manga", label: "Mangás", icon: "library" },
] as const;

export const StatusOptions = [
  { id: "watching", label: "Assistindo", color: "#3b82f6" },
  { id: "completed", label: "Concluído", color: "#10b981" },
  { id: "planning", label: "Planejando", color: "#8b5cf6" },
  { id: "dropped", label: "Abandonado", color: "#ef4444" },
  { id: "paused", label: "Pausado", color: "#f59e0b" },
] as const;

export const APP_NAME = "Geeklogg";
export const APP_VERSION = "1.0.0";
