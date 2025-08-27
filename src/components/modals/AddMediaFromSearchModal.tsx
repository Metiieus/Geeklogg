import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Upload,
  ExternalLink,
  Star,
  Calendar,
  Clock,
  Users,
  Book,
} from "lucide-react";
import { MediaItem, MediaType, Status } from "../../App";
import { addMedia } from "../../services/mediaService";
import { useToast } from "../../context/ToastContext";
import { validateFile, compressImage } from "../../utils/fileValidation";
import {
  ExternalMediaResult,
  externalMediaService,
} from "../../services/externalMediaService";
import { ModalWrapper } from '../ModalWrapper';
import { useImprovedScrollLock } from '../../hooks/useImprovedScrollLock';

interface AddMediaFromSearchModalProps {
  onClose: () => void;
  onSave: (item: MediaItem) => void;
  externalResult: ExternalMediaResult;
}

const statusLabels = {
  planned: "Planejado",
  "in-progress": "Em Progresso",
  completed: "Concluído",
  dropped: "Abandonado",
};

export const AddMediaFromSearchModal: React.FC<
  AddMediaFromSearchModalProps
> = ({ onClose, onSave, externalResult }) => {
  const { showError, showSuccess, showWarning } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [formData, setFormData] = useState({
    title: externalResult.title || "",
    type: getMediaTypeFromResult(externalResult),
    status: "planned" as Status,
    rating: "",
    hoursSpent: "",
    totalPages: externalResult.pageCount?.toString() || "",
    currentPage: "",
    startDate: "",
    endDate: "",
    platform: "",
    tags: externalResult.genres?.join(", ") || "",
    externalLink: "",
    description: externalResult.description || "",
    // Dados da imagem
    coverPreview: externalResult.image || "",
    coverFile: undefined as File | undefined,
    // Flag para indicar se deve usar imagem externa ou uploaded
    useExternalImage: !!externalResult.image,
  });

  // Determinar tipo de mídia baseado no resultado externo
  function getMediaTypeFromResult(result: ExternalMediaResult): MediaType {
    switch (result.originalType) {
      case "book":
        return "books";
      case "movie":
        return "movies";
      case "tv":
        return "series";
      case "anime":
        return "anime";
      case "game":
        return "games";
      default:
        // Fallback: tentar detectar pelo source ou outros indicadores
        if (result.source === "rawg") {
          return "games";
        }
        // Default para movies apenas se realmente não conseguir detectar
        return "movies";
    }
  }

  // Carregar detalhes adicionais quando o modal abre
  useEffect(() => {
    const loadAdditionalDetails = async () => {
      if (externalResult.source !== "tmdb" || !externalResult.tmdbId) return;

      setIsLoadingDetails(true);
      try {
        let details: Partial<ExternalMediaResult> = {};

        if (externalResult.originalType === "movie") {
          details = await externalMediaService.getMovieDetails(
            externalResult.tmdbId,
          );
        } else if (externalResult.originalType === "tv") {
          details = await externalMediaService.getTvShowDetails(
            externalResult.tmdbId,
          );
        }

        // Atualizar form com detalhes adicionais
        if (details.runtime) {
          setFormData((prev) => ({
            ...prev,
            hoursSpent: (details.runtime! / 60).toFixed(1),
          }));
        }

        if (details.director) {
          setFormData((prev) => ({
            ...prev,
            tags: prev.tags
              ? `${prev.tags}, Direção: ${details.director}`
              : `Direção: ${details.director}`,
          }));
        }
      } catch (error) {
        console.warn("Erro ao carregar detalhes adicionais:", error);
      } finally {
        setIsLoadingDetails(false);
      }
    };

    loadAdditionalDetails();
  }, [externalResult]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    setIsSaving(true);

    try {
      const mediaData = {
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
        // Gerenciar imagem: upload manual tem prioridade sobre URL externa
        coverFile: formData.coverFile,
        // Se não há upload e há imagem externa, usar a URL
        ...(!formData.coverFile &&
          formData.useExternalImage &&
          externalResult.image && {
            cover: externalResult.image,
          }),
      };

      const newItem = await addMedia(mediaData);

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
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
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

      let processedFile = file;
      if (file.size > 2 * 1024 * 1024) {
        showWarning("Comprimindo imagem", "A imagem está sendo otimizada");
        processedFile = await compressImage(file, 1024, 1024, 0.8);
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          coverPreview: result,
          coverFile: processedFile,
          useExternalImage: false, // Priorizar upload manual
        }));
        showSuccess(
          "Capa personalizada!",
          "Sua imagem personalizada será usada",
        );
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

  const handleRestoreExternalImage = () => {
    if (!externalResult.image) return;

    setFormData((prev) => ({
      ...prev,
      coverPreview: externalResult.image!,
      coverFile: undefined,
      useExternalImage: true,
    }));
    showSuccess("Imagem restaurada", "Imagem original da busca restaurada");
  };

  // Apply scroll lock
  useImprovedScrollLock(true);

  return (
    <ModalWrapper
      isOpen={true}
      onClose={onClose}
      maxWidth="max-w-5xl"
      className="modal-desktop-large modal-performance"
    >
      <div
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl sm:rounded-2xl border border-white/20 w-full overflow-hidden flex flex-col"
        style={{
          maxHeight: 'calc(100vh - 2rem)',
          minHeight: 'auto'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/20">
          <div className="flex items-center gap-2 sm:gap-4">
            <h2 className="text-lg sm:text-2xl font-bold text-white">
              Adicionar à Biblioteca
            </h2>
            {isLoadingDetails && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-4 h-4 border-2 border-slate-400 border-t-purple-500 rounded-full animate-spin" />
                Carregando detalhes...
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="text-slate-400" size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0 safe-area-inset">
          {/* Preview da mídia - sidebar responsiva */}
          <div className="lg:w-80 xl:w-96 p-3 sm:p-6 border-b lg:border-b-0 lg:border-r border-white/20 bg-slate-800/50 flex-shrink-0 modal-sidebar">
            <div className="space-y-3 sm:space-y-4">
              {/* Imagem de capa */}
              <div className="relative">
                <div className="w-full h-40 sm:h-48 lg:h-60 xl:h-72 bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                  {formData.coverPreview ? (
                    <img
                      src={formData.coverPreview}
                      alt={formData.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Book className="text-slate-500" size={48} />
                    </div>
                  )}
                </div>

                {/* Badge indicando fonte da imagem */}
                {formData.coverPreview && (
                  <div className="absolute top-2 left-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        formData.useExternalImage
                          ? "bg-blue-500/80 text-white"
                          : "bg-green-500/80 text-white"
                      }`}
                    >
                      {formData.useExternalImage ? "Original" : "Personalizada"}
                    </span>
                  </div>
                )}
              </div>

              {/* Informações da busca */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="font-bold text-white text-base sm:text-lg line-clamp-2">
                  {externalResult.title}
                </h3>

                {externalResult.year && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar size={14} className="sm:w-4 sm:h-4" />
                    <span>{externalResult.year}</span>
                  </div>
                )}

                {externalResult.authors &&
                  externalResult.authors.length > 0 && (
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Users size={14} className="sm:w-4 sm:h-4" />
                      <span className="truncate">
                        {externalResult.authors.slice(0, 2).join(", ")}
                      </span>
                    </div>
                  )}

                {externalResult.pageCount && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Book size={14} className="sm:w-4 sm:h-4" />
                    <span>{externalResult.pageCount} páginas</span>
                  </div>
                )}

                {externalResult.genres && externalResult.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {externalResult.genres.slice(0, 3).map((genre, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {/* Fonte */}
                <div className="pt-3 border-t border-slate-600">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      externalResult.source === "google-books"
                        ? "bg-blue-500/20 text-blue-400"
                        : externalResult.source === "rawg"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {externalResult.source === "google-books"
                      ? "Google Books"
                      : externalResult.source === "rawg"
                      ? "RAWG"
                      : "TMDb"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário - área principal */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0 modal-main modal-scroll-desktop">
            <form
              id="search-media-form"
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col overflow-hidden min-h-0"
            >
              <div className="flex-1 p-3 sm:p-6 space-y-3 sm:space-y-6 overflow-y-auto min-h-0 safe-area-padding-bottom modal-form-grid-desktop">
                {/* Informações básicas */}
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
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Avaliação e progresso */}
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

                {/* Páginas (apenas para livros) */}
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
                        onChange={(e) =>
                          handleChange("totalPages", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                      />
                    </div>
                  </div>
                )}

                {/* Datas */}
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

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Plataforma
                  </label>
                  <input
                    type="text"
                    value={formData.platform}
                    onChange={(e) => handleChange("platform", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Steam, Netflix, Físico, etc."
                  />
                </div>

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

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Link Externo
                  </label>
                  <input
                    type="url"
                    value={formData.externalLink}
                    onChange={(e) => handleChange("externalLink", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://..."
                  />
                </div>

                {/* Seção de imagem personalizada */}
                <div className="form-full-width">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Personalizar Imagem de Capa
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
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
                        {isUploading ? "Processando..." : "Upload Nova Imagem"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={isUploading}
                        />
                      </label>

                      {!formData.useExternalImage && externalResult.image && (
                        <button
                          type="button"
                          onClick={handleRestoreExternalImage}
                          className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-colors"
                        >
                          Restaurar Original
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-400">
                      Faça upload de uma imagem personalizada ou use a imagem
                      original encontrada na busca. Imagens personalizadas têm
                      prioridade sobre as originais.
                    </p>
                  </div>
                </div>

                <div className="form-full-width">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Descrição / Notas
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Adicione suas impressões, notas ou uma descrição personalizada..."
                  />
                </div>
              </div>
            </form>

            {/* Actions - Fixed at bottom */}
            <div className="flex-shrink-0 bg-gradient-to-t from-slate-800 via-slate-800 to-transparent p-3 sm:p-6 border-t border-white/20 safe-area-padding-bottom">
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3 modal-form-actions-desktop">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 text-slate-300 hover:text-white transition-colors order-2 sm:order-1 text-sm sm:text-base"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  form="search-media-form"
                  disabled={isSaving || isUploading}
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 order-1 sm:order-2 text-sm sm:text-base ${
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
                  {isSaving ? "Salvando..." : "Adicionar à Biblioteca"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};
