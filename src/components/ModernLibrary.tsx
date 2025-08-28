import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Grid, List } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MediaType, Status } from '../App';
import type { MediaItem } from '../App';
import { useToast } from '../context/ToastContext';
import useDebounce from '../hooks/useDebounce';

// Design System Components
import { HeroBanner } from '../design-system/components/HeroBanner';
import { MediaCard } from '../design-system/components/MediaCard';
import { GlassInput, GlassSelect, GlassFilterBar } from '../design-system/components/GlassInput';
import { TribalDivider, NeonOrnament, FloatingParticles } from '../design-system/components/NeonPatterns';

// Tokens
import { shadows, getCategoryColors } from '../design-system/tokens';

// Services & Modals
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

  // Estados
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

  // Filtragem e ordenação
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

  // Opções de filtro por categoria
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

  // Handlers
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

  const handleEditItem = useCallback((updatedItem: MediaItem) => {
    setMediaItems(
      mediaItems.map((item) => item.id === updatedItem.id ? updatedItem : item)
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
    window.location.reload();
  }, []);

  return (
    <div className="relative overflow-hidden">
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
        <TribalDivider variant="complex" color="cyan" />

        {/* Search & Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
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
              <GlassSelect options={sortOptions} value={sortBy} onChange={(v) => setSortBy(v as any)} placeholder="Ordenar por" />
              <GlassSelect options={statusOptions} value={selectedStatus} onChange={(v) => setSelectedStatus(v as any)} placeholder="Status" />
            </div>
          </div>
          <GlassFilterBar
            options={filterOptions}
            selected={selectedType === 'all' ? [] : [selectedType]}
            onChange={(selected) => setSelectedType(selected.length > 0 ? selected[0] as MediaType : 'all')}
          />
        </motion.div>

        {/* Result header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.3 }} className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <span className="text-white/80">{filteredAndSortedItems.length} itens encontrados</span>
          <div className="flex gap-2">
            <motion.button onClick={() => setViewMode('grid')} className={`p-2 rounded-xl ${viewMode==='grid'?'bg-violet-500/30 border border-violet-400/50':'bg-white/5 border border-white/20'}`}>
              <Grid size={18}/>
            </motion.button>
            <motion.button onClick={() => setViewMode('list')} className={`p-2 rounded-xl ${viewMode==='list'?'bg-violet-500/30 border border-violet-400/50':'bg-white/5 border border-white/20'}`}>
              <List size={18}/>
            </motion.button>
          </div>
        </motion.div>

        {/* Connection error */}
        {hasConnectionError && <ConnectivityError onRetry={handleRetryConnection}/>}

        {/* Media list */}
        <AnimatePresence mode="wait">
          {filteredAndSortedItems.length > 0 ? (
            <div className={viewMode==='grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'flex flex-col gap-3'}>
              {filteredAndSortedItems.map((item) => (
                <MediaCard
                  key={item.id}
                  item={{ ...item, synopsis: item.description } as any}
                  onEdit={navigateToEditMedia}
                  onDelete={handleDeleteItem}
                  variant={viewMode==='list'?'compact':'default'}
                  className={viewMode==='list'?'flex-row h-32':''}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-16 text-center">
              <Search className="text-white/40 mb-4" size={28}/>
              <h3 className="text-xl font-semibold text-white mb-2">Nenhum item encontrado</h3>
              <p className="text-white/60 mb-6">Tente ajustar sua busca ou filtros, ou adicione novos itens à sua biblioteca</p>
              <button onClick={() => {window.scrollTo(0,0);setShowAddOptions(true)}} className="px-6 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-2xl">
                Adicionar Primeiro Item
              </button>
            </div>
          )}
        </AnimatePresence>

        {/* Decoração */}
        <NeonOrnament type="corner" color="violet" size="small" opacity={0.3}/>
        <NeonOrnament type="corner" color="cyan" size="small" opacity={0.3}/>
      </div>

      {/* Modais */}
      <AnimatePresence>
        {showAddOptions && (
          <>
            <motion.div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]" onClick={() => setShowAddOptions(false)}/>
            <motion.div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e)=>e.stopPropagation()}>
              <div className="bg-slate-800 rounded-2xl border border-white/20 p-6">
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Adicionar Nova Mídia</h2>
                  <button onClick={() => setShowAddOptions(false)}><Plus className="text-slate-400 rotate-45"/></button>
                </div>
                <AddMediaOptions
                  onExternalResultSelect={handleExternalResultSelect}
                  onManualAdd={() => {navigateToAddMedia();setShowAddOptions(false);}}
                />
              </div>
            </motion.div>
          </>
        )}

        {selectedExternalResult && (
          <AddMediaFromSearchModal
            externalResult={selectedExternalResult}
            onClose={() => setSelectedExternalResult(null)}
            onSave={handleAddFromSearch}
          />
        )}

        <ConfirmationModal
          isOpen={showDeleteConfirm}
          title="Excluir Item"
          message={itemToDelete ? `Vai apagar "${itemToDelete.title}" mesmo? Essa ação não pode ser desfeita!` : ''}
          confirmText="Excluir"
          cancelText="Cancelar"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={() => {setShowDeleteConfirm(false);setItemToDelete(null);}}
        />
      </AnimatePresence>
    </div>
  );
};

export default ModernLibrary;
