import React, { useState, useEffect } from 'react';
import { Flame, TrendingUp, Calendar, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="text-6xl mb-2"
              >
                🎉
              </motion.div>
              <p className="text-white font-bold text-xl">Sequência Mantida!</p>
              <p className="text-slate-300 text-sm">Continue assim!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Content */}
      <div className={`bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border transition-all duration-300 ${
        atRisk ? 'border-amber-500/30' : 'border-white/10'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className={atRisk ? 'text-amber-400' : 'text-orange-400'} size={24} />
            <h3 className="text-lg font-semibold text-white">Sequência</h3>
          </div>
          <span className="text-2xl">{emoji}</span>
        </div>

        {/* Streak Counter */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-1">
            <motion.span
              key={streakData.currentStreak}
              initial={{ scale: 1.2, color: '#f59e0b' }}
              animate={{ scale: 1, color: '#ffffff' }}
              className="text-5xl font-bold text-white"
            >
              {streakData.currentStreak}
            </motion.span>
            <span className="text-slate-400 text-lg">dia{streakData.currentStreak !== 1 ? 's' : ''}</span>
          </div>
          <p className="text-sm text-slate-400">{message}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-900/50 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Award className="text-yellow-400" size={16} />
              <span className="text-xs text-slate-400">Recorde</span>
            </div>
            <p className="text-xl font-bold text-white">{streakData.longestStreak}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="text-emerald-400" size={16} />
              <span className="text-xs text-slate-400">Total</span>
            </div>
            <p className="text-xl font-bold text-white">{streakData.totalDays}</p>
          </div>
        </div>

        {/* Progress to Next Milestone */}
        {streakData.currentStreak < 100 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Próximo marco</span>
              <span className="text-slate-300 font-medium">
                {streakData.currentStreak < 7 ? '7 dias' : 
                 streakData.currentStreak < 30 ? '30 dias' : '100 dias'}
              </span>
            </div>
            <div className="h-1.5 bg-slate-900/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ 
                  width: `${
                    streakData.currentStreak < 7 
                      ? (streakData.currentStreak / 7) * 100
                      : streakData.currentStreak < 30
                      ? (streakData.currentStreak / 30) * 100
                      : (streakData.currentStreak / 100) * 100
                  }%` 
                }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
              />
            </div>
          </div>
        )}

        {/* At Risk Warning */}
        {atRisk && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg"
          >
            <div className="flex items-start gap-2">
              <Calendar className="text-amber-400 flex-shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-sm font-medium text-amber-300">Sequência em risco!</p>
                <p className="text-xs text-amber-400/80 mt-1">
                  Faz mais de 20 horas desde seu último acesso. Continue hoje para manter sua sequência!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
