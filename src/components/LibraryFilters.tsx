import React from "react";

interface LibraryFiltersProps {
  activeFilter: string;
  onChange: (filter: string) => void;
}

const filters = [
  { id: "all", label: "Todos" },
  { id: "game", label: "Jogos" },
  { id: "movie", label: "Filmes" },
  { id: "anime", label: "Animes" },
  { id: "tv", label: "Séries" },
  { id: "book", label: "Livros" },
  { id: "manga", label: "Mangás" },
];

export const LibraryFilters: React.FC<LibraryFiltersProps> = ({
  activeFilter,
  onChange,
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => onChange(f.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeFilter === f.id
              ? "bg-cyan-600 text-white shadow-lg"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};
