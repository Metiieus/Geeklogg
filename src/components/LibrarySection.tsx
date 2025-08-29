import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Grid, 
  List, 
  Filter, 
  Plus, 
  Star, 
  Clock, 
  Play,
  Book,
  Film,
  Gamepad2,
  Tv,
  Sparkles,
  ArrowLeft,
  Share2
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MediaItem, MediaType, Status } from '../App';
import { ModalWrapper } from './ModalWrapper';

// Tipos e interfaces
interface LibraryFilters {
  search: string;
  type: MediaType | 'all';
  status: Status | 'all';
  sortBy: 'recent' | 'title' | 'rating' | 'hours';
}

interface MediaCardProps {
  item: MediaItem;
  onEdit: (item: MediaItem) => void;
  onView: (item: MediaItem) => void;
  variant?: 'grid' | 'list';
}

// Configurações de tipos de mídia
const mediaTypeConfig = {
  games: { 
    label: 'GAMES', 
    icon: Gamepad2, 
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-500/20',
    textColor: 'text-purple-400'
  },
  movies: { 
    label: 'MOVIES', 
    icon: Film, 
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-500/20',
    textColor: 'text-red-400'
  },
  anime: { 
    label: 'ANIME', 
    icon: Play, 
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/20',
    textColor: 'text-pink-400'
  },
  series: { 
    label: 'SERIES', 
    icon: Tv, 
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-400'
  },
  books: { 
    label: 'BOOKS', 
    icon: Book, 
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-400'
  }
};

