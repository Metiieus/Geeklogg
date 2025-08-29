import React, { useMemo, useState, useDeferredValue, useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { MediaCard } from '../design-system/components/MediaCard';
import type { MediaItemDS } from '../design-system/components/MediaCard';
import type { ExternalMediaResult } from '../services/externalMediaService';
import { MediaSearchBar } from './MediaSearchBar';
import { AddMediaModal } from './modals/AddMediaModal';
import { EditFeaturedModal } from './modals/EditFeaturedModal';
import { MediaDetailModal } from './modals/MediaDetailModal';
import { AddMediaFromSearchModal } from './modals/AddMediaFromSearchModal';
import { ConfirmationModal } from './ConfirmationModal';
import { useToast } from '../context/ToastContext';
import { deleteMedia } from '../services/mediaService';
import { Star, Edit, Trash2, Plus, Search, Filter, X } from 'lucide-react';

// Tipos do seu app
type MediaType = "games" | "anime" | "series" | "books" | "movies"
type Status = "completed" | "in-progress" | "dropped" | "planned"

type MediaItem = {
  id: string;
  title: string;
  cover?: string;
  platform?: string;
  status: Status;
  rating?: number;
  hoursSpent?: number;
  totalPages?: number;
  currentPage?: number;
  startDate?: string;
  endDate?: string;
  tags: string[];
  externalLink?: string;
  type: MediaType;
  description?: string;
  isFeatured?: boolean;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
};

// Converter MediaItem para MediaItemDS
const convertToDesignSystemItem = (item: MediaItem): MediaItemDS => ({
  id: item.id,
  title: item.title,
  cover: item.cover,
  type: item.type,
  status: item.status,
  rating: item.rating,
  hoursSpent: item.hoursSpent,
  currentPage: item.currentPage,
  totalPages: item.totalPages,
  tags: item.tags,
  externalLink: item.externalLink,
  synopsis: item.description,
})

// Status -> estilização
const statusBadge: Record<Status, { label: string; cls: string }> = {
  completed: { label: "Concluído", cls: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20" },
  "in-progress": { label: "Em Progresso", cls: "bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/20" },
  dropped: { label: "Abandonado", cls: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/20" },
  planned: { label: "Planejado", cls: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/20" },
}

const typePill: Record<MediaType, string> = {
  games: "from-cyan-500/20 to-cyan-400/10 text-cyan-300",
  anime: "from-pink-500/20 to-pink-400/10 text-pink-300",
  series: "from-indigo-500/20 to-indigo-400/10 text-indigo-300",
  books: "from-amber-500/20 to-amber-400/10 text-amber-300",
  movies: "from-fuchsia-500/20 to-fuchsia-400/10 text-fuchsia-300",
}

const typeLabels: Record<MediaType, string> = {
  games: "Games",
  anime: "Anime",
  series: "Séries",
  books: "Livros",
  movies: "Filmes",
}

type SortKey = "updatedAt" | "rating" | "title" | "createdAt"

export default function LibrarySection() {
  const {
    mediaItems = [],
    setMediaItems,
    setActivePage,
    setEditingMediaItem,
    settings,
  } = useAppContext();

  const { showSuccess, showError } = useToast();

  const [query, setQuery] = useState("");
  const [types, setTypes] = useState<Set<MediaType>>(new Set());
  const [statuses, setStatuses] = useState<Set<Status>>(new Set());
  const [onlyFav, setOnlyFav] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>(settings?.defaultLibrarySort as SortKey || "updatedAt");
  const [searchType, setSearchType] = useState<MediaType>('games');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFeaturedModalOpen, setIsFeaturedModalOpen] = useState(false);
  const [selectedMediaForDetail, setSelectedMediaForDetail] = useState<MediaItem | null>(null);
  const [selectedExternalResult, setSelectedExternalResult] = useState<ExternalMediaResult | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MediaItem | null>(null);

  const q = useDeferredValue(query.trim().toLowerCase())

  const filtered = useMemo(() => {
    if (!mediaItems?.length) return []

    let arr = mediaItems.slice()

    if (types.size > 0) {
      arr = arr.filter((i) => types.has(i.type))
    }

    if (statuses.size > 0) {
      arr = arr.filter((i) => statuses.has(i.status))
    }

    if (onlyFav) {
      arr = arr.filter((i) => i.isFavorite === true)
    }

    if (q) {
      arr = arr.filter((i) => {
        const titleMatch = i.title?.toLowerCase().includes(q)
        const tagMatch = i.tags?.some((t) => t.toLowerCase().includes(q))
        const descMatch = i.description?.toLowerCase().includes(q)
        return titleMatch || tagMatch || descMatch
      })
    }

    arr.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating ?? -1) - (a.rating ?? -1)
        case "title":
          return a.title.localeCompare(b.title, "pt-BR", { sensitivity: "base" })
        case "createdAt":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "updatedAt":
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
    })

    return arr
  }, [mediaItems, q, types, statuses, onlyFav, sortBy])

  const featuredItems = useMemo(() => {
    return mediaItems.filter((item) => item.isFeatured).slice(0, 5)
  }, [mediaItems])

  const recentItems = useMemo(() => {
    return filtered.slice(0, 8)
  }, [filtered])

  const bestItem = useMemo(() => {
    return filtered
      .filter((item) => item.rating && item.rating >= 9)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))[0]
  }, [filtered])

  const toggleSet = useCallback(<T,>(set: React.Dispatch<React.SetStateAction<Set<T>>>, value: T) => {
    set((prev) => {
      const next = new Set(prev)
      if (next.has(value)) {
        next.delete(value)
      } else {
        next.add(value)
      }
      return next
    })
  }, [])

  const clearFilters = useCallback(() => {
    setQuery("");
    setTypes(new Set());
    setStatuses(new Set());
    setOnlyFav(false);
    setSortBy("updatedAt");
  }, []);

  const handleEditItem = useCallback((item: MediaItem) => {
    setEditingMediaItem(item);
    setActivePage("edit-media");
  }, [setEditingMediaItem, setActivePage]);

  const handleDeleteItem = useCallback(async (item: MediaItem) => {
    try {
      await deleteMedia(item.id);
      setMediaItems(mediaItems.filter(m => m.id !== item.id));
      showSuccess('Item removido', `${item.title} foi removido da biblioteca`);
    } catch (error) {
      console.error('Erro ao deletar:', error);
      showError('Erro ao remover', 'Não foi possível remover o item');
    }
  }, [mediaItems, setMediaItems, showSuccess, showError]);

  const handleSearchResultSelect = (result: ExternalMediaResult) => {
    setSelectedExternalResult(result);
  };

  const handleAddFromSearch = (newItem: MediaItem) => {
    setMediaItems([...mediaItems, newItem]);
    setSelectedExternalResult(null);
    showSuccess('Mídia adicionada', `${newItem.title} foi adicionado à biblioteca`);
  };

  const handleAddManual = (newItem: MediaItem) => {
    setMediaItems([...mediaItems, newItem]);
    setIsAddModalOpen(false);
    showSuccess('Mídia adicionada', `${newItem.title} foi adicionado à biblioteca`);
  };

  // Empty state
  if (!mediaItems || mediaItems.length === 0) {
    return (
      <div className="p-4 md:p-8 text-white min-h-screen flex items-center justify-center">
        <div className="rounded-3xl bg-gradient-to-br from-slate-800/40 via-slate-900/60 to-slate-800/40 border border-white/10 p-8 md:p-12 relative overflow-hidden backdrop-blur-xl max-w-4xl w-full mx-auto">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background:
                "radial-gradient(1200px 400px at 20% -10%, rgba(6,182,212,0.15), transparent 40%), radial-gradient(1000px 300px at 80% 120%, rgba(139,92,246,0.15), transparent 40%)",
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent mb-4">
              Minha Biblioteca
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8">
              Organize sua jornada geek com estilo e inteligência. Comece adicionando seus primeiros itens!
            </p>

            <div className="max-w-2xl mx-auto mb-6">
              <MediaSearchBar
                selectedType={searchType}
                onTypeChange={setSearchType}
                onResultSelect={handleSearchResultSelect}
                placeholder="Buscar mídia online..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300 shadow-lg shadow-emerald-600/25 font-semibold"
              >
                <Plus size={18} /> Adicionar Manualmente
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 text-white min-h-screen max-w-7xl mx-auto">
      {/* Header com Barra de Pesquisa Integrada */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent mb-2">
              Minha Biblioteca
            </h1>
            <p className="text-white/60 text-lg">{filtered.length} itens na sua coleção</p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300 shadow-lg shadow-emerald-600/25 font-semibold text-white"
            >
              <Plus size={18} /> Adicionar Manualmente
            </motion.button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
          <div className="flex-1">
            <MediaSearchBar
              selectedType={searchType}
              onTypeChange={setSearchType}
              onResultSelect={handleSearchResultSelect}
              placeholder="Buscar mídia online..."
            />
          </div>
        </div>
      </motion.div>

      {/* Carousel de Destaques */}
      {featuredItems.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white/90 flex items-center gap-2">
              <Star className="text-yellow-400" size={24} />
              Destaques da Coleção
            </h2>
            <button
              onClick={() => setIsFeaturedModalOpen(true)}
              className="text-sm px-4 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 transition-all duration-200 flex items-center gap-2"
            >
              <Edit size={16} />
              Editar Destaques
            </button>
          </div>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 md:gap-6 w-max mx-auto lg:mx-0">
              {featuredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="w-48 md:w-56 flex-shrink-0"
                >
                  <div
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-2 border border-white/10 bg-slate-800"
                    onClick={() => setSelectedMediaForDetail(item)}
                  >
                    {/* Capa com fallback melhorado */}
                    {item.cover ? (
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback sempre presente */}
                    <div 
                      className="w-full h-full bg-gradient-to-br from-slate-700/60 to-slate-800/80 flex items-center justify-center absolute inset-0"
                      style={{ display: item.cover ? 'none' : 'flex' }}
                    >
                      <div className="text-center">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${typePill[item.type]} flex items-center justify-center mb-3 mx-auto border border-white/20`}>
                          <span className="text-2xl font-bold text-white">{item.title.charAt(0)}</span>
                        </div>
                        <span className="text-white/60 text-sm font-medium">{typeLabels[item.type]}</span>
                      </div>
                    </div>

                    {/* Overlay gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Badge de rating */}
                    {item.rating && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-yellow-500/20 backdrop-blur-sm rounded-full border border-yellow-500/30">
                        <Star size={12} className="text-yellow-400 fill-current" />
                        <span className="text-white text-sm font-bold">{item.rating}</span>
                      </div>
                    )}

                    {/* Badge de destaque */}
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-500/30">
                      <Star size={12} className="text-purple-400 fill-current" />
                      <span className="text-white text-xs font-bold">DESTAQUE</span>
                    </div>

                    {/* Título e status */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2 mb-2">
                        {item.title}
                      </h3>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusBadge[item.status].cls}`}>
                        <span>{statusBadge[item.status].label}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Barra de busca local e filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4 mb-8"
      >
        {/* Busca e ordenação */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filtrar sua biblioteca por título, tags ou descrição..."
              className="w-full bg-slate-800/40 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-lg outline-none focus:border-emerald-400/50 focus:bg-slate-800/60 placeholder-white/40 backdrop-blur-sm transition-all duration-300"
              aria-label="Campo de busca local"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90 p-1 rounded-full hover:bg-white/10 transition-all"
                aria-label="Limpar busca"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="bg-slate-800/40 border border-white/10 rounded-2xl px-4 py-4 outline-none focus:border-emerald-400/50 backdrop-blur-sm text-white min-w-48"
              aria-label="Ordenar por"
            >
              <option value="updatedAt">Mais Recentes</option>
              <option value="createdAt">Data de Inclusão</option>
              <option value="rating">Maior Nota</option>
              <option value="title">Título (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
          {/* Filtros de tipo */}
          <div className="flex flex-wrap gap-2">
            {(["games", "anime", "series", "books", "movies"] as MediaType[]).map((t) => (
              <button
                key={t}
                onClick={() => toggleSet(setTypes, t)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-br ${typePill[t]} border transition-all duration-200 ${
                  types.has(t)
                    ? "border-white/30 ring-2 ring-white/20 scale-105 shadow-lg"
                    : "border-white/10 hover:border-white/20 hover:scale-105"
                }`}
                aria-pressed={types.has(t)}
                aria-label={`Filtrar por ${typeLabels[t]}`}
              >
                {typeLabels[t]}
              </button>
            ))}
          </div>

          <div className="hidden lg:block w-px h-8 bg-white/20 my-auto"></div>

          {/* Filtros de status */}
          <div className="flex flex-wrap gap-2">
            {(["completed", "in-progress", "dropped", "planned"] as Status[]).map((s) => (
              <button
                key={s}
                onClick={() => toggleSet(setStatuses, s)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                  statuses.has(s)
                    ? "bg-white/15 border-white/30 text-white scale-105 shadow-lg"
                    : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 text-white/80 hover:scale-105"
                }`}
                aria-pressed={statuses.has(s)}
                aria-label={`Filtrar por ${statusBadge[s].label}`}
              >
                {statusBadge[s].label}
              </button>
            ))}
          </div>

          <div className="hidden lg:block w-px h-8 bg-white/20 my-auto"></div>

          {/* Filtro de favoritos */}
          <button
            onClick={() => setOnlyFav((v) => !v)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium border inline-flex items-center gap-2 transition-all duration-200 ${
              onlyFav
                ? "bg-yellow-500/15 border-yellow-400/30 text-yellow-300 scale-105 shadow-lg"
                : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 text-white/80 hover:scale-105"
            }`}
            title="Apenas favoritos"
            aria-pressed={onlyFav}
            aria-label="Filtrar apenas favoritos"
          >
            <Star size={14} className={onlyFav ? "fill-current" : ""} /> Favoritos
          </button>

          {/* Limpar filtros */}
          {(types.size || statuses.size || onlyFav || query) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2.5 rounded-xl text-sm font-medium bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 transition-all duration-200 flex items-center gap-2"
              aria-label="Limpar todos os filtros"
            >
              <X size={14} /> Limpar Filtros
            </button>
          )}
        </div>
      </motion.div>

      {/* Layout Principal */}
      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-white/90 mb-2">Nenhum item encontrado</h3>
          <p className="text-white/60 mb-6">Tente ajustar os filtros ou adicionar novos itens à sua biblioteca</p>
          <button
            onClick={clearFilters}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200"
          >
            Limpar Filtros
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Coleção Principal */}
          <div className="xl:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white/90">Coleção Completa</h2>
              <span className="text-white/60">{filtered.length} itens</span>
            </div>

            <motion.div
              layout
              className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4"
            >
              {filtered.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.5) }}
                  className="relative"
                >
                  {item && item.type && item.status && (
                    <MediaCard
                      item={convertToDesignSystemItem(item)}
                      onEdit={(dsItem) => {
                        const originalItem = mediaItems.find((mi) => mi.id === dsItem.id)
                        if (originalItem) {
                          handleEditItem(originalItem)
                        }
                      }}
                      onDelete={(dsItem) => {
                        const originalItem = mediaItems.find((mi) => mi.id === dsItem.id)
                        if (originalItem) {
                          setItemToDelete(originalItem)
                        }
                      }}
                      onQuickAction={(dsItem) => {
                        const originalItem = mediaItems.find((mi) => mi.id === dsItem.id)
                        if (originalItem) {
                          setSelectedMediaForDetail(originalItem)
                        }
                      }}
                      variant="default"
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Sidebar com Destaques */}
          <div className="xl:col-span-1">
            <div className="sticky top-6 space-y-8">
              {/* Melhor Item */}
              {bestItem && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                  <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center gap-2">
                    <Star className="text-yellow-400 fill-current" size={20} />
                    Melhor Avaliado
                  </h3>
                  <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                    <div
                      className="aspect-[3/4] rounded-xl overflow-hidden mb-4 cursor-pointer hover:scale-105 transition-transform duration-300 bg-slate-700"
                      onClick={() => setSelectedMediaForDetail(bestItem)}
                    >
                      {bestItem.cover ? (
                        <img
                          src={bestItem.cover}
                          alt={bestItem.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="w-full h-full bg-gradient-to-br from-slate-700/60 to-slate-800/80 flex items-center justify-center"
                        style={{ display: bestItem.cover ? 'none' : 'flex' }}
                      >
                        <div className="text-center">
                          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${typePill[bestItem.type]} flex items-center justify-center mb-2 mx-auto`}>
                            <span className="text-white/80 font-bold text-2xl">{bestItem.title.charAt(0)}</span>
                          </div>
                          <span className="text-white/60 text-sm">{typeLabels[bestItem.type]}</span>
                        </div>
                      </div>
                    </div>
                    <h4 className="font-semibold text-white mb-2 line-clamp-2">{bestItem.title}</h4>
                    {bestItem.rating && (
                      <div className="flex items-center gap-2 text-yellow-400 mb-3">
                        <Star size={16} className="fill-current" />
                        <span className="font-bold">{bestItem.rating}/10</span>
                      </div>
                    )}
                    <div
                      className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium ${statusBadge[bestItem.status].cls}`}
                    >
                      {statusBadge[bestItem.status].label}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Itens Recentes */}
              {recentItems.length > 0 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
                  <h3 className="text-xl font-bold text-white/90 mb-4">Recentes</h3>
                  <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
                    <div className="space-y-3">
                      {recentItems.slice(0, 5).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                          onClick={() => setSelectedMediaForDetail(item)}
                        >
                          <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-700/50 flex-shrink-0">
                            {item.cover ? (
                              <img
                                src={item.cover}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const fallback = target.nextElementSibling as HTMLElement;
                                  if (fallback) fallback.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div 
                              className="w-full h-full flex items-center justify-center"
                              style={{ display: item.cover ? 'none' : 'flex' }}
                            >
                              <span className="text-white/60 text-xs font-bold">{item.title.charAt(0)}</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white/90 text-sm font-medium truncate">{item.title}</p>
                            <p className="text-white/60 text-xs">{typeLabels[item.type]}</p>
                          </div>
                          {item.rating && (
                            <div className="flex items-center gap-1 text-yellow-400">
                              <Star size={12} className="fill-current" />
                              <span className="text-xs font-bold">{item.rating}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modais */}
      <AnimatePresence>
        {isAddModalOpen && (
          <AddMediaModal
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleAddManual}
          />
        )}

        {isFeaturedModalOpen && (
          <EditFeaturedModal
            isOpen={isFeaturedModalOpen}
            selectedIds={mediaItems.filter(i => i.isFeatured).map(i => i.id)}
            onClose={() => setIsFeaturedModalOpen(false)}
            onSave={(ids) => {
              // Limitar a 5 destaques
              const limitedIds = ids.slice(0, 5);
              setMediaItems(mediaItems.map((it: MediaItem) => ({ 
                ...it, 
                isFeatured: limitedIds.includes(it.id) 
              })));
              setIsFeaturedModalOpen(false);
              showSuccess('Destaques atualizados', `${limitedIds.length} itens em destaque`);
            }}
          />
        )}

        {selectedMediaForDetail && (
          <MediaDetailModal
            item={selectedMediaForDetail}
            onClose={() => setSelectedMediaForDetail(null)}
            onEdit={() => {
              handleEditItem(selectedMediaForDetail);
              setSelectedMediaForDetail(null);
            }}
            onDelete={() => {
              setItemToDelete(selectedMediaForDetail);
              setSelectedMediaForDetail(null);
            }}
          />
        )}

        {selectedExternalResult && (
          <AddMediaFromSearchModal
            selectedResult={selectedExternalResult}
            onAdd={handleAddFromSearch}
            onClose={() => setSelectedExternalResult(null)}
          />
        )}

        {itemToDelete && (
          <ConfirmationModal
            isOpen={!!itemToDelete}
            title="Remover da Biblioteca"
            message={
              <div>
                <p>Tem certeza que deseja remover <strong>{itemToDelete?.title}</strong> da sua biblioteca?</p>
                <p className="text-sm text-white/60 mt-2">Esta ação não pode ser desfeita.</p>
              </div>
            }
            confirmText="Remover"
            cancelText="Cancelar"
            variant="danger"
            onConfirm={() => {
              if (itemToDelete) {
                handleDeleteItem(itemToDelete);
                setItemToDelete(null);
              }
            }}
            onCancel={() => setItemToDelete(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}