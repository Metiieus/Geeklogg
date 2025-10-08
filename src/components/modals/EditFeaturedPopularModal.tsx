import React, { useState } from "react";
import { X, Star, Check } from "lucide-react";
import { motion } from "framer-motion";
import { MediaItem } from "../../App";

interface EditFeaturedPopularModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: MediaItem[];
  currentItems: MediaItem[];
  onSave: (items: MediaItem[]) => void;
  title: string;
  maxItems?: number;
}

export const EditFeaturedPopularModal: React.FC<EditFeaturedPopularModalProps> = ({
  isOpen,
  onClose,
  collection,
  currentItems,
  onSave,
  title,
  maxItems = 8,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    currentItems.map(item => item.id)
  );

  if (!isOpen) return null;

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      if (selectedIds.length < maxItems) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const handleSave = () => {
    const selectedItems = collection.filter(item => selectedIds.includes(item.id));
    onSave(selectedItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-slate-900/90 to-slate-800/90 p-6 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{title}</h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Selecione até {maxItems} mídias ({selectedIds.length}/{maxItems} selecionadas)
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {collection.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSelection(item.id)}
                    className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                      isSelected
                        ? "border-violet-500 shadow-lg shadow-violet-500/20"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="aspect-[2/3] relative">
                      {item.cover ? (
                        <img
                          src={item.cover}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                          <span className="text-slate-600 text-xs">Sem Capa</span>
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      {/* Title */}
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <h4 className="text-xs font-semibold text-white line-clamp-2">
                          {item.title}
                        </h4>
                      </div>

                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}

                      {/* Rating */}
                      {item.rating && (
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-semibold text-white">
                            {item.rating}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {collection.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400">Nenhuma mídia disponível</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/5 flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all"
            >
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all"
            >
              Salvar Seleção
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
