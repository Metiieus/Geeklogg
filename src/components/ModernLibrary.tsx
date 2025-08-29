// ModernLibrary.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid, List, X, Trash2 } from 'lucide-react';

import { useAppContext } from '../context/AppContext';
import { MediaType, Status } from '../App';
import type { MediaItem } from '../App';

import { useToast } from '../context/ToastContext';
import useDebounce from '../hooks/useDebounce';

// Design System
import { HeroBanner } from '../design-system/components/HeroBanner';
// import { MediaCard } from '../design-system/components/MediaCard';
import { RadiantMediaCard } from '../design-system/components/RadiantMediaCard';
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
  { value: 'updatedAt', label: '🕐 Mais Recentes' }, // corrigido
  { value: 'title', label: '🔤 A-Z' },
  { value: 'rating', label: '⭐ Avaliação' },
  { value: 'hoursSpent', label: '⏱️ Mais Horas' },
];

const ModernLibrary: React.FC = () => {
  const {
    mediaItems,
    setMediaItems,
    navigateToAddMedia,
    navigateToEditMedia,
    deleteMedia, // opcional no seu contexto
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

  const filterOptions = useMemo(() => {
    const typeCounts = mediaItems.reduce((acc: Record<string, number>, item: MediaItem) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});
    return [
      { id: 'all', label: 'Todos', count: mediaItems.length },
      { id: 'games', label: 'Jogos', count: typeCounts.games || 0 },
      { id: 'anime', label: 'Anime', count: typeCounts.anime || 0 },
      { id: 'series', label: 'Séries', count: typeCounts.series || 0 },
      { id: 'books', label: 'Livros', count: typeCounts.books || 0 },
      { id: 'movies', label: 'Filmes', count: typeCounts.movies || 0 },
    ];
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
      <FloatingParticles count={8} color="cyan" />

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

        {/* Busca e filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-6"
        >
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

          <GlassFilterBar
            options={filterOptions}
            selected={selectedType === 'all' ? [] : [selectedType]}
            onChange={(selected) =>
              setSelectedType(selected.length > 0 ? (selected[0] as MediaType) : 'all')
            }
          />
        </motion.div>

        {/* Cabeçalho de resultados */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-col sm:flex-row sm:justify-between gap-4"
        >
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
        </motion.div>

        {/* Erro de Conexão (se houver) */}
        {hasConnectionError && <ConnectivityError onRetry={handleRetryConnection} />}

        {/* Lista de mídias */}
        <AnimatePresence mode="popLayout">
          {filteredAndSortedItems.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                  : 'grid grid-cols-1 gap-4' /* mantém “list” simples mas bonito */
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
                  className="relative"
                >
                  {/* Botão de deletar (overlay) */}
                  <button
                    onClick={() => handleDeleteItem(item)}
                    className="absolute z-10 top-2 right-2 p-1.5 rounded-xl bg-black/55 hover:bg-black/70 border border-white/20 text-white/90"
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
