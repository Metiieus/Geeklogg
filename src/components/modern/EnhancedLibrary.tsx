import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Star, 
  Clock, 
  ExternalLink, 
  Edit, 
  Trash2, 
  X, 
  Filter,
  Grid3X3,
  List,
  TrendingUp,
  Zap,
  Gamepad2,
  Film,
  Book,
  Tv,
  Heart
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { MediaType, MediaItem, Status } from '../../App';
import { ModernCard, GlassCard, InteractiveCard } from './ModernCard';
import { ModernButton, GradientButton, NeonButton, GhostButton } from './ModernButton';
import { enhancedExternalMediaService, EnhancedExternalMediaResult } from '../../infrastructure/services/EnhancedExternalMediaService';
import { useToast } from '../../context/ToastContext';

const mediaTypeConfig = {
  games: { 
    icon: Gamepad2, 
    label: "Jogos", 
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500",
    textColor: "text-blue-400"
  },
  anime: { 
    icon: Tv, 
    label: "Anime", 
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500",
    textColor: "text-pink-400"
  },
  series: { 
    icon: Tv, 
    label: "Séries", 
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-500",
    textColor: "text-purple-400"
  },
  books: { 
    icon: Book, 
    label: "Livros", 
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500",
    textColor: "text-green-400"
  },
  movies: { 
    icon: Film, 
    label: "Filmes", 
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-500",
    textColor: "text-yellow-400"
  },
  dorama: { 
    icon: Heart, 
    label: "Doramas", 
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-500",
    textColor: "text-red-400"
  },
};

const statusConfig = {
  completed: { label: "CONCLUÍDO", color: "text-green-400 bg-green-500/10", icon: "✅" },
  "in-progress": { label: "EM PROGRESSO", color: "text-blue-400 bg-blue-500/10", icon: "⏳" },
  dropped: { label: "ABANDONADO", color: "text-red-400 bg-red-500/10", icon: "❌" },
  planned: { label: "PLANEJADO", color: "text-purple-400 bg-purple-500/10", icon: "📅" },
};

const viewModes = [
  { id: 'grid', icon: Grid3X3, label: 'Grid' },
  { id: 'list', icon: List, label: 'Lista' }
] as const;

type ViewMode = typeof viewModes[number]['id'];

