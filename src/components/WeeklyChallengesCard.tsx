import React, { useEffect, useState } from 'react';
import { Target, Trophy, Clock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getWeeklyChallenges,
  updateChallengesProgress,
  getDaysUntilWeekEnd,
  getDifficultyColor,
  getDifficultyLabel,
  type WeeklyChallenges,
  type Challenge,
} from '../services/challengesService';
import { getStreakData } from '../services/streakService';
import { MediaItem } from '../types';

interface WeeklyChallengesCardProps {
  userId: string;
  mediaItems: MediaItem[];
}

export const WeeklyChallengesCard: React.FC<WeeklyChallengesCardProps> = ({
  userId,
  mediaItems,
}) => {
  const [challenges, setChallenges] = useState<WeeklyChallenges | null>(null);
  const [daysLeft, setDaysLeft] = useState(0);
  const [showReward, setShowReward] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const streakData = getStreakData(userId);
    const updated = updateChallengesProgress(userId, mediaItems, streakData.currentStreak);
    setChallenges(updated);
    setDaysLeft(getDaysUntilWeekEnd());

    // Verifica se algum desafio foi completado recentemente
    const newlyCompleted = updated.challenges.find(
      (c) => c.completed && c.current === c.target
    );
    if (newlyCompleted) {
      setShowReward(newlyCompleted.reward);
      setTimeout(() => setShowReward(null), 3000);
    }
  }, [userId, mediaItems]);

  if (!challenges) return null;

  const allCompleted = challenges.completedCount === challenges.challenges.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Reward Notification */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Trophy size={20} />
              <span className="font-semibold">{showReward}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-500/20 hover:scale-105 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="text-purple-400" size={24} />
            <h3 className="text-lg font-semibold text-white">Desafios Semanais</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Clock size={16} />
            <span>
              {daysLeft} {daysLeft === 1 ? 'dia' : 'dias'}
            </span>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="mb-4 p-3 bg-black/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Progresso Geral</span>
            <span className="text-sm font-semibold text-white">
              {challenges.completedCount}/{challenges.challenges.length}
            </span>
          </div>
          <div className="h-2 bg-black/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(challenges.completedCount / challenges.challenges.length) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            />
          </div>
        </div>

        {/* Challenges List */}
        <div className="space-y-3">
          {challenges.challenges.map((challenge, index) => (
            <ChallengeItem key={challenge.id} challenge={challenge} index={index} />
          ))}
        </div>

        {/* All Completed Message */}
        {allCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Trophy className="text-yellow-400" size={24} />
              <div>
                <p className="text-white font-semibold">Parabéns! 🎉</p>
                <p className="text-sm text-slate-300">
                  Você completou todos os desafios desta semana!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Challenge Item Component
interface ChallengeItemProps {
  challenge: Challenge;
  index: number;
}

const ChallengeItem: React.FC<ChallengeItemProps> = ({ challenge, index }) => {
  const progress = (challenge.current / challenge.target) * 100;
  const difficultyColor = getDifficultyColor(challenge.difficulty);
  const difficultyLabel = getDifficultyLabel(challenge.difficulty);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-3 rounded-lg border ${
        challenge.completed
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-black/20 border-white/10'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="text-2xl flex-shrink-0 mt-1">{challenge.icon}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-white font-medium text-sm">{challenge.title}</h4>
            {challenge.completed && (
              <CheckCircle2 className="text-green-400 flex-shrink-0" size={18} />
            )}
          </div>

          <p className="text-xs text-slate-400 mb-2">{challenge.description}</p>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-300">
                {challenge.current}/{challenge.target}
              </span>
              <span className={`text-xs font-medium ${difficultyColor}`}>
                {difficultyLabel}
              </span>
            </div>
            <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`h-full ${
                  challenge.completed
                    ? 'bg-green-500'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}
              />
            </div>
          </div>

          {/* Reward */}
          <div className="flex items-center gap-1 text-xs text-yellow-400">
            <Trophy size={12} />
            <span>{challenge.reward}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
