import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, TrendingUp, Star, Clock, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

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
  featuredItems?: Array<{
    id: string;
    title: string;
    cover?: string;
    type: string;
    rating?: number;
  }>;
  onFeaturedItemClick?: (item: any) => void;
}

export const FuturisticHero: React.FC<FuturisticHeroProps> = ({
  title,
  subtitle,
  stats,
  onAddMedia,
  onSearch,
  searchQuery = '',
  featuredItems = [],
  onFeaturedItemClick,
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
      <div className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 lg:p-12 pb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            {/* Title and Subtitle */}
            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight"
              >
                Biblioteca de Mídia
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl"
              >
                Sua coleção pessoal, organizada e facilmente acessível
              </motion.p>
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
                <span className="relative z-10">Adicionar Nova Mídia</span>
              </motion.button>
            )}
          </div>

          {/* Search Bar */}
          {onSearch && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <div className="relative max-w-2xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={localSearchQuery}
                  onChange={handleSearchChange}
                  placeholder="Pesquisar sua biblioteca..."
                  className="w-full pl-12 pr-4 py-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Featured Items Carousel - Inspired by the library image */}
        {featuredItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="px-8 lg:px-12 pb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Destaques da Biblioteca
              </h2>
              <div className="flex items-center gap-3">
                <button className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors">
                  <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <button className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors">
                  <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            </div>
            
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {featuredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onFeaturedItemClick?.(item)}
                  className="group flex-shrink-0 w-48 cursor-pointer"
                >
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    {item.cover ? (
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center"
                      style={{ display: item.cover ? 'none' : 'flex' }}
                    >
                      <span className="text-slate-600 dark:text-slate-300 font-bold text-4xl">
                        {item.title.charAt(0)}
                      </span>
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Rating Badge */}
                    {item.rating && (
                      <div className="absolute top-3 right-3 bg-yellow-500/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                        <Star className="w-3 h-3 text-white fill-current" />
                        <span className="text-white text-xs font-bold">{item.rating}</span>
                      </div>
                    )}
                    
                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="font-semibold text-sm line-clamp-2 mb-1">{item.title}</h3>
                      <p className="text-xs text-white/80 capitalize">{item.type}</p>
                    </div>
                  </div>
                  
                  {/* Title below image */}
                  <div className="mt-3 px-1">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm line-clamp-2 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                      {item.type}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200/50 dark:border-slate-700/50 p-8 lg:p-12"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Items */}
              <div className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 hover:border-slate-300/60 dark:hover:border-slate-600/60 hover:shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.total}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                      Total de Itens
                    </p>
                  </div>
                </div>
              </div>

              {/* Completed */}
              <div className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 hover:border-slate-300/60 dark:hover:border-slate-600/60 hover:shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.completed}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                      Concluídos
                    </p>
                  </div>
                </div>
              </div>

              {/* In Progress */}
              <div className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 hover:border-slate-300/60 dark:hover:border-slate-600/60 hover:shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.inProgress}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                      Em Progresso
                    </p>
                  </div>
                </div>
              </div>

              {/* Average Rating */}
              <div className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 hover:border-slate-300/60 dark:hover:border-slate-600/60 hover:shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-violet-50 dark:bg-violet-950/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Star className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.avgRating}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                      Avaliação Média
                    </p>
                  </div>
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
