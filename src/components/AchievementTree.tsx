import React, { useState, useEffect } from 'react';
import { Trophy, Star, Lock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AchievementNode, UserAchievement, AchievementProgress } from '../types/achievements';
import { getUserAchievements, getAchievementsWithProgress, getAchievementProgress } from '../services/achievementService';

interface AchievementTreeProps {
  onAchievementClick: (achievement: AchievementNode) => void;
}

const categoryColors = {
  gamer: 'from-blue-500 to-cyan-500',
  leitor: 'from-green-500 to-emerald-500',
  narrador: 'from-purple-500 to-violet-500',
  cinefilo: 'from-red-500 to-pink-500',
  geral: 'from-yellow-500 to-orange-500'
};

const rarityColors = {
  common: 'border-gray-400',
  rare: 'border-blue-400',
  epic: 'border-purple-400',
  legendary: 'border-yellow-400'
};

const rarityGlow = {
  common: 'shadow-gray-400/20',
  rare: 'shadow-blue-400/30',
  epic: 'shadow-purple-400/40',
  legendary: 'shadow-yellow-400/50'
};

export const AchievementTree: React.FC<AchievementTreeProps> = ({ onAchievementClick }) => {
  const [achievements, setAchievements] = useState<AchievementNode[]>([]);
  const [progress, setProgress] = useState<AchievementProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const userAchievements = await getUserAchievements();
      const achievementsWithProgress = getAchievementsWithProgress(userAchievements);
      const achievementProgress = getAchievementProgress(userAchievements);
      
      setAchievements(achievementsWithProgress);
      setProgress(achievementProgress);
    } catch (error) {
      console.error('Erro ao carregar conquistas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress Overview */}
      {progress && (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Trophy className="text-yellow-400" size={24} />
              Progresso das Conquistas
            </h3>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">
                {progress.totalUnlocked}/{progress.totalAvailable}
              </p>
              <p className="text-sm text-slate-400">Desbloqueadas</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(progress.byCategory).map(([category, stats]) => (
              <div key={category} className="text-center">
                <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br ${categoryColors[category as keyof typeof categoryColors]} flex items-center justify-center`}>
                  <span className="text-white font-bold">{stats.unlocked}</span>
                </div>
                <p className="text-xs text-slate-400 capitalize">{category}</p>
                <p className="text-xs text-slate-500">{stats.unlocked}/{stats.total}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievement Tree */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 overflow-hidden">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Sparkles className="text-purple-400" size={24} />
          Árvore de Conquistas
        </h3>
        
        <div className="relative min-h-96">
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {achievements.map(achievement => 
              achievement.dependsOn?.map(depId => {
                const dependency = achievements.find(a => a.id === depId);
                if (!dependency) return null;
                
                return (
                  <motion.line
                    key={`${depId}-${achievement.id}`}
                    x1={`${dependency.position.x}%`}
                    y1={`${dependency.position.y}%`}
                    x2={`${achievement.position.x}%`}
                    y2={`${achievement.position.y}%`}
                    stroke={achievement.unlocked ? '#8b5cf6' : '#475569'}
                    strokeWidth="2"
                    strokeDasharray={achievement.unlocked ? "0" : "5,5"}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                );
              })
            )}
          </svg>

          {/* Achievement Nodes */}
          {achievements.map((achievement, index) => {
            const canUnlock = !achievement.dependsOn || 
              achievement.dependsOn.every(depId => 
                achievements.find(a => a.id === depId)?.unlocked
              );

            return (
              <motion.div
                key={achievement.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ 
                  left: `${achievement.position.x}%`, 
                  top: `${achievement.position.y}%`,
                  zIndex: 2
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAchievementClick(achievement)}
              >
                <div className={`
                  relative w-20 h-20 rounded-full border-4 overflow-hidden
                  ${rarityColors[achievement.rarity]}
                  ${achievement.unlocked ? `shadow-lg ${rarityGlow[achievement.rarity]}` : 'opacity-60'}
                  ${canUnlock && !achievement.unlocked ? 'animate-pulse' : ''}
                `}>
                  <img
                    src={achievement.image}
                    alt={achievement.title}
                    className={`w-full h-full object-cover ${
                      achievement.unlocked ? '' : 'filter blur-sm grayscale'
                    }`}
                  />
                  
                  {/* Overlay for locked achievements */}
                  {!achievement.unlocked && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Lock className="text-white" size={24} />
                    </div>
                  )}
                  
                  {/* Unlock animation */}
                  <AnimatePresence>
                    {achievement.unlocked && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                  </AnimatePresence>
                  
                  {/* Rarity indicator */}
                  <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br ${categoryColors[achievement.category]} flex items-center justify-center`}>
                    <Star size={12} className="text-white" fill="currentColor" />
                  </div>
                </div>
                
                {/* Achievement title */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-center">
                  <p className={`text-xs font-medium ${achievement.unlocked ? 'text-white' : 'text-slate-500'} whitespace-nowrap`}>
                    {achievement.title}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};