import React, { useMemo } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { MediaItem } from '../types';
import {
  generateRecommendations,
  getCategoryIcon,
  getCategoryColor,
  type Recommendation,
} from '../services/recommendationsService';

interface ForYouSectionProps {
  mediaItems: MediaItem[];
  onMediaClick: (media: MediaItem) => void;
}

export const ForYouSection: React.FC<ForYouSectionProps> = ({
  mediaItems,
  onMediaClick,
}) => {
  const recommendations = useMemo(() => {
    return generateRecommendations(mediaItems);
  }, [mediaItems]);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-400" size={24} />
          <h2 className="text-xl font-bold text-white">Para Você</h2>
        </div>
        <span className="text-sm text-slate-400">
          {recommendations.length} {recommendations.length === 1 ? 'sugestão' : 'sugestões'}
        </span>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.map((recommendation, index) => (
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            index={index}
            onClick={() => onMediaClick(recommendation.media)}
          />
        ))}
      </div>
    </motion.div>
  );
};

// Recommendation Card Component
interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
  onClick: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  index,
  onClick,
}) => {
  const { media, reason, category } = recommendation;
  const icon = getCategoryIcon(category);
  const colorClass = getCategoryColor(category);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05, y: -5 }}
      onClick={onClick}
      className={`relative overflow-hidden bg-gradient-to-br ${colorClass} backdrop-blur-sm rounded-xl p-4 cursor-pointer group transition-all duration-300 hover:shadow-lg`}
    >
      {/* Category Icon Badge */}
      <div className="absolute top-2 right-2 text-2xl opacity-80 group-hover:scale-110 transition-transform">
        {icon}
      </div>

      {/* Cover Image */}
      {media.cover ? (
        <div className="w-full h-32 mb-3 rounded-lg overflow-hidden bg-slate-700">
          <img
            src={media.cover}
            alt={media.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full h-32 mb-3 rounded-lg bg-slate-700/50 flex items-center justify-center">
          <span className="text-4xl opacity-50">{icon}</span>
        </div>
      )}

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-white font-semibold text-sm line-clamp-2 min-h-[2.5rem]">
          {media.title}
        </h3>

        <p className="text-xs text-slate-300 line-clamp-2 min-h-[2rem]">
          {reason}
        </p>

        {/* Rating if available */}
        {media.rating && (
          <div className="flex items-center gap-1 text-xs text-yellow-400">
            <span>⭐</span>
            <span className="font-semibold">{media.rating}/10</span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="text-xs text-slate-400 capitalize">
            {getStatusLabel(media.status)}
          </span>
          <ChevronRight
            size={16}
            className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>
      </div>

      {/* Hover Glow */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300 pointer-events-none" />
    </motion.div>
  );
};

// Helper function
const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    completed: 'Concluído',
    'in-progress': 'Em progresso',
    dropped: 'Abandonado',
    planned: 'Planejado',
  };
  return labels[status] || status;
};
