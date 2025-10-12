import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Star,
  BookOpen,
  Film,
  Gamepad2,
  Tv,
  Book,
  Sparkles,
  TrendingUp,
  Edit2,
  ArrowRight,
  Heart
} from "lucide-react";
import MediaPreviewModal from "./MediaPreviewModal";
import AddMediaSearchModal from "../modals/AddMediaSearchModal";
import { EditMediaModal } from "../modals/EditMediaModal";
import { ManualAddModal } from "./ManualAddModal";
import { AddMediaConfirmModal } from "../modals/AddMediaConfirmModal";
import { EditBeforeAddModal } from "../modals/EditBeforeAddModal";
import { EditFeaturedPopularModal } from "../modals/EditFeaturedPopularModal";
import { MediaItem } from "../../App";
import { useAppContext } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { addMedia, updateMedia, deleteMedia } from "../../services/mediaService";
import { ExternalMediaResult } from "../../services/externalMediaService";
import { ConfirmationModal } from "../ConfirmationModal";

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
  const [filter, setFilter] = useState<string>("all");
  const [showAddSearchModal, setShowAddSearchModal] = useState(false);
  const [showManualAddModal, setShowManualAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<MediaItem | null>(null);
  const [pendingMedia, setPendingMedia] = useState<ExternalMediaResult | null>(null);
  const [editingPendingMedia, setEditingPendingMedia] = useState<ExternalMediaResult | null>(null);
  const [showEditFeaturedModal, setShowEditFeaturedModal] = useState(false);
  const [showEditPopularModal, setShowEditPopularModal] = useState(false);
  const [customFeatured, setCustomFeatured] = useState<MediaItem[]>(featured);
  const [customPopular, setCustomPopular] = useState<MediaItem[]>(topRated);

  const { mediaItems, setMediaItems } = useAppContext();
  const { showToast } = useToast();

  // Get category icon
  const getCategoryIcon = (type: string, className: string = "w-4 h-4") => {
    switch (type?.toLowerCase()) {
      case "game":
      case "games":
        return <Gamepad2 className={className} />;
      case "book":
      case "books":
        return <BookOpen className={className} />;
      case "movie":
      case "movies":
        return <Film className={className} />;
      case "tv":
      case "series":
        return <Tv className={className} />;
      default:
        return <Book className={className} />;
    }
  };

  // Filter collection
  const filteredCollection = collection.filter((item) => {
    const matchesFilter =
      filter === "all" || item.type?.toLowerCase() === filter.toLowerCase();
    return matchesFilter;
  });

  // Get favorites
  const favorites = collection.filter((item) => item.isFavorite);

  // Best per category by tag (Portuguese category tags)
  const getBestByCategoryTag = (tag: string) => {
    return collection
      .filter((item) => Array.isArray(item.tags) && item.tags.map((t) => (t || '').toLowerCase()).includes(tag))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
  };

  const bestPerCategory: { title: string; tag: string; icon: React.ElementType; item?: MediaItem }[] = [
    { title: "Melhor Jogo", tag: "game", icon: Gamepad2 },
    { title: "Melhor Filme", tag: "filme", icon: Film },
    { title: "Melhor Série", tag: "serie", icon: Tv },
    { title: "Melhor Livro", tag: "livro", icon: BookOpen },
    { title: "Melhor Anime", tag: "anime", icon: Tv },
  ].map((c) => ({ ...c, item: getBestByCategoryTag(c.tag) }));

  const handleCardClick = (item: MediaItem) => {
    setSelectedItem(item);
    setIsPreviewOpen(true);
  };

  const handleMediaSelected = (result: ExternalMediaResult) => {
    setPendingMedia(result);
    setShowAddSearchModal(false);
  };

  const handleConfirmAdd = async (result: ExternalMediaResult) => {
    setIsAddingMedia(true);
    try {
      // Ensure category tag is present and tags are mandatory
      const typeToCategoryTag = (t?: string): string | null => {
        switch ((t || "").toLowerCase()) {
          case "game":
          case "games":
            return "game";
          case "movie":
          case "movies":
            return "filme";
          case "tv":
          case "series":
            return "serie";
          case "book":
          case "books":
            return "livro";
          case "anime":
            return "anime";
          default:
            return null;
        }
      };
      const categoryTag = typeToCategoryTag(result.originalType || "");

      const newMedia = await addMedia({
        title: result.title,
        type: result.originalType || "book",
        cover: result.image,
        year: result.year,
        author: result.authors?.join(", "),
        director: result.director,
        genre: result.genres?.join(", "),
        notes: result.description,
        rating: result.rating,
        status: "completed",
        isFavorite: false,
        tags: categoryTag ? [categoryTag] : ["geral"],
      });

      setMediaItems([...mediaItems, newMedia]);
      showToast("Mídia adicionada com sucesso!", "success");
      setPendingMedia(null);
    } catch (error) {
      console.error("Erro ao adicionar mídia:", error);
      showToast("Erro ao adicionar mídia. Tente novamente.", "error");
    } finally {
      setIsAddingMedia(false);
    }
  };

  const handleEditBeforeAdd = (media: ExternalMediaResult) => {
    setEditingPendingMedia(media);
    setPendingMedia(null);
  };

  const handleSaveEditedMedia = async (media: ExternalMediaResult) => {
    await handleConfirmAdd(media);
    setEditingPendingMedia(null);
  };

  const handleEditMedia = (item: MediaItem) => {
    setEditingItem(item);
    setIsPreviewOpen(false);
  };

  const handleUpdateMedia = async (id: string, updates: Partial<MediaItem>) => {
    try {
      await updateMedia(id, updates);
      const updatedItems = mediaItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      );
      setMediaItems(updatedItems);
      showToast("Mídia atualizada com sucesso!", "success");
      setEditingItem(null);
    } catch (error) {
      console.error("Erro ao atualizar mídia:", error);
      showToast("Erro ao atualizar mídia. Tente novamente.", "error");
    }
  };

  const handleDeleteMedia = async (item: MediaItem) => {
    setDeleteConfirmItem(item);
    setIsPreviewOpen(false);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmItem) return;

    try {
      await deleteMedia(deleteConfirmItem.id);
      const updatedItems = mediaItems.filter((item) => item.id !== deleteConfirmItem.id);
      setMediaItems(updatedItems);
      showToast("Mídia excluída com sucesso!", "success");
      setDeleteConfirmItem(null);
    } catch (error) {
      console.error("Erro ao excluir mídia:", error);
      showToast("Erro ao excluir mídia. Tente novamente.", "error");
    }
  };

  const handleToggleFavorite = async (item: MediaItem) => {
    try {
      const newFavoriteStatus = !item.isFavorite;
      await updateMedia(item.id, { isFavorite: newFavoriteStatus });
      const updatedItems = mediaItems.map((m) =>
        m.id === item.id ? { ...m, isFavorite: newFavoriteStatus } : m
      );
      setMediaItems(updatedItems);
      showToast(
        newFavoriteStatus ? "Adicionado aos favoritos!" : "Removido dos favoritos!",
        "success"
      );
      setIsPreviewOpen(false);
    } catch (error) {
      console.error("Erro ao favoritar mídia:", error);
      showToast("Erro ao favoritar mídia. Tente novamente.", "error");
    }
  };

  const handleEditFeatured = () => {
    setShowEditFeaturedModal(true);
  };

  const handleEditPopular = () => {
    setShowEditPopularModal(true);
  };

  const handleSaveFeatured = (items: MediaItem[]) => {
    setCustomFeatured(items);
    showToast("Destaques atualizados com sucesso!", "success");
  };

  const handleSavePopular = (items: MediaItem[]) => {
    setCustomPopular(items);
    showToast("Populares atualizados com sucesso!", "success");
  };

  return (
    <div className="min-h-screen text-white">
      {/* Modern Header */}
      <div className="sticky top-0 md:top-16 z-30 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1800px] mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            {/* Logo & Title */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">Minhas Mídias</h1>
                <p className="text-xs text-slate-400">{collection.length} itens</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter("favorites")}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium text-xs sm:text-sm transition-all flex-1 sm:flex-none justify-center ${
                  filter === "favorites"
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Favoritos ({favorites.length})</span>
                <span className="sm:hidden">({favorites.length})</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddSearchModal(true)}
                disabled={isAddingMedia}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-xl font-medium text-xs sm:text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50 flex-1 sm:flex-none justify-center"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{isAddingMedia ? "Adicionando..." : "Adicionar"}</span>
              </motion.button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-3 sm:mt-4 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
            {[
              { id: "all", label: "Todas", icon: null },
              { id: "book", label: "Livros", icon: BookOpen },
              { id: "game", label: "Jogos", icon: Gamepad2 },
              { id: "movie", label: "Filmes", icon: Film },
              { id: "tv", label: "Séries", icon: Tv },
            ].map((category) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(category.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap text-xs sm:text-sm font-medium ${
                    filter === category.id
                      ? "bg-white/10 text-white border border-white/20"
                      : "bg-transparent text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {Icon && <Icon className="w-3 h-3 sm:w-4 sm:h-4" />}
                  <span>{category.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-8 sm:space-y-12">
        {/* Hero Banner Carousel */}
        {customFeatured.length > 0 && filter === "all" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="relative h-[300px] sm:h-[400px] rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-white/10">
              {/* Background with blur */}
              <div
                className="absolute inset-0 bg-cover bg-center blur-2xl scale-110 opacity-30"
                style={{
                  backgroundImage: `url(${customFeatured[0]?.cover || ""})`,
                }}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />

              {/* Content */}
              <div className="relative h-full flex items-center px-4 sm:px-8 lg:px-12">
                <div className="max-w-2xl space-y-3 sm:space-y-6">
                  <div className="flex items-center gap-2 text-violet-400">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm font-medium">Coleção em Destaque</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                    Continue sua jornada..
                  </h2>

                  <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-xl hidden sm:block">
                    Continue explorando as histórias que você ama. Não pare de explorar sua lista e mergulhe no mundo do entretenimento.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCardClick(customFeatured[0])}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-900 hover:bg-slate-800 rounded-xl font-medium text-sm border border-white/10 hover:border-white/20 transition-all inline-flex items-center justify-center gap-2"
                    >
                      Ver Mais
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleEditFeatured}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium text-sm border border-white/10 hover:border-white/20 transition-all inline-flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Editar Destaques</span>
                      <span className="sm:hidden">Editar</span>
                    </motion.button>
                  </div>
                </div>

                {/* Featured Books Carousel - Hidden on mobile */}
                <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 gap-4">
                  {customFeatured.slice(0, 5).map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, zIndex: 10 }}
                      onClick={() => handleCardClick(item)}
                      className="cursor-pointer"
                      style={{
                        transform: `perspective(1000px) rotateY(${-10 + index * 2}deg)`,
                        zIndex: 5 - index,
                      }}
                    >
                      <div className="w-32 h-48 xl:w-44 xl:h-64 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 hover:border-violet-500/50 transition-all">
                        {item.cover ? (
                          <img
                            src={item.cover}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                            <BookOpen className="w-8 h-8 xl:w-12 xl:h-12 text-slate-600" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Favorites Section */}
        {filter === "favorites" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Heart className="w-6 h-6 text-pink-400 fill-pink-400" />
                Meus Favoritos
              </h3>
              <div className="text-sm text-slate-400">
                {favorites.length} favoritos
              </div>
            </div>

            {favorites.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 sm:gap-4">
                {favorites.map((item, index) => (
                  <MediaCard key={item.id} item={item} index={index} onClick={handleCardClick} getCategoryIcon={getCategoryIcon} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
                  <Heart className="w-10 h-10 text-slate-500" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  Nenhum favorito ainda
                </h4>
                <p className="text-slate-400 mb-6">
                  Adicione mídias aos favoritos para vê-las aqui
                </p>
              </div>
            )}
          </motion.section>
        )}

        {/* Best Items Grid - Only show when filter is "all" */}
        {filter === "all" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {bestBooks.length > 0 && (
              <BestItemsSection
                items={bestBooks}
                title="Melhores Livros"
                icon={BookOpen}
                onItemClick={handleCardClick}
                getCategoryIcon={getCategoryIcon}
              />
            )}

            {bestGames.length > 0 && (
              <BestItemsSection
                items={bestGames}
                title="Melhores Jogos"
                icon={Gamepad2}
                onItemClick={handleCardClick}
                getCategoryIcon={getCategoryIcon}
              />
            )}

            {bestMovies.length > 0 && (
              <BestItemsSection
                items={bestMovies}
                title="Melhores Filmes"
                icon={Film}
                onItemClick={handleCardClick}
                getCategoryIcon={getCategoryIcon}
              />
            )}
          </div>
        )}

        {/* Popular Section - Only show when filter is "all" */}
        {customPopular.length > 0 && filter === "all" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-400" />
                Populares
              </h3>
              <button
                onClick={handleEditPopular}
                className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
              {customPopular.slice(0, 8).map((item, index) => (
                <MediaCard key={item.id} item={item} index={index} onClick={handleCardClick} getCategoryIcon={getCategoryIcon} showInfo />
              ))}
            </div>
          </motion.section>
        )}

        {/* Full Collection Grid */}
        {filter !== "favorites" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                {filter === "all" ? "Minha Coleção" : `${filter === "book" ? "Livros" : filter === "game" ? "Jogos" : filter === "movie" ? "Filmes" : "Séries"}`}
              </h3>
              <div className="text-sm text-slate-400">
                {filteredCollection.length} / {collection.length} mídias
              </div>
            </div>

            {filteredCollection.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 sm:gap-4">
                {filteredCollection.map((item, index) => (
                  <MediaCard key={item.id} item={item} index={index} onClick={handleCardClick} getCategoryIcon={getCategoryIcon} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-slate-500" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  Nenhuma mídia encontrada
                </h4>
                <p className="text-slate-400 mb-6">
                  Comece construindo sua coleção
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddSearchModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-xl font-medium"
                >
                  Adicionar Primeira Mídia
                </motion.button>
              </div>
            )}
          </motion.section>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddSearchModal && (
          <AddMediaSearchModal
            onClose={() => setShowAddSearchModal(false)}
            onAddMedia={handleMediaSelected}
          />
        )}
        {showManualAddModal && (
          <ManualAddModal onClose={() => setShowManualAddModal(false)} />
        )}
        {pendingMedia && (
          <AddMediaConfirmModal
            media={pendingMedia}
            onConfirm={handleConfirmAdd}
            onEdit={handleEditBeforeAdd}
            onCancel={() => setPendingMedia(null)}
          />
        )}
        {editingPendingMedia && (
          <EditBeforeAddModal
            media={editingPendingMedia}
            onSave={handleSaveEditedMedia}
            onCancel={() => setEditingPendingMedia(null)}
          />
        )}
        {showEditFeaturedModal && (
          <EditFeaturedPopularModal
            isOpen={true}
            onClose={() => setShowEditFeaturedModal(false)}
            collection={collection}
            currentItems={customFeatured}
            onSave={handleSaveFeatured}
            title="Editar Destaques"
            maxItems={8}
          />
        )}
        {showEditPopularModal && (
          <EditFeaturedPopularModal
            isOpen={true}
            onClose={() => setShowEditPopularModal(false)}
            collection={collection}
            currentItems={customPopular}
            onSave={handleSavePopular}
            title="Editar Populares"
            maxItems={8}
          />
        )}
        {editingItem && (
          <EditMediaModal
            isOpen={true}
            onClose={() => setEditingItem(null)}
            item={editingItem}
            onSave={handleUpdateMedia}
          />
        )}
        {isPreviewOpen && selectedItem && (
          <MediaPreviewModal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            item={selectedItem}
            onEdit={handleEditMedia}
            onDelete={handleDeleteMedia}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
        {deleteConfirmItem && (
          <ConfirmationModal
            isOpen={true}
            title="Excluir Mídia"
            message={`Tem certeza que deseja excluir "${deleteConfirmItem.title}"?`}
            onConfirm={confirmDelete}
            onCancel={() => setDeleteConfirmItem(null)}
            confirmText="Excluir Permanentemente"
            cancelText="Cancelar"
            variant="danger"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Media Card Component
interface MediaCardProps {
  item: MediaItem;
  index: number;
  onClick: (item: MediaItem) => void;
  getCategoryIcon: (type: string, className?: string) => JSX.Element;
  showInfo?: boolean;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, index, onClick, getCategoryIcon, showInfo }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.02 }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      onClick={() => onClick(item)}
      className="group cursor-pointer"
    >
      <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-violet-500/20 transition-all">
        <div className="aspect-[2/3] relative">
          {item.cover ? (
            <img
              src={item.cover}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              {getCategoryIcon(item.type, "w-8 h-8 text-slate-600")}
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {item.isFavorite && (
            <div className="absolute top-2 left-2">
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
            </div>
          )}

          {item.rating && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-semibold text-white">
                {item.rating}
              </span>
            </div>
          )}

          {showInfo && (
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h4 className="text-sm font-semibold text-white line-clamp-2 mb-1">
                {item.title}
              </h4>
              <div className="flex items-center gap-1">
                {getCategoryIcon(item.type, "w-3 h-3 text-violet-400")}
                <span className="text-xs text-violet-400 capitalize">
                  {item.type}
                </span>
              </div>
            </div>
          )}

          {!showInfo && (
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
              <h4 className="text-sm font-semibold text-white line-clamp-2">
                {item.title}
              </h4>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Best Item Card Component
interface BestItemCardProps {
  item: MediaItem;
  title: string;
  icon: React.ElementType;
  onClick: () => void;
}

const BestItemCard: React.FC<BestItemCardProps> = ({ item, title, icon: Icon, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 cursor-pointer hover:border-violet-500/50 transition-all"
    >
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>

      <div className="flex gap-4">
        <div className="w-24 h-36 rounded-xl overflow-hidden flex-shrink-0 shadow-xl">
          {item.cover ? (
            <img
              src={item.cover}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
              <Icon className="w-8 h-8 text-slate-600" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <h4 className="text-base font-bold text-white line-clamp-2">
            {item.title}
          </h4>

          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.round((item.rating || 0) / 2)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-slate-600"
                }`}
              />
            ))}
          </div>

          <p className="text-xs text-slate-400 line-clamp-3">
            {item.notes || "Uma das suas melhores mídias avaliadas."}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

interface BestItemsSectionProps {
  items: MediaItem[];
  title: string;
  icon: React.ElementType;
  onItemClick: (item: MediaItem) => void;
  getCategoryIcon: (type: string, className?: string) => JSX.Element;
}

const BestItemsSection: React.FC<BestItemsSectionProps> = ({
  items,
  title,
  icon: Icon,
  onItemClick,
  getCategoryIcon,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onItemClick(item)}
            className="cursor-pointer group"
          >
            <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
              <div className="aspect-[2/3] relative">
                {item.cover ? (
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    {getCategoryIcon(item.type, "w-8 h-8 text-slate-600")}
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {item.rating && (
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-semibold text-white">
                      {item.rating}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                  <h4 className="text-xs font-semibold text-white line-clamp-2">
                    {item.title}
                  </h4>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProLibrary;
