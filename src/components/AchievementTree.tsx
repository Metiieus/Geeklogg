import React, { useState, useEffect } from "react";
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
  Filter,
  Grid,
  List,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

const categoryNames = {
  gamer: "Gaming",
  leitor: "Leitura",
  narrador: "Críticas",
  cinefilo: "Cinema",
  geral: "Geral",
};

const rarityColors = {
  common: {
    border: "border-slate-400",
    bg: "from-slate-400 to-slate-500",
    glow: "shadow-slate-400/40",
    particles: "bg-slate-400",
  },
  rare: {
    border: "border-blue-400",
    bg: "from-blue-400 to-blue-500",
    glow: "shadow-blue-400/50",
    particles: "bg-blue-400",
  },
  epic: {
    border: "border-purple-400",
    bg: "from-purple-400 to-purple-500",
    glow: "shadow-purple-400/60",
    particles: "bg-purple-400",
  },
  legendary: {
    border: "border-yellow-400",
    bg: "from-yellow-400 to-yellow-500",
    glow: "shadow-yellow-400/70",
    particles: "bg-yellow-400",
  },
};

const rarityNames = {
  common: "Comum",
  rare: "Raro",
  epic: "Épico",
  legendary: "Lendário",
};

type ViewMode = "grid" | "list";
type FilterMode = "all" | "unlocked" | "locked";

