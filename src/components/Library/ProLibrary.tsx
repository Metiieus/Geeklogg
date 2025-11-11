import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  Heart,
  Trophy,
  Medal,
  Award,
  ChevronLeft,
  ChevronRight
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
import { ArchiviusAgent } from "../ArchiviusAgent";
import { BestMediaModal } from "../modals/BestMediaModal";

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
  const [sortBy, setSortBy] = useState<string>("recent"); // recent, title, rating, type
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
  const [showBestMediaModal, setShowBestMediaModal] = useState(false);
  const [bestMediaCategory, setBestMediaCategory] = useState<string>("");
  const [bestMedia, setBestMedia] = useState<Record<string, MediaItem[]>>({});
  const [currentPodiumIndex, setCurrentPodiumIndex] = useState(0);

  // Carregar destaques e melhores salvos
  useEffect(() => {
    const savedFeaturedIds = localStorage.getItem('customFeatured');
    if (savedFeaturedIds) {
      try {
        const ids: string[] = JSON.parse(savedFeaturedIds);
        const savedItems = collection.filter(item => ids.includes(item.id));
        if (savedItems.length > 0) {
          setCustomFeatured(savedItems);
        }
      } catch (error) {
        console.error('Erro ao carregar destaques:', error);
      }
    }

    // Carregar melhores mídias
    const savedBestMedia = localStorage.getItem('bestMedia');
    if (savedBestMedia) {
      try {
        const bestData: Record<string, string[]> = JSON.parse(savedBestMedia);
        const loadedBest: Record<string, MediaItem[]> = {};
        
        Object.keys(bestData).forEach(category => {
          const ids = bestData[category];
          loadedBest[category] = collection.filter(item => ids.includes(item.id));
        });
        
        setBestMedia(loadedBest);
      } catch (error) {
        console.error('Erro ao carregar melhores mídias:', error);
      }
    }
  }, [collection]);

  // Auto-play do carrossel de pódio
  useEffect(() => {
    const categories = ["book", "game", "movie", "tv", "anime"];
    const interval = setInterval(() => {
      setCurrentPodiumIndex((prev) => (prev + 1) % categories.length);
    }, 5000); // Troca a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

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

  // Filter and sort collection (otimizado com useMemo)
  const filteredCollection = useMemo(() => {
    return collection
      .filter((item) => {
        const matchesFilter =
          filter === "all" || item.type?.toLowerCase() === filter.toLowerCase();
        return matchesFilter;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "title":
            return (a.title || "").localeCompare(b.title || "");
          case "rating":
            return (b.rating || 0) - (a.rating || 0);
          case "type":
            return (a.type || "").localeCompare(b.type || "");
          case "recent":
          default:
            // Ordenar por data de adição (mais recente primeiro)
            return (b.createdAt || 0) - (a.createdAt || 0);
        }
      });
  }, [collection, filter, sortBy]);

  // Get favorites (otimizado com useMemo)
  const favorites = useMemo(() => {
    return collection.filter((item) => item.isFavorite);
  }, [collection]);

  // Best per category by tag (Portuguese category tags)
  // Apenas mídias com rating definido pelo usuário (não da API)
  const getBestByCategoryTag = (tag: string) => {
    return collection
      .filter((item) => {
        // Verificar se tem a tag
        const hasTag = Array.isArray(item.tags) && item.tags.map((t) => (t || '').toLowerCase()).includes(tag);
        // Verificar se tem rating definido pelo usuário (maior que 0)
        const hasUserRating = item.rating && item.rating > 0;
        return hasTag && hasUserRating;
      })
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

   const handleConfirmAdd = useCallback(async (media: ExternalMediaResult) => {
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

      // Normalizar tipo para plural (exceto tv e anime)
      const normalizeType = (type: string) => {
        const typeMap: Record<string, string> = {
          "book": "books",
          "game": "games",
          "movie": "movies",
          "tv": "tv",
          "anime": "anime",
        };
        return typeMap[type] || type;
      };

      const newMedia = await addMedia({
        title: result.title,
        type: normalizeType(result.originalType || "book"),
        cover: result.image,
        year: result.year,
        author: result.authors?.join(", "),
        director: result.director,
        genre: result.genres?.join(", "),
        notes: result.description ? result.description.substring(0, 100) : undefined,
        // NÃO adicionar rating da API - usuário deve definir manualmente
        rating: undefined,
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
  }, [mediaItems, setMediaItems, showToast]);

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

  const handleUpdateMedia = useCallback(async (id: string, updates: Partial<MediaItem>) => {
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
  }, [mediaItems, setMediaItems, showToast]);

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

  const handleToggleFavorite = useCallback(async (item: MediaItem) => {
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
  }, [mediaItems, setMediaItems, showToast]);

  const handleEditFeatured = () => {
    setShowEditFeaturedModal(true);
  };

  const handleEditPopular = () => {
    setShowEditPopularModal(true);
  };

  const handleSaveFeatured = async (items: MediaItem[]) => {
    try {
      setCustomFeatured(items);
      // Salvar IDs dos destaques no localStorage
      const featuredIds = items.map(item => item.id);
      localStorage.setItem('customFeatured', JSON.stringify(featuredIds));
      showToast("Destaques atualizados com sucesso!", "success");
    } catch (error) {
      console.error('Erro ao salvar destaques:', error);
      showToast("Erro ao salvar destaques", "error");
    }
  };

  const handleSavePopular = (items: MediaItem[]) => {
    setCustomPopular(items);
    showToast("Populares atualizados com sucesso!", "success");
  };

  const handleOpenBestMedia = (category: string) => {
    setBestMediaCategory(category);
    setShowBestMediaModal(true);
  };

  const handleSaveBestMedia = useCallback((category: string, items: MediaItem[]) => {
    try {
      const newBestMedia = { ...bestMedia, [category]: items };
      setBestMedia(newBestMedia);
      
      // Salvar no localStorage
      const bestDataToSave: Record<string, string[]> = {};
      Object.keys(newBestMedia).forEach(cat => {
        bestDataToSave[cat] = newBestMedia[cat].map(item => item.id);
      });
      localStorage.setItem('bestMedia', JSON.stringify(bestDataToSave));
      
      showToast(`Top 3 de ${category} atualizado com sucesso!`, "success");
    } catch (error) {
      console.error('Erro ao salvar melhores mídias:', error);
      showToast("Erro ao salvar", "error");
    }
  }, [bestMedia, showToast]);

  return (
    <div className="min-h-screen text-white">
      {/* Modern Header - Otimizado para Capacitor */}
      <div className="sticky top-0 md:top-16 z-30 backdrop-blur-xl border-b border-white/5 pt-safe">
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
              { id: "books", label: "Livros", icon: BookOpen },
              { id: "games", label: "Jogos", icon: Gamepad2 },
              { id: "movies", label: "Filmes", icon: Film },
              { id: "tv", label: "Séries", icon: Tv },
              { id: "anime", label: "Animes", icon: Sparkles },
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

      {/* Main Content - Com espaço para navegação mobile */}
      <div className="max-w-[1800px] mx-auto px-3 sm:px-6 py-6 sm:py-10 pb-24 sm:pb-10 space-y-10 sm:space-y-16">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-4 sm:gap-5">
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
        {/* Podium Carousel - Top 3 por Categoria */}
        {filter === "all" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Seu Pódio Pessoal
              </h3>
              <p className="text-slate-400 text-sm">
                Suas 3 melhores mídias de cada categoria
              </p>
            </div>

            {/* Carousel Container */}
            <div className="relative max-w-4xl mx-auto">
              {/* Navigation Buttons */}
              <button
                onClick={() => setCurrentPodiumIndex((prev) => (prev - 1 + 5) % 5)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all border border-white/20"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => setCurrentPodiumIndex((prev) => (prev + 1) % 5)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all border border-white/20"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>

              {/* Carousel Content */}
              <AnimatePresence mode="wait">
                {["book", "game", "movie", "tv", "anime"].map((category, idx) => {
                  if (idx !== currentPodiumIndex) return null;

                  const categoryBest = bestMedia[category] || [];
                  const hasItems = categoryBest.length > 0;

                  const categoryLabels: Record<string, string> = {
                    book: "Livros",
                    game: "Jogos",
                    movie: "Filmes",
                    tv: "Séries",
                    anime: "Animes",
                  };

                  const categoryIcons: Record<string, any> = {
                    book: BookOpen,
                    game: Gamepad2,
                    movie: Film,
                    tv: Tv,
                    anime: Tv,
                  };

                  const Icon = categoryIcons[category];

                  return (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-white/10 overflow-hidden mx-12"
                    >
                      {/* Category Header */}
                      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-4 border-b border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="w-6 h-6 text-cyan-400" />
                            <h4 className="text-xl font-bold text-white">
                              {categoryLabels[category]}
                            </h4>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setBestMediaCategory(category);
                              setShowBestMediaModal(true);
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 rounded-lg text-white font-medium text-sm shadow-lg transition-all"
                          >
                            {hasItems ? "Editar" : "Configurar"}
                          </motion.button>
                        </div>
                      </div>

                      {/* Podium Content */}
                      <div className="p-6">
                        {hasItems ? (
                          <div className="flex items-end justify-center gap-4">
                            {/* 2º Lugar */}
                            {categoryBest[1] ? (
                              <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="flex-1 max-w-[200px] cursor-pointer group"
                                onClick={() => handleCardClick(categoryBest[1])}
                              >
                                <div className="bg-gradient-to-br from-gray-400/20 to-gray-600/20 border-2 border-gray-400/40 rounded-xl p-4 hover:border-gray-300 transition-all">
                                  <div className="flex items-center justify-center gap-1 mb-3">
                                    <Medal className="w-6 h-6 text-gray-300" />
                                    <span className="text-lg font-bold text-gray-200">2º</span>
                                  </div>
                                  {categoryBest[1].cover && (
                                    <img
                                      src={categoryBest[1].cover}
                                      alt={categoryBest[1].title}
                                      className="w-full h-48 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform"
                                    />
                                  )}
                                  <p className="text-sm text-white text-center line-clamp-2 font-medium">
                                    {categoryBest[1].title}
                                  </p>
                                </div>
                              </motion.div>
                            ) : (
                              <div className="flex-1 max-w-[200px] opacity-30">
                                <div className="bg-white/5 border-2 border-dashed border-white/20 rounded-xl p-4 h-64 flex flex-col items-center justify-center">
                                  <Medal className="w-6 h-6 text-gray-500 mb-2" />
                                  <span className="text-sm text-gray-500">2º lugar</span>
                                </div>
                              </div>
                            )}

                            {/* 1º Lugar (maior) */}
                            {categoryBest[0] ? (
                              <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="flex-1 max-w-[240px] cursor-pointer group"
                                onClick={() => handleCardClick(categoryBest[0])}
                              >
                                <div className="bg-gradient-to-br from-yellow-500/20 to-amber-600/20 border-2 border-yellow-500/50 rounded-xl p-5 hover:border-yellow-400 transition-all">
                                  <div className="flex items-center justify-center gap-2 mb-3">
                                    <Trophy className="w-8 h-8 text-yellow-400" />
                                    <span className="text-2xl font-bold text-yellow-300">1º</span>
                                  </div>
                                  {categoryBest[0].cover && (
                                    <img
                                      src={categoryBest[0].cover}
                                      alt={categoryBest[0].title}
                                      className="w-full h-56 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform shadow-lg"
                                    />
                                  )}
                                  <p className="text-base text-white text-center line-clamp-2 font-bold">
                                    {categoryBest[0].title}
                                  </p>
                                </div>
                              </motion.div>
                            ) : (
                              <div className="flex-1 max-w-[240px] opacity-30">
                                <div className="bg-white/5 border-2 border-dashed border-white/20 rounded-xl p-5 h-72 flex flex-col items-center justify-center">
                                  <Trophy className="w-8 h-8 text-gray-500 mb-2" />
                                  <span className="text-sm text-gray-500">1º lugar</span>
                                </div>
                              </div>
                            )}

                            {/* 3º Lugar */}
                            {categoryBest[2] ? (
                              <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex-1 max-w-[200px] cursor-pointer group"
                                onClick={() => handleCardClick(categoryBest[2])}
                              >
                                <div className="bg-gradient-to-br from-amber-700/20 to-amber-900/20 border-2 border-amber-700/40 rounded-xl p-4 hover:border-amber-600 transition-all">
                                  <div className="flex items-center justify-center gap-1 mb-3">
                                    <Award className="w-6 h-6 text-amber-600" />
                                    <span className="text-lg font-bold text-amber-500">3º</span>
                                  </div>
                                  {categoryBest[2].cover && (
                                    <img
                                      src={categoryBest[2].cover}
                                      alt={categoryBest[2].title}
                                      className="w-full h-48 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform"
                                    />
                                  )}
                                  <p className="text-sm text-white text-center line-clamp-2 font-medium">
                                    {categoryBest[2].title}
                                  </p>
                                </div>
                              </motion.div>
                            ) : (
                              <div className="flex-1 max-w-[200px] opacity-30">
                                <div className="bg-white/5 border-2 border-dashed border-white/20 rounded-xl p-4 h-64 flex flex-col items-center justify-center">
                                  <Award className="w-6 h-6 text-gray-500 mb-2" />
                                  <span className="text-sm text-gray-500">3º lugar</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          // Estado vazio
                          <div className="py-16 text-center space-y-4">
                            <div className="flex justify-center gap-3 opacity-30">
                              <Trophy className="w-16 h-16 text-yellow-400" />
                              <Medal className="w-16 h-16 text-gray-400" />
                              <Award className="w-16 h-16 text-amber-600" />
                            </div>
                            <div>
                              <p className="text-slate-400 text-base mb-2">
                                Nenhum pódio configurado ainda
                              </p>
                              <p className="text-slate-500 text-sm">
                                Clique em "Configurar" para escolher suas 3 melhores
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Indicators */}
              <div className="flex items-center justify-center gap-2 mt-6">
                {["book", "game", "movie", "tv", "anime"].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPodiumIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentPodiumIndex
                        ? "bg-cyan-400 w-8"
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.section>
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

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 sm:gap-5">
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <h3 className="text-2xl font-bold text-white">
                {filter === "all" ? "Minha Coleção" : 
                  filter === "books" ? "Livros" : 
                  filter === "games" ? "Jogos" : 
                  filter === "movies" ? "Filmes" : 
                  filter === "tv" ? "Séries" :
                  filter === "anime" ? "Animes" : "Minha Coleção"}
              </h3>
              <div className="flex items-center gap-3">
                <div className="text-sm text-slate-400">
                  {filteredCollection.length} / {collection.length} mídias
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="recent" className="bg-slate-900">Mais Recentes</option>
                  <option value="title" className="bg-slate-900">Título (A-Z)</option>
                  <option value="rating" className="bg-slate-900">Maior Nota</option>
                  <option value="type" className="bg-slate-900">Tipo</option>
                </select>
              </div>
            </div>

            {filteredCollection.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-4 sm:gap-5">
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

      {/* Archivius Agent - Botão Flutuante */}
      <ArchiviusAgent />

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
        {showBestMediaModal && (
          <BestMediaModal
            isOpen={true}
            onClose={() => setShowBestMediaModal(false)}
            collection={collection}
            category={bestMediaCategory}
            currentBest={bestMedia[bestMediaCategory] || []}
            onSave={handleSaveBestMedia}
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
