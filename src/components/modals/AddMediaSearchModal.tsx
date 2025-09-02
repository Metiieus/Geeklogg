import React, { useState } from "react";
import { X, Search, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MediaSearchBar } from "../MediaSearchBar";
import { MediaType } from "../../App";
import { ExternalMediaResult } from "../../services/externalMediaService";

interface AddMediaSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResultSelect: (result: ExternalMediaResult) => void;
}

export const AddMediaSearchModal: React.FC<AddMediaSearchModalProps> = ({
  isOpen,
  onClose,
  onResultSelect,
}) => {
  const [selectedType, setSelectedType] = useState<MediaType>("books");

  const handleResultSelect = (result: ExternalMediaResult) => {
    onResultSelect(result);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] mx-auto"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-tl from-violet-400/20 to-fuchsia-400/20 rounded-full blur-2xl" />
            </div>

            <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 p-8 border-b border-slate-200/50 dark:border-slate-700/50">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/30 to-transparent dark:from-blue-900/20 rounded-bl-full" />

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 dark:from-blue-400/30 dark:to-cyan-400/30 rounded-2xl border border-blue-200/50 dark:border-blue-700/50">
                      <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Buscar Mídia Online
                      </h1>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Encontre livros, filmes, séries e jogos em bases de
                        dados online
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="p-3 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 hover:scale-105"
                  >
                    <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Search Content */}
              <div className="p-8 min-h-[500px]">
                <div className="max-w-3xl mx-auto">
                  {/* Search Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center mb-8"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 rounded-full border border-violet-200/50 dark:border-violet-700/50 mb-4">
                      <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                      <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                        Pesquisa Inteligente
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                      Digite o nome do que você está procurando e escolha o tipo
                      de mídia. Nossa busca conecta com múltiplas bases de dados
                      para encontrar as melhores opções.
                    </p>
                  </motion.div>

                  {/* Search Component */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6"
                  >
                    <MediaSearchBar
                      selectedType={selectedType}
                      onTypeChange={setSelectedType}
                      onResultSelect={handleResultSelect}
                      placeholder={`Buscar ${
                        selectedType === "books"
                          ? "livros"
                          : selectedType === "movies"
                            ? "filmes"
                            : selectedType === "games"
                              ? "jogos"
                              : selectedType === "series"
                                ? "séries"
                                : "mídia"
                      }...`}
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddMediaSearchModal;
