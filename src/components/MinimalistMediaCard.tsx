import React from 'react';
import { motion } from 'framer-motion';
import { Star, Play, BookOpen, Gamepad2, Film, Monitor } from 'lucide-react';
import { MediaType } from '../App';

interface MinimalistMediaCardProps {
  title: string;
  imageUrl?: string;
  type: MediaType;
  status?: string;
  rating?: number;
  progress?: number;
  onClick?: () => void;
  className?: string;
}

const typeIcons = {
  game: Gamepad2,
  movie: Film,
  tv: Monitor,
  book: BookOpen,
  anime: Play,
  manga: BookOpen,
};

const typeLabels = {
  game: 'Jogo',
  movie: 'Filme',
  tv: 'Série',
  book: 'Livro',
  anime: 'Anime',
  manga: 'Mangá',
};

const statusColors = {
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  planned: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  dropped: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const statusLabels = {
  completed: 'Concluído',
  'in-progress': 'Em progresso',
  planned: 'Planejado',
  dropped: 'Abandonado',
};

export const MinimalistMediaCard: React.FC<MinimalistMediaCardProps> = ({
  title,
  imageUrl,
  type,
  status,
  rating,
  progress,
  onClick,
  className = '',
}) => {
  const TypeIcon = typeIcons[type] || BookOpen;

  return (
    <motion.div
      className={`group cursor-pointer ${className}`}
      onClick={onClick}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {/* Main Card Container */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 h-full">
        
        {/* Cover Image Area */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
          {imageUrl ? (
            <motion.img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <TypeIcon className="w-12 h-12 text-gray-300 dark:text-gray-600" />
            </div>
          )}
          
          {/* Rating Overlay */}
          {rating && rating > 0 && (
            <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {rating.toFixed(1)}
              </span>
            </div>
          )}
          
          {/* Progress Bar */}
          {progress !== undefined && progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 bg-gray-200 dark:bg-gray-700 h-1">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 text-sm leading-snug">
            {title}
          </h3>
          
          {/* Metadata Row */}
          <div className="flex items-center justify-between">
            {/* Type */}
            <div className="flex items-center gap-1.5">
              <TypeIcon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {typeLabels[type]}
              </span>
            </div>
            
            {/* Status Badge */}
            {status && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                {statusLabels[status as keyof typeof statusLabels] || status}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
