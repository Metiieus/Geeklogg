import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Grid, List, X, Star, Trash2, Plus } from "lucide-react";

import { useAppContext } from "../context/AppContext";
import type { MediaItem } from "../App";
import { MediaType, Status } from "../App";

import { useToast } from "../context/ToastContext";
import useDebounce from "../hooks/useDebounce";

// Design System
import { HeroBanner } from "../design-system/components/HeroBanner";
import { RadiantMediaCard } from "./RadiantMediaCard";
import { GlassInput, GlassSelect, GlassFilterBar } from "../design-system/components/GlassInput";
import { NeonOrnament, FloatingParticles } from "../design-system/components/NeonPatterns";

// Modais / Serviços
import { ConnectivityError } from "./ConnectivityError";
import { AddMediaOptions } from "./AddMediaOptions";
import { AddMediaFromSearchModal } from "./modals/AddMediaFromSearchModal";
import { ConfirmationModal } from "./ConfirmationModal";
import { ExternalMediaResult } from "../services/externalMediaService";
import { useImprovedScrollLock } from "../hooks/useImprovedScrollLock";

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "completed", label: "✅ Concluído" },
  { value: "in-progress", label: "⏳ Em Progresso" },
  { value: "dropped", label: "❌ Abandonado" },
  { value: "planned", label: "📅 Planejado" },
];

const sortOptions = [
  { value: "updatedAt", label: "🕐 Mais Recentes" },
  { value: "title", label: "🔤 A-Z" },
  { value: "rating", label: "⭐ Avaliação" },
  { value: "hoursSpent", label: "⏱️ Mais Horas" },
];

