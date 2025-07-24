import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  X, 
  Star, 
  Calendar, 
  Clock, 
  Tag, 
  Zap,
  RotateCcw,
  Save,
  Bookmark,
  TrendingUp,
  Target,
  Sparkles
} from 'lucide-react';
import { MediaType, Status } from '../../domain/entities/Media';
import { ModernCard, GlassCard } from './ModernCard';
import { ModernButton, GradientButton, GhostButton, NeonButton } from './ModernButton';

interface FilterOptions {
  types: MediaType[];
  statuses: Status[];
  ratingRange: { min: number; max: number };
  yearRange: { min: number; max: number };
  hoursRange: { min: number; max: number };
  tags: string[];
  hasRating: boolean;
  hasHours: boolean;
  hasReviews: boolean;
  dateRange: { start: Date | null; end: Date | null };
}

interface FilterPreset {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  filters: Partial<FilterOptions>;
  color: string;
}

interface IntelligentFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: Partial<FilterOptions>) => void;
  availableTags: string[];
  currentFilters: Partial<FilterOptions>;
  totalItems: number;
  filteredCount: number;
}

const filterPresets: FilterPreset[] = [
  {
    id: 'completed-favorites',
    name: 'Favoritos Concluídos',
    description: 'Itens concluídos com avaliação 4+ estrelas',
    icon: <Star className="text-yellow-400" size={16} />,
    filters: {
      statuses: ['completed'],
      ratingRange: { min: 4, max: 5 },
      hasRating: true
    },
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'current-progress',
    name: 'Em Progresso',
    description: 'Tudo que você está fazendo agora',
    icon: <Clock className="text-blue-400" size={16} />,
    filters: {
      statuses: ['in-progress']
    },
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'recent-additions',
    name: 'Adições Recentes',
    description: 'Itens adicionados nos últimos 30 dias',
    icon: <TrendingUp className="text-green-400" size={16} />,
    filters: {
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date()
      }
    },
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'quick-wins',
    name: 'Vitórias Rápidas',
    description: 'Itens com menos de 10 horas investidas',
    icon: <Zap className="text-purple-400" size={16} />,
    filters: {
      hoursRange: { min: 0, max: 10 },
      hasHours: true
    },
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'marathon-sessions',
    name: 'Maratonas',
    description: 'Itens com mais de 50 horas',
    icon: <Target className="text-red-400" size={16} />,
    filters: {
      hoursRange: { min: 50, max: 1000 },
      hasHours: true
    },
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'unrated-gems',
    name: 'Sem Avaliação',
    description: 'Itens que precisam de sua opinião',
    icon: <Sparkles className="text-cyan-400" size={16} />,
    filters: {
      hasRating: false
    },
    color: 'from-cyan-500 to-blue-500'
  }
];

const mediaTypeLabels: Record<MediaType, string> = {
  games: 'Jogos',
  anime: 'Anime',
  series: 'Séries',
  books: 'Livros',
  movies: 'Filmes',
  dorama: 'Doramas'
};

const statusLabels: Record<Status, string> = {
  completed: 'Concluído',
  'in-progress': 'Em Progresso',
  dropped: 'Abandonado',
  planned: 'Planejado'
};

