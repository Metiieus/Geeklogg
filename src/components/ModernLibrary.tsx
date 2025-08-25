import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, Grid, List, SortAsc } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MediaType, Status } from '../App';
import type { MediaItem } from '../App';
import { useToast } from '../context/ToastContext';

// Design System Components
import { HeroBanner } from '../design-system/components/HeroBanner';
import { MediaCard } from '../design-system/components/MediaCard';
import { GlassInput, GlassSelect, GlassFilterBar } from '../design-system/components/GlassInput';
import { GlassNavigation, mediaTypeItems } from '../design-system/components/GlassNavigation';
import { TribalDivider, NeonOrnament, FloatingParticles } from '../design-system/components/NeonPatterns';

// Design System Tokens
import { colors, gradients, shadows, animations, getCategoryColors } from '../design-system/tokens';

// Existing services
import { ConnectivityError } from './ConnectivityError';
import { AddMediaFromSearchModal } from './modals/AddMediaFromSearchModal';
import { AddMediaOptions } from './AddMediaOptions';
import { ExternalMediaResult } from '../services/externalMediaService';
import { deleteMedia } from '../services/mediaService';
import { ConfirmationModal } from './ConfirmationModal';

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
  { value: 'rating', label: '��� Avaliação' },
  { value: 'hoursSpent', label: '⏱️ Mais Horas' },
];

