import React, { useState } from "react";
import { X, Search, Sparkles, Plus, BookOpen, Film, Gamepad2, Tv } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MediaSearchBar } from "../MediaSearchBar";
import { MediaType } from "../../App";
import { ExternalMediaResult } from "../../services/externalMediaService";
import { ManualAddModal } from "../Library/ManualAddModal";

interface AddMediaSearchModalProps {
  onClose: () => void;
}

export const AddMediaSearchModal: React.FC<AddMediaSearchModalProps> = ({
  onClose,
}) => {
  const [selectedType, setSelectedType] = useState<MediaType>("books");
  const [showManualAdd, setShowManualAdd] = useState(false);

  const handleResultSelect = (result: ExternalMediaResult) => {
    console.log("Selected media:", result);
    // TODO: Save to database
    onClose();
  };

  const mediaTypes: Array<{ id: MediaType; label: string; icon: React.ElementType }> = [
    { id: "books", label: "Books", icon: BookOpen },
    { id: "movies", label: "Movies", icon: Film },
    { id: "games", label: "Games", icon: Gamepad2 },
    { id: "series", label: "TV Shows", icon: Tv },
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
          <div className="relative bg-gradient-to-r from-slate-900/90 to-slate-800/90 p-6 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Add Media</h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Search online databases or add manually
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

            {/* Media Type Filters */}
            <div className="flex gap-2 mt-6">
              {mediaTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-medium ${
                      selectedType === type.id
                        ? "bg-gradient-to-r from-violet-500 to-cyan-500 text-white"
                        : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{type.label}</span>
                  </motion.button>
                );
              })}

              <div className="flex-1" />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowManualAdd(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 transition-all text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Add Manually</span>
              </motion.button>
            </div>
          </div>

          {/* Search Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-4xl mx-auto"
            >
              {/* Info Banner */}
              <div className="mb-6 p-4 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Smart Search</h3>
                  <p className="text-slate-400 text-sm">
                    Search across multiple databases including Google Books, TMDb, and RAWG.
                    We'll find the best matches with covers, descriptions, and metadata.
                  </p>
                </div>
              </div>

              {/* Search Component */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <MediaSearchBar
                  selectedType={selectedType}
                  onTypeChange={setSelectedType}
                  onResultSelect={handleResultSelect}
                  placeholder={`Search for ${
                    selectedType === "books"
                      ? "books by title or author"
                      : selectedType === "movies"
                        ? "movies by title"
                        : selectedType === "games"
                          ? "games by title"
                          : selectedType === "series"
                            ? "TV shows by title"
                            : "media"
                  }...`}
                />
              </div>

              {/* Instructions */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center mb-3">
                    <Search className="w-4 h-4 text-violet-400" />
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1">1. Search</h4>
                  <p className="text-slate-400 text-xs">
                    Type the name of what you're looking for
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-3">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1">2. Select</h4>
                  <p className="text-slate-400 text-xs">
                    Choose from the results we find
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center mb-3">
                    <Plus className="w-4 h-4 text-green-400" />
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1">3. Add</h4>
                  <p className="text-slate-400 text-xs">
                    It's added to your library automatically
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
