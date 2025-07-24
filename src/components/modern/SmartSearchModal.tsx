import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Zap, 
  TrendingUp, 
  Star, 
  Calendar,
  Clock,
  Plus,
  Gamepad2,
  Film,
  Book,
  Tv,
  Heart,
  Loader2,
  Sparkles,
  Filter,
  ArrowRight
} from 'lucide-react';
import { MediaType } from '../../domain/entities/Media';
import { enhancedExternalMediaService, EnhancedExternalMediaResult } from '../../infrastructure/services/EnhancedExternalMediaService';
import { ModernCard, GlassCard, InteractiveCard } from './ModernCard';
import { ModernButton, GradientButton, NeonButton, GhostButton } from './ModernButton';
import { useToast } from '../../context/ToastContext';

const mediaTypeConfig = {
  games: { 
    icon: Gamepad2, 
    label: "Jogos", 
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/20",
    textColor: "text-blue-400",
    borderColor: "border-blue-500/30"
  },
  anime: { 
    icon: Tv, 
    label: "Anime", 
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500/20",
    textColor: "text-pink-400",
    borderColor: "border-pink-500/30"
  },
  series: { 
    icon: Tv, 
    label: "Séries", 
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-500/20",
    textColor: "text-purple-400",
    borderColor: "border-purple-500/30"
  },
  books: { 
    icon: Book, 
    label: "Livros", 
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/20",
    textColor: "text-green-400",
    borderColor: "border-green-500/30"
  },
  movies: { 
    icon: Film, 
    label: "Filmes", 
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-500/20",
    textColor: "text-yellow-400",
    borderColor: "border-yellow-500/30"
  },
  dorama: { 
    icon: Heart, 
    label: "Doramas", 
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-500/20",
    textColor: "text-red-400",
    borderColor: "border-red-500/30"
  },
};

interface SmartSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (result: EnhancedExternalMediaResult) => void;
  initialType?: MediaType;
  userPreferences?: {
    favoriteGenres?: string[];
    preferredPlatforms?: string[];
    ratingThreshold?: number;
  };
}

interface SearchResults {
  exact: EnhancedExternalMediaResult[];
  suggestions: EnhancedExternalMediaResult[];
  trending: EnhancedExternalMediaResult[];
}

