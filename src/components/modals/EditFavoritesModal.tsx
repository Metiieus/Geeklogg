import React, { useState } from 'react';
import { Plus, Save, X, Trash2, ChevronUp, ChevronDown, Upload } from 'lucide-react';
import { FavoriteItem, UserSettings } from '../../App';

interface EditFavoritesModalProps {
  favorites: UserSettings['favorites'];
  onSave: (fav: UserSettings['favorites']) => void;
  onClose: () => void;
}

const emptyItem = (): FavoriteItem => ({ id: Date.now().toString(), name: '', image: '' });

type Category = keyof UserSettings['favorites'];

export const EditFavoritesModal: React.FC<EditFavoritesModalProps> = ({ favorites, onSave, onClose }) => {
  const [local, setLocal] = useState({ ...favorites });

  const addItem = (cat: Category) => {
    setLocal(prev => ({ ...prev, [cat]: [...prev[cat], emptyItem()] }));
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
      <h3 className="text-lg font-semibold text-white">{title}</h3>
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
      <button type="button" onClick={() => addItem(cat)} className="flex items-center gap-2 text-purple-400 hover:text-purple-500">
        <Plus size={18} /> Adicionar
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/20 max-w-2xl w-full overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white">Editar Favoritos</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <X className="text-slate-400" size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
          {renderCategory('characters', 'Personagens Favoritos')}
          {renderCategory('games', 'Jogos Favoritos')}
          {renderCategory('movies', 'Filmes/Séries Favoritos')}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/20">
            <button type="button" onClick={onClose} className="px-6 py-3 text-slate-300 hover:text-white transition-colors">Cancelar</button>
            <button type="submit" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-200 flex items-center gap-2">
              <Save size={18} /> Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
