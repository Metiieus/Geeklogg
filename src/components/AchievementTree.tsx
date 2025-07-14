import React, { useState, useEffect, useRef } from "react";
import {
  Trophy,
  Star,
  Lock,
  Sparkles,
  Crown,
  Zap,
  Target,
  Award,
  Flame,
} from "lucide-react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import {
  AchievementNode,
  UserAchievement,
  AchievementProgress,
} from "../types/achievements";
import {
  getUserAchievements,
  getAchievementsWithProgress,
  getAchievementProgress,
} from "../services/achievementService";

interface AchievementTreeProps {
  onAchievementClick: (achievement: AchievementNode) => void;
}

const categoryColors = {
  gamer: "from-cyan-500 via-blue-500 to-indigo-500",
  leitor: "from-emerald-500 via-green-500 to-teal-500",
  narrador: "from-purple-500 via-violet-500 to-fuchsia-500",
  cinefilo: "from-pink-500 via-red-500 to-rose-500",
  geral: "from-yellow-500 via-orange-500 to-amber-500",
};

const categoryIcons = {
  gamer: Target,
  leitor: Sparkles,
  narrador: Award,
  cinefilo: Flame,
  geral: Trophy,
};

const rarityColors = {
  common: {
    border: "border-slate-400",
    bg: "from-slate-400 to-slate-500",
    glow: "shadow-slate-400/30",
  },
  rare: {
    border: "border-blue-400",
    bg: "from-blue-400 to-blue-500",
    glow: "shadow-blue-400/40",
  },
  epic: {
    border: "border-purple-400",
    bg: "from-purple-400 to-purple-500",
    glow: "shadow-purple-400/50",
  },
  legendary: {
    border: "border-yellow-400",
    bg: "from-yellow-400 to-yellow-500",
    glow: "shadow-yellow-400/60",
  },
};

const rarityParticles = {
  common: 3,
  rare: 5,
  epic: 8,
  legendary: 12,
};