export const SmartSearchModal: React.FC<SmartSearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialType = 'games',
  userPreferences
}) => {
  // State
  const [selectedType, setSelectedType] = useState<MediaType>(initialType);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({ exact: [], suggestions: [], trending: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'trending' | 'suggestions'>('search');
  const [isAiMode, setIsAiMode] = useState(false);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const { showError, showSuccess } = useToast();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Load trending content on mount
  useEffect(() => {
    if (isOpen) {
      loadTrendingContent();
    }
  }, [isOpen, selectedType]);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(searchQuery);
      }, 500);
    } else {
      setResults(prev => ({ ...prev, exact: [] }));
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, selectedType, isAiMode]);

  const loadTrendingContent = async () => {
    try {
      let trending: EnhancedExternalMediaResult[] = [];
      
      switch (selectedType) {
        case 'games':
          trending = await enhancedExternalMediaService.getPopularGames(12);
          break;
        default:
          // For other types, we'd implement similar trending methods
          break;
      }

      setResults(prev => ({ ...prev, trending }));
    } catch (error) {
      console.error('Error loading trending content:', error);
    }
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      if (isAiMode) {
        // AI-powered smart search
        const smartResults = await enhancedExternalMediaService.smartSearch(query, userPreferences);
        setResults(smartResults);
      } else {
        // Regular search
        const searchResults = await enhancedExternalMediaService.searchMedia({
          query,
          type: selectedType,
          limit: 20
        });
        setResults(prev => ({ ...prev, exact: searchResults }));
      }
    } catch (error) {
      console.error('Error searching:', error);
      showError('Erro na busca', 'Não foi possível realizar a busca. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (result: EnhancedExternalMediaResult) => {
    onSelect(result);
    showSuccess('Item selecionado!', 'Preencha os detalhes para adicionar à sua biblioteca');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 400 }}
          className="w-full max-w-6xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        >
          <GlassCard size="lg" className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Search className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Busca Inteligente</h2>
                  <p className="text-slate-400">Encontre e adicione nova mídia à sua biblioteca</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <NeonButton
                  size="sm"
                  icon={<Sparkles size={16} />}
                  onClick={() => setIsAiMode(!isAiMode)}
                  className={isAiMode ? 'bg-purple-600' : ''}
                >
                  IA
                </NeonButton>
                <GhostButton size="sm" icon={<X size={20} />} onClick={onClose}>
                  <span className="sr-only">Fechar</span>
                </GhostButton>
              </div>
            </div>

            {/* Search Controls */}
            <div className="space-y-4 mb-6">
              {/* Type Selector */}
              <div className="flex flex-wrap gap-2">
                {(Object.keys(mediaTypeConfig) as MediaType[]).map((type) => {
                  const config = mediaTypeConfig[type];
                  const Icon = config.icon;
                  const isSelected = selectedType === type;
                  
                  return (
                    <motion.button
                      key={type}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedType(type)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium
                        ${isSelected 
                          ? `bg-gradient-to-r ${config.color} text-white shadow-lg` 
                          : `${config.bgColor} ${config.textColor} border ${config.borderColor} hover:bg-opacity-80`
                        }
                      `}
                    >
                      <Icon size={18} />
                      <span>{config.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Search Input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Search size={20} />
                  )}
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAiMode ? "Descreva o que você procura..." : `Buscar ${mediaTypeConfig[selectedType].label.toLowerCase()}...`}
                  className="w-full pl-12 pr-16 py-4 bg-slate-800/50 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-lg"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* AI Mode Info */}
              {isAiMode && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-purple-400 bg-purple-500/10 px-4 py-2 rounded-lg border border-purple-500/30"
                >
                  <Sparkles size={16} />
                  <span>Modo IA ativado - Busca inteligente com sugestões personalizadas</span>
                </motion.div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              {[
                { id: 'search', label: 'Resultados', icon: Search, count: results.exact.length },
                { id: 'trending', label: 'Trending', icon: TrendingUp, count: results.trending.length },
                { id: 'suggestions', label: 'Sugestões', icon: Sparkles, count: results.suggestions.length }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium
                      ${isActive 
                        ? 'bg-cyan-500 text-white shadow-lg' 
                        : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
                      }
                    `}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span className={`
                        px-2 py-0.5 rounded-full text-xs font-bold
                        ${isActive ? 'bg-white/20' : 'bg-slate-600/50'}
                      `}>
                        {tab.count}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Results */}
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent"
                >
                  <SearchResultsGrid 
                    results={results[activeTab]} 
                    onSelect={handleSelect}
                    isLoading={isLoading && activeTab === 'search'}
                    emptyMessage={getEmptyMessage(activeTab, searchQuery)}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

interface SearchResultsGridProps {
  results: EnhancedExternalMediaResult[];
  onSelect: (result: EnhancedExternalMediaResult) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

const SearchResultsGrid: React.FC<SearchResultsGridProps> = ({
  results,
  onSelect,
  isLoading,
  emptyMessage
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-slate-400">Buscando conteúdo...</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-4">
      {results.map((result) => (
        <SearchResultCard 
          key={`${result.source}-${result.id}`}
          result={result}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

interface SearchResultCardProps {
  result: EnhancedExternalMediaResult;
  onSelect: (result: EnhancedExternalMediaResult) => void;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ result, onSelect }) => {
  return (
    <InteractiveCard className="group cursor-pointer">
      <div className="aspect-[3/4] bg-slate-700 rounded-lg overflow-hidden relative mb-3">
        {result.image ? (
          <img 
            src={result.image} 
            alt={result.title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Search className="text-slate-500" size={32} />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSelect(result)}
            className="p-3 bg-cyan-500 backdrop-blur-sm rounded-full hover:bg-cyan-600 transition-colors"
          >
            <Plus size={20} className="text-white" />
          </motion.button>
        </div>

        {/* Source badge */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white">
          {result.source.toUpperCase()}
        </div>

        {/* Rating */}
        {result.rating && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded">
            <Star className="text-yellow-400" size={12} fill="currentColor" />
            <span className="text-white text-xs">{result.rating}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-white line-clamp-2 text-sm leading-tight">
          {result.title}
        </h3>
        
        <div className="space-y-1">
          {result.year && (
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar size={10} />
              <span>{result.year}</span>
            </div>
          )}
          
          {result.genres && result.genres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {result.genres.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-0.5 bg-slate-700/50 text-slate-300 text-xs rounded-full"
                >
                  {genre}
                </span>
              ))}
              {result.genres.length > 2 && (
                <span className="px-2 py-0.5 bg-slate-700/50 text-slate-300 text-xs rounded-full">
                  +{result.genres.length - 2}
                </span>
              )}
            </div>
          )}

          {result.platforms && result.platforms.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {result.platforms.slice(0, 2).map((platform) => (
                <span
                  key={platform}
                  className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30"
                >
                  {platform}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </InteractiveCard>
  );
};

const getEmptyMessage = (tab: string, searchQuery: string): string => {
  switch (tab) {
    case 'search':
      return searchQuery 
        ? `Nenhum resultado encontrado para "${searchQuery}"` 
        : 'Digite algo para começar a buscar';
    case 'trending':
      return 'Nenhum conteúdo trending disponível no momento';
    case 'suggestions':
      return 'Nenhuma sugestão disponível';
    default:
      return 'Nenhum resultado encontrado';
  }
};

export default SmartSearchModal;
