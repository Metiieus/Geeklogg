import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { UserSettings } from '../../App';

interface EditProfileModalProps {
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ settings, onSave, onClose }) => {
  const [local, setLocal] = useState({
    name: settings.name,
    avatar: settings.avatar || '',
    bio: settings.bio || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...settings,
      name: local.name,
      avatar: local.avatar || undefined,
      bio: local.bio
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 max-w-lg w-full overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">Editar Perfil</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <X className="text-slate-400" size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Nome</label>
            <input
              type="text"
              value={local.name}
              onChange={(e) => setLocal(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Seu nome"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">URL da Foto</label>
            <input
              type="url"
              value={local.avatar}
              onChange={(e) => setLocal(prev => ({ ...prev, avatar: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://exemplo.com/avatar.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Biografia</label>
            <textarea
              value={local.bio}
              onChange={(e) => setLocal(prev => ({ ...prev, bio: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Fale algo sobre você"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-700">
            <button type="button" onClick={onClose} className="px-6 py-3 text-slate-300 hover:text-white transition-colors">Cancelar</button>
            <button type="submit" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-200 flex items-center gap-2">
              <Save size={18} />
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
