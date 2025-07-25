import React, { useState, useMemo, useCallback } from 'react';
import { Search, Plus, Star, Clock, ExternalLink, Edit, Trash2, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MediaType, MediaItem, Status } from '../App';
import { AddMediaModal } from './modals/AddMediaModal';
import { AddMediaFromSearchModal } from './modals/AddMediaFromSearchModal';
import { EditMediaModal } from './modals/EditMediaModal';
import { AddMediaOptions } from './AddMediaOptions';
import { ExternalMediaResult } from '../services/externalMediaService';
import { deleteMedia } from '../services/mediaService';
import { useToast } from '../context/ToastContext';

const mediaTypeColors = {
  games: "from-blue-500 to-cyan-500",
  anime: "from-pink-500 to-rose-500",
  series: "from-purple-500 to-violet-500",
  books: "from-green-500 to-emerald-500",
  movies: "from-yellow-500 to-orange-500",
  jogos: "from-blue-500 to-cyan-500",
};

const mediaTypeFrames = {
  games: "ring-2 ring-blue-400/60 shadow-2xl shadow-blue-500/40 hover:ring-blue-400 hover:shadow-blue-500/60 transition-all duration-500 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-blue-400/20 before:to-transparent before:animate-shimmer hover:animate-glow-pulse",
  anime: "ring-2 ring-pink-400/60 shadow-2xl shadow-pink-500/40 hover:ring-pink-400 hover:shadow-pink-500/60 transition-all duration-500 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-pink-400/20 before:to-transparent before:animate-shimmer hover:animate-glow-pulse",
  series: "ring-2 ring-purple-400/60 shadow-2xl shadow-purple-500/40 hover:ring-purple-400 hover:shadow-purple-500/60 transition-all duration-500 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-purple-400/20 before:to-transparent before:animate-shimmer hover:animate-glow-pulse",
  books: "ring-2 ring-green-400/60 shadow-2xl shadow-green-500/40 hover:ring-green-400 hover:shadow-green-500/60 transition-all duration-500 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-green-400/20 before:to-transparent before:animate-shimmer hover:animate-glow-pulse",
  movies: "ring-2 ring-yellow-400/60 shadow-2xl shadow-yellow-500/40 hover:ring-yellow-400 hover:shadow-yellow-500/60 transition-all duration-500 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-yellow-400/20 before:to-transparent before:animate-shimmer hover:animate-glow-pulse",
  jogos: "ring-2 ring-blue-400/60 shadow-2xl shadow-blue-500/40 hover:ring-blue-400 hover:shadow-blue-500/60 transition-all duration-500 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-blue-400/20 before:to-transparent before:animate-shimmer hover:animate-glow-pulse",
};

const mediaTypeLabels = {
  games: "Jogos",
  anime: "Anime",
  series: "Séries",
  books: "Livros",
  movies: "Filmes",
  jogos: "Jogos",
};

const bookmarkColors = {
  games: "bg-blue-500",
  anime: "bg-pink-500",
  series: "bg-purple-500",
  books: "bg-green-500",
  movies: "bg-yellow-500",
  jogos: "bg-blue-500",
};

