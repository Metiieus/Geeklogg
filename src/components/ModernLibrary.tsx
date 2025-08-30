// ModernLibrary.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid, List, X, Trash2, Star, Clock, TrendingUp, BookOpen, Award, Users, ChevronRight } from 'lucide-react';

import { useAppContext } from '../context/AppContext';
import { MediaType, Status } from '../App';
import type { MediaItem } from '../App';

import { useToast } from '../context/ToastContext';
import useDebounce from '../hooks/useDebounce';

// Design System
import { HeroBanner } from '../design-system/components/HeroBanner';
import { RadiantMediaCard } from './RadiantMediaCard';
import { GlassInput, GlassSelect, GlassFilterBar } from '../design-system/components/GlassInput';
import { NeonOrnament, FloatingParticles } from '../design-system/components/NeonPatterns';

// Modais / Serviços
import { ConnectivityError } from './ConnectivityError';
import { AddMediaOptions } from './AddMediaOptions';
import { AddMediaFromSearchModal } from './modals/AddMediaFromSearchModal';
import { ConfirmationModal } from './ConfirmationModal';
import { ExternalMediaResult } from '../services/externalMediaService';
import { useImprovedScrollLock } from '../hooks/useImprovedScrollLock';

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

// New component for section headers
const SectionHeader: React.FC<{ 
  title: string; 
  subtitle?: string; 
  icon?: React.ReactNode; 
  action?: React.ReactNode;
}> = ({ title, subtitle, icon, action }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      {icon && <div className="text-cyan-400">{icon}</div>}
      <div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
      </div>
    </div>
    {action}
  </div>
);

// Featured media card component
const FeaturedMediaCard: React.FC<{ 
  item: MediaItem; 
  onEdit: (item: MediaItem) => void;
  onDelete: (item: MediaItem) => void;
}> = ({ item, onEdit, onDelete }) => {
  const getItemImage = (it: MediaItem) =>
    (it as any)?.coverUrl || (it as any)?.imageUrl || (it as any)?.poster || (it as any)?.thumbnail || "";

  return (
    <motion.div
      className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 overflow-hidden group cursor-pointer"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={() => onEdit(item)}
    >
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10 flex flex-col md:flex-row gap-6">
        {/* Book Cover */}
        <div className="flex-shrink-0">
          <div className="w-32 h-48 md:w-40 md:h-60 rounded-2xl overflow-hidden shadow-2xl">
            {getItemImage(item) ? (
              <img
                src={getItemImage(item)}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                <BookOpen className="text-slate-500" size={32} />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-medium uppercase">
                {item.type}
              </span>
              {item.status === 'completed' && (
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium">
                  Concluído
                </span>
              )}
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3 leading-tight">{item.title}</h3>
            
            {item.rating && (
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < item.rating! ? 'text-yellow-400 fill-current' : 'text-slate-600'}
                  />
                ))}
                <span className="text-slate-300 ml-2">{item.rating}/5</span>
              </div>
            )}

            {item.notes && (
              <p className="text-slate-300 text-sm line-clamp-3 mb-4">
                {item.notes}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-slate-400">
              {item.hoursSpent && (
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {item.hoursSpent}h
                </span>
              )}
              {item.endDate && (
                <span>Finalizado em {new Date(item.endDate).toLocaleDateString('pt-BR')}</span>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item);
              }}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Stats card component
const StatsCard: React.FC<{ label: string; value: number; icon: React.ReactNode; color: string }> = ({
  label, value, icon, color
}) => (
  <motion.div
    className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/20 p-6 text-center`}
    whileHover={{ y: -5 }}
    transition={{ duration: 0.2 }}
  >
    <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br ${color} flex items-center justify-center`}>
      {icon}
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-slate-400 text-sm">{label}</div>
  </motion.div>
);

