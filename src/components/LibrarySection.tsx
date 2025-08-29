import React, { useMemo, useState, useDeferredValue } from "react";
import { useAppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { MediaCard } from '../design-system/components/MediaCard';
import type { MediaItemDS } from '../design-system/components/MediaCard';

// Tipos do seu app (ajuste se os nomes diferirem)
type MediaType = "games" | "anime" | "series" | "books" | "movies";
type Status = "completed" | "in-progress" | "dropped" | "planned";

type MediaItem = {
  id: string;
  title: string;
  cover?: string;
  platform?: string;
  status: Status;
  rating?: number; // 0-10
  hoursSpent?: number;
  totalPages?: number;
  currentPage?: number;
  startDate?: string;
  endDate?: string;
  tags: string[];
  externalLink?: string;
  type: MediaType;
  description?: string;
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
  synopsis: item.description
});

// ---------------------------------------------
// Ícones inline (sem libs)
const IconGrid = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z"/></svg>
);
const IconList = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/></svg>
);
const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 21.5 21.5 20l-6-6zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
);
const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/></svg>
);
const IconStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z"/></svg>
);
const IconType: Record<MediaType, JSX.Element> = {
  games: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 8h12a4 4 0 110 8H6a4 4 0 110-8zm2 2H7v1H6v1h1v1h1v-1h1v-1H8v-1zm8 1a1 1 0 100 2 1 1 0 000-2zm-2-1a1 1 0 100 2 1 1 0 000-2z"/></svg>,
  anime: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.03 2 10.67 2 15.31 6.48 19.33 12 19.33c5.52 0 10-4.02 10-8.66C22 6.03 17.52 2 12 2zm-4 9a1.33 1.33 0 110-2.67A1.33 1.33 0 018 11zm8 0a1.33 1.33 0 110-2.67A1.33 1.33 0 0116 11zM8.67 14h6.66c-.73 1.6-2.4 2.67-3.33 2.67S9.4 15.6 8.67 14z"/></svg>,
  series: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v12H4z"/><path d="M2 18h20v2H2z"/></svg>,
  books: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H8a2 2 0 00-2 2v16a2 2 0 012 2h10a2 2 0 012-2V4a2 2 0 00-2-2zm0 18H8V4h10v16z"/><path d="M6 2H5a3 3 0 00-3 3v16a3 3 0 013 3h1"/></svg>,
  movies: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h3l2 4H6l-2-4zm5 0h3l2 4h-3l-2-4zm5 0h3l2 4h-3l-2-4zM4 10h16v10H4V10z"/></svg>,
};

