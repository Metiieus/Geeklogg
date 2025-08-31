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
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Main Card Container */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-500 h-full relative">

        {/* Cover Image Area */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
          {imageUrl ? (
            <>
              <motion.img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  console.log('Image failed to load:', imageUrl);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <div className="text-center">
                <TypeIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {typeLabels[type]}
                </span>
              </div>
            </div>
          )}

          {/* Rating Overlay */}
          {rating && rating > 0 && (
            <motion.div
              className="absolute top-3 right-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl px-3 py-1.5 flex items-center gap-1.5 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {rating.toFixed(1)}
              </span>
            </motion.div>
          )}

          {/* Progress Bar */}
          {progress !== undefined && progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm h-2">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
          )}

          {/* Status Badge */}
          {status && (
            <div className="absolute top-3 left-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100/90 text-gray-700 dark:bg-gray-700/90 dark:text-gray-300'}`}>
                {statusLabels[status as keyof typeof statusLabels] || status}
              </span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-5 space-y-3">
          {/* Title */}
          <h3 className="font-bold text-gray-900 dark:text-gray-100 line-clamp-2 text-base leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {title}
          </h3>

          {/* Type Label */}
          <div className="flex items-center gap-2">
            <TypeIcon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {typeLabels[type]}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
