export type AchievementCategory = 'gamer' | 'leitor' | 'narrador' | 'cinefilo' | 'geral';

export interface AchievementNode {
  id: string;
  title: string;
  description: string;
  image: string;
  unlocked: boolean;
  unlockedAt?: string;
  dependsOn?: string[];
  category: AchievementCategory;
  position: { x: number; y: number }; // Para posicionamento na árvore
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserAchievement {
  id: string;
  achievementId: string;
  unlockedAt: string;
  title: string;
  image: string;
  category: AchievementCategory;
}

export interface AchievementProgress {
  totalUnlocked: number;
  totalAvailable: number;
  byCategory: Record<AchievementCategory, { unlocked: number; total: number }>;
}