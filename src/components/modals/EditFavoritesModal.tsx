import React, { useState } from 'react';
import { Plus, Save, X, Trash2, ChevronUp, ChevronDown, Upload, Library } from 'lucide-react';
import { FavoriteItem, UserSettings, MediaItem } from '../../App';
import { useAppContext } from '../../context/AppContext';
import { LibrarySelector } from './LibrarySelector';

interface EditFavoritesModalProps {
  favorites: UserSettings['favorites'];
  onSave: (fav: UserSettings['favorites']) => void;
  onClose: () => void;
}

const emptyItem = (): FavoriteItem => ({ id: Date.now().toString(), name: '', image: '' });

type Category = keyof UserSettings['favorites'];

export const EditFavoritesModal: React.FC<EditFavoritesModalProps> = ({ favorites, onSave, onClose }) => {
  const [local, setLocal] = useState({ ...favorites });
  const [showLibrarySelector, setShowLibrarySelector] = useState<'games' | 'movies' | null>(null);
  const { mediaItems } = useAppContext();

  const handleLibrarySelection = (category: 'games' | 'movies', selectedItems: MediaItem[]) => {
    const favoriteItems = selectedItems.map(item => ({
      id: item.id,
      name: item.title,
      image: item.cover || ''
    }));

    setLocal(prev => ({
      ...prev,
      [category]: favoriteItems
    }));
  };

  const getCurrentSelectedIds = (category: 'games' | 'movies') => {
    return local[category].map(item => item.id);
  };

  const addItem = (cat: Category) => {
    setLocal(prev => {
      // Limitar a 3 itens por categoria
      if (prev[cat].length >= 3) {
        return prev;
      }
      return { ...prev, [cat]: [...prev[cat], emptyItem()] };
    });
  };

  const updateItem = (cat: Category, index: number, field: keyof FavoriteItem, value: string) => {
    setLocal(prev => {
      const arr = [...prev[cat]];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [cat]: arr };
    });
  };

  const uploadImage = (cat: Category, index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        updateItem(cat, index, 'image', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeItem = (cat: Category, index: number) => {
    setLocal(prev => {
      const arr = prev[cat].filter((_, i) => i !== index);
      return { ...prev, [cat]: arr };
    });
  };

  const moveItem = (cat: Category, from: number, to: number) => {
    setLocal(prev => {
      const arr = [...prev[cat]];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return { ...prev, [cat]: arr };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(local);
  };

  const renderCategory = (cat: Category, title: string) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">{local[cat].length}/3</span>
          {(cat === 'games' || cat === 'movies') && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowLibrarySelector(cat);
              }}
              className="flex items-center gap-1 px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg text-cyan-400 text-xs transition-colors"
            >
              <Library size={14} />
              Da Biblioteca
            </button>
          )}
        </div>
      </div>
      {local[cat].map((item, idx) => (
        <div key={item.id} className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-lg">
          <div className="w-16 h-16 bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
            {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : null}
          </div>
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateItem(cat, idx, 'name', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Nome"
            />
            <label className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white cursor-pointer hover:bg-slate-700 transition-colors">
              <Upload size={16} />
              Enviar Imagem
              <input
                type="file"
                accept="image/*"
                onChange={(e) => uploadImage(cat, idx, e)}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex flex-col gap-1">
            <button type="button" onClick={() => moveItem(cat, idx, Math.max(0, idx - 1))} disabled={idx === 0} className="p-1 text-slate-300 hover:text-white disabled:opacity-50">
              <ChevronUp size={18} />
            </button>
            <button type="button" onClick={() => moveItem(cat, idx, Math.min(local[cat].length - 1, idx + 1))} disabled={idx === local[cat].length - 1} className="p-1 text-slate-300 hover:text-white disabled:opacity-50">
              <ChevronDown size={18} />
            </button>
            <button type="button" onClick={() => removeItem(cat, idx)} className="p-1 text-red-400 hover:text-red-500">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addItem(cat)}
        disabled={local[cat].length >= 3}
        className={`flex items-center gap-2 transition-colors ${
          local[cat].length >= 3
            ? 'text-slate-500 cursor-not-allowed'
            : 'text-purple-400 hover:text-purple-500'
        }`}
      >
        <Plus size={18} />
        {local[cat].length >= 3 ? 'Máximo 3 itens' : 'Adicionar'}
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fade-in">
      <div
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl sm:rounded-2xl border border-white/20 max-w-2xl w-full overflow-hidden animate-slide-up flex flex-col"
        style={{
          maxHeight: 'calc(100vh - 2rem)',
          minHeight: 'auto'
        }}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/20 flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Editar Favoritos</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors touch-target">
            <X className="text-slate-400" size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 p-4 sm:p-6 space-y-6 sm:space-y-8 overflow-y-auto min-h-0">
          {renderCategory('characters', 'Personagens Favoritos')}
          {renderCategory('games', 'Jogos Favoritos')}
          {renderCategory('movies', 'Filmes/Séries Favoritos')}
          </div>

          {/* Actions - Fixed at bottom */}
          <div className="flex-shrink-0 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent p-4 sm:p-6 border-t border-white/20">
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 text-slate-300 hover:text-white transition-colors text-sm sm:text-base"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Save size={18} /> Salvar
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Library Selector Modal */}
      {showLibrarySelector && (
        <LibrarySelector
          mediaType={showLibrarySelector}
          onSelect={(items) => handleLibrarySelection(showLibrarySelector, items)}
          onClose={() => setShowLibrarySelector(null)}
          maxSelection={3}
          selectedItems={getCurrentSelectedIds(showLibrarySelector)}
        />
      )}
    </div>
  );
};
