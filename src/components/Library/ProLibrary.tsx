import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Star,
  Edit2,
  Trash2,
  BookOpen,
  Film,
  Gamepad2,
  Tv
} from "lucide-react";
import { SearchBar } from "../SearchBar";
import { LibraryFilters } from "./LibraryFilters";
import { FeaturedSection } from "./FeaturedSection";
import { CollectionGrid } from "./CollectionGrid";
import { ManualAddModal } from "./ManualAddModal";
import MediaPreviewModal from "./MediaPreviewModal";
import { FloatingParticles } from "../../design-system";

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

  // Get category icon
  const getCategoryIcon = (type: string) => {
    switch (type) {
      case "game":
        return <Gamepad2 className="w-4 h-4" />;
      case "book":
        return <BookOpen className="w-4 h-4" />;
      case "movie":
        return <Film className="w-4 h-4" />;
      case "tv":
      case "series":
        return <Tv className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
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
    <div className="min-h-screen p-6 md:p-10 lg:p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Background particles */}
      <FloatingParticles count={6} color="cyan" className="absolute inset-0 opacity-30" />

      {/* Cabeçalho com busca - Modernizado */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            My Books
          </h1>
          <p className="text-slate-400">
            Seu espaço geek com estilo moderno ✨
          </p>
        </div>

        <SearchBar value={search} onChange={setSearch} />
      </header>

      {/* Filtros modernos */}
      <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pb-4 mb-10 relative z-10">
        {["all", "game", "book", "movie", "tv", "anime"].map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(category)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl border transition-all whitespace-nowrap ${
              filter === category
                ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
                : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20"
            }`}
          >
            {category !== "all" && getCategoryIcon(category)}
            <span className="capitalize">
              {category === "all" ? "Todos" : category}
            </span>
          </motion.button>
        ))}
      </div>

      <main className="space-y-16 mt-10 relative z-10">
        {/* Hero Section com destaque principal */}
        {featured.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Best Book</h2>
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-cyan-600/20 backdrop-blur-xl border border-white/10 p-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Featured Book Cover */}
                <div className="w-48 h-72 rounded-2xl overflow-hidden flex-shrink-0">
                  {featured[0]?.cover ? (
                    <img
                      src={featured[0].cover}
                      alt={featured[0].title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                      Sem Capa
                    </div>
                  )}
                </div>

                {/* Featured Content */}
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-4">
                    {featured[0]?.title || "Descobertas Incríveis"}
                  </h3>
                  <p className="text-slate-300 mb-6 text-lg leading-relaxed">
                    {featured[0]?.notes || "Explore novos mundos e histórias fascinantes em nossa coleção curada especialmente para você."}
                  </p>

                  {featured[0]?.rating && (
                    <div className="flex items-center gap-2 mb-6">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-lg font-semibold text-white">
                        {featured[0].rating}/10
                      </span>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all"
                  >
                    READ MORE
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Popular Section */}
        {topRated.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Popular</h2>
              <button className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
                ALL BOOKS →
              </button>
            </div>
            <div className="flex gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pb-4">
              {topRated.slice(0, 8).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex-shrink-0 w-40 cursor-pointer"
                  onClick={() => handleCardClick(item)}
                >
                  <div className="relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 hover:border-violet-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/20">
                    <div className="h-56 relative">
                      {item.cover ? (
                        <img
                          src={item.cover}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 text-xs">
                          Sem Capa
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-white mb-1 text-sm line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(item.type)}
                        <span className="text-xs text-violet-400 capitalize">
                          {item.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Seção Destaques - Mantendo original */}
        <FeaturedSection
          items={featured}
          onEdit={() => console.log("Editar destaques")}
        />

        {/* Coleção completa - Grid modernizado */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Minha Coleção</h2>
            <div className="text-sm text-slate-400">
              {filteredCollection.length} itens
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredCollection.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.02 }}
                whileHover={{ scale: 1.03 }}
                className="group cursor-pointer"
                onClick={() => handleCardClick(item)}
              >
                <div className="relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 hover:border-violet-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/20">
                  <div className="aspect-[3/4] relative">
                    {item.cover ? (
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 text-xs">
                        Sem Capa
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Action Buttons (hover) */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Edit:", item);
                        }}
                        className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-violet-500/50 transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Delete:", item);
                        }}
                        className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-red-500/50 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </motion.button>
                    </div>

                    {/* Rating */}
                    {item.rating && (
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-white font-medium">
                          {item.rating}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(item.type)}
                      <span className="text-xs text-violet-400 capitalize">
                        {item.type}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCollection.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-300 mb-2">
                Nenhum item encontrado
              </h3>
              <p className="text-slate-400 mb-4">
                {search
                  ? "Tente ajustar sua busca"
                  : "Comece adicionando sua primeira mídia"}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all"
              >
                Adicionar Mídia
              </motion.button>
            </motion.div>
          )}
        </motion.section>
      </main>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full shadow-lg hover:shadow-xl hover:shadow-violet-500/25 flex items-center justify-center transition-all duration-300 z-40"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>

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
