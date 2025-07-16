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
      <div className="space-y-4">
        {/* Header da busca */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Search className="text-purple-400" size={24} />
            <div>
              <h2 className="text-xl font-bold text-white">
                Buscar Mídia Online
              </h2>
              <p className="text-slate-400 text-sm">
                Encontre livros, filmes e séries para adicionar à sua biblioteca
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSearchMode(false)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="text-slate-400" size={20} />
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
        <div className="flex items-center justify-center pt-4 border-t border-slate-700">
          <button
            onClick={onManualAdd}
            className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors"
          >
            <Plus size={16} />
            Ou adicione manualmente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Busca online */}
      <button
        onClick={() => setIsSearchMode(true)}
        className="flex-1 flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
      >
        <Search size={24} />
        <div className="text-left">
          <div className="font-semibold">Buscar Online</div>
          <div className="text-sm opacity-90">
            Encontrar em Google Books, TMDb e mais
          </div>
        </div>
      </button>

      {/* Adição manual */}
      <button
        onClick={onManualAdd}
        className="flex-1 flex items-center justify-center gap-3 p-6 bg-slate-700/50 border border-slate-600 rounded-xl text-white hover:bg-slate-700 transition-all duration-200"
      >
        <Plus size={24} />
        <div className="text-left">
          <div className="font-semibold">Adicionar Manualmente</div>
          <div className="text-sm text-slate-400">
            Criar entrada personalizada
          </div>
        </div>
      </button>
    </div>
  );
};
