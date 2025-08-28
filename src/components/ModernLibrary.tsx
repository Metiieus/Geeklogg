import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Grid, List, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MediaType, Status } from '../App';
import type { MediaItem } from '../App';
import { useToast } from '../context/ToastContext';
import useDebounce from '../hooks/useDebounce';

// Import components
import { MediaCard } from '../design-system/components/MediaCard';
import { AddMediaOptions } from './AddMediaOptions';
import { ExternalMediaResult } from '../services/externalMediaService';

const statusOptions = [
  { value: 'all', label: 'Todos os Status' },
  { value: 'completed', label: '✅ Concluído' },
  { value: 'in-progress', label: '⏳ Em Progresso' },
  { value: 'dropped', label: '❌ Abandonado' },
  { value: 'planned', label: '📅 Planejado' },
];

const sortOptions = [
  { value: 'updatedAt', label: '🕐 Mais Recentes' },
  { value: 'title', label: '🔤 A-Z' },
  { value: 'rating', label: '⭐ Avaliação' },
  { value: 'hoursSpent', label: '⏱️ Mais Horas' },
];

const ModernLibrary: React.FC = () => {
  const { mediaItems, navigateToAddMedia, navigateToEditMedia } = useAppContext();
  const { showError, showSuccess } = useToast();

  const [selectedType, setSelectedType] = useState<MediaType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<Status | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'rating' | 'hoursSpent' | 'updatedAt'>('updatedAt');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredAndSortedItems = useMemo(() => {
    const uniqueItems = mediaItems.filter((item, index, arr) => 
      arr.findIndex(i => i.id === item.id) === index
    );
    let filtered = uniqueItems;

    if (selectedType !== 'all') {
      filtered = filtered.filter((item) => item.type === selectedType);
    }
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((item) => item.status === selectedStatus);
    }

    if (debouncedSearchQuery) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        (item.tags && item.tags.some((tag) => 
          tag.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        ))
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title': 
          return a.title.localeCompare(b.title);
        case 'rating': 
          return (b.rating || 0) - (a.rating || 0);
        case 'hoursSpent': 
          return (b.hoursSpent || 0) - (a.hoursSpent || 0);
        default: 
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    return filtered;
  }, [mediaItems, selectedType, selectedStatus, debouncedSearchQuery, sortBy]);

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Floating Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="text-center relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-cyan-500/10 to-magenta-500/20 rounded-3xl blur-3xl" />
          <div className="relative">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-violet-400 via-cyan-400 to-magenta-400 bg-clip-text text-transparent">
              Minha Biblioteca
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Organize sua jornada geek com estilo e inteligência
            </p>
            <button
              onClick={() => navigateToAddMedia()}
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-500 via-cyan-500 to-magenta-500 text-white font-medium rounded-2xl hover:from-violet-400 hover:via-cyan-400 hover:to-magenta-400 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              Adicionar Mídia
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-600 via-cyan-600 to-magenta-600 opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300" />
            </button>
          </div>
        </motion.div>

        {/* Tribal Divider */}
        <div className="flex justify-center py-8">
          <svg width="200" height="20" viewBox="0 0 200 20" className="text-cyan-400">
            <path
              d="M0 10 Q50 5 100 10 T200 10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            />
            <circle cx="100" cy="10" r="3" fill="currentColor" opacity="0.8" />
          </svg>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl"
        >
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={18} />
                <input
                  type="text"
                  placeholder="Buscar por título ou tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as MediaType | 'all')}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-violet-400 min-w-[140px]"
              >
                <option value="all">Todos os Tipos</option>
                <option value="anime">🎭 Anime</option>
                <option value="series">📺 Séries</option>
                <option value="games">🎮 Games</option>
                <option value="movies">🎬 Filmes</option>
                <option value="books">📖 Livros</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as Status | 'all')}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-violet-400 min-w-[140px]"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-violet-400 min-w-[140px]"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              <div className="flex bg-white/5 border border-white/20 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-cyan-500 text-white shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-cyan-500 text-white shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {filteredAndSortedItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative mx-auto mb-8">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-violet-500 via-cyan-500 to-magenta-500 rounded-full flex items-center justify-center">
                  <Search className="text-white" size={32} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-cyan-500 to-magenta-500 rounded-full blur-xl opacity-20" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                {debouncedSearchQuery ? 'Nenhum resultado encontrado' : 'Sua biblioteca está vazia'}
              </h3>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                {debouncedSearchQuery
                  ? 'Tente ajustar os filtros ou termos de busca'
                  : 'Comece adicionando suas primeiras mídias para organizar sua jornada geek!'
                }
              </p>
              {!debouncedSearchQuery && (
                <button
                  onClick={() => navigateToAddMedia()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-lg"
                >
                  <Plus size={20} />
                  Adicionar Primeira Mídia
                </button>
              )}
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }
            >
              <AnimatePresence mode="popLayout">
                {filteredAndSortedItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                      layout: { duration: 0.3 }
                    }}
                  >
                    <MediaCard
                      item={item}
                      viewMode={viewMode}
                      onEdit={() => navigateToEditMedia(item)}
                      onDelete={() => {}}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ModernLibrary;
