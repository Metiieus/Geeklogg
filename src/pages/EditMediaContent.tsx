import React, { useState } from "react";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { MediaItem, MediaType, Status } from "../types";
import { updateMedia, addMedia } from "../services/mediaService";
import { useAddMedia, useUpdateMedia } from "../hooks/queries/useMediaQueries";
import { useToast } from "../context/ToastContext";
import { validateFile, compressImage } from "../utils/fileValidation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mediaSchema, MediaFormData } from "../schemas/media";
import { useImprovedScrollLock } from "../hooks/useImprovedScrollLock";

import { ModalWrapper } from "../components/ModalWrapper";

interface EditMediaPageProps {
  item: Partial<MediaItem>;
  onSave: (item: MediaItem) => void;
  onBack: () => void;
  isNew?: boolean;
}

const mediaTypeLabels = {
  game: "Jogos",
  anime: "Anime",
  tv: "Séries",
  book: "Livros",
  movie: "Filmes",
  manga: "Mangá",
};

export const EditMediaPage: React.FC<EditMediaPageProps> = ({
  item,
  onSave,
  onBack,
  isNew = false,
}) => {
  const { showError, showSuccess, showWarning } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MediaFormData & { coverFile?: File; coverPreview?: string }>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      title: item.title || "",
      type: item.type || "game",
      status: item.status || "planned",
      rating: item.rating,
      hoursSpent: item.hoursSpent,
      totalPages: item.totalPages,
      currentPage: item.currentPage,
      startDate: item.startDate || "",
      endDate: item.endDate || "",
      platform: item.platform || "",
      tags: Array.isArray(item.tags) ? item.tags : [],
      externalLink: item.externalLink || "",
      description: item.description || "",
      coverPreview: item.cover || "",
    },
  });

  // Watch for conditional rendering
  const type = watch("type");
  const coverPreview = watch("coverPreview");

  useImprovedScrollLock(true);

  const addMediaMutation = useAddMedia();
  const updateMediaMutation = useUpdateMedia();

  const onSubmit = async (data: MediaFormData & { coverFile?: File }) => {
    if (!isNew && !item.id) {
      showError("Erro", "ID inválido para edição");
      return;
    }

    try {
      if (isNew) {
        // Create New
        await addMediaMutation.mutateAsync({
          ...data,
          rating: data.rating,
          hoursSpent: data.hoursSpent,
          totalPages: data.totalPages,
          currentPage: data.currentPage,
          tags: Array.isArray(data.tags) ? data.tags : [],
          coverFile: data.coverFile,
          type: data.type as MediaType,
          status: data.status as Status,
        });
        showSuccess("Mídia criada!", `${data.title} foi adicionado à sua biblioteca`);
        // We don't have the savedItem here easily unless we strip it from result, 
        // but invalidation handles the list. 
        // onSave might expect the item for local state? 
        // The legacy onSave updates the array manually.
        // If we rely on Query Cache, we might not need to manually update local state if the parent uses useMedias.
        // But for now, let's keep onSave if parent needs it, but we can't easily get the full object back from mutateAsync depending on how it's typed.
        // The mutation returns the result of addMedia service which IS the item.
      } else {
        // Update Existing
        const id = item.id!;
        await updateMediaMutation.mutateAsync({
          id,
          updates: {
            ...data,
            rating: data.rating,
            hoursSpent: data.hoursSpent,
            totalPages: data.totalPages,
            currentPage: data.currentPage,
            tags: Array.isArray(data.tags) ? data.tags : [],
            coverFile: data.coverFile,
          } as any // Cast to any to bypass Partial<MediaItem> strictness for coverFile
        });
        showSuccess("Mídia atualizada!", `${data.title} foi atualizado com sucesso`);
      }

      // We call onSave with a placeholder or fetch fresh data?
      // Since we invalidated queries, the list in App/Library should auto-update.
      // We can just call onBack for now, or pass "true" to onSave to indicate success.
      // But preserving existing signature:
      onSave({ ...item, ...data } as MediaItem); // Optimistic / approx
      onBack();
    } catch (error: any) {
      console.error("Erro ao salvar mídia:", error);
      showError("Erro ao salvar", error.message || "Não foi possível salvar a mídia");
    }
  };

  // Helper to handle tags input (comma separated <-> array)
  // We can just use a controlled input for tags linked to setValue
  const [tagsInput, setTagsInput] = useState(Array.isArray(item.tags) ? item.tags.join(", ") : "");
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
    const tagsArray = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
    setValue("tags", tagsArray);
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
        setValue("coverPreview", result);
        setValue("coverFile", processedFile);
        showSuccess("Capa carregada!", "Imagem da capa foi adicionada");
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
    <ModalWrapper
      isOpen={true}
      onClose={onBack}
      maxWidth="max-w-4xl"
      className="modal-desktop-large modal-performance"
    >
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl sm:rounded-2xl border border-white/20 w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/20 flex-shrink-0 safe-area-padding-top">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <button
              onClick={onBack}
              className="p-2 sm:p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl border border-slate-600/50 transition-colors flex-shrink-0 touch-target no-zoom"
              type="button"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5 text-white" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">
                Editar Mídia
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 hidden sm:block truncate">
                Atualize as informações de {item.title}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex flex-col overflow-hidden min-h-0"
        >
          <div
            className="flex-1 p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 overflow-y-auto min-h-0 modal-scroll allow-scroll"
            style={{ touchAction: "auto" }}
          >
            <div className="space-y-4 sm:space-y-6 pb-safe">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    {...register("title")}
                    className={`w-full px-3 sm:px-4 py-3 sm:py-4 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base transition-all duration-200 ${errors.title ? 'border-red-500' : 'border-slate-600'}`}
                    placeholder="Digite o título da mídia"
                  />
                  {errors.title && <span className="text-red-400 text-xs mt-1">{errors.title.message}</span>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tipo *
                  </label>
                  <select
                    {...register("type")}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-base mobile-input transition-all duration-200"
                  >
                    {Object.entries(mediaTypeLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                  {errors.type && <span className="text-red-400 text-xs mt-1">{errors.type.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Status *
                  </label>
                  <select
                    {...register("status")}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  >
                    <option value="planned">Planejado</option>
                    <option value="in-progress">Em Progresso</option>
                    <option value="completed">Concluído</option>
                    <option value="dropped">Abandonado</option>
                  </select>
                  {errors.status && <span className="text-red-400 text-xs mt-1">{errors.status.message}</span>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Plataforma
                  </label>
                  <input
                    type="text"
                    {...register("platform")}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                    placeholder="Steam, Netflix, etc."
                  />
                </div>
              </div>

              {/* Rating & Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text sm font-medium text-slate-300 mb-2">
                    Avaliação (0-10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    {...register("rating")}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                    placeholder="8.5"
                  />
                  {errors.rating && <span className="text-red-400 text-xs mt-1">{errors.rating.message}</span>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Horas Gastas
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    {...register("hoursSpent")}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                    placeholder="25.5"
                  />
                </div>
              </div>

              {type === "book" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Páginas Totais
                    </label>
                    <input
                      type="number"
                      min="1"
                      {...register("totalPages")}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
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
                      {...register("currentPage")}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      placeholder="42"
                    />
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    {...register("startDate")}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Data de Conclusão
                  </label>
                  <input
                    type="date"
                    {...register("endDate")}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
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
                  value={tagsInput}
                  onChange={handleTagsChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
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
                  {...register("externalLink")}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  placeholder="https://store.steampowered.com/..."
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Imagem de Capa
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-center sm:justify-start">
                    <label
                      className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white transition-colors cursor-pointer text-sm sm:text-base touch-target ${isUploading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-slate-700"
                        }`}
                    >
                      {isUploading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Upload size={16} className="sm:w-5 sm:h-5" />
                      )}
                      {isUploading
                        ? "Processando..."
                        : "Fazer Upload da Imagem"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                  {coverPreview && (
                    <div className="mt-3 flex justify-center overflow-hidden">
                      <img
                        src={coverPreview}
                        alt="Preview"
                        className="w-24 sm:w-32 h-32 sm:h-40 object-cover rounded-lg"
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
                  rows={3}
                  {...register("description")}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm sm:text-base"
                  placeholder="Breve descrição ou notas..."
                />
              </div>
            </div>
          </div>

          {/* Actions - Fixed at bottom */}
          <div className="flex-shrink-0 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent p-3 sm:p-4 md:p-6 border-t border-white/20 safe-area-padding-bottom">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
              <button
                type="button"
                onClick={onBack}
                className="w-full sm:w-auto px-6 py-3 text-slate-300 hover:text-white transition-colors order-2 sm:order-1 text-sm sm:text-base touch-target"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className={`w-full sm:w-auto px-6 py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 order-1 sm:order-2 text-base font-semibold touch-target no-zoom ${isSubmitting || isUploading
                  ? "bg-slate-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg hover:shadow-pink-500/25 active:scale-95"
                  } text-white`}
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={16} className="sm:w-5 sm:h-5" />
                )}
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default EditMediaPage;
