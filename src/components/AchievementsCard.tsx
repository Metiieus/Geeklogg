import React, { useEffect, useState } from 'react';
import { Trophy, Lock, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  updateAchievements,
  getInProgressAchievements,
  getAchievementProgress,
  getTierColor,
  getTierLabel,
  type Achievement,
} from '../services/achievementsService';
import { MediaItem } from '../types';

interface AchievementsCardProps {
  userId: string;
  mediaItems: MediaItem[];
  currentStreak: number;
  onViewAll?: () => void;
}

export const AchievementsCard: React.FC<AchievementsCardProps> = ({
  userId,
  mediaItems,
  currentStreak,
  onViewAll,
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [inProgress, setInProgress] = useState<Achievement[]>([]);
  const [progress, setProgress] = useState(0);
  const [newUnlock, setNewUnlock] = useState<Achievement | null>(null);

  useEffect(() => {
    const { achievements: updated, newlyUnlocked } = updateAchievements(
      userId,
      mediaItems,
      currentStreak
    );

    setAchievements(updated);
    setInProgress(getInProgressAchievements(updated));
    setProgress(getAchievementProgress(updated));

    // Mostra notificação de nova conquista
    if (newlyUnlocked.length > 0) {
      setNewUnlock(newlyUnlocked[0]);
      setTimeout(() => setNewUnlock(null), 5000);
    }
  }, [userId, mediaItems, currentStreak]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* New Achievement Notification */}
      <AnimatePresence>
        {newUnlock && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-20 bg-amber-500/20 border border-amber-500/30 text-white px-6 py-3 rounded-xl shadow-2xl backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{newUnlock.icon}</span>
              <div>
                <p className="font-bold text-sm">Conquista Desbloqueada!</p>
                <p className="text-xs text-amber-300">{newUnlock.title}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-400" size={24} />
            <h3 className="text-lg font-semibold text-white">Conquistas</h3>
          </div>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="flex items-center gap-1 text-sm text-slate-300 hover:text-white transition-colors"
            >
              <span>Ver Todas</span>
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        {/* Progress Overview */}
        <div className="mb-4 p-3 bg-slate-900/50 rounded-lg border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Progresso Geral</span>
            <span className="text-sm font-semibold text-white">
              {unlockedCount}/{achievements.length}
            </span>
          </div>
          <div className="h-2 bg-black/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-yellow-500 to-amber-600"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1 text-center">
            {Math.round(progress)}% completo
          </p>
        </div>

        {/* In Progress Achievements */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-300">Próximas Conquistas</h4>
          {inProgress.length > 0 ? (
            inProgress.map((achievement, index) => (
              <AchievementItem key={achievement.id} achievement={achievement} index={index} />
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-slate-400">
                Continue explorando para desbloquear conquistas!
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-slate-400">Bronze</p>
            <p className="text-lg font-bold text-orange-400">
              {achievements.filter((a) => a.tier === 'bronze' && a.unlocked).length}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Prata</p>
            <p className="text-lg font-bold text-slate-300">
              {achievements.filter((a) => a.tier === 'silver' && a.unlocked).length}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Ouro</p>
            <p className="text-lg font-bold text-yellow-400">
              {achievements.filter((a) => a.tier === 'gold' && a.unlocked).length}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Achievement Item Component
interface AchievementItemProps {
  achievement: Achievement;
  index: number;
}

const AchievementItem: React.FC<AchievementItemProps> = ({ achievement, index }) => {
  const progress = (achievement.current / achievement.requirement) * 100;
  const tierLabel = getTierLabel(achievement.tier);

  // Subtle tier colors
  const tierClasses = {
    bronze: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    silver: 'text-slate-300 bg-slate-500/10 border-slate-500/20',
    gold: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    platinum: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-3 rounded-lg border ${
        achievement.unlocked
          ? 'bg-amber-500/10 border-amber-500/20'
          : 'bg-slate-900/50 border-white/5'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="text-2xl flex-shrink-0 mt-1">
          {achievement.unlocked ? achievement.icon : <Lock size={20} className="text-slate-600" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`font-medium text-sm ${
              achievement.unlocked ? 'text-white' : 'text-slate-400'
            }`}>
              {achievement.title}
            </h4>
            <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${
              tierClasses[achievement.tier]
            }`}>
              {tierLabel}
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-2">{achievement.description}</p>

          {/* Progress Bar */}
          {!achievement.unlocked && (
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-300">
                  {achievement.current}/{achievement.requirement}
                </span>
                <span className="text-xs text-slate-400">{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full bg-gradient-to-r from-yellow-500 to-amber-600"
                />
              </div>
            </div>
          )}

          {/* Reward */}
          <div className="flex items-center gap-1 text-xs text-yellow-400">
            <Trophy size={12} />
            <span>{achievement.reward}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