export const AchievementTree: React.FC<AchievementTreeProps> = ({
  onAchievementClick,
}) => {
  const [achievements, setAchievements] = useState<AchievementNode[]>([]);
  const [progress, setProgress] = useState<AchievementProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredAchievements = achievements.filter((achievement) => {
    // Category filter
    if (selectedCategory && achievement.category !== selectedCategory)
      return false;

    // Rarity filter
    if (selectedRarity && achievement.rarity !== selectedRarity) return false;

    // Status filter
    if (filterMode === "unlocked" && !achievement.unlocked) return false;
    if (filterMode === "locked" && achievement.unlocked) return false;

    // Search filter
    if (
      searchTerm &&
      !achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !achievement.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;

    return true;
  });

  // Group achievements by category for better organization
  const groupedAchievements = filteredAchievements.reduce(
    (acc, achievement) => {
      if (!acc[achievement.category]) {
        acc[achievement.category] = [];
      }
      acc[achievement.category].push(achievement);
      return acc;
    },
    {} as Record<string, AchievementNode[]>,
  );

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
    <div className="space-y-4 sm:space-y-8 overflow-x-hidden">
      {/* Progress Overview */}
      {progress && (
        <motion.div
          className="bg-gradient-to-br from-slate-800/60 via-indigo-900/30 to-slate-900/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-cyan-500/20 shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Floating particles background */}
          <div className="absolute inset-0">
            {Array.from({ length: 8 }).map((_, i) => (
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
                  left: `${10 + i * 10}%`,
                  top: `${20 + i * 8}%`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Trophy className="text-white" size={16} />
                </div>
                Central de Conquistas
              </h3>
              <motion.div className="text-right" whileHover={{ scale: 1.05 }}>
                <p className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                  {progress.totalUnlocked}/{progress.totalAvailable}
                </p>
                <p className="text-sm text-slate-400">Conquistas</p>
              </motion.div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="mb-8 relative">
              <div className="w-full bg-slate-800/50 rounded-full h-6 border border-slate-600/30 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 h-6 rounded-full relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(progress.totalUnlocked / progress.totalAvailable) * 100}%`,
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </motion.div>
              </div>
              <p className="text-lg text-slate-200 mt-3 text-center font-semibold">
                {Math.round(
                  (progress.totalUnlocked / progress.totalAvailable) * 100,
                )}
                % Completo
              </p>
            </div>

            {/* Category Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
              {Object.entries(progress.byCategory).map(
                ([category, stats], index) => {
                  const IconComponent =
                    categoryIcons[category as keyof typeof categoryIcons];
                  const isSelected = selectedCategory === category;
                  return (
                    <motion.div
                      key={category}
                      className={`text-center p-3 sm:p-5 rounded-xl sm:rounded-2xl border backdrop-blur-sm relative overflow-hidden group cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? `bg-gradient-to-br ${categoryColors[category as keyof typeof categoryColors]}/20 border-cyan-400/50 shadow-lg`
                          : "bg-gradient-to-br from-slate-800/40 to-slate-900/60 border-slate-600/30 hover:border-cyan-400/30"
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      onClick={() =>
                        setSelectedCategory(isSelected ? null : category)
                      }
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div
                        className={`relative w-10 h-10 sm:w-14 sm:h-14 mx-auto mb-2 sm:mb-3 rounded-full bg-gradient-to-br ${categoryColors[category as keyof typeof categoryColors]} flex items-center justify-center shadow-lg`}
                      >
                        <IconComponent
                          className="text-white drop-shadow"
                          size={16}
                        />
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 capitalize font-semibold mb-1 sm:mb-2">
                        {categoryNames[category as keyof typeof categoryNames]}
                      </p>
                      <p className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
                        {stats.unlocked}
                      </p>
                      <p className="text-xs text-slate-400 mb-2 sm:mb-3">
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

      {/* Filters and Controls */}
      <motion.div
        className="bg-gradient-to-br from-slate-800/60 via-indigo-950/40 to-slate-900/60 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar conquistas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Rarity Filter */}
            <select
              value={selectedRarity || ""}
              onChange={(e) => setSelectedRarity(e.target.value || null)}
              className="bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-2 text-white focus:border-cyan-400/50 focus:outline-none"
            >
              <option value="">Todas Raridades</option>
              {Object.entries(rarityNames).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <div className="flex bg-slate-800/50 rounded-xl border border-slate-600/50 overflow-hidden">
              {(["all", "unlocked", "locked"] as FilterMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    filterMode === mode
                      ? "bg-gradient-to-r from-cyan-500 to-pink-500 text-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  {mode === "all"
                    ? "Todas"
                    : mode === "unlocked"
                      ? "Desbloqueadas"
                      : "Bloqueadas"}
                </button>
              ))}
            </div>

            {/* View Mode */}
            <div className="flex bg-slate-800/50 rounded-xl border border-slate-600/50 overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-cyan-500 to-pink-500 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-cyan-500 to-pink-500 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Achievements Display */}
      <div className="space-y-8">
        {selectedCategory ? (
          // Single category view
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <AchievementCategory
              category={selectedCategory}
              achievements={groupedAchievements[selectedCategory] || []}
              viewMode={viewMode}
              onAchievementClick={onAchievementClick}
            />
          </motion.div>
        ) : (
          // All categories view
          Object.entries(groupedAchievements).map(
            ([category, categoryAchievements]) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <AchievementCategory
                  category={category}
                  achievements={categoryAchievements}
                  viewMode={viewMode}
                  onAchievementClick={onAchievementClick}
                />
              </motion.div>
            ),
          )
        )}
      </div>

      {filteredAchievements.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center">
            <Filter className="text-slate-400" size={32} />
          </div>
          <p className="text-xl text-slate-400 mb-2">
            Nenhuma conquista encontrada
          </p>
          <p className="text-slate-500">Tente ajustar os filtros de busca</p>
        </motion.div>
      )}
    </div>
  );
};

// Category Component
interface AchievementCategoryProps {
  category: string;
  achievements: AchievementNode[];
  viewMode: ViewMode;
  onAchievementClick: (achievement: AchievementNode) => void;
}

const AchievementCategory: React.FC<AchievementCategoryProps> = ({
  category,
  achievements,
  viewMode,
  onAchievementClick,
}) => {
  const IconComponent = categoryIcons[category as keyof typeof categoryIcons];

  if (achievements.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-slate-800/60 via-indigo-950/40 to-slate-900/60 backdrop-blur-lg rounded-2xl border border-purple-500/20 overflow-hidden">
      {/* Category Header */}
      <div
        className={`bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors]} p-6`}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <IconComponent className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">
              {categoryNames[category as keyof typeof categoryNames]}
            </h3>
            <p className="text-white/80">
              {achievements.filter((a) => a.unlocked).length} de{" "}
              {achievements.length} desbloqueadas
            </p>
          </div>
        </div>
      </div>

      {/* Achievements Grid/List */}
      <div className="p-6">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                index={index}
                onClick={() => onAchievementClick(achievement)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <AchievementListItem
                key={achievement.id}
                achievement={achievement}
                index={index}
                onClick={() => onAchievementClick(achievement)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Achievement Card Component
interface AchievementCardProps {
  achievement: AchievementNode;
  index: number;
  onClick: () => void;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  index,
  onClick,
}) => {
  const rarity = rarityColors[achievement.rarity];
  const categoryColor =
    categoryColors[achievement.category as keyof typeof categoryColors];

  return (
    <motion.div
      className={`relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border-2 overflow-hidden cursor-pointer group transition-all duration-300 ${
        achievement.unlocked
          ? `${rarity.border} shadow-lg ${rarity.glow}`
          : "border-slate-600/50 hover:border-slate-500/70"
      }`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Floating particles for unlocked achievements */}
      {achievement.unlocked && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 ${rarity.particles} rounded-full opacity-60`}
              animate={{
                x: [0, Math.random() * 30 - 15],
                y: [0, Math.random() * 30 - 15],
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.4,
              }}
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
            />
          ))}
        </div>
      )}

      <div className="p-6">
        {/* Achievement Image */}
        <div
          className={`relative w-20 h-20 mx-auto mb-4 rounded-full border-2 overflow-hidden ${rarity.border}`}
        >
          <img
            src={achievement.image}
            alt={achievement.title}
            className={`w-full h-full object-cover transition-all duration-300 ${
              achievement.unlocked
                ? "brightness-110"
                : "filter blur-sm grayscale"
            }`}
          />

          {!achievement.unlocked && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
              <Lock className="text-white" size={24} />
            </div>
          )}

          {/* Category indicator */}
          <div
            className={`absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br ${categoryColor} border-2 border-white flex items-center justify-center`}
          >
            {React.createElement(categoryIcons[achievement.category], {
              size: 12,
              className: "text-white",
            })}
          </div>
        </div>

        {/* Achievement Info */}
        <div className="text-center">
          <h4
            className={`font-bold mb-2 ${achievement.unlocked ? "text-white" : "text-slate-400"}`}
          >
            {achievement.title}
          </h4>
          <p
            className={`text-sm leading-relaxed ${achievement.unlocked ? "text-slate-300" : "text-slate-500"}`}
          >
            {achievement.description}
          </p>
        </div>

        {/* Rarity Badge */}
        <div className="mt-4 flex justify-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${rarity.bg} text-white`}
          >
            {rarityNames[achievement.rarity]}
          </span>
        </div>
      </div>

      {/* Hover glow effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${categoryColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}
      />
    </motion.div>
  );
};

// Achievement List Item Component
interface AchievementListItemProps {
  achievement: AchievementNode;
  index: number;
  onClick: () => void;
}

const AchievementListItem: React.FC<AchievementListItemProps> = ({
  achievement,
  index,
  onClick,
}) => {
  const rarity = rarityColors[achievement.rarity];
  const categoryColor =
    categoryColors[achievement.category as keyof typeof categoryColors];

  return (
    <motion.div
      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer group transition-all duration-300 ${
        achievement.unlocked
          ? `bg-gradient-to-r from-slate-800/50 to-slate-900/50 ${rarity.border} shadow-lg`
          : "bg-slate-800/30 border-slate-600/50 hover:border-slate-500/70"
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
    >
      {/* Achievement Image */}
      <div
        className={`relative w-16 h-16 rounded-full border-2 overflow-hidden flex-shrink-0 ${rarity.border}`}
      >
        <img
          src={achievement.image}
          alt={achievement.title}
          className={`w-full h-full object-cover ${
            achievement.unlocked ? "brightness-110" : "filter blur-sm grayscale"
          }`}
        />

        {!achievement.unlocked && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Lock className="text-white" size={16} />
          </div>
        )}
      </div>

      {/* Achievement Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4
            className={`font-semibold ${achievement.unlocked ? "text-white" : "text-slate-400"}`}
          >
            {achievement.title}
          </h4>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${rarity.bg} text-white`}
          >
            {rarityNames[achievement.rarity]}
          </span>
        </div>
        <p
          className={`text-sm ${achievement.unlocked ? "text-slate-300" : "text-slate-500"}`}
        >
          {achievement.description}
        </p>
      </div>

      {/* Category Icon */}
      <div
        className={`w-10 h-10 rounded-full bg-gradient-to-br ${categoryColor} flex items-center justify-center flex-shrink-0`}
      >
        {React.createElement(categoryIcons[achievement.category], {
          size: 20,
          className: "text-white",
        })}
      </div>
    </motion.div>
  );
};
