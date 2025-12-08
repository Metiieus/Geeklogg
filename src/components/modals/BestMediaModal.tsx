import React, { useState } from "react";
import { X, Trophy, Medal, Award } from "lucide-react";
import { motion } from "framer-motion";
import { MediaItem } from "../../types";

interface BestMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: MediaItem[];
  category: string;
  currentBest: MediaItem[];
  onSave: (category: string, items: MediaItem[]) => void;
}

export const BestMediaModal: React.FC<BestMediaModalProps> = ({
  isOpen,
  onClose,
  collection,
  category,
  currentBest,
  onSave,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    currentBest.map(item => item.id)
  );

  if (!isOpen) return null;

  const categoryLabels: Record<string, string> = {
    book: "Livros",
    game: "Jogos",
    movie: "Filmes",
    tv: "Séries",
    anime: "Animes",
  };

  const filteredCollection = collection.filter(item => 
    item.type === category || item.tags?.includes(category)
  );

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const handleSave = () => {
    const selectedItems = filteredCollection.filter(item => 
      selectedIds.includes(item.id)
    );
    onSave(category, selectedItems);
    onClose();
  };

  const getPodiumIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getPodiumColor = (index: number) => {
    switch (index) {
      case 0:
        return "from-yellow-500/20 to-amber-500/20 border-yellow-500/30";
      case 1:
        return "from-gray-400/20 to-gray-500/20 border-gray-400/30";
      case 2:
        return "from-amber-600/20 to-amber-700/20 border-amber-600/30";
      default:
        return "from-white/5 to-white/10 border-white/10";
    }
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
          <div className="relative bg-gradient-to-r from-yellow-900/30 to-amber-900/30 p-6 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Top 3 {categoryLabels[category]}
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Selecione suas 3 melhores ({selectedIds.length}/3 selecionadas)
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Podium Preview */}
          {selectedIds.length > 0 && (
            <div className="p-6 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Seu Pódio
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {[0, 1, 2].map((index) => {
                  const itemId = selectedIds[index];
                  const item = itemId ? filteredCollection.find(m => m.id === itemId) : null;
                  
                  return (
                    <div
                      key={index}
                      className={`relative rounded-xl p-4 border bg-gradient-to-br ${getPodiumColor(index)} ${
                        item ? 'opacity-100' : 'opacity-30'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {getPodiumIcon(index)}
                        <span className="text-sm font-semibold text-white">
                          {index === 0 ? '1º Lugar' : index === 1 ? '2º Lugar' : '3º Lugar'}
                        </span>
                      </div>
                      {item ? (
                        <div className="flex items-center gap-2">
                          {item.cover && (
                            <img
                              src={item.cover}
                              alt={item.title}
                              className="w-12 h-16 object-cover rounded"
                            />
                          )}
                          <p className="text-sm text-white line-clamp-2 flex-1">
                            {item.title}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500">Selecione abaixo</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 max-h-[50vh] overflow-y-auto">
            {filteredCollection.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400">
                  Nenhuma mídia encontrada nesta categoria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredCollection.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  const selectionIndex = selectedIds.indexOf(item.id);

                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleSelection(item.id)}
                      className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                        isSelected
                          ? 'border-yellow-500 shadow-lg shadow-yellow-500/20'
                          : 'border-white/10 hover:border-white/20'
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
                            <span className="text-4xl">📚</span>
                          </div>
                        )}

                        {isSelected && (
                          <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                            {getPodiumIcon(selectionIndex)}
                          </div>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                          <h4 className="text-xs font-semibold text-white line-clamp-2">
                            {item.title}
                          </h4>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/5 bg-slate-900/50 flex justify-between items-center">
            <p className="text-sm text-slate-400">
              {selectedIds.length === 3 ? (
                <span className="text-green-400">✓ Pódio completo!</span>
              ) : (
                `Selecione mais ${3 - selectedIds.length} ${3 - selectedIds.length === 1 ? 'mídia' : 'mídias'}`
              )}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={selectedIds.length === 0}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                Salvar Pódio
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