const ModernLibrary: React.FC = () => {
  const {
    mediaItems,
    setMediaItems,
    navigateToAddMedia,
    navigateToEditMedia,
    deleteMedia,
  } = useAppContext() as any;

  const { showError, showSuccess } = useToast();

  const [selectedType, setSelectedType] = useState<MediaType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<Status | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'rating' | 'hoursSpent' | 'updatedAt'>('updatedAt');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [showAddOptions, setShowAddOptions] = useState(false);
  const [selectedExternalResult, setSelectedExternalResult] = useState<ExternalMediaResult | null>(null);

  const [hasConnectionError, setHasConnectionError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MediaItem | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useImprovedScrollLock(showAddOptions || !!selectedExternalResult || showDeleteConfirm);

  // Stats calculations
  const stats = useMemo(() => {
    const completed = mediaItems.filter((item: MediaItem) => item.status === 'completed').length;
    const inProgress = mediaItems.filter((item: MediaItem) => item.status === 'in-progress').length;
    const totalHours = mediaItems.reduce((acc: number, item: MediaItem) => acc + (item.hoursSpent || 0), 0);
    const avgRating = mediaItems.filter((item: MediaItem) => item.rating).reduce((acc: number, item: MediaItem, _, arr) => acc + (item.rating || 0) / arr.length, 0);

    return { completed, inProgress, totalHours, avgRating: Math.round(avgRating * 10) / 10 };
  }, [mediaItems]);

  // Featured item (latest completed with high rating)
  const featuredItem = useMemo(() => {
    return mediaItems
      .filter((item: MediaItem) => item.status === 'completed' && (item.rating || 0) >= 4)
      .sort((a: MediaItem, b: MediaItem) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
  }, [mediaItems]);

  // Recently added items
  const recentItems = useMemo(() => {
    return [...mediaItems]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 6);
  }, [mediaItems]);

  // Popular items (highest rated)
  const popularItems = useMemo(() => {
    return [...mediaItems]
      .filter(item => item.rating && item.rating >= 4)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 8);
  }, [mediaItems]);

  // Categories with counts
  const categories = useMemo(() => {
    const typeCounts = mediaItems.reduce((acc: Record<string, number>, item: MediaItem) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});

    return [
      { id: 'games', label: 'Jogos', count: typeCounts.games || 0, color: 'from-blue-500 to-cyan-500' },
      { id: 'anime', label: 'Anime', count: typeCounts.anime || 0, color: 'from-pink-500 to-rose-500' },
      { id: 'series', label: 'Séries', count: typeCounts.series || 0, color: 'from-purple-500 to-violet-500' },
      { id: 'books', label: 'Livros', count: typeCounts.books || 0, color: 'from-green-500 to-emerald-500' },
      { id: 'movies', label: 'Filmes', count: typeCounts.movies || 0, color: 'from-orange-500 to-amber-500' },
    ].filter(cat => cat.count > 0);
  }, [mediaItems]);

  const filteredAndSortedItems = useMemo(() => {
    const uniqueItems = mediaItems.filter(
      (item, idx, arr) => arr.findIndex(i => String(i.id) === String(item.id)) === idx
    );

    let filtered = uniqueItems;

    if (selectedType !== 'all') {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((item) => item.status === selectedStatus);
    }

    if (debouncedSearchQuery) {
      const q = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(q) ||
        (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(q)))
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

  // Helpers
  const getItemImage = (it: MediaItem) =>
    (it as any)?.coverUrl || (it as any)?.imageUrl || (it as any)?.poster || (it as any)?.thumbnail || "";

  // Handlers
  const handleExternalResultSelect = useCallback((result: ExternalMediaResult) => {
    setSelectedExternalResult(result);
    setShowAddOptions(false);
  }, []);

  const handleAddFromSearch = useCallback((newItem: MediaItem) => {
    try {
      setMediaItems([...mediaItems, newItem]);
      showSuccess('Mídia adicionada!');
    } catch {
      showError('Erro ao adicionar mídia');
    } finally {
      setSelectedExternalResult(null);
    }
  }, [mediaItems, setMediaItems, showSuccess, showError]);

  const handleDeleteItem = useCallback((item: MediaItem) => {
    if (!item?.id || typeof item.id !== 'string' || item.id.trim() === '') {
      showError('ID do item inválido. Não é possível excluir este item.');
      return;
    }
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  }, [showError]);

  const confirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      if (typeof deleteMedia === 'function') {
        await deleteMedia(itemToDelete.id);
      }
      setMediaItems((prev: MediaItem[]) => prev.filter(m => m.id !== itemToDelete.id));
      showSuccess('Item removido com sucesso!');
      setHasConnectionError(false);
    } catch (err: any) {
      if (err?.message?.includes('fetch') || err?.message?.includes('network') || err?.name === 'TypeError') {
        setHasConnectionError(true);
        showError('Erro de Conectividade', 'Verifique sua conexão e tente novamente.');
      } else {
        showError('Erro ao remover mídia', err?.message || 'Não foi possível excluir o item.');
      }
    } finally {
      setItemToDelete(null);
      setShowDeleteConfirm(false);
    }
  }, [itemToDelete, deleteMedia, setMediaItems, showSuccess, showError]);

  const handleRetryConnection = useCallback(() => {
    setHasConnectionError(false);
    window.location.reload();
  }, []);

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background decorativo */}
      <FloatingParticles count={12} color="cyan" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <HeroBanner
            title="Minha Biblioteca"
            subtitle="Organize sua jornada geek com estilo e inteligência"
            onAddMedia={() => {
              window.scrollTo(0, 0);
              setShowAddOptions(true);
            }}
          />
        </motion.div>

        {/* Stats Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <SectionHeader 
            title="Visão Geral" 
            subtitle="Seus números até agora"
            icon={<BarChart3 size={24} />}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard
              label="Concluídos"
              value={stats.completed}
              icon={<Award className="text-white" size={20} />}
              color="from-green-500 to-emerald-500"
            />
            <StatsCard
              label="Em Progresso"
              value={stats.inProgress}
              icon={<Clock className="text-white" size={20} />}
              color="from-blue-500 to-cyan-500"
            />
            <StatsCard
              label="Horas Totais"
              value={stats.totalHours}
              icon={<TrendingUp className="text-white" size={20} />}
              color="from-purple-500 to-violet-500"
            />
            <StatsCard
              label="Nota Média"
              value={stats.avgRating}
              icon={<Star className="text-white" size={20} />}
              color="from-yellow-500 to-orange-500"
            />
          </div>
        </motion.section>

        {/* Featured Reading */}
        {featuredItem && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <SectionHeader 
              title="Destaque da Biblioteca" 
              subtitle="Sua última grande experiência"
              icon={<Award size={24} />}
            />
            <FeaturedMediaCard
              item={featuredItem}
              onEdit={navigateToEditMedia}
              onDelete={handleDeleteItem}
            />
          </motion.section>
        )}

        {/* Recent Reading */}
        {recentItems.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <SectionHeader 
              title="Adicionados Recentemente" 
              subtitle="Suas últimas descobertas"
              icon={<Clock size={24} />}
              action={
                <button className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-sm">
                  Ver todos <ChevronRight size={16} />
                </button>
              }
            />
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {recentItems.map((item, idx) => (
                <motion.div
                  key={item?.id ? String(item.id) : `recent-${idx}`}
                  className="flex-shrink-0 w-36"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <div className="relative group">
                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="absolute z-10 top-2 right-2 p-1 rounded-lg bg-black/60 hover:bg-black/80 border border-white/20 text-white/90 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                    <RadiantMediaCard
                      title={item.title}
                      imageUrl={getItemImage(item)}
                      kind={item.type as any}
                      genre={(item as any)?.genre}
                      onClick={() => navigateToEditMedia(item)}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Categories Section */}
        {categories.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <SectionHeader 
              title="Categorias" 
              subtitle="Explore por tipo de mídia"
              icon={<Grid size={24} />}
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((category, idx) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedType(category.id as MediaType)}
                  className={`p-4 rounded-2xl bg-gradient-to-br ${category.color} bg-opacity-20 backdrop-blur border border-white/20 text-white hover:scale-105 transition-transform`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <div className="text-2xl font-bold">{category.count}</div>
                  <div className="text-sm opacity-90">{category.label}</div>
                </motion.button>
              ))}
            </div>
          </motion.section>
        )}

        {/* Popular/Highly Rated */}
        {popularItems.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <SectionHeader 
              title="Populares" 
              subtitle="Seus favoritos mais bem avaliados"
              icon={<TrendingUp size={24} />}
              action={
                <button className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-sm">
                  Ver todos <ChevronRight size={16} />
                </button>
              }
            />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {popularItems.map((item, idx) => (
                <motion.div
                  key={item?.id ? String(item.id) : `popular-${idx}`}
                  className="relative group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <button
                    onClick={() => handleDeleteItem(item)}
                    className="absolute z-10 top-2 right-2 p-1 rounded-lg bg-black/60 hover:bg-black/80 border border-white/20 text-white/90 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                  <RadiantMediaCard
                    title={item.title}
                    imageUrl={getItemImage(item)}
                    kind={item.type as any}
                    genre={(item as any)?.genre}
                    onClick={() => navigateToEditMedia(item)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* All Items Section with Search/Filter */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <SectionHeader 
            title="Toda a Biblioteca" 
            subtitle="Busque e filtre sua coleção completa"
            icon={<BookOpen size={24} />}
          />

          {/* Search and Filters */}
          <div className="space-y-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
              <div className="flex-1 max-w-2xl">
                <GlassInput
                  placeholder="Buscar por título ou tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClear={() => setSearchQuery('')}
                  variant="search"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <GlassSelect
                  options={sortOptions}
                  value={sortBy}
                  onChange={(v) => setSortBy(v as any)}
                  placeholder="Ordenar por"
                />
                <GlassSelect
                  options={statusOptions}
                  value={selectedStatus}
                  onChange={(v) => setSelectedStatus(v as any)}
                  placeholder="Status"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white/80">{filteredAndSortedItems.length} itens encontrados</span>
              <div className="flex gap-2">
                <motion.button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl ${viewMode === 'grid' ? 'bg-violet-500/30 border border-violet-400/50' : 'bg-white/5 border border-white/20'}`}
                  whileTap={{ scale: 0.95 }}
                >
                  <Grid size={18} />
                </motion.button>
                <motion.button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl ${viewMode === 'list' ? 'bg-violet-500/30 border border-violet-400/50' : 'bg-white/5 border border-white/20'}`}
                  whileTap={{ scale: 0.95 }}
                >
                  <List size={18} />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Erro de Conexão (se houver) */}
          {hasConnectionError && <ConnectivityError onRetry={handleRetryConnection} />}

          {/* Lista de mídias */}
          <AnimatePresence mode="popLayout">
            {filteredAndSortedItems.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
                    : 'grid grid-cols-1 gap-4'
                }
              >
                {filteredAndSortedItems.map((item, idx) => (
                  <motion.div
                    key={item?.id ? String(item.id) : `${item.type}-${item.title}-${idx}`}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="relative group"
                  >
                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="absolute z-10 top-2 right-2 p-1.5 rounded-xl bg-black/55 hover:bg-black/70 border border-white/20 text-white/90 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Excluir ${item.title}`}
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>

                    <RadiantMediaCard
                      title={item.title}
                      imageUrl={getItemImage(item)}
                      kind={item.type as any}
                      genre={(item as any)?.genre}
                      onClick={() => navigateToEditMedia(item)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center py-16 text-center"
              >
                <Search className="text-white/40 mb-4" size={28} />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {debouncedSearchQuery ? 'Nenhum resultado encontrado' : 'Sua biblioteca está vazia'}
                </h3>
                <p className="text-white/60 mb-6">
                  {debouncedSearchQuery
                    ? 'Tente ajustar a busca e os filtros'
                    : 'Comece adicionando suas primeiras mídias'}
                </p>
                <button
                  onClick={() => {
                    window.scrollTo(0, 0);
                    setShowAddOptions(true);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-2xl"
                >
                  Adicionar Mídia
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Decorações */}
        <NeonOrnament type="corner" color="violet" size="small" opacity={0.3} />
        <NeonOrnament type="corner" color="cyan" size="small" opacity={0.3} />
      </div>

      {/* Modais */}
      <AnimatePresence>
        {showAddOptions && (
          <div
            className="fixed inset-0 z-[9999] grid place-items-center pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-label="Adicionar nova mídia"
          >
            <motion.div
              key="overlay-add"
              className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddOptions(false)}
            />
            <motion.div
              key="modal-add"
              className="relative pointer-events-auto w-full max-w-3xl max-h-[80vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, type: 'spring', damping: 24, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Adicionar Nova Mídia</h2>
                  <button
                    onClick={() => setShowAddOptions(false)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    aria-label="Fechar"
                  >
                    <X className="text-slate-300" size={20} />
                  </button>
                </div>

                <AddMediaOptions
                  onExternalResultSelect={handleExternalResultSelect}
                  onManualAdd={() => {
                    navigateToAddMedia();
                    setShowAddOptions(false);
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {selectedExternalResult && (
        <AddMediaFromSearchModal
          selectedResult={selectedExternalResult}
          onAdd={handleAddFromSearch}
          onClose={() => setSelectedExternalResult(null)}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Excluir Item"
        message={
          itemToDelete
            ? `Vai apagar "${itemToDelete.title}" mesmo? Essa ação não pode ser desfeita!`
            : ''
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setItemToDelete(null);
        }}
      />
    </div>
  );
};

export default ModernLibrary;