const ModernLibrary: React.FC = () => {
  const { mediaItems, setMediaItems, navigateToAddMedia, navigateToEditMedia, deleteMedia } = useAppContext() as any;
  const { showError, showSuccess } = useToast();

  const [selectedType, setSelectedType] = useState<MediaType | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<Status | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "rating" | "hoursSpent" | "updatedAt">("updatedAt");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [showAddOptions, setShowAddOptions] = useState(false);
  const [selectedExternalResult, setSelectedExternalResult] = useState<ExternalMediaResult | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MediaItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [hasConnectionError, setHasConnectionError] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  useImprovedScrollLock(showAddOptions || !!selectedExternalResult || showDeleteConfirm);

  // ----------------------------
  // Filtros e organização
  // ----------------------------
  const filterOptions = useMemo(() => {
    const typeCounts = mediaItems.reduce((acc: Record<string, number>, item: MediaItem) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});
    return [
      { id: "all", label: "Todos", count: mediaItems.length },
      { id: "games", label: "Jogos", count: typeCounts.games || 0 },
      { id: "anime", label: "Anime", count: typeCounts.anime || 0 },
      { id: "series", label: "Séries", count: typeCounts.series || 0 },
      { id: "books", label: "Livros", count: typeCounts.books || 0 },
      { id: "movies", label: "Filmes", count: typeCounts.movies || 0 },
    ];
  }, [mediaItems]);

  const filteredAndSortedItems = useMemo(() => {
    let filtered = mediaItems;

    if (selectedType !== "all") filtered = filtered.filter((i) => i.type === selectedType);
    if (selectedStatus !== "all") filtered = filtered.filter((i) => i.status === selectedStatus);

    if (debouncedSearchQuery) {
      const q = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          (i.tags && i.tags.some((tag) => tag.toLowerCase().includes(q)))
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
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    return filtered;
  }, [mediaItems, selectedType, selectedStatus, debouncedSearchQuery, sortBy]);

  // ----------------------------
  // Destaques, Melhor Avaliado, Recentes
  // ----------------------------
  const featuredItems = useMemo(() => mediaItems.filter((i) => i.isFeatured).slice(0, 5), [mediaItems]);
  const bestItem = useMemo(() => filteredAndSortedItems.find((i) => i.rating && i.rating >= 9), [filteredAndSortedItems]);
  const recentItems = useMemo(() => filteredAndSortedItems.slice(0, 5), [filteredAndSortedItems]);

  // ----------------------------
  // Handlers
  // ----------------------------
  const handleDeleteItem = (item: MediaItem) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      if (typeof deleteMedia === "function") await deleteMedia(itemToDelete.id);
      setMediaItems((prev: MediaItem[]) => prev.filter((m) => m.id !== itemToDelete.id));
      showSuccess("Item removido!");
    } catch (err: any) {
      setHasConnectionError(true);
      showError("Erro ao remover mídia", err?.message || "Falha inesperada.");
    } finally {
      setItemToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <div className="relative min-h-screen text-white">
      {/* Background decorativo */}
      <FloatingParticles count={10} color="cyan" />

      {/* Hero */}
      <HeroBanner
        title="Minha Biblioteca"
        subtitle="Seu espaço geek com estilo futurista"
        onAddMedia={() => setShowAddOptions(true)}
      />

      {/* Conteúdo */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-6 py-10 max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <GlassInput
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            variant="search"
          />

          <GlassSelect options={sortOptions} value={sortBy} onChange={(v) => setSortBy(v as any)} placeholder="Ordenar" />
          <GlassSelect
            options={statusOptions}
            value={selectedStatus}
            onChange={(v) => setSelectedStatus(v as any)}
            placeholder="Status"
          />

          <GlassFilterBar
            options={filterOptions}
            selected={selectedType === "all" ? [] : [selectedType]}
            onChange={(s) => setSelectedType(s.length > 0 ? (s[0] as MediaType) : "all")}
          />

          {bestItem && (
            <div className="bg-slate-800/60 p-4 rounded-xl border border-white/20">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Star className="text-yellow-400" size={18} /> Melhor Avaliado
              </h3>
              <p className="text-sm">{bestItem.title}</p>
              <span className="text-yellow-400 text-sm font-semibold">{bestItem.rating}/10</span>
            </div>
          )}

          {recentItems.length > 0 && (
            <div className="bg-slate-800/60 p-4 rounded-xl border border-white/20">
              <h3 className="font-bold mb-3">Recentes</h3>
              <ul className="space-y-2 text-sm text-white/80">
                {recentItems.map((i) => (
                  <li key={i.id} className="truncate cursor-pointer hover:text-cyan-300">
                    {i.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        {/* Main */}
        <main className="lg:col-span-3 space-y-10">
          {/* Carrossel Destaques */}
          {featuredItems.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">✨ Destaques</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {featuredItems.map((item) => (
                  <motion.div key={item.id} whileHover={{ scale: 1.05 }} className="w-40 flex-shrink-0">
                    <RadiantMediaCard
                      title={item.title}
                      imageUrl={item.cover}
                      kind={item.type}
                      onClick={() => navigateToEditMedia(item)}
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Grid/List */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">📚 Coleção Completa</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-cyan-600" : "bg-slate-700/50"}`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${viewMode === "list" ? "bg-cyan-600" : "bg-slate-700/50"}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            {filteredAndSortedItems.length === 0 ? (
              <motion.div className="text-center py-16 text-white/60">
                <Search className="mx-auto mb-4 opacity-50" size={28} />
                <p>Nenhum resultado encontrado...</p>
              </motion.div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }
              >
                {filteredAndSortedItems.map((item) => (
                  <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <RadiantMediaCard
                      title={item.title}
                      imageUrl={item.cover}
                      kind={item.type}
                      onClick={() => navigateToEditMedia(item)}
                    />
                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="absolute top-2 right-2 p-1 rounded-lg bg-black/50 text-white/80 hover:bg-black/70"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Erro Conexão */}
      {hasConnectionError && <ConnectivityError onRetry={() => setHasConnectionError(false)} />}

      {/* Modais */}
      <AnimatePresence>
        {showAddOptions && (
          <AddMediaOptions
            onExternalResultSelect={(r) => setSelectedExternalResult(r)}
            onManualAdd={() => navigateToAddMedia()}
          />
        )}
      </AnimatePresence>
      {selectedExternalResult && (
        <AddMediaFromSearchModal selectedResult={selectedExternalResult} onAdd={() => {}} onClose={() => setSelectedExternalResult(null)} />
      )}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Excluir Item"
        message={`Deseja remover "${itemToDelete?.title}"?`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* Decorações */}
      <NeonOrnament type="corner" color="violet" size="small" opacity={0.3} />
      <NeonOrnament type="corner" color="cyan" size="small" opacity={0.3} />
    </div>
  );
};

export default ModernLibrary;
