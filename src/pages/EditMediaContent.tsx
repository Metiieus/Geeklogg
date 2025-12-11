import React, { useState } from "react";
import { z } from "zod";
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
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";

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

  // Extend schema for form handling including file upload
  const formSchema = mediaSchema.extend({
    coverFile: z.any().optional(),
    coverPreview: z.string().optional(),
  });

  type FormDataType = z.infer<typeof formSchema>;

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormDataType>({
    resolver: zodResolver(formSchema) as any,
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



  const onSubmit = async (data: FormDataType) => {
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
                <Input
                  label="Título"
                  required
                  placeholder="Digite o título da mídia"
                  {...register("title")}
                  error={errors.title?.message}
                />

                <Select
                  label="Tipo"
                  required
                  {...register("type")}
                  error={errors.type?.message}
                >
                  {Object.entries(mediaTypeLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Select
                  label="Status"
                  required
                  {...register("status")}
                  error={errors.status?.message}
                >
                  <option value="planned">Planejado</option>
                  <option value="in-progress">Em Progresso</option>
                  <option value="completed">Concluído</option>
                  <option value="dropped">Abandonado</option>
                </Select>

                <Input
                  label="Plataforma"
                  placeholder="Steam, Netflix, etc."
                  {...register("platform")}
                />
              </div>

              {/* Rating & Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label="Avaliação (0-10)"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="8.5"
                  {...register("rating")}
                  error={errors.rating?.message}
                />

                <Input
                  label="Horas Gastas"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="25.5"
                  {...register("hoursSpent")}
                />
              </div>

              {type === "book" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Input
                    label="Páginas Totais"
                    type="number"
                    min="1"
                    placeholder="350"
                    {...register("totalPages")}
                  />
                  <Input
                    label="Página Atual"
                    type="number"
                    min="0"
                    placeholder="42"
                    {...register("currentPage")}
                  />
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label="Data de Início"
                  type="date"
                  {...register("startDate")}
                />
                <Input
                  label="Data de Conclusão"
                  type="date"
                  {...register("endDate")}
                />
              </div>

              {/* Tags */}
              <Input
                label="Tags"
                value={tagsInput}
                onChange={handleTagsChange}
                placeholder="RPG, Fantasia, Multiplayer (separado por vírgula)"
              />

              {/* External Link */}
              <Input
                label="Link Externo"
                type="url"
                placeholder="https://store.steampowered.com/..."
                {...register("externalLink")}
              />

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Imagem de Capa
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-center sm:justify-start">
                    <label
                      className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white transition-colors cursor-pointer text-sm sm:text-base touch-target hover:bg-slate-700/50 ${isUploading
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                        }`}
                    >
                      {isUploading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Upload size={16} className="sm:w-5 sm:h-5 text-purple-400" />
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
                        className="w-24 sm:w-32 h-32 sm:h-40 object-cover rounded-xl shadow-lg border border-white/10"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Descrição
                </label>
                <textarea
                  rows={3}
                  {...register("description")}
                  className="w-full bg-slate-800/50 text-white rounded-xl border border-slate-700/50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 resize-none px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base hover:border-slate-600/50"
                  placeholder="Breve descrição ou notas..."
                />
              </div>
            </div>
          </div>

          {/* Actions - Fixed at bottom */}
          <div className="flex-shrink-0 bg-slate-900 border-t border-white/10 p-4 sm:p-6 safe-area-padding-bottom z-10">
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
              <Button
                variant="ghost"
                onClick={onBack}
                className="w-full sm:w-auto"
                type="button"
              >
                Cancelar
              </Button>
              <Button
                isLoading={isSubmitting || isUploading}
                leftIcon={<Save size={18} />}
                className="w-full sm:w-auto"
                type="submit"
              >
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default EditMediaPage;
