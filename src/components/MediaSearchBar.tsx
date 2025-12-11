import React, { useState, useCallback, useRef, useEffect } from "react";
import { Search, X, AlertCircle, Book, Film, Tv, Gamepad2 } from "lucide-react";
import { MediaType } from "../types";
import {
  externalMediaService,
  ExternalMediaResult,
} from "../services/externalMediaService";
import { useToast } from "../context/ToastContext";

import { useI18n } from "../i18n";

interface MediaSearchBarProps {
  selectedType: MediaType;
  onTypeChange: (type: MediaType) => void;
  onResultSelect: (result: ExternalMediaResult) => void;
  placeholder?: string;
}

export const MediaSearchBar: React.FC<MediaSearchBarProps> = ({
  selectedType,
  onTypeChange,
  onResultSelect,
  placeholder, // Note: placeholder logic below
}) => {
  const { t } = useI18n();

  const displayPlaceholder = placeholder || t("search.placeholder");

  const mediaTypeOptions = [
    { value: "anime", label: t("media_type.anime"), icon: Film },
    { value: "movie", label: t("media_type.movie"), icon: Film },
    { value: "tv", label: t("media_type.tv"), icon: Tv },
    { value: "game", label: t("media_type.game"), icon: Gamepad2 },
    { value: "book", label: t("media_type.book"), icon: Book },
  ] as const;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ExternalMediaResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [apiStatus, setApiStatus] = useState({
    googleBooks: true,
    tmdb: true,
    rawg: true,
  });

  const { showError, showWarning } = useToast();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Verificar status das APIs na inicialização
  useEffect(() => {
    const checkApis = async () => {
      try {
        const status = await externalMediaService.checkApiAvailability();
        setApiStatus(status);

        if (!status.googleBooks && !status.tmdb && !status.rawg) {
          showWarning(
            "APIs Indisponíveis",
            "Serviços de busca externa temporariamente indisponíveis",
          );
        }
      } catch (error) {
        console.warn("Erro ao verificar APIs:", error);
      }
    };

    checkApis();
  }, [showError, showWarning]);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Função de busca com debounce
  const performSearch = useCallback(
    async (searchQuery: string, mediaType: MediaType) => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setResults([]);
        return;
      }

      // Verificar se a API necessária está disponível
      const needsGoogleBooks = mediaType === "book";
      const needsTmdb = ["movie", "tv", "anime"].includes(mediaType);
      const needsRawg = mediaType === "game";

      if (
        (needsGoogleBooks && !apiStatus.googleBooks) ||
        (needsTmdb && !apiStatus.tmdb) ||
        (needsRawg && !apiStatus.rawg)
      ) {
        showError(
          "API Indisponível",
          t("search.searching") // Using a generic searching message or create specific error key in future
        );
        return;
      }

      setIsLoading(true);
      setHasError(false);

      try {
        const searchResults = await externalMediaService.searchMedia({
          query: searchQuery,
          type: mediaType,
        });
        setResults(searchResults);
        if (searchResults.length > 0) {
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Erro na busca:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [apiStatus, showError],
  );

  const handleInputChange = (value: string) => {
    setQuery(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (value.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      performSearch(value, selectedType);
    }, 500);
  };

  const handleResultClick = (result: ExternalMediaResult) => {
    onResultSelect(result);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const handleClearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const getTypeIcon = (type: MediaType) => {
    const option = mediaTypeOptions.find((opt) => opt.value === type);
    if (!option) return Search;
    return option.icon;
  };

  const formatResultSubtitle = (result: ExternalMediaResult): string => {
    const parts: string[] = [];

    if (result.year) parts.push(result.year.toString());
    if (result.authors && result.authors.length > 0) {
      parts.push(result.authors.slice(0, 2).join(", "));
    }
    if (result.publisher) parts.push(result.publisher);
    if (result.genres && result.genres.length > 0) {
      parts.push(result.genres.slice(0, 2).join(", "));
    }

    return parts.join(" • ");
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Seletor de tipo de mídia */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {mediaTypeOptions.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => onTypeChange(value)}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap transition-all text-sm ${selectedType === value
              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
              : "bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
          >
            <Icon size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label.charAt(0)}</span>
          </button>
        ))}
      </div>

      {/* Barra de busca */}
      <div className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-3 sm:left-4 text-slate-400">
            {React.createElement(getTypeIcon(selectedType), {
              size: 18,
              className: "sm:w-5 sm:h-5",
            })}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            placeholder={displayPlaceholder}
            className="w-full pl-10 sm:pl-12 pr-12 py-3 sm:py-4 text-sm sm:text-base bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />

          <div className="absolute right-3 sm:right-4 flex items-center gap-2">
            {isLoading && (
              <div className="w-5 h-5 border-2 border-slate-400 border-t-purple-500 rounded-full animate-spin" />
            )}

            {query && !isLoading && (
              <button
                onClick={handleClearSearch}
                className="p-1 sm:p-2 hover:bg-slate-700 rounded-full transition-colors touch-target"
              >
                <X className="text-slate-400 hover:text-white" size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Dropdown de resultados */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl max-h-80 sm:max-h-96 overflow-y-auto z-[9999] animate-slide-up">
            {hasError ? (
              <div className="flex items-center gap-3 p-4 text-red-400">
                <AlertCircle size={20} />
                <span>Erro ao buscar resultados</span>
              </div>
            ) : results.length === 0 ? (
              <div className="p-4 text-slate-400 text-center">
                {query.length < 2
                  ? t("tips.hint_use") + "..."
                  : t("search.no_results")}
              </div>
            ) : (
              <div className="py-2">
                {results.map((result) => (
                  <button
                    key={`${result.source}-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full flex items-start gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-slate-700/50 transition-colors text-left"
                  >
                    {/* Imagem da capa */}
                    <div className="flex-shrink-0 w-10 h-12 sm:w-12 sm:h-16 bg-slate-700 rounded overflow-hidden">
                      {result.image ? (
                        <img
                          src={result.image}
                          alt={result.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {React.createElement(getTypeIcon(selectedType), {
                            size: 16,
                            className: "text-slate-500 sm:w-5 sm:h-5",
                          })}
                        </div>
                      )}
                    </div>

                    {/* Informações */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate text-sm sm:text-base">
                        {result.title}
                      </h3>

                      {formatResultSubtitle(result) && (
                        <p className="text-xs sm:text-sm text-slate-400 truncate mt-1">
                          {formatResultSubtitle(result)}
                        </p>
                      )}

                      {result.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1 sm:line-clamp-2">
                          {result.description.slice(0, 120)}
                          {result.description.length > 120 ? "..." : ""}
                        </p>
                      )}

                      {/* Indicador da fonte */}
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ${result.source === "google-books"
                            ? "bg-blue-500/20 text-blue-400"
                            : result.source === "rawg"
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-green-500/20 text-green-400"
                            }`}
                        >
                          {result.source === "google-books"
                            ? "Google Books"
                            : result.source === "rawg"
                              ? "RAWG"
                              : "TMDb"}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div >
  );
};
