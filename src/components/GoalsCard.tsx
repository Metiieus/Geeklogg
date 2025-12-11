import React, { useMemo } from 'react';
import { Target, TrendingUp, CheckCircle2, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { MediaItem } from '../types';

interface Goal {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  icon: React.ReactNode;
  iconColor: string;
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
        icon: <Target size={20} />,
        iconColor: 'text-pink-400',
      },
      {
        id: 'hours-goal',
        title: 'Horas Investidas',
        description: 'Alcançar 100 horas totais',
        current: Math.min(Math.floor(totalHours), 100),
        target: 100,
        icon: <TrendingUp size={20} />,
        iconColor: 'text-cyan-400',
      },
      {
        id: 'rating-goal',
        title: 'Crítico Ativo',
        description: 'Avaliar 25 mídias',
        current: Math.min(rated, 25),
        target: 25,
        icon: <Star size={20} />,
        iconColor: 'text-amber-400',
      },
    ];
  }, [mediaItems]);

  const completedGoals = goals.filter((g) => g.current >= g.target).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="text-emerald-400" size={24} />
          <h3 className="text-lg font-semibold text-white">Metas</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>
            {completedGoals}/{goals.length}
          </span>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        {goals.map((goal, index) => (
          <GoalItem key={goal.id} goal={goal} index={index} />
        ))}
      </div>

      {/* Motivation Message */}
      {completedGoals === goals.length ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <p className="text-white font-semibold">Todas as metas concluídas!</p>
              <p className="text-sm text-emerald-300">
                Você está arrasando! Continue assim!
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-white/5">
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
      className={`p-3 rounded-lg border ${
        isCompleted
          ? 'bg-emerald-500/10 border-emerald-500/20'
          : 'bg-slate-900/50 border-white/5'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`p-2 bg-slate-900/50 rounded-lg ${goal.iconColor}`}>
          {isCompleted ? <CheckCircle2 size={20} className="text-emerald-400" /> : goal.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h4 className="text-white font-medium text-sm">{goal.title}</h4>
              <p className="text-xs text-slate-400">{goal.description}</p>
            </div>
            {isCompleted && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex-shrink-0">
                ✓ Completo
              </span>
            )}
          </div>

          {/* Progress */}
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-300">
                {goal.current}/{goal.target}
              </span>
              <span className="text-xs text-slate-400">{Math.round(progress)}%</span>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`h-full ${
                  isCompleted
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                }`}
              />
            </div>

            {/* Remaining */}
            {!isCompleted && (
              <p className="text-xs text-slate-400 mt-1">
                Faltam {goal.target - goal.current} para completar
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
