/**
 * Challenges Service - Sistema de desafios semanais
 * Gerencia desafios rotativos para engajar usuários
 */

import { MediaItem } from '../types';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'count' | 'rating' | 'hours' | 'streak' | 'category';
  target: number;
  current: number;
  reward: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expiresAt: string;
  completed: boolean;
}

export interface WeeklyChallenges {
  week: string;
  challenges: Challenge[];
  completedCount: number;
}

const CHALLENGES_STORAGE_KEY = 'geeklogg_challenges';

/**
 * Obtém o número da semana do ano
 */
const getWeekNumber = (date: Date): string => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return `${date.getFullYear()}-W${weekNumber}`;
};

/**
 * Calcula a data de expiração (próximo domingo)
 */
const getWeekEndDate = (): string => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
  const sunday = new Date(today);
  sunday.setDate(today.getDate() + daysUntilSunday);
  sunday.setHours(23, 59, 59, 999);
  return sunday.toISOString();
};

/**
 * Gera desafios aleatórios para a semana
 */
const generateWeeklyChallenges = (): Challenge[] => {
  const allChallenges: Omit<Challenge, 'id' | 'current' | 'expiresAt' | 'completed'>[] = [
    // Easy Challenges
    {
      title: 'Adicione 3 Mídias',
      description: 'Expanda sua biblioteca adicionando 3 novas mídias',
      icon: '➕',
      type: 'count',
      target: 3,
      reward: 'Badge "Colecionador"',
      difficulty: 'easy',
    },
    {
      title: 'Avalie 5 Mídias',
      description: 'Compartilhe sua opinião avaliando 5 mídias',
      icon: '⭐',
      type: 'rating',
      target: 5,
      reward: 'Badge "Crítico"',
      difficulty: 'easy',
    },
    {
      title: 'Complete 1 Mídia',
      description: 'Termine algo que você começou',
      icon: '✅',
      type: 'count',
      target: 1,
      reward: 'Badge "Finalizador"',
      difficulty: 'easy',
    },
    {
      title: 'Acesse 3 Dias Seguidos',
      description: 'Mantenha sua sequência por 3 dias',
      icon: '🔥',
      type: 'streak',
      target: 3,
      reward: 'Badge "Consistente"',
      difficulty: 'easy',
    },

    // Medium Challenges
    {
      title: 'Complete 2 Mídias',
      description: 'Finalize 2 mídias esta semana',
      icon: '🎯',
      type: 'count',
      target: 2,
      reward: 'Badge "Produtivo"',
      difficulty: 'medium',
    },
    {
      title: 'Invista 10 Horas',
      description: 'Dedique 10 horas ao entretenimento',
      icon: '⏰',
      type: 'hours',
      target: 10,
      reward: 'Badge "Dedicado"',
      difficulty: 'medium',
    },
    {
      title: 'Explore 2 Categorias',
      description: 'Adicione mídias de pelo menos 2 categorias diferentes',
      icon: '🎭',
      type: 'category',
      target: 2,
      reward: 'Badge "Explorador"',
      difficulty: 'medium',
    },
    {
      title: 'Dê 3 Notas 10/10',
      description: 'Encontre 3 obras-primas',
      icon: '💎',
      type: 'rating',
      target: 3,
      reward: 'Badge "Perfeccionista"',
      difficulty: 'medium',
    },

    // Hard Challenges
    {
      title: 'Complete 5 Mídias',
      description: 'Finalize 5 mídias esta semana',
      icon: '🏆',
      type: 'count',
      target: 5,
      reward: 'Badge "Maratonista"',
      difficulty: 'hard',
    },
    {
      title: 'Invista 20 Horas',
      description: 'Dedique 20 horas ao entretenimento',
      icon: '⚡',
      type: 'hours',
      target: 20,
      reward: 'Badge "Hardcore"',
      difficulty: 'hard',
    },
    {
      title: 'Acesse 7 Dias Seguidos',
      description: 'Complete uma semana perfeita',
      icon: '👑',
      type: 'streak',
      target: 7,
      reward: 'Badge "Lendário"',
      difficulty: 'hard',
    },
  ];

  // Seleciona 3 desafios aleatórios (1 easy, 1 medium, 1 hard)
  const easy = allChallenges.filter((c) => c.difficulty === 'easy');
  const medium = allChallenges.filter((c) => c.difficulty === 'medium');
  const hard = allChallenges.filter((c) => c.difficulty === 'hard');

  const selectedEasy = easy[Math.floor(Math.random() * easy.length)];
  const selectedMedium = medium[Math.floor(Math.random() * medium.length)];
  const selectedHard = hard[Math.floor(Math.random() * hard.length)];

  const expiresAt = getWeekEndDate();

  return [selectedEasy, selectedMedium, selectedHard].map((challenge, index) => ({
    ...challenge,
    id: `challenge-${Date.now()}-${index}`,
    current: 0,
    expiresAt,
    completed: false,
  }));
};