const statusConfig = {
  completed: { label: 'CONCLUÍDO', color: 'text-green-400', bg: 'bg-green-500/20' },
  'in-progress': { label: 'EM PROGRESSO', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  planned: { label: 'PLANEJADO', color: 'text-purple-400', bg: 'bg-purple-500/20' },
  dropped: { label: 'ABANDONADO', color: 'text-red-400', bg: 'bg-red-500/20' }
};

// Componente do Card de Mídia
const MediaCard: React.FC<MediaCardProps> = ({ item, onEdit, onView, variant = 'grid' }) => {
  const [imageError, setImageError] = useState(false);
  const typeConfig = mediaTypeConfig[item.type];
  const statusInfo = statusConfig[item.status];
  const TypeIcon = typeConfig.icon;

  if (variant === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        whileHover={{ scale: 1.02 }}
        className="flex items-center gap-4 p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
        onClick={() => onView(item)}
      >
        {/* Cover Image */}
        <div className="w-16 h-20 bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
          {!imageError && item.cover ? (
            <img
              src={item.cover}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <TypeIcon size={20} className={typeConfig.textColor} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-lg mb-1 truncate">{item.title}</h3>
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeConfig.bgColor} ${typeConfig.textColor}`}>
              {typeConfig.label}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            {item.rating && (
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-400" fill="currentColor" />
                <span>{item.rating}</span>
              </div>
            )}
            {item.hoursSpent && (
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{item.hoursSpent}h</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item);
          }}
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
        >
          <Share2 size={16} className="text-slate-400" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative bg-slate-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
      onClick={() => onView(item)}
    >
      {/* Cover Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {!imageError && item.cover ? (
          <motion.img
            src={item.cover}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${typeConfig.color}`}>
            <TypeIcon size={48} className="text-white/80" />
          </div>
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Type Badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 ${typeConfig.bgColor} backdrop-blur-sm rounded-full border border-white/20`}>
          <TypeIcon size={14} className="text-white" />
          <span className="text-white text-xs font-medium">{typeConfig.label}</span>
        </div>

        {/* Rating Badge */}
        {item.rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-yellow-500/20 backdrop-blur-sm rounded-full border border-yellow-500/30">
            <Star size={12} className="text-yellow-400" fill="currentColor" />
            <span className="text-white text-sm font-bold">{item.rating}</span>
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onView(item);
            }}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-white hover:bg-white/30 transition-all"
          >
            <Play size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-white hover:bg-white/30 transition-all"
          >
            <Share2 size={18} />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 leading-tight">
          {item.title}
        </h3>

        {/* Status */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3 ${statusInfo.bg} ${statusInfo.color}`}>
          <div className={`w-2 h-2 rounded-full ${statusInfo.color.replace('text-', 'bg-')}`} />
          {statusInfo.label}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-slate-400">
          {item.hoursSpent && (
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{item.hoursSpent}h</span>
            </div>
          )}
          {item.tags.length > 0 && (
            <span className="px-2 py-1 bg-white/10 rounded-full text-xs">
              {item.tags[0]}
              {item.tags.length > 1 && ` +${item.tags.length - 1}`}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Componente de Detalhes da Mídia
const MediaDetailModal: React.FC<{
  item: MediaItem;
  onClose: () => void;
  onEdit: (item: MediaItem) => void;
}> = ({ item, onClose, onEdit }) => {
  const typeConfig = mediaTypeConfig[item.type];
  const statusInfo = statusConfig[item.status];
  const TypeIcon = typeConfig.icon;

  return (
    <ModalWrapper
      isOpen={true}
      onClose={onClose}
      maxWidth="max-w-2xl"
      className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden"
    >
      <div className="relative">
        {/* Header */}
        <div className="relative h-64 overflow-hidden">
          {item.cover ? (
            <img
              src={item.cover}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${typeConfig.color}`}>
              <TypeIcon size={64} className="text-white/80" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Share Button */}
          <button
            onClick={() => onEdit(item)}
            className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <Share2 size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-4">{item.title}</h1>

          {/* Rating */}
          {item.rating && (
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  className={`${star <= Math.floor(item.rating! / 2) ? 'text-yellow-400' : 'text-slate-600'}`}
                  fill="currentColor"
                />
              ))}
              <span className="text-white font-bold text-lg ml-2">{item.rating}</span>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 mb-6">
            <button className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-medium border-b-2 border-green-400">
              Overview
            </button>
            <button className="px-4 py-2 text-slate-400 hover:text-white transition-colors">
              Community
            </button>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-white font-bold text-lg mb-2">FALL FROM GRACE</h3>
            <p className="text-slate-300 leading-relaxed">
              {item.description || "The Land of Shadow. A place obscured by the Erdtree..."}
            </p>
            <button className="text-green-400 hover:text-green-300 text-sm mt-2 transition-colors">
              More
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-blue-400" />
                <span className="text-slate-400 text-sm">Tempo Gasto</span>
              </div>
              <span className="text-white font-bold text-xl">{item.hoursSpent || 0}h</span>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TypeIcon size={16} className={typeConfig.textColor} />
                <span className="text-slate-400 text-sm">Status</span>
              </div>
              <span className={`font-bold text-lg ${statusInfo.color}`}>{statusInfo.label}</span>
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

// Componente Principal da Biblioteca
export const LibrarySection: React.FC = () => {
  const { mediaItems, setActivePage, navigateToEditMedia } = useAppContext();
  const [filters, setFilters] = useState<LibraryFilters>({
    search: '',
    type: 'all',
    status: 'all',
    sortBy: 'recent'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  // Filtrar e ordenar itens
  const filteredItems = useMemo(() => {
    let filtered = [...mediaItems];

    // Filtro por busca
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filtro por tipo
    if (filters.type !== 'all') {
      filtered = filtered.filter(item => item.type === filters.type);
    }

    // Filtro por status
    if (filters.status !== 'all') {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    // Ordenação
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'hours':
          return (b.hoursSpent || 0) - (a.hoursSpent || 0);
        default: // recent
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    return filtered;
  }, [mediaItems, filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.3, type: "spring", bounce: 0.4 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl mb-6 shadow-2xl"
          >
            <Book size={32} className="text-white" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            Minha Biblioteca
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Organize sua jornada geek com estilo e inteligência
          </p>

          {/* Add Media Button */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActivePage('add-media')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
          >
            <Plus size={20} />
            Adicionar Mídia
            <Sparkles size={16} className="text-yellow-300" />
          </motion.button>

          {/* Decorative Wave */}
          <div className="mt-12 flex justify-center">
            <svg width="400" height="60" viewBox="0 0 400 60" className="text-cyan-400/30">
              <path
                d="M0,30 Q100,10 200,30 T400,30"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="100" cy="30" r="3" fill="currentColor" />
              <circle cx="200" cy="30" r="3" fill="currentColor" />
              <circle cx="300" cy="30" r="3" fill="currentColor" />
            </svg>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8 space-y-6"
        >
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por título ou tags..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Type Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, type: 'all' }))}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filters.type === 'all'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Todos ({mediaItems.length})
              </button>
              {Object.entries(mediaTypeConfig).map(([type, config]) => {
                const count = mediaItems.filter(item => item.type === type).length;
                return (
                  <button
                    key={type}
                    onClick={() => setFilters(prev => ({ ...prev, type: type as MediaType }))}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filters.type === type
                        ? `bg-gradient-to-r ${config.color} text-white`
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {config.label} ({count})
                  </button>
                );
              })}
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="recent">Mais Recentes</option>
                <option value="title">A-Z</option>
                <option value="rating">Avaliação</option>
                <option value="hours">Mais Horas</option>
              </select>

              {/* View Mode */}
              <div className="flex bg-slate-700/50 rounded-lg border border-slate-600/50 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-purple-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-purple-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <span className="text-slate-400 text-lg">
            {filteredItems.length} itens encontrados
          </span>
        </motion.div>

        {/* Media Grid/List */}
        <AnimatePresence mode="popLayout">
          {filteredItems.length > 0 ? (
            <motion.div
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MediaCard
                    item={item}
                    onEdit={navigateToEditMedia}
                    onView={setSelectedItem}
                    variant={viewMode}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-slate-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {filters.search ? 'Nenhum resultado encontrado' : 'Sua biblioteca está vazia'}
              </h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                {filters.search 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece adicionando suas primeiras mídias favoritas'
                }
              </p>
              <button
                onClick={() => setActivePage('add-media')}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
              >
                Adicionar Primeira Mídia
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detail Modal */}
        {selectedItem && (
          <MediaDetailModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onEdit={navigateToEditMedia}
          />
        )}
      </div>
    </div>
  );
};

export default LibrarySection;