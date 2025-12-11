/**
 * Streak Service - Sistema de dias consecutivos
 * Gerencia o streak do usuário (dias consecutivos acessando)
 */

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastAccessDate: string;
  totalDays: number;
  streakHistory: StreakHistoryEntry[];
}

export interface StreakHistoryEntry {
  date: string;
  streakCount: number;
  broken: boolean;
}

const STREAK_STORAGE_KEY = 'geeklogg_streak';

/**
 * Calcula a diferença em dias entre duas datas
 */
const getDaysDifference = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Verifica se duas datas são do mesmo dia
 */
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Obtém os dados do streak do localStorage
 */
export const getStreakData = (userId: string): StreakData => {
  try {
    const stored = localStorage.getItem(`${STREAK_STORAGE_KEY}_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading streak data:', error);
  }

  // Dados padrão
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastAccessDate: '',
    totalDays: 0,
    streakHistory: [],
  };
};

/**
 * Salva os dados do streak no localStorage
 */
const saveStreakData = (userId: string, data: StreakData): void => {
  try {
    localStorage.setItem(`${STREAK_STORAGE_KEY}_${userId}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving streak data:', error);
  }
};

/**
 * Atualiza o streak do usuário
 * Deve ser chamado quando o usuário acessa o app
 */
export const updateStreak = (userId: string): StreakData => {
  const data = getStreakData(userId);
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Se já acessou hoje, não faz nada
  if (data.lastAccessDate === todayStr) {
    return data;
  }

  // Primeira vez acessando
  if (!data.lastAccessDate) {
    const newData: StreakData = {
      currentStreak: 1,
      longestStreak: 1,
      lastAccessDate: todayStr,
      totalDays: 1,
      streakHistory: [
        {
          date: todayStr,
          streakCount: 1,
          broken: false,
        },
      ],
    };
    saveStreakData(userId, newData);
    return newData;
  }

  const lastAccess = new Date(data.lastAccessDate);
  const daysDiff = getDaysDifference(lastAccess, today);

  let newStreak = data.currentStreak;
  let broken = false;

  if (daysDiff === 1) {
    // Acesso consecutivo - incrementa streak
    newStreak = data.currentStreak + 1;
  } else if (daysDiff > 1) {
    // Streak quebrado - reinicia
    newStreak = 1;
    broken = true;
  }

  const newData: StreakData = {
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, data.longestStreak),
    lastAccessDate: todayStr,
    totalDays: data.totalDays + 1,
    streakHistory: [
      ...data.streakHistory.slice(-30), // Mantém últimos 30 dias
      {
        date: todayStr,
        streakCount: newStreak,
        broken,
      },
    ],
  };

  saveStreakData(userId, newData);
  return newData;
};

/**
 * Verifica se o streak está em risco (último acesso foi ontem)
 */
export const isStreakAtRisk = (userId: string): boolean => {
  const data = getStreakData(userId);
  
  if (!data.lastAccessDate || data.currentStreak === 0) {
    return false;
  }

  const lastAccess = new Date(data.lastAccessDate);
  const today = new Date();
  const daysDiff = getDaysDifference(lastAccess, today);

  // Se último acesso foi ontem, streak está em risco
  return daysDiff === 1;
};

/**
 * Retorna mensagem motivacional baseada no streak
 */
export const getStreakMessage = (streak: number): string => {
  if (streak === 0) return 'Comece sua jornada hoje!';
  if (streak === 1) return 'Primeiro dia! Continue assim!';
  if (streak < 7) return 'Você está indo bem! Continue!';
  if (streak < 30) return 'Incrível! Você está consistente!';
  if (streak < 100) return 'Lendário! Você é dedicado!';
  return 'ÉPICO! Você é imparável! 🔥';
};

/**
 * Retorna emoji baseado no streak
 */
export const getStreakEmoji = (streak: number): string => {
  if (streak === 0) return '✨';
  if (streak < 7) return '🔥';
  if (streak < 30) return '⚡';
  if (streak < 100) return '💎';
  return '👑';
};

/**
 * Calcula a porcentagem de dias ativos no último mês
 */
export const getMonthlyActivityRate = (userId: string): number => {
  const data = getStreakData(userId);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentHistory = data.streakHistory.filter(
    (entry) => new Date(entry.date) >= thirtyDaysAgo
  );

  return recentHistory.length > 0 ? (recentHistory.length / 30) * 100 : 0;
};
