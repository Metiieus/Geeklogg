import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Clock,
  Edit,
  Trash2,
  ExternalLink,
  Play,
  Book,
  Film,
  Gamepad2,
  MoreHorizontal,
  Calendar,
  Award,
} from "lucide-react";
import {
  colors,
  gradients,
  shadows,
  animations,
  getCategoryColors,
  getCategoryGradient,
} from "../tokens";

export interface MediaItemDS {
  id: string;
  title: string;
  cover?: string;
  type: "games" | "anime" | "series" | "books" | "movies";
  status: "completed" | "in-progress" | "dropped" | "planned";
  rating?: number;
  hoursSpent?: number;
  currentPage?: number;
  totalPages?: number;
  tags: string[];
  externalLink?: string;
  releaseDate?: string;
  synopsis?: string;
}

interface MediaCardProps {
  item: MediaItemDS;
  onEdit?: (item: MediaItemDS) => void;
  onDelete?: (item: MediaItemDS) => void;
  onQuickAction?: (item: MediaItemDS) => void;
  className?: string;
  variant?: "default" | "compact" | "featured";
}

const statusConfig = {
  completed: {
    label: "CONCLUÍDO",
    color: "text-emerald-400",
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/30",
    icon: "✅",
  },
  "in-progress": {
    label: "EM PROGRESSO",
    color: "text-blue-400",
    bg: "bg-blue-500/20",
    border: "border-blue-500/30",
    icon: "⏳",
  },
  dropped: {
    label: "ABANDONADO",
    color: "text-red-400",
    bg: "bg-red-500/20",
    border: "border-red-500/30",
    icon: "❌",
  },
  planned: {
    label: "PLANEJADO",
    color: "text-purple-400",
    bg: "bg-purple-500/20",
    border: "border-purple-500/30",
    icon: "📅",
  },
};

