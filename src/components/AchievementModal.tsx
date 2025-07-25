import React from "react";
import { X, Calendar, Trophy, Star } from "lucide-react";
import { motion } from "framer-motion";
import { AchievementNode } from "../types/achievements";

interface AchievementModalProps {
  achievement: AchievementNode;
  onClose: () => void;
}

const categoryLabels = {
  gamer: "🎮 Gamer",
  leitor: "📚 Leitor",
  narrador: "🧠 Narrador",
  cinefilo: "🎬 Cinéfilo",
  geral: "🌀 Geral",
};

const rarityLabels = {
  common: "Comum",
  rare: "Raro",
  epic: "Épico",
  legendary: "Lendário",
};

const rarityColors = {
  common: "from-gray-500 to-gray-600",
  rare: "from-blue-500 to-blue-600",
  epic: "from-purple-500 to-purple-600",
  legendary: "from-yellow-500 to-orange-500",
};

export const AchievementModal: React.FC<AchievementModalProps> = ({
  achievement,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
      <motion.div
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl sm:rounded-2xl border border-white/20 max-w-md w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="relative p-4 sm:p-6 pb-0">
          <button
            onClick={onClose}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 sm:p-3 hover:bg-slate-700 rounded-lg transition-colors touch-target"
          >
            <X className="text-slate-400" size={18} />
          </button>

          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 overflow-hidden ${
                achievement.unlocked
                  ? "border-yellow-400 shadow-lg shadow-yellow-400/30"
                  : "border-slate-600"
              }`}
            >
              <img
                src={achievement.image}
                alt={achievement.title}
                className={`w-full h-full object-cover ${
                  achievement.unlocked ? "" : "filter blur-sm grayscale"
                }`}
              />
            </div>

            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-1 line-clamp-2">
                {achievement.title}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                {categoryLabels[achievement.category]}
              </p>

              {/* Rarity Badge */}
              <div
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${rarityColors[achievement.rarity]} mt-2`}
              >
                <Star size={12} fill="currentColor" />
                {rarityLabels[achievement.rarity]}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-300 mb-2">
              Descrição
            </h3>
            <p className="text-white leading-relaxed">
              {achievement.description}
            </p>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <Trophy
                className={
                  achievement.unlocked ? "text-yellow-400" : "text-slate-500"
                }
                size={20}
              />
              <span
                className={`font-medium ${achievement.unlocked ? "text-yellow-400" : "text-slate-500"}`}
              >
                {achievement.unlocked ? "Desbloqueada" : "Bloqueada"}
              </span>
            </div>

            {achievement.unlocked && achievement.unlockedAt && (
              <div className="flex items-center gap-1 text-slate-400 text-sm">
                <Calendar size={14} />
                <span>
                  {new Date(achievement.unlockedAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
            )}
          </div>

          {/* Dependencies */}
          {achievement.dependsOn && achievement.dependsOn.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-2">
                Requer
              </h3>
              <div className="space-y-1">
                {achievement.dependsOn.map((depId) => (
                  <div key={depId} className="text-sm text-slate-400">
                    • Conquista: {depId.replace(/_/g, " ")}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
