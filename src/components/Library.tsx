import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Star,
  Clock,
  ExternalLink,
  Edit,
  Trash2,
  MoreHorizontal,
  X,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { MediaType, MediaItem, Status } from "../App";
import { AddMediaModal } from "./modals/AddMediaModal";
import { EditMediaModal } from "./modals/EditMediaModal";
import { AddMediaFromSearchModal } from "./modals/AddMediaFromSearchModal";
import { AddMediaOptions } from "./AddMediaOptions";
import { ExternalMediaResult } from "../services/externalMediaService";
import { deleteMedia } from "../services/mediaService";

const mediaTypeColors = {
  games: "from-blue-500 to-cyan-500",
  anime: "from-pink-500 to-rose-500",
  series: "from-purple-500 to-violet-500",
  books: "from-green-500 to-emerald-500",
  movies: "from-yellow-500 to-orange-500",
  dorama: "from-red-500 to-pink-500",
};

const mediaTypeLabels = {
  games: "Jogos",
  anime: "Anime",
  series: "Séries",
  books: "Livros",
  movies: "Filmes",
  dorama: "Doramas",
};

const bookmarkColors = {
  games: "bg-blue-500",
  anime: "bg-pink-500",
  series: "bg-purple-500",
  books: "bg-green-500",
  movies: "bg-yellow-500",
  dorama: "bg-red-500",
};