/**
 * Obtém os desafios da semana atual
 */
export const getWeeklyChallenges = (userId: string): WeeklyChallenges => {
  const currentWeek = getWeekNumber(new Date());
  
  try {
    const stored = localStorage.getItem(`${CHALLENGES_STORAGE_KEY}_${userId}`);
    if (stored) {
      const data: WeeklyChallenges = JSON.parse(stored);
      
      // Se é a mesma semana, retorna os desafios existentes
      if (data.week === currentWeek) {
        return data;
      }
    }
  } catch (error) {
    console.error('Error loading challenges:', error);
  }

  // Gera novos desafios para a semana
  const challenges = generateWeeklyChallenges();
  const newData: WeeklyChallenges = {
    week: currentWeek,
    challenges,
    completedCount: 0,
  };

  saveWeeklyChallenges(userId, newData);
  return newData;
};

/**
 * Salva os desafios no localStorage
 */
const saveWeeklyChallenges = (userId: string, data: WeeklyChallenges): void => {
  try {
    localStorage.setItem(`${CHALLENGES_STORAGE_KEY}_${userId}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving challenges:', error);
  }
};

/**
 * Atualiza o progresso dos desafios baseado nas mídias do usuário
 */
export const updateChallengesProgress = (
  userId: string,
  mediaItems: MediaItem[],
  currentStreak: number
): WeeklyChallenges => {
  const data = getWeeklyChallenges(userId);
  const weekStart = getWeekStartDate();

  // Filtra mídias adicionadas/atualizadas esta semana
  const thisWeekMedia = mediaItems.filter((item) => {
    const updatedAt = new Date(item.updatedAt);
    return updatedAt >= weekStart;
  });

  // Atualiza cada desafio
  const updatedChallenges = data.challenges.map((challenge) => {
    let current = 0;

    switch (challenge.type) {
      case 'count':
        // Conta mídias completadas esta semana
        if (challenge.title.includes('Complete')) {
          current = thisWeekMedia.filter((item) => item.status === 'completed').length;
        }
        // Conta mídias adicionadas esta semana
        else if (challenge.title.includes('Adicione')) {
          current = thisWeekMedia.length;
        }
        break;

      case 'rating':
        // Conta avaliações feitas esta semana
        if (challenge.title.includes('Avalie')) {
          current = thisWeekMedia.filter((item) => item.rating).length;
        }
        // Conta notas 10/10 esta semana
        else if (challenge.title.includes('10/10')) {
          current = thisWeekMedia.filter((item) => item.rating === 10).length;
        }
        break;

      case 'hours':
        // Soma horas gastas esta semana
        current = thisWeekMedia.reduce((sum, item) => sum + (item.hoursSpent || 0), 0);
        break;

      case 'streak':
        // Usa o streak atual
        current = currentStreak;
        break;

      case 'category':
        // Conta categorias únicas esta semana
        const categories = new Set(thisWeekMedia.map((item) => item.type));
        current = categories.size;
        break;
    }

    const completed = current >= challenge.target;

    return {
      ...challenge,
      current: Math.min(current, challenge.target),
      completed,
    };
  });

  const completedCount = updatedChallenges.filter((c) => c.completed).length;

  const updatedData: WeeklyChallenges = {
    ...data,
    challenges: updatedChallenges,
    completedCount,
  };

  saveWeeklyChallenges(userId, updatedData);
  return updatedData;
};

/**
 * Obtém a data de início da semana (segunda-feira)
 */
const getWeekStartDate = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysToMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

/**
 * Calcula dias restantes até o fim da semana
 */
export const getDaysUntilWeekEnd = (): number => {
  const today = new Date();
  const weekEnd = new Date(getWeekEndDate());
  const diffTime = weekEnd.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Retorna cor baseada na dificuldade
 */
export const getDifficultyColor = (difficulty: Challenge['difficulty']): string => {
  switch (difficulty) {
    case 'easy':
      return 'text-green-400';
    case 'medium':
      return 'text-yellow-400';
    case 'hard':
      return 'text-red-400';
  }
};

/**
 * Retorna label da dificuldade
 */
export const getDifficultyLabel = (difficulty: Challenge['difficulty']): string => {
  switch (difficulty) {
    case 'easy':
      return 'Fácil';
    case 'medium':
      return 'Médio';
    case 'hard':
      return 'Difícil';
  }
};
