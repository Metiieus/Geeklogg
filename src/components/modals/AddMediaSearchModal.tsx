import React, { useState } from "react";
import { X, Search, Sparkles, Plus, BookOpen, Film, Gamepad2, Tv } from "lucide-react";
import { motion } from "framer-motion";
import { MediaSearchBar } from "../MediaSearchBar";
import { MediaType } from "../../App";
import { ExternalMediaResult } from "../../services/externalMediaService";
import { ManualAddModal } from "../Library/ManualAddModal";

interface AddMediaSearchModalProps {
  onClose: () => void;
  onAddMedia: (result: ExternalMediaResult) => Promise<void>;
}

export const AddMediaSearchModal: React.FC<AddMediaSearchModalProps> = ({
  onClose,
  onAddMedia,
}) => {
  const [selectedType, setSelectedType] = useState<MediaType>("books");
  const [showManualAdd, setShowManualAdd] = useState(false);

  const handleResultSelect = async (result: ExternalMediaResult) => {
    await onAddMedia(result);
    onClose();
  };

  const mediaTypes: Array<{ id: MediaType; label: string; icon: React.ElementType }> = [
    { id: "books", label: "Livros", icon: BookOpen },
    { id: "movies", label: "Filmes", icon: Film },
    { id: "games", label: "Jogos", icon: Gamepad2 },
    { id: "series", label: "Séries", icon: Tv },
  ];

  if (showManualAdd) {
    return <ManualAddModal onClose={() => {
      setShowManualAdd(false);
      onClose();
    }} />;
  }

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
        className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden"
      >
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-slate-900/90 to-slate-800/90 p-4 sm:p-6 border-b border-white/5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-white text-balance truncate">Adicionar Mídia</h2>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1 text-balance">
                    Busque em bases de dados online ou adicione manualmente
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all flex-shrink-0"
                aria-label="Fechar"
                title="Fechar"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Media Type Filters */}
            <div className="mt-4 sm:mt-6 -mx-2 px-2 overflow-x-auto pb-2">
              <div className="inline-flex items-center gap-2 min-w-full sm:min-w-0">
              {mediaTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedType(type.id)}
                    className={`shrink-0 whitespace-nowrap flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all text-sm font-medium ${
                      selectedType === type.id
                        ? "bg-gradient-to-r from-violet-500 to-cyan-500 text-white"
                        : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden xs:inline sm:inline">{type.label}</span>
                    <span className="sm:hidden">{type.label.charAt(0)}</span>
                  </motion.button>
                );
              })}

              <div className="flex-1" />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowManualAdd(true)}
                className="shrink-0 whitespace-nowrap flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 transition-all text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                <span className="sm:inline hidden">Adicionar Manualmente</span>
                <span className="sm:hidden">Manual</span>
              </motion.button>
              </div>
            </div>
          </div>

          {/* Search Content */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-4xl mx-auto"
            >
              {/* Info Banner */}
              <div className="mb-6 p-4 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-start gap-3 text-balance">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Busca Inteligente</h3>
                  <p className="text-slate-400 text-sm">
                    Busque em múltiplas bases de dados incluindo Google Books, TMDb e RAWG.
                    Encontraremos as melhores correspondências com capas, descrições e metadados.
                  </p>
                </div>
              </div>

              {/* Search Component */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
                <MediaSearchBar
                  selectedType={selectedType}
                  onTypeChange={setSelectedType}
                  onResultSelect={handleResultSelect}
                  placeholder={`Buscar ${
                    selectedType === "books"
                      ? "livros por título ou autor"
                      : selectedType === "movies"
                        ? "filmes por título"
                        : selectedType === "games"
                          ? "jogos por título"
                          : selectedType === "series"
                            ? "séries por título"
                            : "mídias"
                  }...`}
                />
              </div>

              {/* Instructions */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center mb-3">
                    <Search className="w-4 h-4 text-violet-400" />
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1">1. Buscar</h4>
                  <p className="text-slate-400 text-xs">
                    Digite o nome do que você procura
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-3">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1">2. Selecionar</h4>
                  <p className="text-slate-400 text-xs">
                    Escolha entre os resultados encontrados
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center mb-3">
                    <Plus className="w-4 h-4 text-green-400" />
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1">3. Adicionar</h4>
                  <p className="text-slate-400 text-xs">
                    É adicionado automaticamente à sua biblioteca
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddMediaSearchModal;
