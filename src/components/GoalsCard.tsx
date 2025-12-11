import React, { useMemo } from 'react';
import { Target, TrendingUp, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { MediaItem } from '../types';

interface Goal {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  icon: string;
  color: string;
}

interface GoalsCardProps {
  mediaItems: MediaItem[];
}

export const GoalsCard: React.FC<GoalsCardProps> = ({ mediaItems }) => {
  const goals = useMemo(() => {
    const completed = mediaItems.filter((item) => item.status === 'completed').length;
    const totalHours = mediaItems.reduce((sum, item) => sum + (item.hoursSpent || 0), 0);
    const rated = mediaItems.filter((item) => item.rating).length;

    return [
      {
        id: 'monthly-completions',
        title: 'Meta Mensal',
        description: 'Completar 10 mídias este mês',
        current: Math.min(completed, 10),
        target: 10,
        icon: '🎯',
        color: 'from-blue-500 to-cyan-500',
      },
      {
        id: 'hours-goal',
        title: 'Horas Investidas',
        description: 'Alcançar 100 horas totais',
        current: Math.min(Math.floor(totalHours), 100),
        target: 100,
        icon: '⏰',
        color: 'from-purple-500 to-pink-500',
      },
      {
        id: 'rating-goal',
        title: 'Crítico Ativo',
        description: 'Avaliar 25 mídias',
        current: Math.min(rated, 25),
        target: 25,
        icon: '⭐',
        color: 'from-yellow-500 to-orange-500',
      },
    ];
  }, [mediaItems]);

  const completedGoals = goals.filter((g) => g.current >= g.target).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="text-green-400" size={24} />
          <h3 className="text-lg font-semibold text-white">Metas</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <CheckCircle2 size={16} className="text-green-400" />
          <span>
            {completedGoals}/{goals.length}
          </span>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal, index) => (
          <GoalItem key={goal.id} goal={goal} index={index} />
        ))}
      </div>

      {/* Motivation Message */}
      {completedGoals === goals.length ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <p className="text-white font-semibold">Todas as metas concluídas!</p>
              <p className="text-sm text-slate-300">
                Você está arrasando! Continue assim!
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="mt-4 p-3 bg-black/20 rounded-lg">
          <p className="text-sm text-slate-300 text-center">
            Continue progredindo para alcançar suas metas! 💪
          </p>
        </div>
      )}
    </motion.div>
  );
};

// Goal Item Component
interface GoalItemProps {
  goal: Goal;
  index: number;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal, index }) => {
  const progress = (goal.current / goal.target) * 100;
  const isCompleted = goal.current >= goal.target;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-4 rounded-lg border ${
        isCompleted
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-black/20 border-white/10'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="text-3xl flex-shrink-0">{goal.icon}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h4 className="text-white font-semibold text-sm">{goal.title}</h4>
              <p className="text-xs text-slate-400">{goal.description}</p>
            </div>
            {isCompleted && (
              <CheckCircle2 className="text-green-400 flex-shrink-0" size={20} />
            )}
          </div>

          {/* Progress */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">
                {goal.current}/{goal.target}
              </span>
              <span className="text-sm font-semibold text-white">
                {Math.round(progress)}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`h-full bg-gradient-to-r ${goal.color}`}
              />
            </div>

            {/* Remaining */}
            {!isCompleted && (
              <p className="text-xs text-slate-400 mt-2">
                Faltam {goal.target - goal.current} para completar
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
