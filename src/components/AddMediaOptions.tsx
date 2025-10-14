// src/components/AddMediaOptions.tsx
import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import type { ExternalMediaResult } from "../services/externalMediaService";
import { AddMediaSearchModal } from "./modals/AddMediaSearchModal";

interface AddMediaOptionsProps {
  onExternalResultSelect: (result: ExternalMediaResult) => void;
  onManualAdd: () => void;
}

export const AddMediaOptions: React.FC<AddMediaOptionsProps> = ({
  onExternalResultSelect,
  onManualAdd,
}) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleSearchResultSelect = (result: ExternalMediaResult) => {
    onExternalResultSelect(result);
    setIsSearchModalOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Buscar Online */}
        <button
          type="button"
          onClick={() => setIsSearchModalOpen(true)}
          className="group rounded-2xl border border-white/15 bg-gradient-to-br from-slate-800/40 to-slate-900/60 hover:bg-gradient-to-br hover:from-slate-700/50 hover:to-slate-800/70 px-6 py-6 text-left transition-all duration-300 backdrop-blur-xl hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-500/10 hover:scale-105"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-r from-fuchsia-500/30 to-cyan-500/30 p-3 group-hover:from-fuchsia-500/40 group-hover:to-cyan-500/40 transition-all duration-300">
              <Search className="text-white/90" size={20} />
            </div>
            <div>
              <div className="font-semibold text-white text-lg group-hover:text-cyan-200 transition-colors text-balance">
                Buscar Online
              </div>
              <div className="text-sm text-white/70 group-hover:text-white/80 transition-colors text-balance">
                Google Books, TMDb, RAWG...
              </div>
            </div>
          </div>
        </button>

        {/* Adicionar Manualmente */}
        <button
          type="button"
          onClick={onManualAdd}
          className="group rounded-2xl border border-white/15 bg-gradient-to-br from-slate-800/40 to-slate-900/60 hover:bg-gradient-to-br hover:from-slate-700/50 hover:to-slate-800/70 px-6 py-6 text-left transition-all duration-300 backdrop-blur-xl hover:border-emerald-400/30 hover:shadow-lg hover:shadow-emerald-500/10 hover:scale-105"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-r from-emerald-500/30 to-teal-500/30 p-3 group-hover:from-emerald-500/40 group-hover:to-teal-500/40 transition-all duration-300">
              <Plus className="text-white/90" size={20} />
            </div>
            <div>
              <div className="font-semibold text-white text-lg group-hover:text-emerald-200 transition-colors">
                Adicionar Manual
              </div>
              <div className="text-sm text-white/70 group-hover:text-white/80 transition-colors">
                Criar entrada personalizada
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Search Modal */}
      <AddMediaSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onResultSelect={handleSearchResultSelect}
      />
    </>
  );
};

export default AddMediaOptions;
