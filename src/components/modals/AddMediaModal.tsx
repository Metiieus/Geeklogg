import React, { useState } from "react";
import { X, Save, Upload } from "lucide-react";
import { MediaItem, MediaType, Status } from "../../App";
import { addMedia } from "../../services/mediaService";
import { useToast } from "../../context/ToastContext";
import { validateFile, compressImage } from "../../utils/fileValidation";
import { sanitizeText, sanitizeUrl, sanitizeTags } from "../../utils/sanitizer";

interface AddMediaModalProps {
  onClose: () => void;
  onSave: (item: MediaItem) => void;
}

const mediaTypeLabels = {
  games: "Jogos",
  anime: "Anime",
  series: "Séries",
  books: "Livros",
  movies: "Filmes",
  dorama: "Doramas",
};

export const AddMediaModal: React.FC<AddMediaModalProps> = ({
  onClose,
  onSave,
}) => {
  const { showError, showSuccess, showWarning } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "games" as MediaType,
    status: "planned" as Status,
    rating: "",
    hoursSpent: "",
    totalPages: "",
    currentPage: "",
    startDate: "",
    endDate: "",
    platform: "",
    tags: "",
    externalLink: "",
    coverPreview: "",
    coverFile: undefined as File | undefined,
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!formData.title.trim()) {
      showError("Título obrigatório", "Por favor, insira o título da mídia");
      return;
    }

    if (formData.title.trim().length < 2) {
      showError(
        "Título muito curto",
        "O título deve ter pelo menos 2 caracteres",
      );
      return;
    }

    if (
      formData.rating &&
      (parseInt(formData.rating) < 1 || parseInt(formData.rating) > 10)
    ) {
      showError("Avaliação inválida", "A avaliação deve estar entre 1 e 10");
      return;
    }

    if (
      formData.currentPage &&
      formData.totalPages &&
      parseInt(formData.currentPage) > parseInt(formData.totalPages)
    ) {
      showError(
        "Páginas inválidas",
        "A página atual não pode ser maior que o total de páginas",
      );
      return;
    }

    setIsSaving(true);

    try {
      const newItem = await addMedia({
        title: formData.title.trim(),
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
        platform: formData.platform?.trim() || undefined,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
        externalLink: formData.externalLink?.trim() || undefined,
        description: formData.description?.trim() || undefined,
        coverFile: formData.coverFile,
      });

      showSuccess(
        "Mídia adicionada!",
        `${formData.title} foi adicionado à sua biblioteca`,
      );
      onSave(newItem);
    } catch (error: any) {
      console.error("Erro ao adicionar mídia:", error);
      showError(
        "Erro ao salvar",
        error.message || "Não foi possível adicionar a mídia",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    // Aplicar sanitização baseada no tipo de campo
    let sanitizedValue = value;

    if (field === "externalLink") {
      const validUrl = sanitizeUrl(value);
      sanitizedValue = validUrl || value; // Manter valor original se inválido para feedback visual
    } else if (field === "description" || field === "title") {
      sanitizedValue = sanitizeText(
        value,
        field === "description" ? 1000 : 200,
      );
    }

    setFormData((prev) => ({ ...prev, [field]: sanitizedValue }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Validar arquivo
      const validation = await validateFile(file, {
        maxSizeInMB: 5,
        allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
        maxWidth: 1920,
        maxHeight: 1080,
      });

      if (!validation.isValid) {
        showError("Erro no upload da capa", validation.error);
        setIsUploading(false);
        return;
      }

      // Se a imagem for muito grande, comprimir
      let processedFile = file;
      if (file.size > 2 * 1024 * 1024) {
        // > 2MB
        showWarning("Comprimindo imagem", "A imagem está sendo otimizada");
        processedFile = await compressImage(file, 1024, 1024, 0.8);
      }

      // Converter para base64 para preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          coverPreview: result,
          coverFile: processedFile,
        }));
        showSuccess("Capa carregada!", "Imagem da capa foi adicionada");
        setIsUploading(false);
      };

      reader.onerror = () => {
        showError(
          "Erro ao processar imagem",
          "Não foi possível carregar a imagem selecionada",
        );
        setIsUploading(false);
      };

      reader.readAsDataURL(processedFile);
    } catch (error) {
      console.error("Erro no upload:", error);
      showError("Erro inesperado", "Ocorreu um erro ao processar a imagem");
      setIsUploading(false);
    }
  };

  return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start sm:items-center justify-center p-2 sm:p-4 z-50 animate-fade-in overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl sm:rounded-2xl border border-slate-700 max-w-2xl w-full min-h-[95vh] sm:min-h-0 sm:max-h-[90vh] my-2 sm:my-0 overflow-hidden animate-slide-up flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">
            Adicionar Nova Mídia
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="text-slate-400" size={20} />
          </button>
        </div>

        {/* Form */}
                        <form
          id="media-form"
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto overflow-x-hidden"
        >
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
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
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
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
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
                Horas Gastas
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.hoursSpent}
                onChange={(e) => handleChange("hoursSpent", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="25.5"
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
                  onChange={(e) => handleChange("currentPage", e.target.value)}
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
                <label
                  className={`flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white transition-colors ${
                    isUploading
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:bg-slate-700"
                  }`}
                >
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Upload size={18} />
                  )}
                  {isUploading ? "Processando..." : "Fazer Upload da Imagem"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
              {formData.coverPreview && (
                <div className="mt-3 overflow-hidden">
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

                    {/* Content wrapper */}
          <div className="flex-1 space-y-4 sm:space-y-6">
            {/* Form content here will be moved above */}
          </div>
        </form>

        {/* Actions - Fixed at bottom */}
        <div className="sticky bottom-0 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent p-4 sm:p-6 border-t border-slate-700">
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 text-slate-300 hover:text-white transition-colors order-2 sm:order-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="media-form"
              disabled={isSaving || isUploading}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 order-1 sm:order-2 ${
                isSaving || isUploading
                  ? "bg-slate-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg hover:shadow-pink-500/25"
              } text-white`}
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {isSaving ? "Salvando..." : "Salvar Mídia"}
            </button>
          </div>
        </div>
        </form>
      </div>
    </div>
  );
};