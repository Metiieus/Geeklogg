
/* ModernLibrary.tsx - Corrigido para centralizar o modal corretamente */

// Imports (mantidos iguais ao original)
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, Grid, List, SortAsc } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MediaType, Status } from '../App';
import type { MediaItem } from '../App';
import { useToast } from '../context/ToastContext';
import useDebounce from '../hooks/useDebounce';

import { HeroBanner } from '../design-system/components/HeroBanner';
import { MediaCard } from '../design-system/components/MediaCard';
import { GlassInput, GlassSelect, GlassFilterBar } from '../design-system/components/GlassInput';
import { TribalDivider, NeonOrnament, FloatingParticles } from '../design-system/components/NeonPatterns';
import { getCategoryColors, shadows } from '../design-system/tokens';

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
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernLibrary;
