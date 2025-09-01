import React, { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { MediaCard } from "../design-system/components/MediaCard";
import { MediaSearchBar } from "./MediaSearchBar";
import { AddMediaModal } from "./modals/AddMediaModal";
import { EditFeaturedModal } from "./modals/EditFeaturedModal";
import { MediaDetailModal } from "./modals/MediaDetailModal";
import { AddMediaFromSearchModal } from "./modals/AddMediaFromSearchModal";
import { ConfirmationModal } from "./ConfirmationModal";
import { Star, Plus, Grid, List, Search, X } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { deleteMedia } from "../services/mediaService";

// ------------------------------------------------------------
// Types e helpers (mesmo que antes, apenas organizados)
// ------------------------------------------------------------
type MediaType = "games" | "anime" | "series" | "books" | "movies";
type Status = "completed" | "in-progress" | "dropped" | "planned";
type SortKey = "updatedAt" | "rating" | "title" | "createdAt";

const statusLabels: Record<Status, string> = {
  completed: "✅ Concluído",
  "in-progress": "⏳ Em Progresso",
  dropped: "❌ Abandonado",
  planned: "📅 Planejado",
};

const typeLabels: Record<MediaType, string> = {
  games: "Jogos",
  anime: "Anime",
  series: "Séries",
  books: "Livros",
  movies: "Filmes",
};

// ------------------------------------------------------------
// Componente principal
// ------------------------------------------------------------
export default function LibrarySection() {
  const { mediaItems = [], setMediaItems, setActivePage, setEditingMediaItem } = useAppContext();
  const { showSuccess, showError } = useToast();

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("updatedAt");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFeaturedModalOpen, setIsFeaturedModalOpen] = useState(false);
  const [selectedMediaForDetail, setSelectedMediaForDetail] = useState<any | null>(null);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);

  // -----------------------------
  // Filtragem básica
  // -----------------------------
  const filtered = useMemo(() => {
    let arr = mediaItems.slice();

    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter(
        (i) =>
          i.title?.toLowerCase().includes(q) ||
          i.tags?.some((t: string) => t.toLowerCase().includes(q)) ||
          i.description?.toLowerCase().includes(q)
      );
    }

    arr.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating ?? -1) - (a.rating ?? -1);
        case "title":
          return a.title.localeCompare(b.title, "pt-BR");
        case "createdAt":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "updatedAt":
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    return arr;
  }, [mediaItems, query, sortBy]);

  const featuredItems = useMemo(() => mediaItems.filter((i) => i.isFeatured).slice(0, 5), [mediaItems]);
  const bestItem = useMemo(() => filtered.find((i) => i.rating && i.rating >= 9), [filtered]);
  const recentItems = useMemo(() => filtered.slice(0, 5), [filtered]);

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleDeleteItem = useCallback(
    async (item: any) => {
      try {
        await deleteMedia(item.id);
        setMediaItems(mediaItems.filter((m) => m.id !== item.id));
        showSuccess("Item removido", `${item.title} foi removido da biblioteca`);
      } catch (error) {
        showError("Erro ao remover", "Não foi possível remover o item");
      }
    },
    [mediaItems, setMediaItems, showSuccess, showError]
  );

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  return (
    <div className="relative min-h-screen text-white">
      {/* Hero Banner */}
      <div className="relative h-72 bg-gradient-to-r from-violet-700 via-purple-800 to-cyan-700 rounded-b-3xl overflow-hidden">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative z-10 flex flex-col justify-center h-full text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
            Minha Biblioteca
          </h1>
          <p className="text-white/70 text-lg">Organize sua jornada geek com estilo ✨</p>
          <div className="mt-6">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-400 hover:scale-105 transition font-semibold shadow-lg"
            >
              <Plus size={18} className="inline mr-2" /> Adicionar Mídia
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-6 py-10 max-w-7xl mx-auto">
        {/* Sidebar Filtros */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800/50 p-4 rounded-2xl backdrop-blur-md border border-white/10">
            <h3 className="font-bold mb-3">Buscar</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Título, tags..."
                className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-700/60 focus:bg-slate-700/80 focus:ring-2 ring-cyan-400 outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-2xl backdrop-blur-md border border-white/10">
            <h3 className="font-bold mb-3">Ordenar</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="w-full bg-slate-700/60 rounded-xl p-2 text-white"
            >
              <option value="updatedAt">Mais Recentes</option>
              <option value="createdAt">Data de Inclusão</option>
              <option value="rating">Maior Nota</option>
              <option value="title">Título (A–Z)</option>
            </select>
          </div>

          {bestItem && (
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/10">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Star className="text-yellow-400" size={18} /> Melhor Avaliado
              </h3>
              <p className="text-sm">{bestItem.title}</p>
              <span className="text-yellow-400 text-sm font-semibold">{bestItem.rating}/10</span>
            </div>
          )}

          {recentItems.length > 0 && (
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/10">
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

        {/* Main Content */}
        <main className="lg:col-span-3 space-y-10">
          {/* Destaques */}
          {featuredItems.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">✨ Destaques</h2>
                <button
                  onClick={() => setIsFeaturedModalOpen(true)}
                  className="text-sm text-purple-300 hover:underline"
                >
                  Editar
                </button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {featuredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    className="w-40 flex-shrink-0"
                    onClick={() => setSelectedMediaForDetail(item)}
                  >
                    <MediaCard item={item} variant="compact" />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Grid de Itens */}
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

            {filtered.length === 0 ? (
              <p className="text-center text-white/60">Nenhum item encontrado...</p>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }
              >
                {filtered.map((item) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    variant={viewMode === "grid" ? "default" : "list"}
                    onClick={() => setSelectedMediaForDetail(item)}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Modais */}
      <AnimatePresence>
        {isAddModalOpen && <AddMediaModal onClose={() => setIsAddModalOpen(false)} onSave={() => {}} />}
        {isFeaturedModalOpen && (
          <EditFeaturedModal
            isOpen={isFeaturedModalOpen}
            onClose={() => setIsFeaturedModalOpen(false)}
            selectedIds={featuredItems.map((i) => i.id)}
            onSave={() => setIsFeaturedModalOpen(false)}
          />
        )}
        {selectedMediaForDetail && (
          <MediaDetailModal item={selectedMediaForDetail} onClose={() => setSelectedMediaForDetail(null)} />
        )}
        {itemToDelete && (
          <ConfirmationModal
            isOpen={!!itemToDelete}
            title="Remover da Biblioteca"
            message={`Deseja remover ${itemToDelete?.title}?`}
            confirmText="Remover"
            cancelText="Cancelar"
            variant="danger"
            onConfirm={() => handleDeleteItem(itemToDelete)}
            onCancel={() => setItemToDelete(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
