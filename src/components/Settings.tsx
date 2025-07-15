import React, { useState } from "react";
import { Download, Upload, Trash2, Save } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { saveSettings } from "../services/settingsService";

const Settings: React.FC = () => {
  const { settings, setSettings, mediaItems, reviews, milestones } =
    useAppContext();
  const [localSettings, setLocalSettings] = useState(settings);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = async () => {
    console.log("💾 Salvando configurações:", localSettings);
    setSettings(localSettings);
    await saveSettings(localSettings);
    // Feedback visual melhorado
    const toast = document.createElement("div");
    toast.className =
      "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up";
    toast.textContent = "✅ Configurações salvas com sucesso!";
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
  };

  const handleExport = () => {
    const data = {
      settings,
      mediaItems,
      reviews,
      milestones,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nerdlog-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Feedback visual
    const toast = document.createElement("div");
    toast.className =
      "fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up";
    toast.textContent = "📤 Backup baixado com sucesso!";
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.settings) setSettings(data.settings);
        // Feedback visual
        const toast = document.createElement("div");
        toast.className =
          "fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up";
        toast.textContent = "📥 Backup importado com sucesso!";
        document.body.appendChild(toast);
        setTimeout(() => document.body.removeChild(toast), 3000);
      } catch (error) {
        const toast = document.createElement("div");
        toast.className =
          "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up";
        toast.textContent = "❌ Ops! Arquivo de backup inválido 😅";
        document.body.appendChild(toast);
        setTimeout(() => document.body.removeChild(toast), 3000);
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteAllData = () => {
    const confirmMessage = `🚨 ATENÇÃO! 🚨\n\nVai apagar TODOS os seus dados mesmo?\n\n• Todas as mídias\n• Todas as resenhas\n• Todos os marcos\n• Todas as configurações\n\nEssa ação é IRREVERSÍVEL!\n\nTem certeza ABSOLUTA?`;

    if (!confirm(confirmMessage)) return;

    const finalConfirm = `Última chance! 🛑\n\nDigite "APAGAR TUDO" para confirmar:`;
    const userInput = prompt(finalConfirm);

    if (userInput !== "APAGAR TUDO") {
      alert("Ufa! Dados salvos 😅");
      return;
    }

    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
        <p className="text-slate-400">Personalize sua experiência no NerdLog</p>
      </div>

      {/* Data Management */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-semibold text-white mb-6">Configurações</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Ordenação Padrão da Biblioteca
          </label>
          <select
            value={localSettings.defaultLibrarySort}
            onChange={(e) =>
              setLocalSettings((prev) => ({
                ...prev,
                defaultLibrarySort: e.target.value,
              }))
            }
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="updatedAt">Recém Atualizados</option>
            <option value="title">Título A-Z</option>
            <option value="rating">Melhor Avaliados</option>
            <option value="hoursSpent">Mais Horas</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Export */}
          <div className="p-4 bg-slate-800/30 rounded-lg">
            <h3 className="font-medium text-white mb-2 flex items-center gap-2">
              <Download className="text-green-400" size={18} />
              Exportar Dados
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Baixe um backup de todos os seus dados
            </p>
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
            <p className="text-slate-400 text-sm mb-4">
              Restaurar de um arquivo de backup
            </p>
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
            Isso irá excluir permanentemente todos os seus dados incluindo itens
            de mídia, resenhas e marcos.
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
              <p className="text-red-400 text-sm font-medium">
                Tem certeza absoluta?
              </p>
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
export default Settings;
