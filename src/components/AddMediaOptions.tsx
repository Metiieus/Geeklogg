import React, { useState } from "react";
import { Search, Plus, X } from "lucide-react";
import { MediaType } from "../App";
import { MediaSearchBar } from "./MediaSearchBar";
import { ExternalMediaResult } from "../services/externalMediaService";

interface AddMediaOptionsProps {
  onExternalResultSelect: (result: ExternalMediaResult) => void;
  onManualAdd: () => void;
}

export const AddMediaOptions: React.FC<AddMediaOptionsProps> = ({
  onExternalResultSelect,
  onManualAdd,
}) => {
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [selectedType, setSelectedType] = useState<MediaType>("books");

  const handleResultSelect = (result: ExternalMediaResult) => {
    onExternalResultSelect(result);
    setIsSearchMode(false);
  };

  if (isSearchMode) {
    return (
      <div className="space-y-3 sm:space-y-4">
        {/* Header da busca */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
            <Search className="text-purple-400 flex-shrink-0 mt-1" size={20} />
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Buscar Mídia Online
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Encontre livros, filmes, séries e jogos
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSearchMode(false)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="text-slate-400" size={18} />
          </button>
        </div>

        {/* Barra de busca */}
        <MediaSearchBar
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          onResultSelect={handleResultSelect}
          placeholder="Digite o nome da mídia que deseja adicionar..."
        />

        {/* Opção manual */}
        <div className="flex items-center justify-center pt-3 sm:pt-4 border-t border-white/20">
          <button
            onClick={onManualAdd}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm sm:text-base"
          >
            <Plus size={14} className="sm:w-4 sm:h-4" />
            Ou adicione manualmente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      {/* Busca online */}
      <button
        onClick={() => setIsSearchMode(true)}
        className="flex-1 flex items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
      >
        <Search size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
        <div className="text-center sm:text-left min-w-0">
          <div className="font-semibold text-sm sm:text-base">Buscar Online</div>
          <div className="text-xs sm:text-sm opacity-90 truncate">
            Google Books, TMDb, IGDB
          </div>
        </div>
      </button>

      {/* Adição manual */}
      <button
        onClick={onManualAdd}
        className="flex-1 flex items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 bg-slate-700/50 border border-slate-600 rounded-xl text-white hover:bg-slate-700 transition-all duration-200"
      >
        <Plus size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
        <div className="text-center sm:text-left min-w-0">
          <div className="font-semibold text-sm sm:text-base">Adicionar Manualmente</div>
          <div className="text-xs sm:text-sm text-slate-400 truncate">
            Criar entrada personalizada
          </div>
        </div>
      </button>
    </div>
  );
};
