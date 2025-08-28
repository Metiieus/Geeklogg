import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Grid, List } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MediaType, Status } from '../App';
import type { MediaItem } from '../App';
import { useToast } from '../context/ToastContext';
import useDebounce from '../hooks/useDebounce';

// Simplified version without heavy dependencies
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

const ModernLibraryFixed: React.FC = () => {
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
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Minha Biblioteca
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Organize sua jornada geek com estilo
          </p>
          <button
            onClick={() => navigateToAddMedia()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-medium rounded-xl hover:from-violet-400 hover:to-cyan-400 transition-all duration-300 shadow-lg"
          >
            <Plus size={20} />
            Adicionar Mídia
          </button>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
        >
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={18} />
                <input
                  type="text"
                  placeholder="Buscar por título ou tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as MediaType | 'all')}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-violet-400"
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
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-violet-400"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-violet-400"
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
                      ? 'bg-cyan-500 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-cyan-500 text-white'
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
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Search className="text-white" size={32} />
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
              {filteredAndSortedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer"
                  onClick={() => navigateToEditMedia(item)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-white font-semibold text-lg line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Tipo:</span>
                      <span className="text-white capitalize">{item.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Status:</span>
                      <span className="text-white capitalize">{item.status}</span>
                    </div>
                    {item.rating && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Avaliação:</span>
                        <span className="text-yellow-400">★ {item.rating}/10</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ModernLibraryFixed;
