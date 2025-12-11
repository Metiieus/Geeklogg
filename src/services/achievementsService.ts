/**
 * Achievements Service - Sistema de conquistas e badges
 * Gerencia conquistas desbloqueáveis baseadas em ações do usuário
 */

import { MediaItem } from '../types';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'completion' | 'rating' | 'collection' | 'time' | 'streak' | 'special';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  requirement: number;
  current: number;
  unlocked: boolean;
  unlockedAt?: string;
  reward: string;
}

const ACHIEVEMENTS_STORAGE_KEY = 'geeklogg_achievements';

/**
 * Define todas as conquistas disponíveis
 */
const ALL_ACHIEVEMENTS: Omit<Achievement, 'current' | 'unlocked' | 'unlockedAt'>[] = [
  // Completion Achievements
  {
    id: 'first_steps',
    title: 'Primeiros Passos',
    description: 'Complete sua primeira mídia',
    icon: '🎯',
    category: 'completion',
    tier: 'bronze',
    requirement: 1,
    reward: 'Badge Bronze',
  },
  {
    id: 'getting_started',
    title: 'Começando Bem',
    description: 'Complete 10 mídias',
    icon: '🚀',
    category: 'completion',
    tier: 'silver',
    requirement: 10,
    reward: 'Badge Prata',
  },
  {
    id: 'dedicated',
    title: 'Dedicado',
    description: 'Complete 50 mídias',
    icon: '💪',
    category: 'completion',
    tier: 'gold',
    requirement: 50,
    reward: 'Badge Ouro',
  },
  {
    id: 'legendary',
    title: 'Lendário',
    description: 'Complete 100 mídias',
    icon: '👑',
    category: 'completion',
    tier: 'platinum',
    requirement: 100,
    reward: 'Badge Platina',
  },

  // Rating Achievements
  {
    id: 'critic',
    title: 'Crítico',
    description: 'Avalie 10 mídias',
    icon: '⭐',
    category: 'rating',
    tier: 'bronze',
    requirement: 10,
    reward: 'Badge Crítico',
  },
  {
    id: 'expert_critic',
    title: 'Crítico Expert',
    description: 'Avalie 50 mídias',
    icon: '🌟',
    category: 'rating',
    tier: 'silver',
    requirement: 50,
    reward: 'Badge Crítico Expert',
  },
  {
    id: 'perfectionist',
    title: 'Perfeccionista',
    description: 'Dê 10 notas 10/10',
    icon: '💎',
    category: 'rating',
    tier: 'gold',
    requirement: 10,
    reward: 'Badge Perfeccionista',
  },

  // Collection Achievements
  {
    id: 'collector',
    title: 'Colecionador',
    description: 'Adicione 25 mídias à biblioteca',
    icon: '📚',
    category: 'collection',
    tier: 'bronze',
    requirement: 25,
    reward: 'Badge Colecionador',
  },
  {
    id: 'hoarder',
    title: 'Acumulador',
    description: 'Adicione 100 mídias à biblioteca',
    icon: '🗃️',
    category: 'collection',
    tier: 'silver',
    requirement: 100,
    reward: 'Badge Acumulador',
  },
  {
    id: 'library_master',
    title: 'Mestre da Biblioteca',
    description: 'Adicione 250 mídias à biblioteca',
    icon: '🏛️',
    category: 'collection',
    tier: 'gold',
    requirement: 250,
    reward: 'Badge Mestre',
  },

  // Time Achievements
  {
    id: 'time_traveler',
    title: 'Viajante do Tempo',
    description: 'Invista 100 horas',
    icon: '⏰',
    category: 'time',
    tier: 'bronze',
    requirement: 100,
    reward: 'Badge Tempo',
  },
  {
    id: 'marathon_runner',
    title: 'Maratonista',
    description: 'Invista 500 horas',
    icon: '🏃',
    category: 'time',
    tier: 'silver',
    requirement: 500,
    reward: 'Badge Maratonista',
  },
  {
    id: 'time_lord',
    title: 'Senhor do Tempo',
    description: 'Invista 1000 horas',
    icon: '⚡',
    category: 'time',
    tier: 'gold',
    requirement: 1000,
    reward: 'Badge Senhor do Tempo',
  },

  // Streak Achievements
  {
    id: 'consistent',
    title: 'Consistente',
    description: 'Mantenha 7 dias de sequência',
    icon: '🔥',
    category: 'streak',
    tier: 'bronze',
    requirement: 7,
    reward: 'Badge Consistência',
  },
  {
    id: 'dedicated_user',
    title: 'Usuário Dedicado',
    description: 'Mantenha 30 dias de sequência',
    icon: '💫',
    category: 'streak',
    tier: 'silver',
    requirement: 30,
    reward: 'Badge Dedicação',
  },
  {
    id: 'unstoppable',
    title: 'Imparável',
    description: 'Mantenha 100 dias de sequência',
    icon: '🌟',
    category: 'streak',
    tier: 'gold',
    requirement: 100,
    reward: 'Badge Imparável',
  },

  // Special Achievements
  {
    id: 'explorer',
    title: 'Explorador',
    description: 'Adicione mídias de todas as categorias',
    icon: '🗺️',
    category: 'special',
    tier: 'gold',
    requirement: 5,
    reward: 'Badge Explorador',
  },
  {
    id: 'speed_demon',
    title: 'Demônio da Velocidade',
    description: 'Complete 5 mídias em uma semana',
    icon: '⚡',
    category: 'special',
    tier: 'silver',
    requirement: 5,
    reward: 'Badge Velocista',
  },
  {
    id: 'night_owl',
    title: 'Coruja Noturna',
    description: 'Acesse o app à meia-noite',
    icon: '🦉',
    category: 'special',
    tier: 'bronze',
    requirement: 1,
    reward: 'Badge Noturno',
  },
];

