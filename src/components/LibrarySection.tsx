import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Plus,
  BookOpen,
  Gamepad2,
  Film,
  Tv,
  Sparkles,
  TrendingUp,
  Clock,
  Heart,
  Eye,
  X
} from 'lucide-react';

interface MediaItem {
  id: string;
  title: string;
  type: 'game' | 'anime' | 'series' | 'book' | 'movie';
  status: 'completed' | 'in-progress' | 'planned' | 'dropped';
  rating?: number;
  cover?: string;
  progress?: number;
  totalEpisodes?: number;
  currentEpisode?: number;
  tags: string[];
  dateAdded: string;
  lastUpdated: string;
  isFavorite?: boolean;
  description?: string;
}

// Mock data para demonstração
const mockMediaItems: MediaItem[] = [
  {
    id: '1',
    title: 'The Legend of Zelda: Breath of the Wild',
    type: 'game',
    status: 'completed',
    rating: 10,
    cover: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
    progress: 100,
    tags: ['adventure', 'open-world', 'nintendo'],
    dateAdded: '2024-01-15',
    lastUpdated: '2024-01-20',
    isFavorite: true,
    description: 'Uma obra-prima da Nintendo que redefiniu os jogos de aventura.'
  },
  {
    id: '2',
    title: 'Attack on Titan',
    type: 'anime',
    status: 'completed',
    rating: 9,
    cover: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400',
    currentEpisode: 87,
    totalEpisodes: 87,
    progress: 100,
    tags: ['action', 'drama', 'thriller'],
    dateAdded: '2024-01-10',
    lastUpdated: '2024-01-25',
    isFavorite: true,
    description: 'Uma história épica sobre humanidade, liberdade e sacrifício.'
  },
  {
    id: '3',
    title: 'Dune',
    type: 'book',
    status: 'in-progress',
    rating: 8,
    cover: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400',
    progress: 65,
    tags: ['sci-fi', 'epic', 'politics'],
    dateAdded: '2024-02-01',
    lastUpdated: '2024-02-15',
    description: 'O clássico da ficção científica de Frank Herbert.'
  },
  {
    id: '4',
    title: 'The Matrix',
    type: 'movie',
    status: 'completed',
    rating: 9,
    cover: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
    progress: 100,
    tags: ['sci-fi', 'action', 'philosophy'],
    dateAdded: '2024-01-05',
    lastUpdated: '2024-01-05',
    isFavorite: true,
    description: 'Um marco do cinema que questionou nossa percepção da realidade.'
  },
  {
    id: '5',
    title: 'Breaking Bad',
    type: 'series',
    status: 'completed',
    rating: 10,
    cover: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400',
    currentEpisode: 62,
    totalEpisodes: 62,
    progress: 100,
    tags: ['drama', 'crime', 'thriller'],
    dateAdded: '2024-01-12',
    lastUpdated: '2024-01-30',
    isFavorite: true,
    description: 'A transformação de Walter White em uma das melhores séries já feitas.'
  },
  {
    id: '6',
    title: 'Cyberpunk 2077',
    type: 'game',
    status: 'in-progress',
    rating: 7,
    cover: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
    progress: 45,
    tags: ['rpg', 'cyberpunk', 'open-world'],
    dateAdded: '2024-02-10',
    lastUpdated: '2024-02-20',
    description: 'Aventura futurística em Night City.'
  }
];

const typeIcons = {
  game: Gamepad2,
  anime: Sparkles,
  series: Tv,
  book: BookOpen,
  movie: Film
};

const typeColors = {
  game: 'from-blue-500 to-cyan-500',
  anime: 'from-pink-500 to-purple-500',
  series: 'from-green-500 to-emerald-500',
  book: 'from-amber-500 to-orange-500',
  movie: 'from-red-500 to-rose-500'
};

const statusColors = {
  completed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'in-progress': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  planned: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  dropped: 'bg-red-500/20 text-red-300 border-red-500/30'
};

const statusLabels = {
  completed: 'Concluído',
  'in-progress': 'Em Progresso',
  planned: 'Planejado',
  dropped: 'Abandonado'
};

