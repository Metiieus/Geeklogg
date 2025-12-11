import React from 'react';
import { Filter, X, Star, Clock, TrendingUp, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SmartFilter {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  count?: number;
}

interface SmartFiltersProps {
  filters: SmartFilter[];
  onFilterToggle: (filterId: string) => void;
  onClearAll: () => void;
}

export const SmartFilters: React.FC<SmartFiltersProps> = ({
  filters,
  onFilterToggle,
  onClearAll,
}) => {
  const activeCount = filters.filter((f) => f.active).length;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="text-purple-400" size={18} />
          <h3 className="text-sm font-semibold text-white">Filtros Inteligentes</h3>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <X size={14} />
            <span>Limpar</span>
          </button>
        )}
      </div>

      {/* Filters Grid */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter, index) => (
          <FilterChip
            key={filter.id}
            filter={filter}
            index={index}
            onToggle={() => onFilterToggle(filter.id)}
          />
        ))}
      </div>
    </div>
  );
};

// Filter Chip Component
interface FilterChipProps {
  filter: SmartFilter;
  index: number;
  onToggle: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ filter, index, onToggle }) => {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        filter.active
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
          : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-white/10'
      }`}
    >
      <span className={filter.active ? 'text-white' : 'text-slate-400'}>
        {filter.icon}
      </span>
      <span>{filter.label}</span>
      {filter.count !== undefined && filter.count > 0 && (
        <span
          className={`px-1.5 py-0.5 rounded-full text-xs ${
            filter.active ? 'bg-white/20' : 'bg-black/20'
          }`}
        >
          {filter.count}
        </span>
      )}
    </motion.button>
  );
};

// Predefined Smart Filters
export const createSmartFilters = (mediaItems: any[]): SmartFilter[] => {
  return [
    {
      id: 'high-rated',
      label: 'Bem Avaliados',
      icon: <Star size={14} />,
      active: false,
      count: mediaItems.filter((item) => item.rating && item.rating >= 8).length,
    },
    {
      id: 'in-progress',
      label: 'Em Progresso',
      icon: <TrendingUp size={14} />,
      active: false,
      count: mediaItems.filter((item) => item.status === 'in-progress').length,
    },
    {
      id: 'quick-finish',
      label: 'Rápidos',
      icon: <Clock size={14} />,
      active: false,
      count: mediaItems.filter((item) => (item.hoursSpent || 0) < 10).length,
    },
    {
      id: 'recent',
      label: 'Recentes',
      icon: <Calendar size={14} />,
      active: false,
      count: mediaItems.filter((item) => {
        const daysSince = Math.floor(
          (Date.now() - new Date(item.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysSince <= 7;
      }).length,
    },
  ];
};

// Filter Logic
export const applySmartFilters = (
  mediaItems: any[],
  activeFilters: string[]
): any[] => {
  if (activeFilters.length === 0) return mediaItems;

  return mediaItems.filter((item) => {
    return activeFilters.every((filterId) => {
      switch (filterId) {
        case 'high-rated':
          return item.rating && item.rating >= 8;
        case 'in-progress':
          return item.status === 'in-progress';
        case 'quick-finish':
          return (item.hoursSpent || 0) < 10;
        case 'recent':
          const daysSince = Math.floor(
            (Date.now() - new Date(item.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
          );
          return daysSince <= 7;
        default:
          return true;
      }
    });
  });
};
