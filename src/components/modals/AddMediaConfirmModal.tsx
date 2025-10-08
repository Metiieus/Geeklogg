import React, { useState } from "react";
import { X, Edit2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { ExternalMediaResult } from "../../services/externalMediaService";

interface AddMediaConfirmModalProps {
  media: ExternalMediaResult;
  onConfirm: (media: ExternalMediaResult) => Promise<void>;
  onEdit: (media: ExternalMediaResult) => void;
  onCancel: () => void;
}

export const AddMediaConfirmModal: React.FC<AddMediaConfirmModalProps> = ({
  media,
  onConfirm,
  onEdit,
  onCancel,
}) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleConfirm = async () => {
    setIsAdding(true);
    try {
      await onConfirm(media);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl overflow-hidden"
      >
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-slate-900/90 to-slate-800/90 p-6 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Confirmar Adição</h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Deseja adicionar esta mídia à sua biblioteca?
                  </p>
                </div>
              </div>

              <button
                onClick={onCancel}
                disabled={isAdding}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all disabled:opacity-50"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex gap-6">
              {/* Cover Image */}
              <div className="w-40 h-60 rounded-xl overflow-hidden flex-shrink-0 shadow-xl border border-white/10">
                {media.image ? (
                  <img
                    src={media.image}
                    alt={media.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <span className="text-slate-500 text-xs">Sem Capa</span>
                  </div>
                )}
              </div>

              {/* Media Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {media.title}
                  </h3>
                  {media.year && (
                    <p className="text-sm text-slate-400">Ano: {media.year}</p>
                  )}
                </div>

                {media.authors && media.authors.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Autor(es)</p>
                    <p className="text-sm text-slate-300">
                      {media.authors.join(", ")}
                    </p>
                  </div>
                )}

                {media.director && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Diretor</p>
                    <p className="text-sm text-slate-300">{media.director}</p>
                  </div>
                )}

                {media.developer && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Desenvolvedor</p>
                    <p className="text-sm text-slate-300">{media.developer}</p>
                  </div>
                )}

                {media.genres && media.genres.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Gêneros</p>
                    <div className="flex flex-wrap gap-2">
                      {media.genres.slice(0, 3).map((genre, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-300"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {media.description && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Descrição</p>
                    <p className="text-sm text-slate-300 line-clamp-3">
                      {media.description}
                    </p>
                  </div>
                )}

                {media.rating && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Avaliação</p>
                    <p className="text-sm text-slate-300">{media.rating}/10</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCancel}
                disabled={isAdding}
                className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all disabled:opacity-50"
              >
                Cancelar
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onEdit(media)}
                disabled={isAdding}
                className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-violet-500/50 rounded-xl text-white font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Editar Antes de Adicionar
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirm}
                disabled={isAdding}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {isAdding ? "Adicionando..." : "Adicionar à Biblioteca"}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
