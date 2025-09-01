import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Grid3X3, 
  List, 
  Filter, 
  SlidersHorizontal,
  ChevronRight,
  Trash2,
  Edit3,
  MoreHorizontal,
  Sparkles,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';

import { useAppContext } from '../context/AppContext';
import { MediaType, Status } from '../App';
import type { MediaItem } from '../App';

import { useToast } from '../context/ToastContext';
import useDebounce from '../hooks/useDebounce';

// New Futuristic Components
import { FuturisticMediaCard } from './FuturisticMediaCard';
import { FuturisticHero } from './FuturisticHero';

// Services and Modals
import { ConnectivityError } from './ConnectivityError';
import { AddMediaOptions } from './AddMediaOptions';
import { AddMediaFromSearchModal } from './modals/AddMediaFromSearchModal';
import { MediaDetailModal } from './modals/MediaDetailModal';
import { ConfirmationModal } from './ConfirmationModal';
import { ExternalMediaResult } from '../services/externalMediaService';
import { useImprovedScrollLock } from '../hooks/useImprovedScrollLock';
import { sampleMediaData } from '../data/sampleMediaData';

const statusOptions = [
  { value: 'all', label: 'Todos os Status' },
  { value: 'completed', label: 'Concluído' },
  { value: 'in-progress', label: 'Em Progresso' },
  { value: 'planned', label: 'Planejado' },
  { value: 'dropped', label: 'Abandonado' },
];

const sortOptions = [
  { value: 'updatedAt', label: 'Recentemente Atualizados' },
  { value: 'title', label: 'Título (A-Z)' },
  { value: 'rating', label: 'Melhor Avaliados' },
  { value: 'hoursSpent', label: 'Mais Tempo Gasto' },
];

const typeOptions = [
  { value: 'all', label: 'Todos os Tipos' },
  { value: 'game', label: 'Jogos' },
  { value: 'movie', label: 'Filmes' },
  { value: 'tv', label: 'Séries' },
  { value: 'book', label: 'Livros' },
  { value: 'anime', label: 'Animes' },
  { value: 'manga', label: 'Mangás' },
];

// Modern Section Header Component
const FuturisticSectionHeader: React.FC<{
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  count?: number;
}> = ({ title, subtitle, icon, action, count }) => (
  <motion.div 
    className="flex items-center justify-between mb-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="flex items-center gap-4">
      {icon && (
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          {icon}
        </div>
      )}
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          {count !== undefined && (
            <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full text-sm font-semibold">
              {count}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-slate-500 dark:text-slate-400 text-base mt-1 font-medium">{subtitle}</p>
        )}
      </div>
    </div>
    {action}
  </motion.div>
);

