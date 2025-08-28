/* ModernLibrary.tsx - Corrigido para centralizar o modal corretamente */

// Imports (mantidos iguais ao original)
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Grid, List } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MediaType, Status } from '../App';
import type { MediaItem } from '../App';
import { useToast } from '../context/ToastContext';
import useDebounce from '../hooks/useDebounce';

import { HeroBanner } from '../design-system/components/HeroBanner';
import { MediaCard } from '../design-system/components/MediaCard';
import { GlassInput, GlassSelect, GlassContainer } from '../design-system/components/GlassInput';
import { TribalDivider, NeonOrnament, FloatingParticles } from '../design-system/components/NeonPatterns';

import { ConnectivityError } from './ConnectivityError';
import { AddMediaFromSearchModal } from './modals/AddMediaFromSearchModal';
import { AddMediaOptions } from './AddMediaOptions';
import { ExternalMediaResult } from '../services/externalMediaService';
import { deleteMedia } from '../services/mediaService';
import { ConfirmationModal } from './ConfirmationModal';
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

const ModernLibrary: React.FC = () => {
  const { mediaItems, setMediaItems, navigateToAddMedia, navigateToEditMedia } = useAppContext();
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
  useImprovedScrollLock(showAddOptions || !!selectedExternalResult);

  const filteredAndSortedItems = useMemo(() => {
    const uniqueItems = mediaItems.filter((item, index, arr) => arr.findIndex(i => i.id === item.id) === index);
    let filtered = uniqueItems;

    if (selectedType !== 'all') filtered = filtered.filter((item) => item.type === selectedType);
    if (selectedStatus !== 'all') filtered = filtered.filter((item) => item.status === selectedStatus);

    if (debouncedSearchQuery) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title': return a.title.localeCompare(b.title);
        case 'rating': return (b.rating || 0) - (a.rating || 0);
        case 'hoursSpent': return (b.hoursSpent || 0) - (a.hoursSpent || 0);
        default: return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    return filtered;
  }, [mediaItems, selectedType, selectedStatus, debouncedSearchQuery, sortBy]);

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
      setHasConnectionError(false);
    } catch (err: any) {
      console.error('Erro ao excluir mídia', err);
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

  const handleExternalResultSelect = useCallback((result: ExternalMediaResult) => {
    setSelectedExternalResult(result);
    setShowAddOptions(false);
  }, []);

  const handleAddFromSearch = useCallback((newItem: MediaItem) => {
    setMediaItems([...mediaItems, newItem]);
    setSelectedExternalResult(null);
  }, [mediaItems, setMediaItems]);

  return (
    <div className="relative overflow-hidden">
      <FloatingParticles count={8} color="cyan" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <HeroBanner
            title="Minha Biblioteca"
            subtitle="Organize sua jornada geek com estilo e inteligência"
            onAddMedia={() => {
              window.scrollTo(0, 0);
              setShowAddOptions(true);
            }}
          />
        </motion.div>
        <TribalDivider variant="complex" color="cyan" />

        {/* Barra de Filtros e Controles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <GlassContainer className="p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
              <div className="flex-1">
                <GlassInput
                  icon={Search}
                  placeholder="Buscar por título ou tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <GlassSelect
                  value={selectedType}
                  onChange={(value) => setSelectedType(value as MediaType | 'all')}
                  options={[
                    { value: 'all', label: 'Todos os Tipos' },
                    { value: 'anime', label: '🎭 Anime' },
                    { value: 'series', label: '📺 Séries' },
                    { value: 'games', label: '🎮 Games' },
                    { value: 'movies', label: '🎬 Filmes' },
                    { value: 'books', label: '📖 Livros' },
                  ]}
                />
                <GlassSelect
                  value={selectedStatus}
                  onChange={(value) => setSelectedStatus(value as Status | 'all')}
                  options={statusOptions}
                />
                <GlassSelect
                  value={sortBy}
                  onChange={(value) => setSortBy(value as 'title' | 'rating' | 'hoursSpent' | 'updatedAt')}
                  options={sortOptions}
                />
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
          </GlassContainer>
        </motion.div>

        {/* Grade de Mídias */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {hasConnectionError && <ConnectivityError />}

          {filteredAndSortedItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <NeonOrnament variant="circle" color="cyan" className="mx-auto mb-6" />
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
                  onClick={() => setShowAddOptions(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                >
                  <Plus size={20} />
                  Adicionar Primeira Mídia
                </button>
              )}
            </motion.div>
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
                      onDelete={() => handleDeleteItem(item)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Modais */}
        <AnimatePresence>
          {showAddOptions && (
            <>
              <motion.div
                key="add-options-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
                onClick={() => setShowAddOptions(false)}
              />
              <motion.div
                key="add-options-content"
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-2xl max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-slate-800 rounded-2xl border border-white/20 w-full p-6">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Adicionar Nova Mídia</h2>
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
                </div>
              </motion.div>
            </>
          )}

          {selectedExternalResult && (
            <AddMediaFromSearchModal
              selectedResult={selectedExternalResult}
              onAdd={handleAddFromSearch}
              onClose={() => setSelectedExternalResult(null)}
            />
          )}

          {showDeleteConfirm && itemToDelete && (
            <ConfirmationModal
              isOpen={showDeleteConfirm}
              onConfirm={confirmDelete}
              onCancel={() => {
                setShowDeleteConfirm(false);
                setItemToDelete(null);
              }}
              title="Confirmar Exclusão"
              message={`Tem certeza que deseja excluir "${itemToDelete.title}"? Esta ação não pode ser desfeita.`}
              confirmText="Excluir"
              confirmVariant="danger"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernLibrary;
