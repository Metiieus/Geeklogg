import React, { useState } from "react";
import { X, Search, Sparkles, Plus, BookOpen, Film, Gamepad2, Tv } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { MediaSearchBar } from "../MediaSearchBar";
import { MediaType } from "../../types";
import { ExternalMediaResult } from "../../services/externalMediaService";
import { ManualAddModal } from "../../pages/Library/ManualAddModal";

import { useI18n } from "../../i18n";

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
  const { t } = useI18n();
  const [selectedType, setSelectedType] = useState<MediaType>("book");
  const [showManualAdd, setShowManualAdd] = useState(false);

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setShowManualAdd(false);
      setSelectedType("book");
    }
  }, [isOpen]);

  const handleResultSelect = (result: ExternalMediaResult) => {
    onResultSelect(result);
    // onClose() is handled by parent if needed, or we can call it here.
    // AddMediaOptions calls setIsSearchModalOpen(false) in handleSearchResultSelect.
  };

  const mediaTypes: Array<{ id: MediaType; label: string; icon: React.ElementType }> = [
    { id: "book", label: t("media_type.book"), icon: BookOpen },
    { id: "movie", label: t("media_type.movie"), icon: Film },
    { id: "game", label: t("media_type.game"), icon: Gamepad2 },
    { id: "tv", label: t("media_type.tv"), icon: Tv },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {showManualAdd ? (
            <ManualAddModal onClose={() => setShowManualAdd(false)} />
          ) : (
            <>
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
                          <h2 className="text-2xl font-bold text-white">{t("modals.add.title")}</h2>
                          <p className="text-slate-400 text-sm mt-1">
                            {t("modals.add.subtitle")}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                        }}
                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all hover:scale-110"
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
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-medium ${selectedType === type.id
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
                        <span>{t("modals.add.manual")}</span>
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
                          <h3 className="text-white font-semibold mb-1">{t("modals.add.smart_search")}</h3>
                          <p className="text-slate-400 text-sm">
                            {t("modals.add.smart_search_desc")}
                          </p>
                        </div>
                      </div>

                      {/* Search Component */}
                      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                        <MediaSearchBar
                          selectedType={selectedType}
                          onTypeChange={setSelectedType}
                          onResultSelect={handleResultSelect}
                        // Uses MediaSearchBar's internal default or passed via prop if needed
                        />
                      </div>

                      {/* Instructions */}
                      <div className="mt-6 grid grid-cols-3 gap-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center mb-3">
                            <Search className="w-4 h-4 text-violet-400" />
                          </div>
                          <h4 className="text-white font-semibold text-sm mb-1">{t("modals.add.step1")}</h4>
                          <p className="text-slate-400 text-xs">
                            {t("modals.add.step1_desc")}
                          </p>
                        </div>

                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-3">
                            <Sparkles className="w-4 h-4 text-cyan-400" />
                          </div>
                          <h4 className="text-white font-semibold text-sm mb-1">{t("modals.add.step2")}</h4>
                          <p className="text-slate-400 text-xs">
                            {t("modals.add.step2_desc")}
                          </p>
                        </div>

                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center mb-3">
                            <Plus className="w-4 h-4 text-green-400" />
                          </div>
                          <h4 className="text-white font-semibold text-sm mb-1">{t("modals.add.step3")}</h4>
                          <p className="text-slate-400 text-xs">
                            {t("modals.add.step3_desc")}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      )}
    </AnimatePresence>
  );
};
export default AddMediaSearchModal;
