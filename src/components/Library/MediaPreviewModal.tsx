// src/components/Library/MediaPreviewModal.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Edit3, Trash2, Bookmark } from "lucide-react";
import { MediaItem } from "../../App";

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal Container */}
          <motion.div
            className="relative bg-gray-900 text-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Fechar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-gray-800/50 hover:bg-gray-700 rounded-full"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Conteúdo */}
            <div className="flex flex-col md:flex-row">
              {/* Imagem */}
              <div className="w-full md:w-1/3 bg-gray-800">
                <img
                  src={item.cover || "/placeholder.png"}
                  alt={item.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>

              {/* Detalhes */}
              <div className="flex-1 p-6">
                <h2 className="text-2xl font-bold mb-2">{item.title}</h2>

                {/* Tags */}
                {item.type && (
                  <span className="inline-block text-xs bg-cyan-600/30 text-cyan-300 px-2 py-1 rounded-lg mb-3">
                    {item.type.toUpperCase()}
                  </span>
                )}

                {/* Rating */}
                {item.rating && (
                  <div className="flex items-center mb-3">
                    <Star className="w-5 h-5 text-yellow-400 mr-1" />
                    <span>{item.rating}/10</span>
                  </div>
                )}

                {/* Descrição */}
                {item.description && (
                  <p className="text-sm text-slate-300 mb-4 line-clamp-4">
                    {item.description}
                  </p>
                )}

                {/* Ações rápidas */}
                <div className="flex gap-3">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="flex items-center gap-2 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-sm"
                    >
                      <Edit3 size={16} /> Editar
                    </button>
                  )}
                  {onToggleFavorite && (
                    <button
                      onClick={() => onToggleFavorite(item)}
                      className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm"
                    >
                      <Bookmark size={16} />{" "}
                      {item.isFavorite ? "Remover Favorito" : "Favoritar"}
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item)}
                      className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm"
                    >
                      <Trash2 size={16} /> Excluir
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MediaPreviewModal;
