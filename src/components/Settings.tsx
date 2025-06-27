import React, { useState } from 'react';
import { User, Palette, Download, Upload, Trash2, Save } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Settings: React.FC = () => {
  const { settings, setSettings, mediaItems, reviews, milestones } = useAppContext();
  const [localSettings, setLocalSettings] = useState(settings);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    setSettings(localSettings);
    alert('Configurações salvas com sucesso!');
  };

  const handleExport = () => {
    const data = {
      settings,
      mediaItems,
      reviews,
      milestones,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nerdlog-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.settings) setSettings(data.settings);
        alert('Backup importado com sucesso!');
      } catch (error) {
        alert('Erro ao importar arquivo de backup');
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
        <p className="text-slate-400">Personalize sua experiência no NerdLog</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <User className="text-purple-400" size={20} />
          Perfil
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nome de Exibição
            </label>
            <input
              type="text"
              value={localSettings.name}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Seu nome de exibição"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              URL do Avatar (opcional)
            </label>
          <input
            type="url"
            value={localSettings.avatar || ''}
            onChange={(e) => setLocalSettings(prev => ({ ...prev, avatar: e.target.value }))}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://exemplo.com/avatar.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Biografia
          </label>
          <textarea
            value={localSettings.bio || ''}
            onChange={(e) => setLocalSettings(prev => ({ ...prev, bio: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            placeholder="Fale um pouco sobre você"
          />
        </div>
      </div>
    </div>

      {/* Theme Settings */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Palette className="text-pink-400" size={20} />
          Aparência
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tema
            </label>
            <select
              value={localSettings.theme}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, theme: e.target.value as 'dark' | 'light' }))}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="dark">Escuro</option>
              <option value="light">Claro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Ordenação Padrão da Biblioteca
            </label>
            <select
              value={localSettings.defaultLibrarySort}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, defaultLibrarySort: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="updatedAt">Recém Atualizados</option>
              <option value="title">Título A-Z</option>
              <option value="rating">Melhor Avaliados</option>
              <option value="hoursSpent">Mais Horas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-semibold text-white mb-6">Gerenciamento de Dados</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Export */}
          <div className="p-4 bg-slate-800/30 rounded-lg">
            <h3 className="font-medium text-white mb-2 flex items-center gap-2">
              <Download className="text-green-400" size={18} />
              Exportar Dados
            </h3>
            <p className="text-slate-400 text-sm mb-4">Baixe um backup de todos os seus dados</p>
            <button
              onClick={handleExport}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Exportar Backup
            </button>
          </div>

          {/* Import */}
          <div className="p-4 bg-slate-800/30 rounded-lg">
            <h3 className="font-medium text-white mb-2 flex items-center gap-2">
              <Upload className="text-blue-400" size={18} />
              Importar Dados
            </h3>
            <p className="text-slate-400 text-sm mb-4">Restaurar de um arquivo de backup</p>
            <label className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer text-center">
              Selecionar Arquivo de Backup
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Delete All Data */}
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <h3 className="font-medium text-red-400 mb-2 flex items-center gap-2">
            <Trash2 size={18} />
            Zona de Perigo
          </h3>
          <p className="text-slate-300 text-sm mb-4">
            Isso irá excluir permanentemente todos os seus dados incluindo itens de mídia, resenhas e marcos.
          </p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Excluir Todos os Dados
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-red-400 text-sm font-medium">Tem certeza absoluta?</p>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAllData}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sim, Excluir Tudo
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-200 flex items-center gap-2"
        >
          <Save size={18} />
          Salvar Configurações
        </button>
      </div>
    </div>
  );
};