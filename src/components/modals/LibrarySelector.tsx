import React, { useState, useMemo } from 'react';
import { Search, X, Plus, Check } from 'lucide-react';
import { MediaItem, MediaType } from '../../App';
import { useAppContext } from '../../context/AppContext';

interface LibrarySelectorProps {
  mediaType: 'games' | 'movies'; // movies inclui filmes, séries e anime
  onSelect: (items: MediaItem[]) => void;
  onClose: () => void;
  maxSelection: number;
  selectedItems: string[]; // IDs já selecionados
}

const mediaTypeLabels = {
  games: 'Jogos',
  movies: 'Filmes & Séries'
};

export const LibrarySelector: React.FC<LibrarySelectorProps> = ({ 
  mediaType, 
  onSelect, 
  onClose, 
  maxSelection,
  selectedItems = []
}) => {
  const { mediaItems } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [localSelected, setLocalSelected] = useState<string[]>(selectedItems);

  // Filtrar itens da biblioteca
  const filteredItems = useMemo(() => {
    let items = mediaItems;
    
    // Filtrar por tipo
    if (mediaType === 'games') {
      items = items.filter(item => item.type === 'games');
    } else {
      items = items.filter(item => ['movies', 'series', 'anime'].includes(item.type));
    }
    
    // Filtrar por busca
    if (searchTerm) {
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Ordenar por rating (melhor primeiro) e depois por data de atualização
    return items.sort((a, b) => {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      if (ratingA !== ratingB) {
        return ratingB - ratingA;
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [mediaItems, mediaType, searchTerm]);

  const handleToggleItem = (itemId: string) => {
    setLocalSelected(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else if (prev.length < maxSelection) {
        return [...prev, itemId];
      }
      return prev;
    });
  };

  const handleConfirm = () => {
    const selectedMediaItems = mediaItems.filter(item => localSelected.includes(item.id));
    onSelect(selectedMediaItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl sm:rounded-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/20 flex-shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Selecionar {mediaTypeLabels[mediaType]}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Escolha até {maxSelection} itens da sua biblioteca ({localSelected.length}/{maxSelection})
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <X className="text-slate-400" size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Buscar na biblioteca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Items Grid */}
        <div className="flex-1 p-3 sm:p-6 overflow-y-auto min-h-0">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              {filteredItems.map((item) => {
                const isSelected = localSelected.includes(item.id);
                const canSelect = localSelected.length < maxSelection || isSelected;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleToggleItem(item.id)}
                    disabled={!canSelect}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                      isSelected
                        ? 'bg-purple-500/20 border-purple-500/50'
                        : canSelect
                        ? 'bg-slate-800/50 border-slate-600 hover:bg-slate-800/80 hover:border-slate-500'
                        : 'bg-slate-800/30 border-slate-700 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {/* Cover */}
                    <div className="w-12 h-16 bg-slate-700 rounded overflow-hidden flex-shrink-0">
                      {item.cover ? (
                        <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          <Search size={16} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm line-clamp-2">{item.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {item.rating && (
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                            <span className="text-yellow-400 text-xs">{item.rating}</span>
                          </div>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          item.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
                          item.status === 'planned' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {item.status === 'completed' ? 'Concluído' :
                           item.status === 'in-progress' ? 'Em Progresso' :
                           item.status === 'planned' ? 'Planejado' : 'Abandonado'}
                        </span>
                      </div>
                    </div>

                    {/* Selection indicator */}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? 'bg-purple-500 border-purple-500'
                        : canSelect
                        ? 'border-slate-400'
                        : 'border-slate-600'
                    }`}>
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-400">
                {searchTerm ? 'Nenhum item encontrado' : 'Sua biblioteca está vazia'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-white/20 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-3 text-slate-300 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={localSelected.length === 0}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Adicionar Selecionados ({localSelected.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