export const EnhancedLibrary: React.FC = () => {
  const { mediaItems, setMediaItems } = useAppContext();
  const { showError, showSuccess, showWarning } = useToast();
  
  // State
  const [selectedType, setSelectedType] = useState<MediaType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<Status | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'rating' | 'hoursSpent' | 'updatedAt'>('updatedAt');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [trendingContent, setTrendingContent] = useState<{
    games: EnhancedExternalMediaResult[];
    movies: EnhancedExternalMediaResult[];
    books: EnhancedExternalMediaResult[];
  }>({ games: [], movies: [], books: [] });
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);

  // Load trending content
  useEffect(() => {
    const loadTrendingContent = async () => {
      setIsLoadingTrending(true);
      try {
        const trending = await enhancedExternalMediaService.getTrendingContent();
        setTrendingContent(trending);
      } catch (error) {
        console.error('Error loading trending content:', error);
      } finally {
        setIsLoadingTrending(false);
      }
    };

    loadTrendingContent();
  }, []);

  // Filtered and sorted items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = mediaItems;

    if (selectedType !== "all") {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((item) => item.status === selectedStatus);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "hoursSpent":
          return (b.hoursSpent || 0) - (a.hoursSpent || 0);
        case "updatedAt":
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    return filtered;
  }, [mediaItems, selectedType, selectedStatus, searchQuery, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const total = mediaItems.length;
    const completed = mediaItems.filter(item => item.status === 'completed').length;
    const inProgress = mediaItems.filter(item => item.status === 'in-progress').length;
    const totalHours = mediaItems.reduce((sum, item) => sum + (item.hoursSpent || 0), 0);
    const avgRating = mediaItems.filter(item => item.rating).reduce((sum, item, _, arr) => 
      sum + (item.rating || 0) / arr.length, 0
    );

    return { total, completed, inProgress, totalHours, avgRating };
  }, [mediaItems]);

  const handleQuickAdd = useCallback(async (result: EnhancedExternalMediaResult) => {
    try {
      // Implementation would integrate with media use cases
      showSuccess('Mídia adicionada com sucesso!');
    } catch (error) {
      showError('Erro ao adicionar mídia', 'Tente novamente mais tarde');
    }
  }, [showSuccess, showError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3 sm:p-6">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
              Biblioteca Digital
            </h1>
            <p className="text-slate-400 text-lg">
              Sua coleção pessoal com tecnologia avançada
            </p>
          </div>

          <div className="flex items-center gap-3">
            <GradientButton 
              icon={<Plus size={20} />}
              onClick={() => setShowAddModal(true)}
              size="lg"
            >
              Adicionar Mídia
            </GradientButton>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {[
            { label: "Total", value: stats.total, icon: "📚", color: "from-blue-500 to-cyan-500" },
            { label: "Concluídos", value: stats.completed, icon: "✅", color: "from-green-500 to-emerald-500" },
            { label: "Em Progresso", value: stats.inProgress, icon: "⏳", color: "from-yellow-500 to-orange-500" },
            { label: "Horas Totais", value: `${stats.totalHours}h`, icon: "⏱️", color: "from-purple-500 to-pink-500" },
            { label: "Nota Média", value: stats.avgRating.toFixed(1), icon: "⭐", color: "from-pink-500 to-red-500" },
          ].map((stat, index) => (
            <GlassCard key={stat.label} className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
              >
                <div className={`text-2xl mb-2 w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center mx-auto`}>
                  <span className="text-white text-lg">{stat.icon}</span>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </motion.div>
            </GlassCard>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <GlassCard>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Buscar na sua biblioteca..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              <GhostButton
                size="sm"
                icon={<Filter size={16} />}
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-slate-700' : ''}
              >
                Filtros
              </GhostButton>

              {/* Type filters */}
              <GhostButton
                size="sm"
                onClick={() => setSelectedType('all')}
                className={selectedType === 'all' ? 'bg-slate-700' : ''}
              >
                Todos
              </GhostButton>
              
              {(Object.keys(mediaTypeConfig) as MediaType[]).map((type) => {
                const config = mediaTypeConfig[type];
                const Icon = config.icon;
                return (
                  <GhostButton
                    key={type}
                    size="sm"
                    icon={<Icon size={16} />}
                    onClick={() => setSelectedType(type)}
                    className={selectedType === type ? `bg-gradient-to-r ${config.color}` : ''}
                  >
                    <span className="hidden sm:inline">{config.label}</span>
                  </GhostButton>
                );
              })}
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-600/30"
                >
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as Status | 'all')}
                    className="px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  >
                    <option value="all">Todos os Status</option>
                    {Object.entries(statusConfig).map(([status, config]) => (
                      <option key={status} value={status}>
                        {config.icon} {config.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  >
                    <option value="updatedAt">🕐 Mais Recentes</option>
                    <option value="title">🔤 A-Z</option>
                    <option value="rating">⭐ Avaliação</option>
                    <option value="hoursSpent">⏱️ Mais Horas</option>
                  </select>

                  <div className="flex bg-slate-800/50 border border-slate-600/30 rounded-lg p-1">
                    {viewModes.map((mode) => {
                      const Icon = mode.icon;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => setViewMode(mode.id)}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
                            viewMode === mode.id 
                              ? 'bg-cyan-500 text-white' 
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Icon size={16} />
                          <span className="hidden sm:inline">{mode.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassCard>

        {/* Results Count */}
        <div className="flex items-center justify-between text-slate-400">
          <p>{filteredAndSortedItems.length} itens encontrados</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <TrendingUp size={16} />
            <span>Trending</span>
          </motion.button>
        </div>

        {/* Trending Section */}
        {!isLoadingTrending && (trendingContent.games.length > 0 || trendingContent.movies.length > 0) && (
          <GlassCard>
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-cyan-400" size={24} />
                <h2 className="text-xl font-bold text-white">Trending Agora</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Trending Games */}
                {trendingContent.games.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Gamepad2 className="text-blue-400" size={20} />
                      Jogos
                    </h3>
                    <div className="space-y-2">
                      {trendingContent.games.slice(0, 3).map((game) => (
                        <motion.div
                          key={game.id}
                          className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg hover:bg-slate-700/30 transition-colors cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleQuickAdd(game)}
                        >
                          {game.image && (
                            <img 
                              src={game.image} 
                              alt={game.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">{game.title}</p>
                            <p className="text-sm text-slate-400 truncate">
                              {game.genres?.slice(0, 2).join(', ')} • {game.year}
                            </p>
                          </div>
                          <Plus className="text-cyan-400" size={16} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Similar sections for movies and books would go here */}
              </div>
            </div>
          </GlassCard>
        )}

        {/* Media Grid/List */}
        <motion.div
          layout
          className={viewMode === 'grid' 
            ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4" 
            : "space-y-4"
          }
        >
          <AnimatePresence mode="popLayout">
            {filteredAndSortedItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                {viewMode === 'grid' ? (
                  <MediaGridCard item={item} />
                ) : (
                  <MediaListCard item={item} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredAndSortedItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Nenhum item encontrado
            </h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Tente ajustar sua busca ou filtros, ou adicione novos itens à sua biblioteca
            </p>
            <GradientButton
              icon={<Plus size={20} />}
              onClick={() => setShowAddModal(true)}
              size="lg"
            >
              Adicionar Primeiro Item
            </GradientButton>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Helper components
const MediaGridCard: React.FC<{ item: MediaItem }> = ({ item }) => {
  const config = mediaTypeConfig[item.type];
  const statusConfig_local = statusConfig[item.status];

  return (
    <InteractiveCard className="group">
      <div className="aspect-[3/4] bg-slate-700 rounded-lg overflow-hidden relative mb-3">
        {item.cover ? (
          <img 
            src={item.cover} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <config.icon className={config.textColor} size={48} />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            >
              <Edit size={16} className="text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-red-500/20 backdrop-blur-sm rounded-full hover:bg-red-500/30 transition-colors"
            >
              <Trash2 size={16} className="text-white" />
            </motion.button>
          </div>
        </div>

        {/* Status badge */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${statusConfig_local.color}`}>
          {statusConfig_local.icon}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-white line-clamp-2 mb-2">
          {item.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm">
          {item.rating && (
            <div className="flex items-center gap-1">
              <Star className="text-yellow-400" size={14} fill="currentColor" />
              <span className="text-white">{item.rating}</span>
            </div>
          )}
          {item.hoursSpent && (
            <div className="flex items-center gap-1">
              <Clock className="text-blue-400" size={14} />
              <span className="text-white">{item.hoursSpent}h</span>
            </div>
          )}
        </div>

        {/* Progress bar for books */}
        {item.type === 'books' && item.totalPages && (
          <div className="mt-2">
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{
                  width: `${Math.min(((item.currentPage || 0) / item.totalPages) * 100, 100)}%`
                }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {item.currentPage || 0}/{item.totalPages}
            </p>
          </div>
        )}
      </div>
    </InteractiveCard>
  );
};

const MediaListCard: React.FC<{ item: MediaItem }> = ({ item }) => {
  const config = mediaTypeConfig[item.type];
  const statusConfig_local = statusConfig[item.status];

  return (
    <InteractiveCard>
      <div className="flex items-center gap-4">
        <div className="w-16 h-20 bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
          {item.cover ? (
            <img 
              src={item.cover} 
              alt={item.title} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <config.icon className={config.textColor} size={24} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate mb-1">
            {item.title}
          </h3>
          
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig_local.color} mb-2`}>
            {statusConfig_local.icon} {statusConfig_local.label}
          </div>

          <div className="flex items-center gap-4 text-sm">
            {item.rating && (
              <div className="flex items-center gap-1">
                <Star className="text-yellow-400" size={14} fill="currentColor" />
                <span className="text-white">{item.rating}</span>
              </div>
            )}
            {item.hoursSpent && (
              <div className="flex items-center gap-1">
                <Clock className="text-blue-400" size={14} />
                <span className="text-white">{item.hoursSpent}h</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <GhostButton size="sm" icon={<Edit size={16} />}>
            <span className="sr-only">Editar</span>
          </GhostButton>
          <GhostButton size="sm" icon={<Trash2 size={16} />} variant="ghost">
            <span className="sr-only">Excluir</span>
          </GhostButton>
        </div>
      </div>
    </InteractiveCard>
  );
};

export default EnhancedLibrary;