const ModernLibrary: React.FC = () => {
  const { mediaItems, setMediaItems, navigateToAddMedia, navigateToEditMedia } = useAppContext();
  const { showError, showSuccess } = useToast();

  // State
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

  // Filtered and sorted items
  const filteredAndSortedItems = useMemo(() => {
    // Filtrar itens duplicados por ID como medida preventiva
    const uniqueItems = mediaItems.filter((item, index, arr) =>
      arr.findIndex(i => i.id === item.id) === index
    );
    let filtered = uniqueItems;

    if (selectedType !== "all") {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((item) => item.status === selectedStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

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

  // Filter options for categories
  const filterOptions = useMemo(() => {
    const typeCounts = mediaItems.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { id: 'all', label: 'Todos', count: mediaItems.length },
      { id: 'games', label: 'Jogos', count: typeCounts.games || 0 },
      { id: 'anime', label: 'Anime', count: typeCounts.anime || 0 },
      { id: 'series', label: 'Séries', count: typeCounts.series || 0 },
      { id: 'books', label: 'Livros', count: typeCounts.books || 0 },
      { id: 'movies', label: 'Filmes', count: typeCounts.movies || 0 },
    ];
  }, [mediaItems]);

  // Event handlers
  const handleDeleteItem = useCallback((item: MediaItem) => {
    if (!item.id || typeof item.id !== "string" || item.id.trim() === "") {
      showError('Erro', 'ID do item é inválido. Não é possível excluir este item.');
      return;
    }

    setItemToDelete(item);
    setShowDeleteConfirm(true);
  }, [showError]);

  const confirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      await deleteMedia(itemToDelete.id);
      setMediaItems(mediaItems.filter(mediaItem => mediaItem.id !== itemToDelete.id));
      showSuccess('Item removido com sucesso!');
      setHasConnectionError(false); // Reset error state on success
    } catch (err: any) {
      console.error('Erro ao excluir mídia', err);

      // Check if it's a connectivity error
      if (err.message?.includes('fetch') || err.message?.includes('network') || err.name === 'TypeError') {
        setHasConnectionError(true);
        showError('Erro de Conectividade', 'Verifique sua conexão com a internet e tente novamente.');
      } else {
        showError('Erro ao remover mídia', err.message || 'Não foi possível excluir o item');
      }
    } finally {
      setItemToDelete(null);
      setShowDeleteConfirm(false);
    }
  }, [itemToDelete, mediaItems, setMediaItems, showSuccess, showError]);

  const handleEditItem = useCallback((updatedItem: MediaItem) => {
    setMediaItems(
      mediaItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item,
      ),
    );
  }, [mediaItems, setMediaItems]);

  const handleExternalResultSelect = useCallback((result: ExternalMediaResult) => {
    setSelectedExternalResult(result);
    setShowAddOptions(false);
  }, []);

  const handleAddFromSearch = useCallback((newItem: MediaItem) => {
    setMediaItems([...mediaItems, newItem]);
    setSelectedExternalResult(null);
  }, [mediaItems, setMediaItems]);

  const handleRetryConnection = useCallback(() => {
    setHasConnectionError(false);
    // Reload the page to reinitialize connections
    window.location.reload();
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Floating Particles Background */}
      <FloatingParticles count={8} color="cyan" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <HeroBanner
            title="Minha Biblioteca"
            subtitle="Organize sua jornada geek com estilo e inteligência"
            onAddMedia={() => {
              // FORÇA scroll para topo ANTES de abrir modal
              window.scrollTo(0, 0);
              setShowAddOptions(true);
            }}
          />
        </motion.div>

        {/* Tribal Divider */}
        <TribalDivider variant="complex" color="cyan" />

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-center">
            <div className="flex-1 max-w-2xl">
              <GlassInput
                placeholder="Buscar por título ou tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                variant="search"
                className="w-full"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:flex-shrink-0">
              <GlassSelect
                options={sortOptions}
                value={sortBy}
                onChange={(value) => setSortBy(value as any)}
                placeholder="Ordenar por"
                className="min-w-0 sm:min-w-[140px] lg:min-w-[160px]"
              />

              <GlassSelect
                options={statusOptions}
                value={selectedStatus}
                onChange={(value) => setSelectedStatus(value as any)}
                placeholder="Status"
                className="min-w-0 sm:min-w-[140px] lg:min-w-[160px]"
              />
            </div>
          </div>

          {/* Filter Bar */}
          <GlassFilterBar
            options={filterOptions}
            selected={selectedType === 'all' ? [] : [selectedType]}
            onChange={(selected) => setSelectedType(selected.length > 0 ? selected[0] as MediaType : 'all')}
          />
        </motion.div>

        {/* Results and View Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <span className="text-white/80 text-lg">
              {filteredAndSortedItems.length} itens encontrados
            </span>
            
            {selectedType !== 'all' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 px-3 py-1 rounded-full border"
                style={{
                  background: getCategoryColors(selectedType as MediaType).background,
                  borderColor: getCategoryColors(selectedType as MediaType).border,
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getCategoryColors(selectedType as MediaType).primary }}
                />
                <span className="text-white text-sm font-medium capitalize">
                  {selectedType}
                </span>
              </motion.div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-violet-500/30 text-violet-400 border border-violet-400/50'
                  : 'bg-white/5 text-white/60 border border-white/20 hover:bg-white/10'
              }`}
            >
              <Grid size={20} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-violet-500/30 text-violet-400 border border-violet-400/50'
                  : 'bg-white/5 text-white/60 border border-white/20 hover:bg-white/10'
              }`}
            >
              <List size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Connectivity Error */}
        {hasConnectionError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <ConnectivityError onRetry={handleRetryConnection} />
          </motion.div>
        )}

        {/* Media Grid */}
        <AnimatePresence mode="wait">
          {filteredAndSortedItems.length > 0 ? (
            <motion.div
              key={`${viewMode}-${selectedType}-${selectedStatus}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8'
                  : 'flex flex-col gap-4'
              }
            >
              {filteredAndSortedItems.map((item, index) => (
                <motion.div
                  key={`${item.id}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <MediaCard
                    item={{
                      ...item,
                      synopsis: item.description,
                    } as any}
                    onEdit={navigateToEditMedia}
                    onDelete={handleDeleteItem}
                    variant={viewMode === 'list' ? 'compact' : 'default'}
                    className={viewMode === 'list' ? 'flex-row h-32' : ''}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mb-6 border border-white/10"
              >
                <Search className="text-white/40" size={32} />
              </motion.div>
              
              <h3 className="text-2xl font-semibold text-white mb-2">
                Nenhum item encontrado
              </h3>
              
              <p className="text-white/60 mb-8 max-w-md">
                Tente ajustar sua busca ou filtros, ou adicione novos itens à sua biblioteca
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // FORÇA scroll para topo ANTES de abrir modal
                  window.scrollTo(0, 0);
                  setShowAddOptions(true);
                }}
                className="px-8 py-4 bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl"
                style={{ boxShadow: shadows.glow.violet }}
              >
                Adicionar Primeiro Item
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative Ornaments */}
        <div className="absolute top-20 left-10 pointer-events-none">
          <NeonOrnament type="corner" color="violet" size="small" opacity={0.3} />
        </div>
        
        <div className="absolute bottom-20 right-10 pointer-events-none">
          <NeonOrnament type="corner" color="cyan" size="small" opacity={0.3} />
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddOptions && (
          <motion.div
            key="add-options-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bg-black/70"
            style={{
              zIndex: 9999,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 0 }}
              className="bg-slate-800 rounded-2xl border border-white/20 w-full max-w-4xl p-6 relative"
              style={{
                maxHeight: 'calc(100vh - 2rem)',
                overflow: 'auto',
                maxWidth: 'calc(100vw - 2rem)',
                margin: 'auto'
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Adicionar Nova Mídia
                </h2>
                <button
                  onClick={() => setShowAddOptions(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Plus className="text-slate-400 rotate-45" size={20} />
                </button>
              </div>

              <AddMediaOptions
                onExternalResultSelect={handleExternalResultSelect}
                onManualAdd={() => {
                  navigateToAddMedia();
                  setShowAddOptions(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}



        {selectedExternalResult && (
          <AddMediaFromSearchModal
            key="external-result-modal"
            externalResult={selectedExternalResult}
            onClose={() => setSelectedExternalResult(null)}
            onSave={handleAddFromSearch}
          />
        )}



        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteConfirm}
          title="Excluir Item"
          message={itemToDelete ? `Vai apagar "${itemToDelete.title}" mesmo? 🗑️\n\nEssa aç��o não pode ser desfeita!` : ''}
          confirmText="Excluir"
          cancelText="Cancelar"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setItemToDelete(null);
          }}
        />
      </AnimatePresence>
    </div>
  );
};

export default ModernLibrary;