const Library: React.FC = () => {
  const { mediaItems, setMediaItems } = useAppContext();
  const { showError, showSuccess } = useToast();
  const [selectedType, setSelectedType] = useState<MediaType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<Status | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'rating' | 'hoursSpent' | 'updatedAt'>('updatedAt');
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

  const handleDeleteItem = useCallback(async (itemId: string) => {
    if (!itemId || typeof itemId !== "string" || itemId.trim() === "") {
      showError('Erro', 'ID do item é inválido. Não é possível excluir este item.');
      return;
    }

    const item = mediaItems.find(m => m.id === itemId);
    const confirmMessage = `Vai apagar "${item?.title}" mesmo? 🗑️\n\nEssa ação não pode ser desfeita!`;

    if (confirm(confirmMessage)) {
      try {
        await deleteMedia(itemId);
        setMediaItems(mediaItems.filter(item => item.id !== itemId));
        showSuccess('Item removido com sucesso!');
      } catch (err: any) {
        console.error('Erro ao excluir mídia', err);
        showError('Erro ao remover mídia', err.message || 'Não foi possível excluir o item');
      }
    }
  }, [mediaItems, setMediaItems, showSuccess, showError]);

  const handleEditItem = useCallback((updatedItem: MediaItem) => {
    setMediaItems(
      mediaItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item,
      ),
    );
    setEditingItem(null);
  }, [mediaItems, setMediaItems]);

  const handleExternalResultSelect = useCallback((result: ExternalMediaResult) => {
    setSelectedExternalResult(result);
    setShowAddOptions(false);
  }, []);

  const handleManualAdd = useCallback(() => {
    setShowAddModal(true);
    setShowAddOptions(false);
  }, []);

  const handleAddFromSearch = useCallback((newItem: MediaItem) => {
    setMediaItems([...mediaItems, newItem]);
    setSelectedExternalResult(null);
  }, [mediaItems, setMediaItems]);

  const handleEditClick = useCallback((item: MediaItem) => {
    if (!item.id || typeof item.id !== "string" || item.id.trim() === "") {
      alert("ID inválido");
      return;
    }
    setEditingItem(item);
  }, []);

  const handleDeleteClick = useCallback((item: MediaItem) => {
    if (!item.id || typeof item.id !== "string" || item.id.trim() === "") {
      showError('Erro', 'ID do item é inválido. Não é possível excluir este item.');
      return;
    }
    setItemToDelete(item);
    setShowDeleteModal(true);
  }, [showError]);

  const cancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (itemToDelete && itemToDelete.id && typeof itemToDelete.id === "string" && itemToDelete.id.trim() !== "") {
      await handleDeleteItem(itemToDelete.id);
      setShowDeleteModal(false);
      setItemToDelete(null);
    } else {
      showError('Erro', 'ID do item é inválido. Não é possível excluir este item.');
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  }, [itemToDelete, handleDeleteItem, showError]);

    return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 space-y-4 sm:space-y-6 animate-fade-in relative library-container animation-safe">
      {/* Fragmentos animados no fundo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-cyan-400/20 rounded-full animate-pulse`}
            style={{
              left: `${(i % 4) * 25 + Math.random() * 20}%`,
              top: `${Math.floor(i / 4) * 33 + Math.random() * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
            {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
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
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-slate-700/50 relative z-10">
        <div className="flex flex-col space-y-3 sm:grid sm:grid-cols-2 md:grid-cols-4 sm:gap-3 md:gap-4 sm:space-y-0">
          {/* Search */}
          <div className="relative sm:col-span-2 md:col-span-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Buscar por título ou tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-3 sm:py-2 text-base sm:text-sm bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) =>
              setSelectedType(e.target.value as MediaType | "all")
            }
            className="px-3 py-3 sm:py-2 text-base sm:text-sm bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Todos os Tipos</option>
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
            className="px-3 py-3 sm:py-2 text-base sm:text-sm bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Todos os Status</option>
            <option value="completed">✅ Concluído</option>
            <option value="in-progress">⏳ Em Progresso</option>
            <option value="dropped">❌ Abandonado</option>
            <option value="planned">📅 Planejado</option>
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
            className="px-3 py-3 sm:py-2 text-base sm:text-sm bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="updatedAt">🕐 Mais Recentes</option>
            <option value="title">🔤 A-Z</option>
            <option value="rating">⭐ Avaliação</option>
            <option value="hoursSpent">⏱️ Mais Horas</option>
          </select>
        </div>
      </div>

            {/* Results Count */}
      <div className="flex items-center justify-between text-slate-400 relative z-10">
        <p>{filteredAndSortedItems.length} itens</p>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 animate-fade-in media-grid grid-container">
        {filteredAndSortedItems.map((item) => (
          <div key={item.id} className={`group relative bg-gradient-to-br ${mediaTypeColors[item.type] || 'from-slate-800'}/20 to-slate-900/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-600/30 hover:border-slate-500/60 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-purple-500/25 animate-slide-up media-card scale-on-hover min-h-[300px] sm:min-h-[350px] md:min-h-[400px]`}>
              {/* Cover Image */}
              <div className="h-60 sm:h-72 md:h-80 bg-gradient-to-b from-slate-600/50 to-slate-800/80 relative overflow-hidden rounded-t-2xl">
                {item.cover ? (
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center text-slate-400">
                            <div class="w-20 h-20 rounded-full bg-gradient-to-br ${mediaTypeColors[item.type] || 'from-slate-600 to-slate-700'} opacity-40 flex items-center justify-center">
                              <span class="text-white font-bold text-2xl">${item.title.charAt(0)}</span>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br ${mediaTypeColors[item.type]} opacity-40 flex items-center justify-center`}>
                      <span className="text-white font-bold text-2xl">{item.title.charAt(0)}</span>
                    </div>
                  </div>
                )}

                  {/* Overlay with actions - só aparece no desktop */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 md:flex hidden items-center justify-center gap-3">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-110"
                      title="Editar"
                    >
                      <Edit size={18} className="text-white" />
                    </button>
                    {item.externalLink && (
                      <a
                        href={item.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-110"
                        title="Link Externo"
                      >
                        <ExternalLink size={18} className="text-white" />
                      </a>
                    )}
                    <button
                      onClick={() => handleDeleteClick(item)}
                      disabled={!item.id || typeof item.id !== "string" || item.id.trim() === ""}
                      className="p-3 bg-red-500/30 backdrop-blur-sm rounded-full hover:bg-red-500/50 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      title={!item.id || typeof item.id !== "string" || item.id.trim() === "" ? "Item sem ID válido" : "Excluir"}
                    >
                      <Trash2 size={18} className="text-white" />
                    </button>
                  </div>

                  {/* Mobile Action Buttons - só aparece no mobile */}
                  <div className="absolute top-3 right-3 md:hidden flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(item);
                      }}
                      className="p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 active:scale-95 transition-all duration-200 border border-white/20 shadow-lg"
                      title="Editar"
                    >
                      <Edit size={14} className="text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(item);
                      }}
                      disabled={!item.id || typeof item.id !== "string" || item.id.trim() === ""}
                      className="p-2 bg-red-500/80 backdrop-blur-sm rounded-full hover:bg-red-500/90 active:scale-95 transition-all duration-200 border border-red-400/30 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      title={!item.id || typeof item.id !== "string" || item.id.trim() === "" ? "Item sem ID válido" : "Excluir"}
                    >
                      <Trash2 size={14} className="text-white" />
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 md:p-6 space-y-3 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-white text-sm sm:text-base md:text-lg line-clamp-2 leading-tight flex-1">
                      {item.title}
                    </h3>
                    {item.rating && (
                      <div className="flex items-center gap-1 flex-shrink-0 bg-yellow-500/20 px-2 py-1 rounded-full">
                        <Star className="text-yellow-400" size={14} fill="currentColor" />
                        <span className="text-white text-sm font-bold">{item.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(item.status)}`}>
                    {getStatusLabel(item.status)}
                  </div>

                  {/* Progress para livros */}
                  {item.type === "books" && item.totalPages && (
                    <div>
                      <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
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

                  {/* Tempo de jogo/horas */}
                  {item.hoursSpent && (
                    <div className="flex items-center gap-1 text-blue-400">
                      <Clock size={12} />
                      <span className="text-xs">{item.hoursSpent}h</span>
                    </div>
                  )}

                  {/* Tag principal - limitada a 1 */}
                  {item.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                      <span className={`px-2 py-1 bg-gradient-to-r ${mediaTypeColors[item.type]}/20 border border-current/20 text-xs rounded-full truncate max-w-[120px]`}>
                        {item.tags[0]}
                      </span>
                      {item.tags.length > 1 && (
                        <span className="text-xs text-slate-400">+{item.tags.length - 1}</span>
                      )}
                    </div>
                  )}
                </div>


            </div>
        ))}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in overflow-y-auto">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 w-full max-w-xs sm:max-w-lg md:max-w-3xl lg:max-w-4xl xl:max-w-5xl p-4 sm:p-6 animate-slide-up my-auto min-h-0">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 max-w-md w-full p-6 animate-slide-up my-auto min-h-0">
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
                onClick={confirmDelete}
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
