import React from 'react';
import { motion } from 'framer-motion';
import { Star, Play, BookOpen, Gamepad2, Film, Monitor, Clock, Eye } from 'lucide-react';
import { MediaType } from '../App';

interface FuturisticMediaCardProps {
  title: string;
  imageUrl?: string;
  type: MediaType;
  status?: string;
  rating?: number;
  progress?: number;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'compact' | 'featured';
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
  game: 'Game',
  movie: 'Movie',
  tv: 'Series',
  book: 'Book',
  anime: 'Anime',
  manga: 'Manga',
};

const statusColors = {
  completed: 'bg-slate-100/50 text-slate-600 border border-slate-200/50',
  'in-progress': 'bg-blue-50/50 text-blue-600 border border-blue-200/50',
  planned: 'bg-amber-50/50 text-amber-600 border border-amber-200/50',
  dropped: 'bg-red-50/50 text-red-600 border border-red-200/50',
};

const statusColorsDark = {
  completed: 'bg-slate-800/50 text-slate-300 border border-slate-700/50',
  'in-progress': 'bg-blue-900/30 text-blue-300 border border-blue-800/50',
  planned: 'bg-amber-900/30 text-amber-300 border border-amber-800/50',
  dropped: 'bg-red-900/30 text-red-300 border border-red-800/50',
};

export const FuturisticMediaCard: React.FC<FuturisticMediaCardProps> = ({
  title,
  imageUrl,
  type,
  status,
  rating,
  progress,
  onClick,
  className = '',
  variant = 'default',
}) => {
  const TypeIcon = typeIcons[type] || BookOpen;
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  return (
    <motion.div
      className={`group cursor-pointer ${className}`}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {/* Main Card Container */}
      <div className="relative h-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden transition-all duration-500 hover:border-slate-300/60 dark:hover:border-slate-600/60 hover:shadow-2xl hover:shadow-slate-900/10 dark:hover:shadow-black/20">
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-slate-50/10 dark:from-slate-800/10 dark:to-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Cover Image Area */}
        <div className={`relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 ${isFeatured ? 'aspect-[16/9]' : 'aspect-[3/4]'}`}>
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  console.log('Image failed to load:', imageUrl);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {/* Subtle overlay for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <TypeIcon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {typeLabels[type] || 'Media'}
                </span>
              </div>
            </div>
          )}
          
          {/* Status Badge - Top Left */}
          {status && (
            <div className="absolute top-3 left-3">
              <span className={`px-3 py-1.5 rounded-2xl text-xs font-medium backdrop-blur-md ${statusColors[status as keyof typeof statusColors] || statusColors.planned} dark:${statusColorsDark[status as keyof typeof statusColorsDark] || statusColorsDark.planned}`}>
                {status === 'completed' ? 'Complete' : status === 'in-progress' ? 'Watching' : status === 'planned' ? 'Planned' : 'Dropped'}
              </span>
            </div>
          )}
          
          {/* Rating Badge - Top Right */}
          {rating && rating > 0 && (
            <div className="absolute top-3 right-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {rating.toFixed(1)}
                </span>
              </div>
            </div>
          )}
          
          {/* Progress Bar */}
          {progress !== undefined && progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200/50 dark:bg-slate-700/50">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/20 backdrop-blur-sm rounded-full p-3">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className={`p-4 ${isCompact ? 'space-y-2' : 'space-y-3'}`}>
          {/* Title */}
          <h3 className={`font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight ${isCompact ? 'text-sm' : 'text-base'}`}>
            {title}
          </h3>
          
          {/* Type and Duration Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TypeIcon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                {typeLabels[type]}
              </span>
            </div>
            
            {/* Duration/Progress Info */}
            {progress && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {progress}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Subtle Border Glow Effect */}
        <div className="absolute inset-0 rounded-3xl border border-slate-300/20 dark:border-slate-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  );
};
