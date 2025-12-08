// src/components/Library/MediaPreviewModal.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Edit3, Trash2, Heart, Calendar, Clock, BookOpen, Film, Gamepad2, Tv } from "lucide-react";
import { MediaItem } from "../../types";

interface MediaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MediaItem | null;
  onEdit?: (item: MediaItem) => void;
  onDelete?: (item: MediaItem) => void;
  onToggleFavorite?: (item: MediaItem) => void;
}

const MediaPreviewModal: React.FC<MediaPreviewModalProps> = ({
  isOpen,
  onClose,
  item,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  if (!item) return null;

  const getCategoryIcon = () => {
    switch (item.type?.toLowerCase()) {
      case "game":
      case "games":
        return <Gamepad2 className="w-5 h-5" />;
      case "book":
      case "books":
        return <BookOpen className="w-5 h-5" />;
      case "movie":
      case "movies":
        return <Film className="w-5 h-5" />;
      case "tv":
      case "series":
        return <Tv className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getTypeLabel = () => {
    switch (item.type?.toLowerCase()) {
      case "game":
        return "Jogo";
      case "book":
        return "Livro";
      case "movie":
        return "Filme";
      case "tv":
        return "Série";
      default:
        return item.type;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="relative bg-slate-900/95 backdrop-blur-xl text-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white/10 pointer-events-auto"
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-xl transition-colors backdrop-blur-sm"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[90vh]">
                <div className="flex flex-col lg:flex-row">
                  {/* Cover Image */}
                  <div className="relative w-full lg:w-2/5 h-64 sm:h-80 lg:h-auto lg:min-h-[600px] bg-slate-800/50">
                    {item.cover ? (
                      <>
                        <img
                          src={item.cover}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                        {getCategoryIcon()}
                      </div>
                    )}

                    {/* Favorite Badge */}
                    {item.isFavorite && (
                      <div className="absolute top-4 left-4 bg-pink-500/90 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-white fill-white" />
                        <span className="text-sm font-semibold text-white">Favorito</span>
                      </div>
                    )}

                    {/* Rating Badge */}
                    {item.rating && (
                      <div className="absolute top-4 right-4 bg-yellow-500/90 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2">
                        <Star className="w-4 h-4 text-white fill-white" />
                        <span className="text-sm font-bold text-white">{item.rating}/10</span>
                      </div>
                    )}
                  </div>

                  {/* Details Section */}
                  <div className="flex-1 p-6 sm:p-8 space-y-6">
                    {/* Title & Type */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        {getCategoryIcon()}
                        <span className="text-sm font-medium text-violet-400">
                          {getTypeLabel()}
                        </span>
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                        {item.title}
                      </h2>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                      {item.year && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>{item.year}</span>
                        </div>
                      )}
                      {item.author && (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">Autor:</span>
                          <span>{item.author}</span>
                        </div>
                      )}
                      {item.director && (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">Diretor:</span>
                          <span>{item.director}</span>
                        </div>
                      )}
                      {item.hoursSpent && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>{item.hoursSpent}h jogadas</span>
                        </div>
                      )}
                    </div>

                    {/* Genres */}
                    {item.genre && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-400 mb-2">Gêneros</h4>
                        <div className="flex flex-wrap gap-2">
                          {item.genre.split(',').map((genre, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200"
                            >
                              {genre.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status */}
                    {item.status && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-400 mb-2">Status</h4>
                        <span className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 rounded-lg text-sm font-medium text-white">
                          {item.status === 'completed' ? 'Concluído' :
                           item.status === 'in-progress' ? 'Em Progresso' :
                           item.status === 'dropped' ? 'Abandonado' : 'Planejado'}
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    {(item.notes || item.description) && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-400 mb-2">Descrição</h4>
                        <p className="text-slate-300 leading-relaxed">
                          {item.notes || item.description}
                        </p>
                      </div>
                    )}

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-400 mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-violet-500/20 border border-violet-500/30 rounded-lg text-sm text-violet-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                      {onEdit && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onEdit(item)}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 rounded-xl font-semibold text-white transition-all shadow-lg"
                        >
                          <Edit3 size={18} />
                          Editar
                        </motion.button>
                      )}
                      {onToggleFavorite && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onToggleFavorite(item)}
                          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg ${
                            item.isFavorite
                              ? "bg-pink-500/20 border-2 border-pink-500 text-pink-300 hover:bg-pink-500/30"
                              : "bg-white/5 border-2 border-white/20 text-white hover:bg-white/10"
                          }`}
                        >
                          <Heart size={18} className={item.isFavorite ? "fill-current" : ""} />
                          {item.isFavorite ? "Remover Favorito" : "Adicionar aos Favoritos"}
                        </motion.button>
                      )}
                      {onDelete && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onDelete(item)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-500/20 border-2 border-red-500 hover:bg-red-500/30 rounded-xl font-semibold text-red-300 transition-all shadow-lg"
                        >
                          <Trash2 size={18} />
                          Excluir
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MediaPreviewModal;