export const AchievementTree: React.FC<AchievementTreeProps> = ({
  onAchievementClick,
}) => {
  const [achievements, setAchievements] = useState<AchievementNode[]>([]);
  const [progress, setProgress] = useState<AchievementProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredAchievement, setHoveredAchievement] = useState<string | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const userAchievements = await getUserAchievements();
      const achievementsWithProgress =
        getAchievementsWithProgress(userAchievements);
      const achievementProgress = getAchievementProgress(userAchievements);

      setAchievements(achievementsWithProgress);
      setProgress(achievementProgress);
    } catch (error) {
      console.error("Erro ao carregar conquistas:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAchievements = selectedCategory
    ? achievements.filter((a) => a.category === selectedCategory)
    : achievements;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 border-4 border-transparent border-t-cyan-500 border-r-pink-500 rounded-full"></div>
          <div className="absolute inset-2 w-12 h-12 border-4 border-transparent border-b-purple-500 border-l-indigo-500 rounded-full animate-spin"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress Overview */}
      {progress && (
        <motion.div
          className="bg-gradient-to-br from-slate-800/60 via-indigo-900/30 to-slate-900/60 backdrop-blur-lg rounded-3xl p-8 border border-cyan-500/20 shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated background particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-2 h-2 bg-gradient-to-r ${categoryColors.geral} rounded-full opacity-20`}
                animate={{
                  x: [0, 100, 0],
                  y: [0, -50, 0],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
                style={{
                  left: `${10 + i * 15}%`,
                  top: `${20 + i * 10}%`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Trophy className="text-white" size={20} />
                </div>
                Progresso das Conquistas
              </h3>
              <motion.div className="text-right" whileHover={{ scale: 1.05 }}>
                <p className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                  {progress.totalUnlocked}/{progress.totalAvailable}
                </p>
                <p className="text-sm text-slate-400">Desbloqueadas</p>
              </motion.div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="mb-6 relative">
              <div className="w-full bg-slate-800/50 rounded-full h-4 border border-slate-600/30 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 h-4 rounded-full relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(progress.totalUnlocked / progress.totalAvailable) * 100}%`,
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </motion.div>
              </div>
              <p className="text-sm text-slate-300 mt-2 text-center font-medium">
                {Math.round(
                  (progress.totalUnlocked / progress.totalAvailable) * 100,
                )}
                % completo
              </p>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-3 mb-6 justify-center">
              <motion.button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  !selectedCategory
                    ? "bg-gradient-to-r from-cyan-500 to-pink-500 text-white shadow-lg"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Todas
              </motion.button>
              {Object.entries(progress.byCategory).map(([category, stats]) => {
                const IconComponent =
                  categoryIcons[category as keyof typeof categoryIcons];
                return (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                      selectedCategory === category
                        ? `bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors]} text-white shadow-lg`
                        : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent size={16} />
                    <span className="capitalize">{category}</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      {stats.unlocked}/{stats.total}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Category Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(progress.byCategory).map(
                ([category, stats], index) => {
                  const IconComponent =
                    categoryIcons[category as keyof typeof categoryIcons];
                  return (
                    <motion.div
                      key={category}
                      className="text-center p-4 bg-gradient-to-br from-slate-800/40 to-slate-900/60 rounded-2xl border border-slate-600/30 backdrop-blur-sm relative overflow-hidden group cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      onClick={() => setSelectedCategory(category)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div
                        className={`relative w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br ${categoryColors[category as keyof typeof categoryColors]} flex items-center justify-center shadow-lg`}
                      >
                        <IconComponent className="text-white" size={20} />
                      </div>
                      <p className="text-sm text-slate-200 capitalize font-semibold mb-1">
                        {category}
                      </p>
                      <p className="text-2xl font-bold text-white mb-2">
                        {stats.unlocked}
                      </p>
                      <p className="text-xs text-slate-400 mb-3">
                        de {stats.total}
                      </p>
                      <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className={`bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors]} h-2 rounded-full`}
                          initial={{ width: 0 }}
                          animate={{
                            width: `${stats.total > 0 ? (stats.unlocked / stats.total) * 100 : 0}%`,
                          }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                    </motion.div>
                  );
                },
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Achievement Tree */}
      <motion.div
        className="bg-gradient-to-br from-slate-800/60 via-indigo-950/40 to-slate-900/60 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/20 shadow-2xl relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        ref={containerRef}
      >
        {/* Background constellation effect */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="text-white" size={20} />
            </div>
            Árvore de Conquistas
            {selectedCategory && (
              <span className="text-lg text-slate-400 capitalize">
                - {selectedCategory}
              </span>
            )}
          </h3>

          <div className="relative min-h-[600px] overflow-hidden">
            {/* Enhanced Connection Lines with Animation */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 1 }}
            >
              <defs>
                <linearGradient
                  id="connectionGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#ec4899" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {filteredAchievements.map((achievement) =>
                achievement.dependsOn?.map((depId) => {
                  const dependency = filteredAchievements.find(
                    (a) => a.id === depId,
                  );
                  if (!dependency) return null;

                  const isConnected =
                    achievement.unlocked && dependency.unlocked;

                  return (
                    <motion.line
                      key={`${depId}-${achievement.id}`}
                      x1={`${dependency.position.x}%`}
                      y1={`${dependency.position.y}%`}
                      x2={`${achievement.position.x}%`}
                      y2={`${achievement.position.y}%`}
                      stroke={
                        isConnected ? "url(#connectionGradient)" : "#475569"
                      }
                      strokeWidth={isConnected ? "3" : "2"}
                      strokeDasharray={isConnected ? "0" : "8,4"}
                      filter={isConnected ? "url(#glow)" : undefined}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                  );
                }),
              )}
            </svg>

            {/* Achievement Nodes with Enhanced Design */}
            <AnimatePresence>
              {filteredAchievements.map((achievement, index) => {
                const canUnlock =
                  !achievement.dependsOn ||
                  achievement.dependsOn.every(
                    (depId) =>
                      achievements.find((a) => a.id === depId)?.unlocked,
                  );

                const rarity = rarityColors[achievement.rarity];
                const isHovered = hoveredAchievement === achievement.id;

                return (
                  <motion.div
                    key={achievement.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    style={{
                      left: `${achievement.position.x}%`,
                      top: `${achievement.position.y}%`,
                      zIndex: isHovered ? 10 : 2,
                    }}
                    initial={{ scale: 0, opacity: 0, rotateY: 180 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    exit={{ scale: 0, opacity: 0, rotateY: 180 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.08,
                      type: "spring",
                      stiffness: 120,
                    }}
                    whileHover={{ scale: 1.15, zIndex: 10 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onAchievementClick(achievement)}
                    onHoverStart={() => setHoveredAchievement(achievement.id)}
                    onHoverEnd={() => setHoveredAchievement(null)}
                  >
                    <div className="relative group">
                      {/* Floating particles for rare achievements */}
                      {achievement.unlocked &&
                        achievement.rarity !== "common" && (
                          <div className="absolute inset-0 pointer-events-none">
                            {Array.from({
                              length: rarityParticles[achievement.rarity],
                            }).map((_, i) => (
                              <motion.div
                                key={i}
                                className={`absolute w-1 h-1 bg-gradient-to-r ${rarity.bg} rounded-full`}
                                animate={{
                                  x: [0, Math.random() * 40 - 20],
                                  y: [0, Math.random() * 40 - 20],
                                  scale: [0, 1, 0],
                                  opacity: [0, 1, 0],
                                }}
                                transition={{
                                  duration: 2 + Math.random() * 2,
                                  repeat: Infinity,
                                  delay: i * 0.3,
                                }}
                                style={{
                                  left: "50%",
                                  top: "50%",
                                }}
                              />
                            ))}
                          </div>
                        )}

                      {/* Main achievement circle */}
                      <motion.div
                        className={`
                          relative w-24 h-24 rounded-full border-4 overflow-hidden transition-all duration-500
                          ${rarity.border}
                          ${achievement.unlocked ? `shadow-2xl ${rarity.glow}` : "opacity-70"}
                          ${canUnlock && !achievement.unlocked ? "animate-pulse" : ""}
                        `}
                        whileHover={{
                          boxShadow: achievement.unlocked
                            ? "0 0 30px rgba(168, 85, 247, 0.6)"
                            : undefined,
                          borderWidth: "6px",
                        }}
                      >
                        {/* Background glow effect */}
                        {achievement.unlocked && (
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${rarity.bg} opacity-20 animate-pulse`}
                          />
                        )}

                        <img
                          src={achievement.image}
                          alt={achievement.title}
                          className={`w-full h-full object-cover transition-all duration-300 ${
                            achievement.unlocked
                              ? "brightness-110"
                              : "filter blur-sm grayscale"
                          }`}
                        />

                        {/* Lock overlay */}
                        {!achievement.unlocked && (
                          <motion.div
                            className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm"
                            whileHover={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                          >
                            <Lock
                              className="text-white drop-shadow-lg"
                              size={28}
                            />
                          </motion.div>
                        )}

                        {/* Unlock celebration effect */}
                        <AnimatePresence>
                          {achievement.unlocked && isHovered && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 via-orange-500/20 to-red-500/30"
                              initial={{ scale: 0, opacity: 0, rotate: 0 }}
                              animate={{ scale: 1, opacity: 1, rotate: 360 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ duration: 0.5 }}
                            />
                          )}
                        </AnimatePresence>

                        {/* Rarity indicator with category icon */}
                        <motion.div
                          className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br ${categoryColors[achievement.category]} flex items-center justify-center border-2 border-white shadow-lg`}
                          whileHover={{ scale: 1.2, rotate: 15 }}
                        >
                          {React.createElement(
                            categoryIcons[achievement.category],
                            {
                              size: 14,
                              className: "text-white drop-shadow",
                            },
                          )}
                        </motion.div>

                        {/* Achievement level indicator */}
                        {achievement.unlocked && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                            <div
                              className={`px-2 py-1 rounded-full bg-gradient-to-r ${rarity.bg} text-white text-xs font-bold shadow-lg border border-white/20`}
                            >
                              {achievement.rarity.toUpperCase()}
                            </div>
                          </div>
                        )}
                      </motion.div>

                      {/* Achievement title */}
                      <motion.div
                        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 text-center max-w-32"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 + 0.3 }}
                      >
                        <p
                          className={`text-sm font-semibold ${achievement.unlocked ? "text-white" : "text-slate-500"} break-words leading-tight drop-shadow`}
                        >
                          {achievement.title}
                        </p>
                      </motion.div>

                      {/* Enhanced tooltip */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 z-20"
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white text-sm rounded-2xl p-4 whitespace-nowrap border border-purple-500/30 shadow-2xl backdrop-blur-sm max-w-xs">
                              <div className="flex items-center gap-2 mb-2">
                                <div
                                  className={`w-4 h-4 rounded-full bg-gradient-to-r ${rarity.bg}`}
                                ></div>
                                <p className="font-bold text-white">
                                  {achievement.title}
                                </p>
                              </div>
                              <p className="text-slate-300 text-xs mb-2 whitespace-normal">
                                {achievement.description}
                              </p>
                              <div className="flex justify-between items-center text-xs">
                                <span
                                  className={`px-2 py-1 rounded-full bg-gradient-to-r ${categoryColors[achievement.category]} text-white font-medium`}
                                >
                                  {achievement.category}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-full bg-gradient-to-r ${rarity.bg} text-white font-medium`}
                                >
                                  {achievement.rarity}
                                </span>
                              </div>
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45 border-r border-b border-purple-500/30" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
