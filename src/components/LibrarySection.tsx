import React, { useMemo, useState, useDeferredValue } from "react";
import { useAppContext } from "../context/AppContext";

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
  "in-progress": { label: "Em progresso", cls: "bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/20" },
  "dropped": { label: "Dropado", cls: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/20" },
  "planned": { label: "Planejado", cls: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/20" },
};

const typePill: Record<MediaType, string> = {
  games: "from-cyan-500/20 to-cyan-400/10 text-cyan-300",
  anime: "from-pink-500/20 to-pink-400/10 text-pink-300",
  series: "from-indigo-500/20 to-indigo-400/10 text-indigo-300",
  books: "from-amber-500/20 to-amber-400/10 text-amber-300",
  movies: "from-fuchsia-500/20 to-fuchsia-400/10 text-fuchsia-300",
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
      <div className="p-6 md:p-8 text-white">
        <div className="rounded-3xl bg-gradient-to-b from-slate-800/60 to-slate-900/60 border border-white/5 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none"
               style={{ background: "radial-gradient(1200px 400px at 20% -10%, rgba(6,182,212,0.12), transparent 40%), radial-gradient(1000px 300px at 80% 120%, rgba(139,92,246,0.12), transparent 40%)" }}/>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Minha Biblioteca</h1>
          <p className="mt-3 text-white/70 max-w-xl">
            Organize sua jornada geek com estilo e inteligência.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setActivePage("add-media")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 transition shadow-lg shadow-cyan-600/20"
            >
              <IconPlus /> Adicionar Mídia
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 text-white">
      {/* Header + Ações */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold">Biblioteca</h1>
          <p className="text-white/60 mt-1">{filtered.length} itens encontrados</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage("add-media")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 transition"
          >
            <IconPlus /> Adicionar
          </button>

          <div className="flex p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setView("grid")}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 ${view === "grid" ? "bg-white/10" : "hover:bg-white/5"}`}
              title="Grade"
            >
              <IconGrid />
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 ${view === "list" ? "bg-white/10" : "hover:bg-white/5"}`}
              title="Lista"
            >
              <IconList />
            </button>
          </div>
        </div>
      </div>

      {/* Barra de busca e ordenação */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center mb-4">
        <div className="flex-1 relative">
          <IconSearch />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título ou tags..."
            className="w-full bg-slate-800/60 border border-white/10 rounded-xl px-10 py-3 outline-none focus:border-cyan-400/40 placeholder-white/40"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
            <IconSearch />
          </div>
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90"
              aria-label="Limpar busca"
            >
              ×
            </button>
          )}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="bg-slate-800/60 border border-white/10 rounded-xl px-3 py-3 outline-none focus:border-cyan-400/40"
        >
          <option value="updatedAt">Mais recentes</option>
          <option value="createdAt">Data de inclusão</option>
          <option value="rating">Maior nota</option>
          <option value="title">Título (A–Z)</option>
        </select>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["games","anime","series","books","movies"] as MediaType[]).map(t => (
          <button
            key={t}
            onClick={() => toggleSet(setTypes, t)}
            className={`px-3 py-2 rounded-full text-sm bg-gradient-to-br ${typePill[t]} border ${types.has(t) ? "border-white/30 ring-2 ring-white/20" : "border-white/10 hover:border-white/20"}`}
          >
            <span className="inline-flex items-center gap-2">
              {IconType[t]} {labelType(t)}
            </span>
          </button>
        ))}

        <span className="mx-2 opacity-40">|</span>

        {(["completed","in-progress","dropped","planned"] as Status[]).map(s => (
          <button
            key={s}
            onClick={() => toggleSet(setStatuses, s)}
            className={`px-3 py-2 rounded-full text-sm border ${statuses.has(s) ? "bg-white/10 border-white/30" : "bg-white/5 border-white/10 hover:border-white/20"}`}
          >
            {statusBadge[s].label}
          </button>
        ))}

        <span className="mx-2 opacity-40">|</span>

        <button
          onClick={() => setOnlyFav(v => !v)}
          className={`px-3 py-2 rounded-full text-sm border inline-flex items-center gap-2 ${onlyFav ? "bg-yellow-500/10 border-yellow-400/30 text-yellow-300" : "bg-white/5 border-white/10 hover:border-white/20"}`}
          title="Apenas favoritos"
        >
          <IconStar /> Favoritos
        </button>

        {(types.size || statuses.size || onlyFav || query) ? (
          <button
            onClick={() => { setTypes(new Set()); setStatuses(new Set()); setOnlyFav(false); setQuery(""); }}
            className="ml-auto px-3 py-2 rounded-full text-sm bg-white/5 border border-white/10 hover:bg-white/10"
          >
            Limpar filtros
          </button>
        ) : null}
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="p-8 text-center text-white/70">
          Nada por aqui. Tente ajustar os filtros.
        </div>
      ) : view === "grid" ? (
        <div
          className="grid gap-4 sm:gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))" }}
        >
          {filtered.map(item => (
            <CardGrid
              key={item.id}
              item={item}
              onOpen={() => {
                setEditingMediaItem(item);
                setActivePage("edit-media");
              }}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <CardList
              key={item.id}
              item={item}
              onOpen={() => {
                setEditingMediaItem(item);
                setActivePage("edit-media");
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------- Cards

function CardGrid({ item, onOpen }: { item: MediaItem; onOpen(): void }) {
  const status = statusBadge[item.status];
  return (
    <button
      onClick={onOpen}
      className="group text-left bg-slate-900/60 border border-white/8 rounded-2xl overflow-hidden hover:-translate-y-0.5 transition shadow-lg shadow-black/20 hover:shadow-cyan-500/10"
    >
      <div className="relative aspect-[3/4] bg-slate-800/60">
        {item.cover ? (
          <img src={item.cover} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/50">Sem capa</div>
        )}
        {/* Gradiente */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />
        {/* Type pill */}
        <div className={`absolute top-2 left-2 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gradient-to-br ${typePill[item.type]} border border-white/10 flex items-center gap-1.5`}>
          {IconType[item.type]} {labelType(item.type)}
        </div>
        {/* Nota */}
        <div className="absolute top-2 right-2 flex items-center gap-1 text-yellow-300 bg-black/40 px-2 py-1 rounded-full text-xs">
          <IconStar /> {(item.rating ?? 0).toFixed(1)}
        </div>
        {/* Status */}
        <div className={`absolute bottom-2 left-2 px-2.5 py-1 rounded-full text-[11px] font-medium ${status.cls}`}>
          {status.label}
        </div>
      </div>
      <div className="p-3">
        <div className="font-semibold truncate">{item.title}</div>
        <div className="mt-1 text-xs text-white/60 flex items-center gap-3">
          {item.hoursSpent ? (<span>⏱ {item.hoursSpent}h</span>) : null}
          {item.totalPages ? (<span>📖 {item.currentPage ?? 0}/{item.totalPages}</span>) : null}
          {item.platform ? (<span>🎮 {item.platform}</span>) : null}
        </div>
        {item.tags?.length ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.tags.slice(0, 3).map(t => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70">
                #{t}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        ) : null}
      </div>
    </button>
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
    case "series": return "Series";
    case "books": return "Books";
    case "movies": return "Movies";
  }
}
