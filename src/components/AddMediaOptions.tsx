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
  const [selectedType, setSelectedType] = useState<MediaType>("anime");

  // Função para detectar automaticamente o tipo baseado na query
  const detectTypeFromQuery = (query: string): MediaType => {
    const lowerQuery = query.toLowerCase();

    // Animes populares e palavras-chave
    const animeKeywords = [
      'one piece', 'naruto', 'dragon ball', 'attack on titan', 'demon slayer',
      'my hero academia', 'jujutsu kaisen', 'chainsaw man', 'death note',
      'fullmetal alchemist', 'hunter x hunter', 'bleach', 'pokemon',
      'sailor moon', 'evangelion', 'cowboy bebop', 'anime', 'manga'
    ];

    // Games e palavras-chave de jogos
    const gameKeywords = [
      'call of duty', 'minecraft', 'fortnite', 'league of legends', 'gta',
      'god of war', 'cyberpunk', 'witcher', 'zelda', 'mario', 'sonic',
      'final fantasy', 'resident evil', 'assassins creed', 'game'
    ];

    // Filmes e séries
    const movieSeriesKeywords = [
      'movie', 'film', 'series', 'season', 'episode', 'netflix', 'marvel',
      'dc comics', 'star wars', 'harry potter', 'lord of the rings'
    ];

    // Livros
    const bookKeywords = [
      'book', 'novel', 'livro', 'romance', 'biografia', 'autobiography',
      'cookbook', 'manual', 'guide', 'textbook'
    ];

    if (animeKeywords.some(keyword => lowerQuery.includes(keyword))) {
      return "anime";
    }

    if (gameKeywords.some(keyword => lowerQuery.includes(keyword))) {
      return "games";
    }

    if (bookKeywords.some(keyword => lowerQuery.includes(keyword))) {
      return "books";
    }

    if (movieSeriesKeywords.some(keyword => lowerQuery.includes(keyword))) {
      return "movies";
    }

    // Se não detectar, mantém anime como padrão (mais comum)
    return selectedType;
  };

  const handleResultSelect = (result: ExternalMediaResult) => {
    onExternalResultSelect(result);
    setIsSearchMode(false);
  };

  const handleTypeChange = (newType: MediaType) => {
    setSelectedType(newType);
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
          onTypeChange={handleTypeChange}
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
    <div className="flex flex-col sm:flex-row lg:flex-row gap-3 sm:gap-4 lg:gap-6 max-w-4xl mx-auto">
      {/* Busca online */}
      <button
        onClick={() => setIsSearchMode(true)}
        className="flex-1 flex items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 modal-interactive"
      >
        <Search size={20} className="sm:w-6 sm:h-6 lg:w-7 lg:h-7 flex-shrink-0" />
        <div className="text-center sm:text-left min-w-0">
          <div className="font-semibold text-sm sm:text-base lg:text-lg">Buscar Online</div>
          <div className="text-xs sm:text-sm lg:text-base opacity-90 truncate">
            Google Books, TMDb, IGDB
          </div>
        </div>
      </button>

      {/* Adição manual */}
      <button
        onClick={onManualAdd}
        className="flex-1 flex items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 lg:p-8 bg-slate-700/50 border border-slate-600 rounded-xl text-white hover:bg-slate-700 transition-all duration-200 modal-interactive"
      >
        <Plus size={20} className="sm:w-6 sm:h-6 lg:w-7 lg:h-7 flex-shrink-0" />
        <div className="text-center sm:text-left min-w-0">
          <div className="font-semibold text-sm sm:text-base lg:text-lg">Adicionar Manualmente</div>
          <div className="text-xs sm:text-sm lg:text-base text-slate-400 truncate">
            Criar entrada personalizada
          </div>
        </div>
      </button>
    </div>
  );
};
