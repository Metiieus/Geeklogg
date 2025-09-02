import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Star,
  Edit2,
  Trash2,
  Play,
  BookOpen,
  Film,
  Gamepad2,
  Tv,
  User,
} from "lucide-react";

// Design System Imports
import {
  HeroBanner,
  MediaCard,
  GlassInput,
  FloatingParticles,
  colors,
  gradients,
} from "../design-system";

// Types
interface MediaItem {
  id: string;
  title: string;
  cover?: string;
  category: "game" | "book" | "movie" | "series" | "anime";
  rating?: number;
  description?: string;
  year?: number;
  isOnline?: boolean;
}

interface ModernLibraryProps {
  featured?: MediaItem[];
  highlights?: MediaItem[];
  collection?: MediaItem[];
  onAddMedia?: () => void;
  onEditMedia?: (item: MediaItem) => void;
  onDeleteMedia?: (item: MediaItem) => void;
  onSearchOnline?: (query: string) => void;
}

const ModernLibrary: React.FC<ModernLibraryProps> = ({
  featured = [],
  highlights = [],
  collection = [],
  onAddMedia,
  onEditMedia,
  onDeleteMedia,
  onSearchOnline,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "game":
        return <Gamepad2 className="w-4 h-4" />;
      case "book":
        return <BookOpen className="w-4 h-4" />;
      case "movie":
        return <Film className="w-4 h-4" />;
      case "series":
        return <Tv className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  // Filter collection
  const filteredCollection = collection.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle card click
  const handleCardClick = (item: MediaItem) => {
    setSelectedItem(item);
    setIsPreviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Background particles */}
      <FloatingParticles count={8} color="cyan" className="absolute inset-0" />

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/30">
              <div className="bg-gradient-to-r from-violet-400 to-cyan-500 bg-clip-text text-transparent">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold">GeekLog</h1>
              <p className="text-xs text-slate-400">Minha Biblioteca</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar mídia..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
              />
            </div>
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-500 p-0.5">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-6 max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        {featured.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <HeroBanner
              title="Destaque da Semana"
              subtitle={featured[0]?.title || "Descobertas Incríveis"}
              onAddMedia={onAddMedia}
            />
          </motion.section>
        )}

        {/* Highlights Carousel */}
        {highlights.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Destaques</h2>
              <div className="text-sm text-slate-400">
                {highlights.length} itens
              </div>
            </div>
            <div className="flex gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pb-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex-shrink-0 w-64 cursor-pointer"
                  onClick={() => handleCardClick(item)}
                >
                  <div className="relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 hover:border-violet-500/50 transition-all duration-300">
                    {/* Cover Image */}
                    <div className="h-48 relative">
                      {item.cover ? (
                        <img
                          src={item.cover}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                          Sem Capa
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {/* Play Button */}
                      <div className="absolute top-4 right-4">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {getCategoryIcon(item.category)}
                        <span className="text-xs text-violet-400 capitalize">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="font-semibold text-white mb-1 truncate">
                        {item.title}
                      </h3>
                      {item.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm text-slate-300">
                            {item.rating}/10
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Category Filters */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pb-2">
            {["all", "game", "book", "movie", "series", "anime"].map(
              (category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl border transition-all ${
                    selectedCategory === category
                      ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  {category !== "all" && getCategoryIcon(category)}
                  <span className="capitalize whitespace-nowrap">
                    {category === "all" ? "Todos" : category}
                  </span>
                </motion.button>
              )
            )}
          </div>
        </motion.section>

        {/* My Collection Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Minha Coleção</h2>
            <div className="text-sm text-slate-400">
              {filteredCollection.length} itens
            </div>
          </div>

          {/* Collection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredCollection.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.03 }}
                className="group cursor-pointer"
                onClick={() => handleCardClick(item)}
              >
                <div className="relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 hover:border-violet-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/20">
                  {/* Cover Image */}
                  <div className="h-64 relative">
                    {item.cover ? (
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                        Sem Capa
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Online Badge */}
                    {item.isOnline && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-cyan-500/80 backdrop-blur-sm rounded-lg text-xs font-medium">
                          Online
                        </span>
                      </div>
                    )}

                    {/* Action Buttons (visible on hover) */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditMedia?.(item);
                        }}
                        className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-violet-500/50 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteMedia?.(item);
                        }}
                        className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-red-500/50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(item.category)}
                      <span className="text-xs text-violet-400 capitalize">
                        {item.category}
                      </span>
                      {item.year && (
                        <span className="text-xs text-slate-500">
                          • {item.year}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-white mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    {item.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-slate-300">
                          {item.rating}/10
                        </span>
                      </div>
                    )}
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
                {searchQuery
                  ? "Tente ajustar sua busca"
                  : "Comece adicionando sua primeira mídia"}
              </p>
              {onAddMedia && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onAddMedia}
                  className="px-6 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all"
                >
                  Adicionar Mídia
                </motion.button>
              )}
            </motion.div>
          )}
        </motion.section>
      </main>

      {/* Floating Action Button */}
      {onAddMedia && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onAddMedia}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full shadow-lg hover:shadow-xl hover:shadow-violet-500/25 flex items-center justify-center transition-all duration-300 z-40"
        >
          <Plus className="w-6 h-6 text-white" />
        </motion.button>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
            onClick={() => setIsPreviewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
            >
              <div className="flex">
                {/* Cover */}
                <div className="w-1/3 h-96">
                  {selectedItem.cover ? (
                    <img
                      src={selectedItem.cover}
                      alt={selectedItem.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                      Sem Capa
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {getCategoryIcon(selectedItem.category)}
                    <span className="text-sm text-violet-400 capitalize">
                      {selectedItem.category}
                    </span>
                    {selectedItem.year && (
                      <span className="text-sm text-slate-500">
                        • {selectedItem.year}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-4">
                    {selectedItem.title}
                  </h2>

                  {selectedItem.description && (
                    <p className="text-slate-300 mb-4">
                      {selectedItem.description}
                    </p>
                  )}

                  {selectedItem.rating && (
                    <div className="flex items-center gap-2 mb-6">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-lg font-semibold text-white">
                        {selectedItem.rating}/10
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        onEditMedia?.(selectedItem);
                        setIsPreviewOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-violet-500/20 border border-violet-500/50 rounded-lg text-violet-300 hover:bg-violet-500/30 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        onDeleteMedia?.(selectedItem);
                        setIsPreviewOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModernLibrary;
