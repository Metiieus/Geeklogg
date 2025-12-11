import React, { useEffect, useState } from 'react';
import { Flame, TrendingUp, Calendar, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  updateStreak,
  getStreakData,
  getStreakMessage,
  getStreakEmoji,
  isStreakAtRisk,
  type StreakData,
} from '../services/streakService';

interface StreakCardProps {
  userId: string;
}

export const StreakCard: React.FC<StreakCardProps> = ({ userId }) => {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Atualiza streak ao montar componente
    const oldData = getStreakData(userId);
    const newData = updateStreak(userId);
    
    setStreakData(newData);

    // Mostra celebração se streak aumentou
    if (newData.currentStreak > oldData.currentStreak && newData.currentStreak > 1) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [userId]);

  if (!streakData) return null;

  const atRisk = isStreakAtRisk(userId);
  const emoji = getStreakEmoji(streakData.currentStreak);
  const message = getStreakMessage(streakData.currentStreak);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden"
    >
      {/* Celebration Effect */}
      {showCelebration && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        >
          <span className="text-6xl">🎉</span>
        </motion.div>
      )}

      <div
        className={`bg-gradient-to-br ${
          streakData.currentStreak >= 7
            ? 'from-orange-500/20 to-red-500/20 border-orange-500/30'
            : 'from-orange-500/10 to-red-500/10 border-orange-500/20'
        } backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border hover:scale-105 transition-all duration-300 ${
          streakData.currentStreak >= 7 ? 'hover:shadow-lg hover:shadow-orange-500/20' : ''
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame
              className={`${
                streakData.currentStreak >= 7 ? 'text-orange-400' : 'text-orange-300'
              } ${streakData.currentStreak >= 7 ? 'animate-pulse' : ''}`}
              size={24}
            />
            <h3 className="text-lg font-semibold text-white">Sequência</h3>
          </div>
          <span className="text-3xl">{emoji}</span>
        </div>

        {/* Current Streak */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-bold text-white">
              {streakData.currentStreak}
            </span>
            <span className="text-lg text-slate-300">
              {streakData.currentStreak === 1 ? 'dia' : 'dias'}
            </span>
          </div>
          <p className="text-sm text-slate-400">{message}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-black/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Award className="text-yellow-400" size={16} />
              <span className="text-xs text-slate-400">Recorde</span>
            </div>
            <p className="text-lg font-bold text-white">
              {streakData.longestStreak}
            </p>
          </div>

          <div className="bg-black/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="text-blue-400" size={16} />
              <span className="text-xs text-slate-400">Total</span>
            </div>
            <p className="text-lg font-bold text-white">
              {streakData.totalDays}
            </p>
          </div>
        </div>

        {/* Warning if at risk */}
        {atRisk && streakData.currentStreak > 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/20 border border-red-500/30 rounded-lg p-3"
          >
            <p className="text-sm text-red-300 flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              Sua sequência está em risco! Volte amanhã para mantê-la!
            </p>
          </motion.div>
        )}

        {/* Progress to next milestone */}
        {streakData.currentStreak > 0 && streakData.currentStreak < 100 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">
                Próximo marco
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {getNextMilestone(streakData.currentStreak)} dias
              </span>
            </div>
            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${getMilestoneProgress(streakData.currentStreak)}%`,
                }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-orange-500 to-red-500"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Helper functions
const getNextMilestone = (current: number): number => {
  const milestones = [7, 14, 30, 50, 100, 365];
  return milestones.find((m) => m > current) || 365;
};

const getMilestoneProgress = (current: number): number => {
  const next = getNextMilestone(current);
  const previous = [0, 7, 14, 30, 50, 100].reverse().find((m) => m < current) || 0;
  return ((current - previous) / (next - previous)) * 100;
};