// Status -> estilização
const statusBadge: Record<Status, { label: string; cls: string }> = {
  "completed": { label: "Concluído", cls: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20" },
  "in-progress": { label: "Em Progresso", cls: "bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/20" },
  "dropped": { label: "Abandonado", cls: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/20" },
  "planned": { label: "Planejado", cls: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/20" },
};

const typePill: Record<MediaType, string> = {
  games: "from-cyan-500/20 to-cyan-400/10 text-cyan-300",
  anime: "from-pink-500/20 to-pink-400/10 text-pink-300",
  series: "from-indigo-500/20 to-indigo-400/10 text-indigo-300",
  books: "from-amber-500/20 to-amber-400/10 text-amber-300",
  movies: "from-fuchsia-500/20 to-fuchsia-400/10 text-fuchsia-300",
};

const typeLabels: Record<MediaType, string> = {
  games: "Games",
  anime: "Anime",
  series: "Séries",
  books: "Livros",
  movies: "Filmes",
};

function toStars(r?: number) {
  if (r == null) return "—";
  // nota 0–10 -> 5 estrelas
  const s = Math.round((r / 10) * 5);
  return "★★★★★☆☆☆☆☆".slice(5 - s, 10 - s); // só pra debugar fácil
}

// ---------------------------------------------

type SortKey = "updatedAt" | "rating" | "title" | "createdAt";

export default function LibrarySection() {
  const {
    mediaItems = [],
    setActivePage,
    setEditingMediaItem,
    settings,
  } = useAppContext();

  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [types, setTypes] = useState<Set<MediaType>>(new Set()); // vazio = todos
  const [statuses, setStatuses] = useState<Set<Status>>(new Set());
  const [onlyFav, setOnlyFav] = useState(false); // se você tiver flag de favorito, plugue aqui
  const [sortBy, setSortBy] = useState<SortKey>(settings?.defaultLibrarySort as SortKey || "updatedAt");

  const q = useDeferredValue(query.trim().toLowerCase());

  const filtered = useMemo(() => {
    let arr = mediaItems.slice();

    if (types.size) arr = arr.filter(i => types.has(i.type));
    if (statuses.size) arr = arr.filter(i => statuses.has(i.status));
    if (onlyFav) {
      // se tiver algum campo p/ favorito (ex: i.favorite), troque aqui
      arr = arr.filter(i => (i as any).isFavorite === true);
    }

    if (q) {
      arr = arr.filter(i =>
        i.title?.toLowerCase().includes(q) ||
        i.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    arr.sort((a, b) => {
      switch (sortBy) {
        case "rating": return (b.rating ?? -1) - (a.rating ?? -1);
        case "title": return a.title.localeCompare(b.title);
        case "createdAt": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "updatedAt":
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    return arr;
  }, [mediaItems, q, types, statuses, onlyFav, sortBy]);

  const toggleSet = <T,>(set: React.Dispatch<React.SetStateAction<Set<T>>>, value: T) => {
    set(prev => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value); else next.add(value);
      return next;
    });
  };

  // ---------- Empty state
  if (!mediaItems || mediaItems.length === 0) {
    return (
      <div className="p-4 md:p-8 text-white min-h-screen">
        <div className="rounded-3xl bg-gradient-to-br from-slate-800/40 via-slate-900/60 to-slate-800/40 border border-white/10 p-8 md:p-12 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute inset-0 opacity-20 pointer-events-none"
               style={{ background: "radial-gradient(1200px 400px at 20% -10%, rgba(6,182,212,0.15), transparent 40%), radial-gradient(1000px 300px at 80% 120%, rgba(139,92,246,0.15), transparent 40%)" }}/>
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActivePage("add-media")}
                className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-cyan-600/25 font-semibold"
              >
                <IconPlus /> Adicionar Mídia
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 backdrop-blur-sm font-semibold"
              >
                <IconSearch /> Buscar Online
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Obter items destacados
  const featuredItems = useMemo(() => {
    return filtered
      .filter(item => item.rating && item.rating >= 8)
      .slice(0, 6);
  }, [filtered]);

  const recentItems = useMemo(() => {
    return filtered
      .slice(0, 8);
  }, [filtered]);

  const bestItem = useMemo(() => {
    return filtered
      .filter(item => item.rating && item.rating >= 9)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
  }, [filtered]);

  return (
    <div className="p-4 md:p-6 lg:p-8 text-white min-h-screen">
      {/* Header Moderno */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8"
      >
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent mb-2">
            Minha Biblioteca
          </h1>
          <p className="text-white/60 text-lg">{filtered.length} itens na sua coleção</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActivePage("add-media")}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-cyan-600/25 font-semibold"
          >
            <IconPlus className="w-5 h-5" /> Adicionar
          </motion.button>

          <div className="flex p-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <button
              onClick={() => setView("grid")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                view === "grid"
                  ? "bg-white/15 text-white shadow-sm"
                  : "hover:bg-white/5 text-white/70 hover:text-white"
              }`}
              title="Visualização em Grade"
            >
              <IconGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grade</span>
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                view === "list"
                  ? "bg-white/15 text-white shadow-sm"
                  : "hover:bg-white/5 text-white/70 hover:text-white"
              }`}
              title="Visualização em Lista"
            >
              <IconList className="w-4 h-4" />
              <span className="hidden sm:inline">Lista</span>
            </button>
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
          <h2 className="text-2xl font-bold mb-6 text-white/90">Destaques da Coleção</h2>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 w-max">
              {featuredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="w-48 flex-shrink-0"
                >
                  <div
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-2"
                    onClick={() => {
                      setEditingMediaItem(item);
                      setActivePage("edit-media");
                    }}
                  >
                    {item.cover ? (
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-700/60 to-slate-800/80 flex items-center justify-center">
                        <div className="text-center">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${typePill[item.type]} flex items-center justify-center mb-2 mx-auto`}>
                            {IconType[item.type]}
                          </div>
                          <span className="text-white/80 font-bold text-lg">{item.title.charAt(0)}</span>
                        </div>
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Rating badge */}
                    {item.rating && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-yellow-500/20 backdrop-blur-sm rounded-full border border-yellow-500/30">
                        <IconStar className="w-3 h-3 text-yellow-400" />
                        <span className="text-white text-sm font-bold">{item.rating}</span>
                      </div>
                    )}

                    {/* Title */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Barra de busca e ordenação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col lg:flex-row gap-4 lg:items-center mb-6"
      >
        <div className="flex-1 relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, tags ou descrição..."
            className="w-full bg-slate-800/40 border border-white/10 rounded-2xl px-12 py-4 text-lg outline-none focus:border-cyan-400/50 focus:bg-slate-800/60 placeholder-white/40 backdrop-blur-sm transition-all duration-300"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
            <IconSearch className="w-5 h-5" />
          </div>
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90 text-xl"
              aria-label="Limpar busca"
            >
              ×
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="bg-slate-800/40 border border-white/10 rounded-2xl px-4 py-4 outline-none focus:border-cyan-400/50 backdrop-blur-sm text-white min-w-48"
          >
            <option value="updatedAt">Mais Recentes</option>
            <option value="createdAt">Data de Inclusão</option>
            <option value="rating">Maior Nota</option>
            <option value="title">Título (A–Z)</option>
          </select>
        </div>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap gap-3 mb-8"
      >
        <div className="flex flex-wrap gap-2">
          {(["games","anime","series","books","movies"] as MediaType[]).map(t => (
            <button
              key={t}
              onClick={() => toggleSet(setTypes, t)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-br ${typePill[t]} border transition-all duration-200 ${
                types.has(t)
                  ? "border-white/30 ring-2 ring-white/20 scale-105 shadow-lg"
                  : "border-white/10 hover:border-white/20 hover:scale-105"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                {IconType[t]} {typeLabels[t]}
              </span>
            </button>
          ))}
        </div>

        <div className="hidden lg:block w-px h-8 bg-white/20 my-auto"></div>

        <div className="flex flex-wrap gap-2">
          {(["completed","in-progress","dropped","planned"] as Status[]).map(s => (
            <button
              key={s}
              onClick={() => toggleSet(setStatuses, s)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                statuses.has(s)
                  ? "bg-white/15 border-white/30 text-white scale-105 shadow-lg"
                  : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 text-white/80 hover:scale-105"
              }`}
            >
              {statusBadge[s].label}
            </button>
          ))}
        </div>

        <div className="hidden lg:block w-px h-8 bg-white/20 my-auto"></div>

        <button
          onClick={() => setOnlyFav(v => !v)}
          className={`px-4 py-2.5 rounded-xl text-sm font-medium border inline-flex items-center gap-2 transition-all duration-200 ${
            onlyFav
              ? "bg-yellow-500/15 border-yellow-400/30 text-yellow-300 scale-105 shadow-lg"
              : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 text-white/80 hover:scale-105"
          }`}
          title="Apenas favoritos"
        >
          <IconStar className="w-4 h-4" /> Favoritos
        </button>

        {(types.size || statuses.size || onlyFav || query) ? (
          <button
            onClick={() => { setTypes(new Set()); setStatuses(new Set()); setOnlyFav(false); setQuery(""); }}
            className="ml-auto px-4 py-2.5 rounded-xl text-sm font-medium bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 transition-all duration-200"
          >
            Limpar Filtros
          </button>
        ) : null}
      </motion.div>

      {/* Layout Principal */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-white/90 mb-2">Nenhum item encontrado</h3>
          <p className="text-white/60 mb-6">Tente ajustar os filtros ou adicionar novos itens à sua biblioteca</p>
          <button
            onClick={() => { setTypes(new Set()); setStatuses(new Set()); setOnlyFav(false); setQuery(""); }}
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

            {view === "grid" ? (
              <motion.div
                layout
                className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4"
              >
                {filtered.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <MediaCard
                      item={convertToDesignSystemItem(item)}
                      onEdit={(dsItem) => {
                        const originalItem = mediaItems.find(mi => mi.id === dsItem.id);
                        if (originalItem) {
                          setEditingMediaItem(originalItem);
                          setActivePage("edit-media");
                        }
                      }}
                      onDelete={(dsItem) => {
                        // Implementar delete
                        console.log('Delete:', dsItem.id);
                      }}
                      variant="default"
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div layout className="space-y-4">
                {filtered.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CardList
                      item={item}
                      onOpen={() => {
                        setEditingMediaItem(item);
                        setActivePage("edit-media");
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Sidebar com Destaques */}
          <div className="xl:col-span-1">
            <div className="sticky top-6 space-y-8">
              {/* Melhor Item */}
              {bestItem && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-xl font-bold text-white/90 mb-4">Destaque</h3>
                  <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4 cursor-pointer hover:scale-105 transition-transform duration-300"
                         onClick={() => {
                           setEditingMediaItem(bestItem);
                           setActivePage("edit-media");
                         }}>
                      {bestItem.cover ? (
                        <img
                          src={bestItem.cover}
                          alt={bestItem.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-700/60 to-slate-800/80 flex items-center justify-center">
                          <div className="text-center">
                            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${typePill[bestItem.type]} flex items-center justify-center mb-3 mx-auto`}>
                              {IconType[bestItem.type]}
                            </div>
                            <span className="text-white/80 font-bold text-2xl">{bestItem.title.charAt(0)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <h4 className="font-semibold text-white mb-2 line-clamp-2">{bestItem.title}</h4>
                    {bestItem.rating && (
                      <div className="flex items-center gap-2 text-yellow-400 mb-3">
                        <IconStar className="w-4 h-4" />
                        <span className="font-bold">{bestItem.rating}/10</span>
                      </div>
                    )}
                    <div className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium ${statusBadge[bestItem.status].cls}`}>
                      {statusBadge[bestItem.status].label}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Itens Recentes */}
              {recentItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <h3 className="text-xl font-bold text-white/90 mb-4">Recentes</h3>
                  <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
                    <div className="space-y-3">
                      {recentItems.slice(0, 5).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                          onClick={() => {
                            setEditingMediaItem(item);
                            setActivePage("edit-media");
                          }}
                        >
                          <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-700/50 flex-shrink-0">
                            {item.cover ? (
                              <img
                                src={item.cover}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-white/60 text-xs font-bold">{item.title.charAt(0)}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white/90 text-sm font-medium truncate">{item.title}</p>
                            <p className="text-white/60 text-xs">{typeLabels[item.type]}</p>
                          </div>
                          {item.rating && (
                            <div className="flex items-center gap-1 text-yellow-400">
                              <IconStar className="w-3 h-3" />
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
    </div>
  );
}

// ---------------- Cards

function CardGrid({ item, onOpen }: { item: MediaItem; onOpen(): void }) {
  const status = statusBadge[item.status];
  const [imageError, setImageError] = useState(false);

  return (
    <motion.button
      onClick={onOpen}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group text-left bg-gradient-to-b from-slate-800/40 to-slate-900/60 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-white/20 backdrop-blur-xl"
    >
      <div className="relative aspect-[3/4] bg-slate-800/60 overflow-hidden">
        {!imageError && item.cover ? (
          <img
            src={item.cover}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-700/60 to-slate-800/80 flex items-center justify-center">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${typePill[item.type]} flex items-center justify-center mb-3 mx-auto`}>
                {IconType[item.type]}
              </div>
              <span className="text-white/80 font-bold text-xl">{item.title.charAt(0)}</span>
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Type badge */}
        <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-br ${typePill[item.type]} border border-white/20 flex items-center gap-2 backdrop-blur-sm`}>
          {IconType[item.type]}
          <span className="hidden sm:inline">{typeLabels[item.type]}</span>
        </div>

        {/* Rating */}
        {item.rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 text-yellow-300 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-full text-sm border border-yellow-500/30">
            <IconStar className="w-4 h-4" />
            <span className="font-bold">{item.rating}</span>
          </div>
        )}

        {/* Status */}
        <div className={`absolute bottom-3 left-3 px-3 py-1.5 rounded-full text-xs font-medium ${status.cls} backdrop-blur-sm`}>
          {status.label}
        </div>

        {/* Progress for books */}
        {item.type === 'books' && item.totalPages && (
          <div className="absolute bottom-3 right-3 text-white/80 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-full text-xs font-medium">
            {Math.round(((item.currentPage ?? 0) / item.totalPages) * 100)}%
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-white leading-tight line-clamp-2 mb-2">{item.title}</h3>

        <div className="flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center gap-3">
            {item.hoursSpent ? (<span className="flex items-center gap-1">⏱ {item.hoursSpent}h</span>) : null}
            {item.totalPages ? (<span className="flex items-center gap-1">📖 {item.currentPage ?? 0}/{item.totalPages}</span>) : null}
            {item.platform ? (<span className="flex items-center gap-1">🎮 {item.platform}</span>) : null}
          </div>
        </div>

        {item.tags?.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.slice(0, 2).map(t => (
              <span key={t} className="text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/10 text-white/70">
                #{t}
              </span>
            ))}
            {item.tags.length > 2 && (
              <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/50">
                +{item.tags.length - 2}
              </span>
            )}
          </div>
        ) : null}
      </div>
    </motion.button>
  );
}

function CardList({ item, onOpen }: { item: MediaItem; onOpen(): void }) {
  const status = statusBadge[item.status];
  return (
    <button
      onClick={onOpen}
      className="group w-full text-left bg-slate-900/60 border border-white/8 rounded-2xl overflow-hidden hover:-translate-y-0.5 transition shadow-lg shadow-black/20"
    >
      <div className="flex">
        <div className="relative w-28 sm:w-40 aspect-[3/4] shrink-0 bg-slate-800/60">
          {item.cover ? (
            <img src={item.cover} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
          ) : null}
          <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-[11px] bg-gradient-to-br ${typePill[item.type]} border border-white/10 flex items-center gap-1.5`}>
            {IconType[item.type]} {labelType(item.type)}
          </div>
        </div>
        <div className="p-4 sm:p-5 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg font-semibold">{item.title}</div>
              <div className="mt-1 text-sm text-white/60 flex flex-wrap gap-3">
                {item.platform && <span>🎮 {item.platform}</span>}
                {item.hoursSpent ? <span>⏱ {item.hoursSpent}h</span> : null}
                {item.totalPages ? <span>📖 {item.currentPage ?? 0}/{item.totalPages}</span> : null}
                <span className={`${status.cls} px-2 py-0.5 rounded-full text-[11px]`}>{status.label}</span>
              </div>
            </div>
            <div className="text-yellow-300 bg-black/30 px-2 py-1 rounded-full text-sm inline-flex items-center gap-1">
              <IconStar /> {(item.rating ?? 0).toFixed(1)}
            </div>
          </div>

          {item.description ? (
            <p className="mt-2 text-sm text-white/70 line-clamp-2">{item.description}</p>
          ) : null}

          {item.tags?.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.tags.slice(0, 6).map(t => (
                <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70">
                  #{t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </button>
  );
}

// Util
function labelType(t: MediaType) {
  switch (t) {
    case "games": return "Games";
    case "anime": return "Anime";
    case "series": return "Séries";
    case "books": return "Livros";
    case "movies": return "Filmes";
  }
}
