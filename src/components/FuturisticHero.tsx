import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, TrendingUp, Star, Clock, BookOpen } from 'lucide-react';

interface FuturisticHeroProps {
  title: string;
  subtitle?: string;
  stats?: {
    total: number;
    completed: number;
    inProgress: number;
    avgRating: string;
  };
  onAddMedia?: () => void;
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export const FuturisticHero: React.FC<FuturisticHeroProps> = ({
  title,
  subtitle,
  stats,
  onAddMedia,
  onSearch,
  searchQuery = '',
}) => {
  const [localSearchQuery, setLocalSearchQuery] = React.useState(searchQuery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <div className="relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute -top-5 -right-10 w-96 h-96 bg-gradient-to-bl from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 rounded-full blur-3xl opacity-20" />
      </div>

      {/* Main Hero Content */}
      <div className="relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] border border-slate-200/50 dark:border-slate-700/50 p-8 lg:p-12">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-10">
          {/* Title and Subtitle */}
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight"
            >
              {title}
            </motion.h1>
            
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl"
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          {/* Action Button */}
          {onAddMedia && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              onClick={onAddMedia}
              className="group relative flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-slate-900/25 dark:hover:shadow-white/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Plus className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Add New Media</span>
            </motion.button>
          )}
        </div>

        {/* Search Bar */}
        {onSearch && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10"
          >
            <div className="relative max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={localSearchQuery}
                onChange={handleSearchChange}
                placeholder="Search your library..."
                className="w-full pl-12 pr-4 py-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
              />
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Total Items */}
            <div className="group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 hover:border-slate-300/60 dark:hover:border-slate-600/60">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {stats.total}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Total Items
                  </p>
                </div>
              </div>
            </div>

            {/* Completed */}
            <div className="group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 hover:border-slate-300/60 dark:hover:border-slate-600/60">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {stats.completed}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Completed
                  </p>
                </div>
              </div>
            </div>

            {/* In Progress */}
            <div className="group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 hover:border-slate-300/60 dark:hover:border-slate-600/60">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {stats.inProgress}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    In Progress
                  </p>
                </div>
              </div>
            </div>

            {/* Average Rating */}
            <div className="group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 hover:border-slate-300/60 dark:hover:border-slate-600/60">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-violet-50 dark:bg-violet-950/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {stats.avgRating}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Avg Rating
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Subtle Border Glow */}
        <div className="absolute inset-0 rounded-[2.5rem] border border-slate-300/30 dark:border-slate-600/30 pointer-events-none" />
      </div>
    </div>
  );
};