export const IntelligentFilters: React.FC<IntelligentFiltersProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  availableTags,
  currentFilters,
  totalItems,
  filteredCount
}) => {
  const [localFilters, setLocalFilters] = useState<Partial<FilterOptions>>(currentFilters);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [customPresetName, setCustomPresetName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);

  // Check if current filters match a preset
  const matchingPreset = useMemo(() => {
    return filterPresets.find(preset => {
      const presetKeys = Object.keys(preset.filters);
      return presetKeys.every(key => {
        const presetValue = preset.filters[key as keyof FilterOptions];
        const currentValue = localFilters[key as keyof FilterOptions];
        return JSON.stringify(presetValue) === JSON.stringify(currentValue);
      });
    });
  }, [localFilters]);

  const updateFilter = useCallback(<K extends keyof FilterOptions>(
    key: K, 
    value: FilterOptions[K]
  ) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
    setActivePreset(null);
  }, []);

  const applyPreset = useCallback((preset: FilterPreset) => {
    setLocalFilters(preset.filters);
    setActivePreset(preset.id);
  }, []);

  const resetFilters = useCallback(() => {
    setLocalFilters({});
    setActivePreset(null);
  }, []);

  const handleApply = useCallback(() => {
    onApplyFilters(localFilters);
    onClose();
  }, [localFilters, onApplyFilters, onClose]);

  const isFilterActive = useMemo(() => {
    return Object.keys(localFilters).length > 0;
  }, [localFilters]);

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
          className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <GlassCard size="lg" className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Filter className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Filtros Inteligentes</h2>
                  <p className="text-slate-400">
                    {filteredCount} de {totalItems} itens
                    {filteredCount !== totalItems && ' (filtrados)'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isFilterActive && (
                  <GhostButton
                    size="sm"
                    icon={<RotateCcw size={16} />}
                    onClick={resetFilters}
                  >
                    Limpar
                  </GhostButton>
                )}
                <GhostButton size="sm" icon={<X size={20} />} onClick={onClose}>
                  <span className="sr-only">Fechar</span>
                </GhostButton>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6">
              {/* Quick Presets */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="text-yellow-400" size={20} />
                  Filtros Rápidos
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filterPresets.map((preset) => (
                    <motion.div
                      key={preset.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => applyPreset(preset)}
                      className={`
                        p-4 rounded-xl cursor-pointer transition-all border
                        ${(activePreset === preset.id || matchingPreset?.id === preset.id)
                          ? 'bg-gradient-to-r ' + preset.color + ' border-transparent text-white shadow-lg'
                          : 'bg-slate-800/50 border-slate-600/30 hover:border-slate-500/50 text-slate-300 hover:text-white'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                          {preset.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{preset.name}</h4>
                          <p className="text-sm opacity-80 line-clamp-2">{preset.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Advanced Filters */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Target className="text-cyan-400" size={20} />
                  Filtros Avançados
                </h3>

                {/* Type and Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Tipos de Mídia
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.keys(mediaTypeLabels) as MediaType[]).map((type) => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={localFilters.types?.includes(type) || false}
                            onChange={(e) => {
                              const currentTypes = localFilters.types || [];
                              if (e.target.checked) {
                                updateFilter('types', [...currentTypes, type]);
                              } else {
                                updateFilter('types', currentTypes.filter(t => t !== type));
                              }
                            }}
                            className="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500"
                          />
                          <span className="text-sm text-slate-300">{mediaTypeLabels[type]}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.keys(statusLabels) as Status[]).map((status) => (
                        <label key={status} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={localFilters.statuses?.includes(status) || false}
                            onChange={(e) => {
                              const currentStatuses = localFilters.statuses || [];
                              if (e.target.checked) {
                                updateFilter('statuses', [...currentStatuses, status]);
                              } else {
                                updateFilter('statuses', currentStatuses.filter(s => s !== status));
                              }
                            }}
                            className="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500"
                          />
                          <span className="text-sm text-slate-300">{statusLabels[status]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Rating Range */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Avaliação
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={localFilters.ratingRange?.min || 0}
                        onChange={(e) => updateFilter('ratingRange', {
                          min: parseFloat(e.target.value),
                          max: localFilters.ratingRange?.max || 5
                        })}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>0★</span>
                        <span>5★</span>
                      </div>
                    </div>
                    <div className="text-sm text-white bg-slate-700 px-3 py-2 rounded-lg">
                      {localFilters.ratingRange?.min || 0}★ - {localFilters.ratingRange?.max || 5}★
                    </div>
                  </div>
                </div>

                {/* Hours Range */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Horas Investidas
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      placeholder="Mín"
                      value={localFilters.hoursRange?.min || ''}
                      onChange={(e) => updateFilter('hoursRange', {
                        min: parseInt(e.target.value) || 0,
                        max: localFilters.hoursRange?.max || 1000
                      })}
                      className="w-20 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <span className="text-slate-400">-</span>
                    <input
                      type="number"
                      placeholder="Máx"
                      value={localFilters.hoursRange?.max || ''}
                      onChange={(e) => updateFilter('hoursRange', {
                        min: localFilters.hoursRange?.min || 0,
                        max: parseInt(e.target.value) || 1000
                      })}
                      className="w-20 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <span className="text-slate-400">horas</span>
                  </div>
                </div>

                {/* Tags */}
                {availableTags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {availableTags.map((tag) => (
                        <motion.button
                          key={tag}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            const currentTags = localFilters.tags || [];
                            if (currentTags.includes(tag)) {
                              updateFilter('tags', currentTags.filter(t => t !== tag));
                            } else {
                              updateFilter('tags', [...currentTags, tag]);
                            }
                          }}
                          className={`
                            px-3 py-1.5 rounded-full text-sm transition-all
                            ${localFilters.tags?.includes(tag)
                              ? 'bg-cyan-500 text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }
                          `}
                        >
                          <Tag size={12} className="inline mr-1" />
                          {tag}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Boolean Filters */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Filtros Especiais
                  </label>
                  <div className="space-y-2">
                    {[
                      { key: 'hasRating' as keyof FilterOptions, label: 'Apenas com avaliação' },
                      { key: 'hasHours' as keyof FilterOptions, label: 'Apenas com horas registradas' },
                      { key: 'hasReviews' as keyof FilterOptions, label: 'Apenas com reviews' }
                    ].map((filter) => (
                      <label key={filter.key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={localFilters[filter.key] as boolean || false}
                          onChange={(e) => updateFilter(filter.key, e.target.checked)}
                          className="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500"
                        />
                        <span className="text-sm text-slate-300">{filter.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-600/30">
              <div className="flex items-center gap-3">
                <NeonButton
                  size="sm"
                  icon={<Save size={16} />}
                  onClick={() => setShowSavePreset(true)}
                  disabled={!isFilterActive}
                >
                  Salvar Filtro
                </NeonButton>
              </div>

              <div className="flex items-center gap-3">
                <GhostButton onClick={onClose}>
                  Cancelar
                </GhostButton>
                <GradientButton onClick={handleApply}>
                  Aplicar Filtros
                </GradientButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IntelligentFilters;