const Library: React.FC = () => {
  const { mediaItems, setMediaItems } = useAppContext();
  const [selectedType, setSelectedType] = useState<MediaType | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<Status | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "title" | "rating" | "hoursSpent" | "updatedAt"
  >("updatedAt");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [selectedExternalResult, setSelectedExternalResult] =
    useState<ExternalMediaResult | null>(null);
    const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MediaItem | null>(null);

  const filteredAndSortedItems = useMemo(() => {
    let filtered = mediaItems;

    if (selectedType !== "all") {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((item) => item.status === selectedStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
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
        case "updatedAt":
        default:
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
      }
    });

    return filtered;
  }, [mediaItems, selectedType, selectedStatus, searchQuery, sortBy]);

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-500/10";
      case "in-progress":
        return "text-blue-400 bg-blue-500/10";
      case "dropped":
        return "text-red-400 bg-red-500/10";
      case "planned":
        return "text-purple-400 bg-purple-500/10";
    }
  };

  const getStatusLabel = (status: Status) => {
    const labels = {
      completed: "CONCLUÍDO",
      "in-progress": "EM PROGRESSO",
      dropped: "ABANDONADO",
      planned: "PLANEJADO",
    };
    return labels[status];
  };

    const handleDeleteClick = (item: MediaItem) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    try {
      await deleteMedia(itemToDelete.id);
      setMediaItems(mediaItems.filter((item) => item.id !== itemToDelete.id));
      setShowDeleteModal(false);
      setItemToDelete(null);

      // Feedback visual de sucesso
      const toast = document.createElement("div");
      toast.className =
        "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slide-up";
      toast.textContent = "✅ Item removido com sucesso!";
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    } catch (error) {
      console.error('Erro ao excluir item:', error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleEditItem = (updatedItem: MediaItem) => {
    setMediaItems(
      mediaItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item,
      ),
    );
    setEditingItem(null);
  };

  const handleExternalResultSelect = (result: ExternalMediaResult) => {
    setSelectedExternalResult(result);
    setShowAddOptions(false);
  };

  const handleManualAdd = () => {
    setShowAddModal(true);
    setShowAddOptions(false);
  };

  const handleAddFromSearch = (newItem: MediaItem) => {
    setMediaItems([...mediaItems, newItem]);
    setSelectedExternalResult(null);
  };

  const handleEditClick = (item: MediaItem) => {
    if (!item.id || typeof item.id !== "string" || item.id.trim() === "") {
      alert("ID inválido");
      return;
    }
    setEditingItem(item);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">
            Biblioteca
          </h1>
          <p className="text-slate-400 text-sm md:text-base hidden sm:block">
            Sua coleção pessoal de jogos, anime, séries, livros e filmes
          </p>
        </div>
        <button
          onClick={() => setShowAddOptions(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-200 flex items-center gap-1 md:gap-2 self-start sm:self-auto"
        >
          <Plus size={16} sm:size={18} />
          <span className="hidden sm:inline md:hidden">Adicionar</span>
          <span className="hidden md:inline">Adicionar Mídia</span>
          <span className="sm:hidden">+</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-slate-700/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {/* Search */}
          <div className="relative col-span-1 sm:col-span-2 md:col-span-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) =>
              setSelectedType(e.target.value as MediaType | "all")
            }
            className="px-3 py-2 text-sm bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Tipo</option>
            {Object.entries(mediaTypeLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as Status | "all")
            }
            className="px-3 py-2 text-sm bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Status</option>
            <option value="completed">Concluído</option>
            <option value="in-progress">Progresso</option>
            <option value="dropped">Abandonado</option>
            <option value="planned">Planejado</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as
                  | "title"
                  | "rating"
                  | "hoursSpent"
                  | "updatedAt",
              )
            }
            className="px-3 py-2 text-sm bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="updatedAt">Recentes</option>
            <option value="title">A-Z</option>
            <option value="rating">Avaliação</option>
            <option value="hoursSpent">Horas</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-slate-400">
        <p>{filteredAndSortedItems.length} itens</p>
      </div>

      {/* Media Grid - Layout responsivo */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 md:gap-6 animate-fade-in">
        {filteredAndSortedItems.map((item) => {
          console.log("Library item", item);
          return (
            <div key={item.id} className="group relative">
              {/* Card Container */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl md:rounded-2xl overflow-hidden border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 animate-slide-up">
                {/* Cover Image - Aspecto ajustado para mobile tipo Skoob */}
                <div className="aspect-[3/4.5] bg-slate-700 relative overflow-hidden">
                  {item.cover ? (
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <div
                        className={`w-8 h-8 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${mediaTypeColors[item.type]} opacity-20`}
                      />
                    </div>
                  )}

                  {/* Bookmark indicator no canto superior esquerdo - cores por categoria */}
                  <div
                    className={`absolute top-0 left-0 w-6 h-8 md:w-8 md:h-10 ${bookmarkColors[item.type]} rounded-br-lg shadow-lg`}
                  >
                    <div
                      className={`absolute bottom-0 left-0 w-0 h-0 border-l-[6px] md:border-l-[8px] border-l-transparent border-r-[6px] md:border-r-[8px] border-r-transparent border-b-[4px] md:border-b-[6px] ${
                        item.type === "games"
                          ? "border-b-blue-600"
                          : item.type === "anime"
                            ? "border-b-pink-600"
                            : item.type === "series"
                              ? "border-b-purple-600"
                              : item.type === "books"
                                ? "border-b-green-600"
                                : item.type === "movies"
                                  ? "border-b-yellow-600"
                                  : "border-b-red-600"
                      }`}
                    ></div>
                  </div>

                  {/* Progress indicator para livros - igual Skoob */}
                  {item.type === "books" && item.totalPages && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {Math.round(
                        ((item.currentPage || 0) / item.totalPages) * 100,
                      )}
                      %
                    </div>
                  )}

                  {/* Overlay with actions - só aparece no desktop */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 md:flex hidden items-center justify-center gap-2 overflow-hidden">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-110 animate-bounce"
                      title="Editar"
                    >
                      <Edit size={16} className="text-white" />
                    </button>
                    {item.externalLink && (
                      <a
                        href={item.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-110 animate-bounce"
                        title="Link Externo"
                      >
                        <ExternalLink size={16} className="text-white" />
                      </a>
                    )}
                                        <button
                      onClick={() => handleDeleteClick(item)}
                      className="p-2 bg-red-500/20 backdrop-blur-sm rounded-full hover:bg-red-500/30 transition-all duration-200 hover:scale-110 animate-wiggle"
                      title="Excluir"
                    >
                      <Trash2 size={16} className="text-white" />
                    </button>
                  </div>
                </div>

                {/* Desktop Content - só aparece em telas maiores */}
                <div className="p-4 hidden md:block">
                  <h3 className="font-semibold text-white mb-2 line-clamp-2">
                    {item.title}
                  </h3>

                  {/* Status */}
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)} mb-3`}
                  >
                    {getStatusLabel(item.status)}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      {item.rating && (
                        <div className="flex items-center gap-1">
                          <Star
                            className="text-yellow-400"
                            size={14}
                            fill="currentColor"
                          />
                          <span className="text-white">{item.rating}</span>
                        </div>
                      )}
                      {item.hoursSpent && (
                        <div className="flex items-center gap-1">
                          <Clock className="text-blue-400" size={14} />
                          <span className="text-white">{item.hoursSpent}h</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {item.type === "books" && item.totalPages && (
                    <div className="mt-2">
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{
                            width: `${Math.max(0, Math.min(((item.currentPage || 0) / (item.totalPages || 1)) * 100, 100))}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {item.currentPage || 0}/{item.totalPages} páginas
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {item.tags.slice(0, 3).map((tag, index) => {
                        console.log("Tag", tag);
                        return (
                          <span
                            key={`${item.id}-tag-${index}`}
                            className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        );
                      })}
                      {item.tags.length > 3 && (
                        <span className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Menu de 3 pontos abaixo da imagem - igual Skoob, só no mobile */}
              <div className="md:hidden flex justify-center mt-2">
                <button
                  onClick={() => handleEditClick(item)}
                  className="text-slate-400 hover:text-white transition-colors p-1"
                  title="Opções"
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {/* Empty State */}
      {filteredAndSortedItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-slate-400" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Nenhum item encontrado
          </h3>
          <p className="text-slate-400 mb-6">
            Tente ajustar sua busca ou filtros
          </p>
          <button
            onClick={() => setShowAddOptions(true)}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Adicionar Primeiro Item
          </button>
        </div>
      )}

      {/* Add Media Options Modal */}
      {showAddOptions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 max-w-2xl w-full p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Adicionar Nova Mídia
              </h2>
              <button
                onClick={() => setShowAddOptions(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="text-slate-400" size={20} />
              </button>
            </div>

            <AddMediaOptions
              onExternalResultSelect={handleExternalResultSelect}
              onManualAdd={handleManualAdd}
            />
          </div>
        </div>
      )}

      {/* Add Media Modal */}
      {showAddModal && (
        <AddMediaModal
          onClose={() => setShowAddModal(false)}
          onSave={(newItem) => {
            setMediaItems([...mediaItems, newItem]);
            setShowAddModal(false);
          }}
        />
      )}

      {/* Add Media From Search Modal */}
      {selectedExternalResult && (
        <AddMediaFromSearchModal
          externalResult={selectedExternalResult}
          onClose={() => setSelectedExternalResult(null)}
          onSave={handleAddFromSearch}
        />
      )}

            {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 max-w-md w-full p-6 animate-slide-up">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <Trash2 className="text-red-400" size={32} />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-4">
              Excluir Item
            </h2>

            <p className="text-slate-300 text-center mb-2">
              Tem certeza que deseja excluir
            </p>
            <p className="text-white font-semibold text-center mb-2">
              "{itemToDelete?.title}"?
            </p>
            <p className="text-slate-400 text-sm text-center mb-8">
              Esta ação não pode ser desfeita.
            </p>

            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteItem}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Media Modal */}
      {editingItem && (
        <EditMediaModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleEditItem}
        />
      )}
    </div>
  );
};

export default Library;
