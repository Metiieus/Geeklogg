import React, { useState, useEffect } from 'react';
import { Trophy, Target, Award, Zap, Crown, Star, Eye, EyeOff, X } from 'lucide-react';
import { AchievementNode, AchievementCategory } from '../types/achievements';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AchievementModal } from './AchievementModal';

interface AchievementTreeProps {
  onClose: () => void;
}

const categoryIcons = {
  gamer: Target,
  leitor: Star,
  narrador: Award,
  cinefilo: Zap,
  geral: Trophy,
};

const categoryColors = {
  gamer: 'from-green-400 to-emerald-400',
  leitor: 'from-blue-400 to-cyan-400',
  narrador: 'from-purple-400 to-pink-400',
  cinefilo: 'from-orange-400 to-red-400',
  geral: 'from-cyan-400 to-pink-400',
};

export const AchievementTree: React.FC<AchievementTreeProps> = ({
  onClose,
}) => {
  const [achievements, setAchievements] = useState<AchievementNode[]>([]);
  const [progress, setProgress] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementNode | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');
  const { user } = useAuth();
  const { showError } = useToast();

  useEffect(() => {
    if (user) {
      loadAchievements();
    }
  }, [user]);

  const loadAchievements = async () => {
    try {
      // Simulação de dados de conquistas
      setProgress({
        totalUnlocked: 0,
        totalAvailable: 0,
        byCategory: {},
      });
      setAchievements([]);
    } catch (error) {
      console.error("Erro ao carregar conquistas:", error);
      showError('Erro ao carregar conquistas');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'tree' ? 'list' : 'tree');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-transparent border-t-cyan-500 border-r-pink-500 rounded-full animate-spin"></div>
          <div className="absolute inset-2 w-12 h-12 border-4 border-transparent border-b-purple-500 border-l-indigo-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Árvore de Conquistas
          </h1>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Progress Overview */}
      {progress && (
        <div className="bg-gradient-to-br from-slate-800/60 via-indigo-900/30 to-slate-900/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-cyan-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 bg-gradient-to-r ${categoryColors.geral} rounded-full opacity-20`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-semibold text-white">
                  Progresso Geral
                </h2>
                <p className="text-slate-300">
                  Continue sua jornada para desbloquear mais conquistas
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-700/60 hover:bg-slate-600/60 transition-colors"
                >
                  {showUnlockedOnly ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                  <span className="text-sm">
                    {showUnlockedOnly ? 'Mostrar Todas' : 'Apenas Desbloqueadas'}
                  </span>
                </button>
                
                <div className="text-right">
                  <p className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                    {progress.totalUnlocked}/{progress.totalAvailable}
                  </p>
                  <p className="text-sm text-slate-400">Conquistas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {Object.entries(categoryIcons).map(([category, Icon]) => {
          const IconComponent = Icon;
          return (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`p-3 rounded-xl border transition-all duration-300 ${
                selectedCategory === category
                  ? `border-${categoryColors[category as AchievementCategory]} bg-${categoryColors[category as AchievementCategory]}/20`
                  : 'border-slate-700 bg-slate-800/60 hover:bg-slate-700/60'
              }`}
            >
              <IconComponent className="w-6 h-6 mx-auto mb-2" />
              <span className="text-xs capitalize">{category}</span>
            </button>
          );
        })}
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleViewMode}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'tree'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-slate-700/60 text-slate-300 hover:bg-slate-600/60'
            }`}
          >
            {viewMode === 'tree' ? 'Árvore' : 'Lista'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50">
        {achievements.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">
              Nenhuma conquista encontrada
            </h3>
            <p className="text-slate-500">
              Continue usando o aplicativo para desbloquear conquistas
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="p-4 rounded-xl bg-slate-700/40 border border-slate-600/50 hover:bg-slate-600/40 transition-colors cursor-pointer"
                onClick={() => setSelectedAchievement(achievement)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{achievement.title}</h4>
                    <p className="text-sm text-slate-300">{achievement.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        achievement.unlocked
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-slate-600/50 text-slate-400'
                      }`}>
                        {achievement.unlocked ? 'Desbloqueada' : 'Bloqueada'}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-600/50 text-slate-400">
                        {achievement.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievement Modal */}
      {selectedAchievement && (
        <AchievementModal
          achievement={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
        />
      )}
    </div>
  );
};