export function LibrarySection() {
  const [mediaItems] = useState<MediaItem[]>(mockMediaItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('lastUpdated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = useMemo(() => {
    let filtered = mediaItems;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'dateAdded':
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        default:
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      }
    });

    return filtered;
  }, [mediaItems, searchQuery, selectedType, selectedStatus, sortBy]);

  const stats = useMemo(() => {
    const completed = mediaItems.filter(item => item.status === 'completed').length;
    const inProgress = mediaItems.filter(item => item.status === 'in-progress').length;
    const avgRating = mediaItems.filter(item => item.rating).reduce((acc, item) => acc + (item.rating || 0), 0) / mediaItems.filter(item => item.rating).length;

    return {
      total: mediaItems.length,
      completed,
      inProgress,
      avgRating: avgRating || 0
    };
  }, [mediaItems]);

  const featuredItems = useMemo(() => {
    return mediaItems
      .filter(item => item.isFavorite && item.rating && item.rating >= 8)
      .slice(0, 3);
  }, [mediaItems]);

  return (
    <div className="relative min-h-screen text-white">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 pt-8 pb-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20"
            >
              <BookOpen className="text-cyan-400" size={24} />
              <span className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                GeekLogg
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                Biblioteca Digital
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/70 max-w-3xl mx-auto mb-8"
            >
              Organize sua jornada geek com estilo. Acompanhe jogos, animes, séries, livros e filmes em uma interface moderna e intuitiva.
            </motion.p>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-cyan-400 mb-2">{stats.total}</div>
                <div className="text-white/70 text-sm">Total de Itens</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-emerald-400 mb-2">{stats.completed}</div>
                <div className="text-white/70 text-sm">Concluídos</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-blue-400 mb-2">{stats.inProgress}</div>
                <div className="text-white/70 text-sm">Em Progresso</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.avgRating.toFixed(1)}</div>
                <div className="text-white/70 text-sm">Nota Média</div>
              </div>
            </motion.div>
          </div>

          {/* Featured Section */}
          {featuredItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-16"
            >
              <div className="flex items-center gap-3 mb-8">
                <Star className="text-yellow-400 fill-current" size={28} />
                <h2 className="text-3xl font-bold text-white">Destaques da Coleção</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {featuredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="group relative"
                  >
                    <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/20 backdrop-blur-xl">
                      {item.cover && (
                        <img
                          src={item.cover}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      {/* Rating Badge */}
                      <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-2 bg-yellow-500/20 backdrop-blur-sm rounded-full border border-yellow-500/30">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span className="text-white font-bold text-sm">{item.rating}</span>
                      </div>

                      {/* Type Badge */}
                      <div className="absolute top-4 left-4">
                        <div className={`p-2 rounded-full bg-gradient-to-r ${typeColors[item.type]} backdrop-blur-sm`}>
                          {React.createElement(typeIcons[item.type], { size: 16, className: "text-white" })}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{item.title}</h3>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[item.status]}`}>
                          {statusLabels[item.status]}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center mb-6">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por título, tags ou descrição..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl pl-12 pr-12 py-4 text-white placeholder-white/50 outline-none focus:border-cyan-400/50 focus:bg-white/15 transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-1 rounded-full hover:bg-white/10 transition-all"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Controls */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-4 rounded-2xl border transition-all duration-300 ${showFilters
                      ? 'bg-purple-500/20 border-purple-400/50 text-purple-300'
                      : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/15'
                    }`}
                >
                  <Filter size={18} />
                  <span className="hidden sm:inline">Filtros</span>
                </button>

                <div className="flex border border-white/20 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-4 transition-all duration-200 ${viewMode === 'grid'
                        ? 'bg-white/20 text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-4 transition-all duration-200 ${viewMode === 'list'
                        ? 'bg-white/20 text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    <List size={18} />
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl font-semibold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">Adicionar</span>
                </motion.button>
              </div>
            </div>

            {/* Filter Bar */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Type Filter */}
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Tipo de Mídia</label>
                        <select
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50"
                        >
                          <option value="all">Todos os Tipos</option>
                          <option value="game">🎮 Jogos</option>
                          <option value="anime">✨ Anime</option>
                          <option value="series">📺 Séries</option>
                          <option value="book">📚 Livros</option>
                          <option value="movie">🎬 Filmes</option>
                        </select>
                      </div>

                      {/* Status Filter */}
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Status</label>
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50"
                        >
                          <option value="all">Todos os Status</option>
                          <option value="completed">✅ Concluído</option>
                          <option value="in-progress">⏳ Em Progresso</option>
                          <option value="planned">📅 Planejado</option>
                          <option value="dropped">❌ Abandonado</option>
                        </select>
                      </div>

                      {/* Sort Filter */}
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Ordenar por</label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50"
                        >
                          <option value="lastUpdated">🕐 Última Atualização</option>
                          <option value="title">🔤 Título (A-Z)</option>
                          <option value="rating">⭐ Avaliação</option>
                          <option value="dateAdded">📅 Data de Adição</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-white">
                {searchQuery ? `Resultados para "${searchQuery}"` : 'Sua Coleção'}
              </h2>
              <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/70">
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'itens'}
              </span>
            </div>
          </div>

          {/* Media Grid */}
          <AnimatePresence mode="popLayout">
            {filteredItems.length > 0 ? (
              <motion.div
                layout
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6'
                    : 'space-y-4'
                }
              >
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      duration: 0.3,
                      delay: Math.min(index * 0.05, 0.5)
                    }}
                    className={viewMode === 'grid' ? '' : 'w-full'}
                  >
                    {viewMode === 'grid' ? (
                      <MediaCard item={item} />
                    ) : (
                      <MediaListItem item={item} />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-6">📚</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {searchQuery ? 'Nenhum resultado encontrado' : 'Sua biblioteca está vazia'}
                </h3>
                <p className="text-white/60 mb-8 max-w-md mx-auto">
                  {searchQuery
                    ? 'Tente ajustar os filtros ou buscar por outros termos'
                    : 'Comece adicionando seus jogos, animes, séries, livros e filmes favoritos'
                  }
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl font-semibold text-white shadow-lg shadow-emerald-500/25"
                >
                  <Plus size={20} />
                  Adicionar Primeira Mídia
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// Media Card Component
function MediaCard({ item }: { item: MediaItem }) {
  const IconComponent = typeIcons[item.type];

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative cursor-pointer"
    >
      <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/20 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500">
        {/* Cover Image */}
        {item.cover ? (
          <img
            src={item.cover}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className={`p-6 rounded-full bg-gradient-to-r ${typeColors[item.type]}`}>
              <IconComponent size={32} className="text-white" />
            </div>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className={`p-2 rounded-full bg-gradient-to-r ${typeColors[item.type]} shadow-lg`}>
            <IconComponent size={16} className="text-white" />
          </div>

          {item.rating && (
            <div className="flex items-center gap-1 px-3 py-2 bg-yellow-500/20 backdrop-blur-sm rounded-full border border-yellow-500/30">
              <Star size={12} className="text-yellow-400 fill-current" />
              <span className="text-white font-bold text-sm">{item.rating}</span>
            </div>
          )}
        </div>

        {/* Favorite Heart */}
        {item.isFavorite && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <Heart size={20} className="text-red-400 fill-current drop-shadow-lg" />
          </div>
        )}

        {/* Progress Bar */}
        {item.progress !== undefined && item.progress < 100 && (
          <div className="absolute bottom-20 left-4 right-4">
            <div className="bg-black/50 backdrop-blur-sm rounded-full p-1">
              <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
            <div className="text-center mt-2">
              <span className="text-xs text-white/80 font-medium">{item.progress}% concluído</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors">
            {item.title}
          </h3>

          <div className="flex items-center justify-between mb-3">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[item.status]}`}>
              {statusLabels[item.status]}
            </div>

            {item.currentEpisode && item.totalEpisodes && (
              <span className="text-xs text-white/60">
                {item.currentEpisode}/{item.totalEpisodes}
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/70"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 2 && (
              <span className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/70">
                +{item.tags.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
}

// Media List Item Component
function MediaListItem({ item }: { item: MediaItem }) {
  const IconComponent = typeIcons[item.type];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="group relative cursor-pointer"
    >
      <div className="flex items-center gap-6 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-white/15 hover:border-white/30 transition-all duration-300">
        {/* Cover */}
        <div className="w-16 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 flex-shrink-0">
          {item.cover ? (
            <img
              src={item.cover}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <IconComponent size={20} className="text-white/60" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
              {item.title}
            </h3>
            {item.rating && (
              <div className="flex items-center gap-1 ml-4">
                <Star size={14} className="text-yellow-400 fill-current" />
                <span className="text-white font-medium text-sm">{item.rating}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mb-3">
            <div className={`p-1.5 rounded-lg bg-gradient-to-r ${typeColors[item.type]}`}>
              <IconComponent size={14} className="text-white" />
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[item.status]}`}>
              {statusLabels[item.status]}
            </div>
            {item.isFavorite && (
              <Heart size={14} className="text-red-400 fill-current" />
            )}
          </div>

          {/* Progress */}
          {item.progress !== undefined && item.progress < 100 && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-white/60">Progresso</span>
                <span className="text-xs text-white/80 font-medium">{item.progress}%</span>
              </div>
              <div className="bg-white/20 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/70"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/70">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
            <Eye size={16} className="text-white" />
          </button>
          <button className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-colors">
            <X size={16} className="text-red-300" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}