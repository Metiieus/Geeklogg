import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Plus, 
  ChevronRight,
  MoreHorizontal,
  Trash2,
  Edit3,
  Star,
  TrendingUp,
  Clock,
  BarChart3
} from 'lucide-react';

import { useAppContext } from '../context/AppContext';
import { MediaType, Status } from '../App';
import type { MediaItem } from '../App';

import { useToast } from '../context/ToastContext';
import useDebounce from '../hooks/useDebounce';

// Components
import { MinimalistMediaCard } from './MinimalistMediaCard';
import { MinimalistHeroBanner } from '../design-system/components/MinimalistHeroBanner';
import { ConnectivityError } from './ConnectivityError';
import { AddMediaOptions } from './AddMediaOptions';
import { AddMediaFromSearchModal } from './modals/AddMediaFromSearchModal';
import { ConfirmationModal } from './ConfirmationModal';
import { ExternalMediaResult } from '../services/externalMediaService';
import { useImprovedScrollLock } from '../hooks/useImprovedScrollLock';
import { sampleMediaData } from '../data/sampleMediaData';

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'completed', label: 'Concluídos' },
  { value: 'in-progress', label: 'Em Progresso' },
  { value: 'planned', label: 'Planejados' },
  { value: 'dropped', label: 'Abandonados' },
];

const sortOptions = [
  { value: 'updatedAt', label: 'Mais Recentes' },
  { value: 'title', label: 'Título (A-Z)' },
  { value: 'rating', label: 'Melhor Avaliados' },
  { value: 'hoursSpent', label: 'Mais Tempo' },
];

const typeOptions = [
  { value: 'all', label: 'Todos os Tipos' },
  { value: 'game', label: 'Jogos' },
  { value: 'movie', label: 'Filmes' },
  { value: 'tv', label: 'Séries' },
  { value: 'book', label: 'Livros' },
  { value: 'anime', label: 'Anime' },
  { value: 'manga', label: 'Mangá' },
];

// Section Header Component
const SectionHeader: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  count?: number;
}> = ({ title, subtitle, action, count }) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        {count !== undefined && (
          <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-lg text-sm font-medium">
            {count}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{subtitle}</p>
      )}
    </div>
    {action}
  </div>
);

// Quick Stats Component
const QuickStats: React.FC<{ stats: any }> = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
          <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{stats.total}</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Em Progresso</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{stats.inProgress}</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
          <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Concluídos</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{stats.completed}</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <Star className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Média</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{stats.avgRating}</p>
        </div>
      </div>
    </div>
  </div>
);