const ModernLibrary: React.FC = () => {
  const {
    mediaItems: rawMediaItems,
    setMediaItems,
    navigateToAddMedia,
    navigateToEditMedia,
    deleteMedia,
  } = useAppContext() as any;

  const { showError, showSuccess } = useToast();

  // Use sample data if no real data exists (for development/demo)
  const mediaItems = rawMediaItems?.length > 0 ? rawMediaItems : sampleMediaData;

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
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useImprovedScrollLock(showAddOptions || !!selectedExternalResult || showDeleteConfirm || !!selectedItem);

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
      .slice(0, 3);
  }, [mediaItems]);

  // Recently added items
  const recentItems = useMemo(() => {
    return [...mediaItems]
      .sort((a: MediaItem, b: MediaItem) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 8);
  }, [mediaItems]);

  // Currently watching/reading
  const currentlyActive = useMemo(() => {
    return mediaItems.filter((item: MediaItem) => item.status === 'in-progress').slice(0, 6);
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
      showSuccess('Media added successfully!');
    } catch {
      showError('Error adding media');
    } finally {
      setSelectedExternalResult(null);
    }
  }, [mediaItems, setMediaItems, showSuccess, showError]);

  const handleDeleteItem = useCallback((item: MediaItem) => {
    if (!item?.id || typeof item.id !== 'string' || item.id.trim() === '') {
      showError('Invalid item ID.');
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
      showSuccess('Item removed successfully!');
      setHasConnectionError(false);
    } catch (err: any) {
      if (err?.message?.includes('fetch') || err?.message?.includes('network') || err?.name === 'TypeError') {
        setHasConnectionError(true);
        showError('Connection error');
      } else {
        showError('Error removing media');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-100/20 to-cyan-100/20 dark:from-blue-950/10 dark:to-cyan-950/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-violet-100/20 to-purple-100/20 dark:from-violet-950/10 dark:to-purple-950/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Hero Section */}
        <FuturisticHero
          title="Media Library"
          subtitle="Your personal collection, beautifully organized and easily accessible"
          stats={stats}
          onAddMedia={() => setShowAddOptions(true)}
          onSearch={setSearchQuery}
          searchQuery={searchQuery}
        />

        {/* Connection Error */}
        {hasConnectionError && <ConnectivityError onRetry={handleRetryConnection} />}

        {/* Featured Items */}
        {featuredItems.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <FuturisticSectionHeader
              title="Destaques"
              subtitle="Seus conteúdos mais bem avaliados e recentes"
              icon={<Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
              count={featuredItems.length}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredItems.map((item, idx) => (
                <motion.div
                  key={item?.id ? String(item.id) : `featured-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group"
                >
                  {/* Action Menu */}
                  <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl p-2 flex gap-2 border border-slate-200/50 dark:border-slate-700/50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToEditMedia(item);
                        }}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-400 transition-colors duration-200"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(item);
                        }}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <FuturisticMediaCard
                    title={item.title}
                    imageUrl={getItemImage(item)}
                    type={item.type}
                    status={item.status}
                    rating={item.rating}
                    onClick={() => setSelectedItem(item)}
                    variant="featured"
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Currently Active */}
        {currentlyActive.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <FuturisticSectionHeader
              title="Continue Assistindo"
              subtitle="Continue de onde parou"
              icon={<Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
              count={currentlyActive.length}
            />
            
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {currentlyActive.map((item, idx) => (
                <motion.div
                  key={item?.id ? String(item.id) : `active-${idx}`}
                  className="flex-shrink-0 w-48 relative group"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {/* Action Menu */}
                  <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-1.5 flex gap-1 border border-slate-200/50 dark:border-slate-700/50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToEditMedia(item);
                        }}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(item);
                        }}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <FuturisticMediaCard
                    title={item.title}
                    imageUrl={getItemImage(item)}
                    type={item.type}
                    status={item.status}
                    rating={item.rating}
                    onClick={() => setSelectedItem(item)}
                    variant="compact"
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Filters and View Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-6"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Filters Toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-medium transition-all duration-300 ${
                  showFilters
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filtros</span>
              </button>
              
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {filteredAndSortedItems.length} itens encontrados
              </span>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-2xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
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
                className="border-t border-slate-200/50 dark:border-slate-700/50 pt-6 mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Tipo
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as MediaType | 'all')}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-slate-700/60 border border-slate-200/50 dark:border-slate-600/50 rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                  >
                    {typeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as Status | 'all')}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-slate-700/60 border border-slate-200/50 dark:border-slate-600/50 rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Ordenar Por
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-slate-700/60 border border-slate-200/50 dark:border-slate-600/50 rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
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
        </motion.div>

        {/* All Items */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <FuturisticSectionHeader
            title="Todos os Itens"
            subtitle="Sua coleção completa de mídia"
            icon={<TrendingUp className="w-6 h-6 text-slate-600 dark:text-slate-400" />}
            count={filteredAndSortedItems.length}
          />
          
          <AnimatePresence mode="popLayout">
            {filteredAndSortedItems.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'
                    : 'grid grid-cols-1 gap-4'
                }
              >
                {filteredAndSortedItems.map((item, idx) => (
                  <motion.div
                    key={item?.id ? String(item.id) : `all-${idx}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="relative group"
                  >
                    {/* Action Menu */}
                    <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-1.5 flex gap-1 border border-slate-200/50 dark:border-slate-700/50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToEditMedia(item);
                          }}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item);
                          }}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <FuturisticMediaCard
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
                className="text-center py-20"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center">
                    <TrendingUp className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                    {debouncedSearchQuery ? 'Nenhum resultado encontrado' : 'Sua biblioteca está vazia'}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                    {debouncedSearchQuery
                      ? 'Tente ajustar os termos de busca ou filtros'
                      : 'Comece construindo sua coleção adicionando seu primeiro item'}
                  </p>
                  <button
                    onClick={() => setShowAddOptions(true)}
                    className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    Adicionar Primeiro Item
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddOptions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Adicionar Nova Mídia
                  </h2>
                  <button
                    onClick={() => setShowAddOptions(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-500 dark:text-slate-400 transition-colors duration-200"
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