const typeIcons = {
  games: Gamepad2,
  anime: Play,
  series: Film,
  books: Book,
  movies: Film,
};

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  onEdit,
  onDelete,
  onQuickAction,
  className = "",
  variant = "default",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [imageError, setImageError] = useState(false);

  const categoryColors = getCategoryColors(item.type);
  const categoryGradient = getCategoryGradient(item.type);
  const statusInfo = statusConfig[item.status];
  const TypeIcon = typeIcons[item.type];

  const cardHeight =
    variant === "compact"
      ? "h-80"
      : variant === "featured"
        ? "h-96"
        : "h-[420px]";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        group relative ${cardHeight} rounded-2xl overflow-hidden cursor-pointer
        border border-white/10 backdrop-blur-sm
        transition-all duration-300 ease-out
        ${className}
      `}
      style={{
        background: `linear-gradient(135deg, ${categoryColors.background}, rgba(17, 24, 39, 0.8))`,
        boxShadow: isHovered
          ? shadows.glow[item.type as keyof typeof shadows.glow] || shadows.xl
          : shadows.lg,
      }}
    >
      {/* Background Gradient */}
      <div
        className="absolute inset-0 opacity-20"
        style={{ background: categoryGradient }}
      />

      {/* Cover Image Section */}
      <div className="relative h-2/3 overflow-hidden">
        {!imageError && item.cover ? (
          <motion.img
            src={item.cover}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700/50 to-slate-800/80">
            <motion.div
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: categoryGradient }}
              >
                <TypeIcon size={24} className="text-white" />
              </div>
              <span className="text-white/80 font-bold text-xl">
                {item.title.charAt(0)}
              </span>
            </motion.div>
          </div>
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Type Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full border border-white/20"
        >
          <TypeIcon size={14} className="text-white" />
          <span className="text-white text-xs font-medium uppercase tracking-wide">
            {item.type}
          </span>
        </motion.div>

        {/* Rating Badge */}
        {item.rating && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-yellow-500/20 backdrop-blur-sm rounded-full border border-yellow-500/30"
          >
            <Star size={12} className="text-yellow-400 fill-current" />
            <span className="text-white text-sm font-bold">{item.rating}</span>
          </motion.div>
        )}

        {/* Desktop Action Menu (hover) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3 hidden md:flex"
            >
              {onEdit && (
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item);
                  }}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-white hover:bg-white/30 transition-all duration-200"
                >
                  <Edit size={18} />
                </motion.button>
              )}

              {item.externalLink && (
                <motion.a
                  href={item.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-white hover:bg-white/30 transition-all duration-200"
                >
                  <ExternalLink size={18} />
                </motion.a>
              )}

              {onQuickAction && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickAction(item);
                  }}
                  className="p-3 bg-gradient-to-r from-violet-500/30 to-cyan-500/30 backdrop-blur-sm rounded-full border border-violet-400/50 text-white hover:from-violet-500/40 hover:to-cyan-500/40 transition-all duration-200"
                >
                  <Play size={18} />
                </motion.button>
              )}

              {onDelete && (
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item);
                  }}
                  className="p-3 bg-red-500/30 backdrop-blur-sm rounded-full border border-red-500/50 text-white hover:bg-red-500/40 transition-all duration-200"
                >
                  <Trash2 size={18} />
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Action Buttons (always visible) */}
        <div className="absolute top-3 right-3 flex gap-1.5 md:hidden">
          {onEdit && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="p-2.5 bg-slate-900/85 backdrop-blur-sm rounded-xl border border-slate-600/50 text-slate-200 hover:text-white hover:bg-slate-800/95 transition-all duration-200 shadow-xl"
            >
              <Edit size={16} />
            </motion.button>
          )}
          {onDelete && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item);
              }}
              className="p-2.5 bg-red-900/85 backdrop-blur-sm rounded-xl border border-red-600/50 text-red-200 hover:text-white hover:bg-red-800/95 transition-all duration-200 shadow-xl"
            >
              <Trash2 size={16} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="relative h-1/3 p-4 bg-gradient-to-t from-black/90 to-black/60 backdrop-blur-sm">
        <div className="flex flex-col h-full justify-between">
          {/* Title */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white font-bold text-lg leading-tight mb-2 line-clamp-2"
            >
              {item.title}
            </motion.h3>

            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`
                inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium
                ${statusInfo.bg} ${statusInfo.border} ${statusInfo.color} border
              `}
            >
              <span>{statusInfo.icon}</span>
              <span>{statusInfo.label}</span>
            </motion.div>
          </div>

          {/* Bottom Info */}
          <div className="flex items-center justify-between">
            {/* Progress/Stats */}
            <div className="flex items-center gap-3 text-white/60">
              {item.hoursSpent && (
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span className="text-xs">{item.hoursSpent}h</span>
                </div>
              )}

              {item.type === "books" && item.totalPages && (
                <div className="flex items-center gap-1">
                  <Book size={12} />
                  <span className="text-xs">
                    {Math.round(
                      ((item.currentPage || 0) / item.totalPages) * 100,
                    )}
                    %
                  </span>
                </div>
              )}
            </div>

            {/* Main Tag */}
            {item.tags.length > 0 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="px-2 py-1 text-xs bg-white/10 backdrop-blur-sm rounded-full text-white/80 border border-white/20"
              >
                {item.tags[0]}
                {item.tags.length > 1 && (
                  <span className="ml-1 text-white/50">
                    +{item.tags.length - 1}
                  </span>
                )}
              </motion.span>
            )}
          </div>
        </div>

        {/* Progress Bar for Books */}
        {item.type === "books" && item.totalPages && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="absolute bottom-0 left-0 right-0 h-1 bg-black/20"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(((item.currentPage || 0) / item.totalPages) * 100, 100)}%`,
              }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
            />
          </motion.div>
        )}
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${categoryColors.primary}20, transparent)`,
          filter: "blur(20px)",
        }}
      />
    </motion.div>
  );
};

export default MediaCard;