const ModernLibrary: React.FC = () => {
  const {
    mediaItems: rawMediaItems,
    setMediaItems,
    navigateToAddMedia,
    navigateToEditMedia,
    deleteMedia,
  } = useAppContext() as any;

  // Use sample data if no real data exists (for development/demo)
  const mediaItems = rawMediaItems?.length > 0 ? rawMediaItems : sampleMediaData;

  const { showError, showSuccess } = useToast();

  // State
  const [selectedType, setSelectedType] = useState<MediaType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<Status | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'rating' | 'hoursSpent' | 'updatedAt'>('updatedAt');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Modals
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [selectedExternalResult, setSelectedExternalResult] = useState<ExternalMediaResult | null>(null);
  const [hasConnectionError, setHasConnectionError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MediaItem | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useImprovedScrollLock(showAddOptions || !!selectedExternalResult || showDeleteConfirm);

  // Statistics
  const stats = useMemo(() => {
    const total = mediaItems.length;
    const completed = mediaItems.filter((item: MediaItem) => item.status === 'completed').length;
    const inProgress = mediaItems.filter((item: MediaItem) => item.status === 'in-progress').length;
    const ratedItems = mediaItems.filter((item: MediaItem) => item.rating && item.rating > 0);
    const avgRating = ratedItems.length > 0 
      ? (ratedItems.reduce((acc: number, item: MediaItem) => acc + (item.rating || 0), 0) / ratedItems.length).toFixed(1)
      : '0.0';

    return { total, completed, inProgress, avgRating };
  }, [mediaItems]);

  // Featured items (recent and highly rated)
  const featuredItems = useMemo(() => {
    return [...mediaItems]
      .filter((item: MediaItem) => item.rating && item.rating >= 4)
      .sort((a: MediaItem, b: MediaItem) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 6);
  }, [mediaItems]);

  // Recent additions
  const recentItems = useMemo(() => {
    return [...mediaItems]
      .sort((a: MediaItem, b: MediaItem) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 12);
  }, [mediaItems]);

  // Filtered and sorted items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...mediaItems];

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

  // Helper functions
  const getItemImage = (item: MediaItem) => item.cover || "";

  // Handlers
  const handleExternalResultSelect = useCallback((result: ExternalMediaResult) => {
    setSelectedExternalResult(result);
    setShowAddOptions(false);
  }, []);

  const handleAddFromSearch = useCallback((newItem: MediaItem) => {
    try {
      setMediaItems([...mediaItems, newItem]);
      showSuccess('Mídia adicionada com sucesso!');
    } catch {
      showError('Erro ao adicionar mídia');
    } finally {
      setSelectedExternalResult(null);
    }
  }, [mediaItems, setMediaItems, showSuccess, showError]);

  const handleDeleteItem = useCallback((item: MediaItem) => {
    if (!item?.id || typeof item.id !== 'string' || item.id.trim() === '') {
      showError('ID do item inválido.');
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
        showError('Erro de conectividade');
      } else {
        showError('Erro ao remover mídia');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 dark:bg-pink-800 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Banner */}
        <MinimalistHeroBanner
          title="Minha Biblioteca"
          subtitle="Organize e acompanhe sua jornada através dos seus conteúdos favoritos"
          onAddMedia={() => setShowAddOptions(true)}
          stats={stats}
        />

        {/* Additional Stats */}
        <QuickStats stats={stats} />

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por título, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 rounded-lg border font-medium transition-colors ${
                showFilters
                  ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>

            {/* View Mode */}
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2.5 ${
                  viewMode === 'grid'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                    : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2.5 border-l border-gray-200 dark:border-gray-600 ${
                  viewMode === 'list'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                    : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as MediaType | 'all')}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100"
                  >
                    {typeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as Status | 'all')}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ordenar por
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Connection Error */}
        {hasConnectionError && <ConnectivityError onRetry={handleRetryConnection} />}

        {/* Featured Items */}
        {featuredItems.length > 0 && (
          <section className="mb-8">
            <SectionHeader
              title="Recomendados"
              subtitle="Seus favoritos e mais bem avaliados"
              count={featuredItems.length}
              action={
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 text-sm font-medium">
                  Ver todos <ChevronRight className="w-4 h-4" />
                </button>
              }
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {featuredItems.map((item, idx) => (
                <motion.div
                  key={item?.id ? String(item.id) : `featured-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group"
                >
                  {/* Action Menu */}
                  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToEditMedia(item);
                        }}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(item);
                        }}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <MinimalistMediaCard
                    title={item.title}
                    imageUrl={getItemImage(item)}
                    type={item.type}
                    status={item.status}
                    rating={item.rating}
                    onClick={() => navigateToEditMedia(item)}
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Recent Items */}
        {recentItems.length > 0 && (
          <section className="mb-8">
            <SectionHeader
              title="Adicionados Recentemente"
              subtitle="Suas últimas adições à biblioteca"
              count={recentItems.length}
            />
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {recentItems.map((item, idx) => (
                <motion.div
                  key={item?.id ? String(item.id) : `recent-${idx}`}
                  className="flex-shrink-0 w-40 relative group"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  {/* Action Menu */}
                  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToEditMedia(item);
                        }}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(item);
                        }}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <MinimalistMediaCard
                    title={item.title}
                    imageUrl={getItemImage(item)}
                    type={item.type}
                    status={item.status}
                    rating={item.rating}
                    onClick={() => navigateToEditMedia(item)}
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* All Items */}
        <section>
          <SectionHeader
            title="Todos os Itens"
            subtitle="Sua biblioteca completa"
            count={filteredAndSortedItems.length}
          />
          
          <AnimatePresence mode="popLayout">
            {filteredAndSortedItems.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'
                    : 'grid grid-cols-1 gap-3'
                }
              >
                {filteredAndSortedItems.map((item, idx) => (
                  <motion.div
                    key={item?.id ? String(item.id) : `all-${idx}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="relative group"
                  >
                    {/* Action Menu */}
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToEditMedia(item);
                          }}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item);
                          }}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <MinimalistMediaCard
                      title={item.title}
                      imageUrl={getItemImage(item)}
                      type={item.type}
                      status={item.status}
                      rating={item.rating}
                      onClick={() => navigateToEditMedia(item)}
                      className={viewMode === 'list' ? 'w-full' : ''}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {debouncedSearchQuery ? 'Nenhum resultado encontrado' : 'Sua biblioteca está vazia'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {debouncedSearchQuery
                      ? 'Tente ajustar seus filtros ou termos de busca'
                      : 'Comece adicionando suas primeiras mídias à sua biblioteca'}
                  </p>
                  <button
                    onClick={() => setShowAddOptions(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                  >
                    Adicionar Primeira Mídia
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddOptions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Adicionar Nova Mídia
                  </h2>
                  <button
                    onClick={() => setShowAddOptions(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400"
                  >
                    ×
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
        message={itemToDelete ? `Tem certeza que deseja excluir "${itemToDelete.title}"? Esta ação não pode ser desfeita.` : ''}
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