/**
 * Obtém conquistas do localStorage
 */
export const getAchievements = (userId: string): Achievement[] => {
  try {
    const stored = localStorage.getItem(`${ACHIEVEMENTS_STORAGE_KEY}_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading achievements:', error);
  }

  // Inicializa conquistas
  return ALL_ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    current: 0,
    unlocked: false,
  }));
};

/**
 * Salva conquistas no localStorage
 */
const saveAchievements = (userId: string, achievements: Achievement[]): void => {
  try {
    localStorage.setItem(`${ACHIEVEMENTS_STORAGE_KEY}_${userId}`, JSON.stringify(achievements));
  } catch (error) {
    console.error('Error saving achievements:', error);
  }
};

/**
 * Atualiza progresso das conquistas
 */
export const updateAchievements = (
  userId: string,
  mediaItems: MediaItem[],
  currentStreak: number
): { achievements: Achievement[]; newlyUnlocked: Achievement[] } => {
  const achievements = getAchievements(userId);
  const newlyUnlocked: Achievement[] = [];

  // Calcula estatísticas
  const stats = {
    completed: mediaItems.filter((item) => item.status === 'completed').length,
    rated: mediaItems.filter((item) => item.rating).length,
    perfect: mediaItems.filter((item) => item.rating === 10).length,
    total: mediaItems.length,
    hours: mediaItems.reduce((sum, item) => sum + (item.hoursSpent || 0), 0),
    categories: new Set(mediaItems.map((item) => item.type)).size,
  };

  // Atualiza cada conquista
  const updatedAchievements = achievements.map((achievement) => {
    let current = 0;

    switch (achievement.category) {
      case 'completion':
        current = stats.completed;
        break;
      case 'rating':
        if (achievement.id === 'perfectionist') {
          current = stats.perfect;
        } else {
          current = stats.rated;
        }
        break;
      case 'collection':
        current = stats.total;
        break;
      case 'time':
        current = Math.floor(stats.hours);
        break;
      case 'streak':
        current = currentStreak;
        break;
      case 'special':
        if (achievement.id === 'explorer') {
          current = stats.categories;
        } else if (achievement.id === 'speed_demon') {
          // Conta mídias completadas na última semana
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          current = mediaItems.filter(
            (item) =>
              item.status === 'completed' &&
              new Date(item.updatedAt) >= weekAgo
          ).length;
        } else if (achievement.id === 'night_owl') {
          // Verifica se está acessando à meia-noite
          const hour = new Date().getHours();
          current = hour === 0 ? 1 : achievement.current;
        }
        break;
    }

    const wasUnlocked = achievement.unlocked;
    const unlocked = current >= achievement.requirement;

    // Se desbloqueou agora
    if (unlocked && !wasUnlocked) {
      const unlockedAchievement = {
        ...achievement,
        current,
        unlocked,
        unlockedAt: new Date().toISOString(),
      };
      newlyUnlocked.push(unlockedAchievement);
      return unlockedAchievement;
    }

    return {
      ...achievement,
      current,
      unlocked,
    };
  });

  saveAchievements(userId, updatedAchievements);

  return {
    achievements: updatedAchievements,
    newlyUnlocked,
  };
};

/**
 * Obtém conquistas por categoria
 */
export const getAchievementsByCategory = (
  achievements: Achievement[],
  category: Achievement['category']
): Achievement[] => {
  return achievements.filter((a) => a.category === category);
};

/**
 * Obtém conquistas desbloqueadas
 */
export const getUnlockedAchievements = (achievements: Achievement[]): Achievement[] => {
  return achievements.filter((a) => a.unlocked);
};

/**
 * Obtém conquistas em progresso (próximas de desbloquear)
 */
export const getInProgressAchievements = (achievements: Achievement[]): Achievement[] => {
  return achievements
    .filter((a) => !a.unlocked && a.current > 0)
    .sort((a, b) => {
      const progressA = a.current / a.requirement;
      const progressB = b.current / b.requirement;
      return progressB - progressA;
    })
    .slice(0, 3);
};

/**
 * Obtém cor do tier
 */
export const getTierColor = (tier: Achievement['tier']): string => {
  const colors = {
    bronze: 'from-amber-600 to-amber-800',
    silver: 'from-slate-400 to-slate-600',
    gold: 'from-yellow-400 to-yellow-600',
    platinum: 'from-cyan-400 to-blue-600',
  };
  return colors[tier];
};

/**
 * Obtém label do tier
 */
export const getTierLabel = (tier: Achievement['tier']): string => {
  const labels = {
    bronze: 'Bronze',
    silver: 'Prata',
    gold: 'Ouro',
    platinum: 'Platina',
  };
  return labels[tier];
};

/**
 * Calcula porcentagem de conquistas desbloqueadas
 */
export const getAchievementProgress = (achievements: Achievement[]): number => {
  const unlocked = achievements.filter((a) => a.unlocked).length;
  return (unlocked / achievements.length) * 100;
};
