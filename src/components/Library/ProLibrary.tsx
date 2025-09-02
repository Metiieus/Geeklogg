import React, { useState } from "react";
import React, { useState } from "react";
import { SearchBar } from "../SearchBar";
import { LibraryFilters } from "./LibraryFilters";
import { FeaturedSection } from "./FeaturedSection";
import { CollectionGrid } from "./CollectionGrid";
import { ManualAddModal } from "./ManualAddModal";
import MediaPreviewModal from "./MediaPreviewModal";

import { MediaItem } from "../../App"; // tipagem compartilhada

interface ProLibraryProps {
  featured?: MediaItem[];
  recent?: MediaItem[];
  topRated?: MediaItem[];
  collection?: MediaItem[];
}

const ProLibrary: React.FC<ProLibraryProps> = ({
  featured = [],
  recent = [],
  topRated = [],
  collection = [],
}) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Estado do preview modal
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Abre o modal ao clicar no card
  const handleCardClick = (item: MediaItem) => {
    setSelectedItem(item);
    setIsPreviewOpen(true);
  };

  // Filtra a coleção por texto e tag
  const filteredCollection = collection.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" || item.type?.toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen p-6 md:p-10 lg:p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Cabeçalho com busca */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            Minha Biblioteca
          </h1>
          <p className="text-slate-400">
            Seu espaço geek com estilo moderno ✨
          </p>
        </div>

        <SearchBar value={search} onChange={setSearch} />
      </header>

      {/* Filtros */}
      <LibraryFilters activeFilter={filter} onChange={setFilter} />

      <main className="space-y-16 mt-10">
        {/* Seção Destaques */}
        <FeaturedSection
          items={featured}
          onEdit={() => console.log("Editar destaques")}
        />

        {/* Coleção completa */}
        <CollectionGrid
          items={filteredCollection}
          onCardClick={handleCardClick}
        />

        {/* Botão de adicionar mídia */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-lg font-semibold transition"
          >
            + Adicionar Mídia
          </button>
        </div>
      </main>

      {/* Modal de adicionar manualmente */}
      {showAddModal && (
        <ManualAddModal onClose={() => setShowAddModal(false)} />
      )}

      {/* Modal de preview */}
      <MediaPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        item={selectedItem}
        onEdit={(item) => console.log("Editar mídia:", item)}
        onDelete={(item) => console.log("Excluir mídia:", item)}
        onToggleFavorite={(item) => console.log("Favoritar mídia:", item)}
      />
    </div>
  );
};

export default ProLibrary;
