import React, { useState } from "react";
import { X, Save, Upload } from "lucide-react";
import { MediaItem, MediaType, Status } from "../../types";
import { updateMedia } from "../../services/mediaService";

interface EditMediaModalProps {
  isOpen: boolean;
  item: MediaItem;
  onClose: () => void;
  onSave: (id: string, updates: Partial<MediaItem>) => void;
}

const mediaTypeLabels = {
  games: "Jogos",
  anime: "Anime",
  series: "Séries",
  books: "Livros",
  movies: "Filmes",
  dorama: "Doramas",
};

export const EditMediaModal: React.FC<EditMediaModalProps> = ({
  isOpen,
  item,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;
  const [formData, setFormData] = useState({
    title: item.title,
    type: item.type,
    status: item.status,
    rating: item.rating?.toString() || "",
    hoursSpent: item.hoursSpent?.toString() || "",
    totalPages: item.totalPages?.toString() || "",
    currentPage: item.currentPage?.toString() || "",
    startDate: item.startDate || "",
    endDate: item.endDate || "",
    platform: item.platform || "",
    tags: Array.isArray(item.tags) ? item.tags.join(", ") : "",
    externalLink: item.externalLink || "",
    coverPreview: item.cover || "",
    coverFile: undefined as File | undefined,
    description: item.description || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!item.id || typeof item.id !== "string" || item.id.trim() === "") {
      alert("ID inválido");
      return;
    }

    const updates = {
      title: formData.title,
      type: formData.type,
      status: formData.status,
      rating: formData.rating ? parseInt(formData.rating) : undefined,
      hoursSpent: formData.hoursSpent
        ? parseFloat(formData.hoursSpent)
        : undefined,
      totalPages: formData.totalPages
        ? parseInt(formData.totalPages)
        : undefined,
      currentPage: formData.currentPage
        ? parseInt(formData.currentPage)
        : undefined,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
      platform: formData.platform || undefined,
      tags: formData.tags
        ? formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
        : [],
      externalLink: formData.externalLink || undefined,
      description: formData.description || undefined,
      coverFile: formData.coverFile,
    };

    onSave(item.id, updates);
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          coverPreview: result,
          coverFile: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fade-in"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden", // BLOQUEIA scroll da página
      }}
    >
      <div
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl sm:rounded-2xl border border-white/20 max-w-2xl w-full overflow-hidden animate-slide-up flex flex-col"
        style={{
          maxHeight: "calc(100vh - 2rem)",
          minHeight: "auto",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/20 flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Editar Mídia
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors touch-target"
          >
            <X className="text-slate-400" size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col overflow-hidden min-h-0"
        >
          <div className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto min-h-0">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite o título da mídia"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tipo *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {Object.entries(mediaTypeLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="planned">Planejado</option>
                  <option value="in-progress">Em Progresso</option>
                  <option value="completed">Concluído</option>
                  <option value="dropped">Abandonado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Plataforma
                </label>
                <input
                  type="text"
                  value={formData.platform}
                  onChange={(e) => handleChange("platform", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Steam, Netflix, etc."
                />
              </div>
            </div>

            {/* Rating & Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Avaliação (0-10)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => handleChange("rating", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="8.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {formData.type === "books" ? "Páginas Lidas" : "Horas Gastas"}
                </label>
                <input
                  type="number"
                  min="0"
                  step={formData.type === "books" ? "1" : "0.5"}
                  value={formData.hoursSpent}
                  onChange={(e) => handleChange("hoursSpent", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={formData.type === "books" ? "350" : "25.5"}
                />
              </div>
            </div>

            {formData.type === "books" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Páginas Totais
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.totalPages}
                    onChange={(e) => handleChange("totalPages", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="350"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Página Atual
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.currentPage}
                    onChange={(e) =>
                      handleChange("currentPage", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="42"
                  />
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Data de Início
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Data de Conclusão
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="RPG, Fantasia, Multiplayer (separado por vírgula)"
              />
            </div>

            {/* External Link */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Link Externo
              </label>
              <input
                type="url"
                value={formData.externalLink}
                onChange={(e) => handleChange("externalLink", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://store.steampowered.com/..."
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Imagem de Capa
              </label>
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <label className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white cursor-pointer hover:bg-slate-700 transition-colors">
                    <Upload size={18} />
                    Fazer Upload da Imagem
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {formData.coverPreview && (
                  <div className="mt-3">
                    <img
                      src={formData.coverPreview}
                      alt="Preview"
                      className="w-32 h-40 object-cover rounded-lg mx-auto"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Breve descrição ou notas..."
              />
            </div>
          </div>

          {/* Actions - Fixed at bottom */}
          <div className="flex-shrink-0 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent p-4 sm:p-6 border-t border-white/20">
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 text-slate-300 hover:text-white transition-colors order-2 sm:order-1 text-sm sm:text-base"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-200 flex items-center justify-center gap-2 order-1 sm:order-2 text-sm sm:text-base"
              >
                <Save size={18} />
                Salvar Alterações
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
