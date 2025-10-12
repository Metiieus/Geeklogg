import React, { useState } from "react";
import {
  X,
  Save,
  Star,
  Calendar,
  Tag,
  ExternalLink,
  Clock,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalMediaResult } from "../../services/externalMediaService";
import { MediaItem, MediaType, Status } from "../../App";
import { useToast } from "../../context/ToastContext";

interface AddMediaFromSearchModalProps {
  selectedResult: ExternalMediaResult;
  onAdd: (item: MediaItem) => void;
  onClose: () => void;
}

const statusOptions = [
  {
    value: "planned",
    label: "Planejado",
    icon: "📅",
    color: "from-purple-500/20 to-purple-400/10 border-purple-500/30",
  },
  {
    value: "in-progress",
    label: "Em Progresso",
    icon: "⏳",
    color: "from-blue-500/20 to-blue-400/10 border-blue-500/30",
  },
  {
    value: "completed",
    label: "Concluído",
    icon: "✅",
    color: "from-emerald-500/20 to-emerald-400/10 border-emerald-500/30",
  },
  {
    value: "dropped",
    label: "Abandonado",
    icon: "❌",
    color: "from-red-500/20 to-red-400/10 border-red-500/30",
  },
];

const typeLabels = {
  games: "Jogo",
  anime: "Anime",
  series: "Série",
  books: "Livro",
  movies: "Filme",
};

export const AddMediaFromSearchModal: React.FC<
  AddMediaFromSearchModalProps
> = ({ selectedResult, onAdd, onClose }) => {
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    status: "planned" as Status,
    rating: "",
    hoursSpent: "",
    currentPage: "",
    totalPages: selectedResult.pageCount?.toString() || "",
    startDate: "",
    endDate: "",
    platform: "",
    tags: selectedResult.genres?.join(", ") || "",
    personalNotes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const rawTags = formData.tags
        ? formData.tags
            .split(",")
            .map((t) => t.trim().toLowerCase())
            .filter((t) => t)
        : [];

      if (rawTags.length === 0) {
        showError("Tags obrigatórias", "Adicione pelo menos uma tag (ex.: game, filme, serie, livro, anime)");
        return;
      }

      const typeToCategoryTag = (t?: string): string | null => {
        switch ((t || "").toLowerCase()) {
          case "game":
          case "games":
            return "game";
          case "movie":
          case "movies":
            return "filme";
          case "tv":
          case "series":
            return "serie";
          case "book":
          case "books":
            return "livro";
          case "anime":
            return "anime";
          default:
            return null;
        }
      };
      const categoryTag = typeToCategoryTag(selectedResult.originalType as string);
      const tags = Array.from(new Set(categoryTag ? [categoryTag, ...rawTags] : rawTags));

      const newItem: MediaItem = {
        id: crypto.randomUUID(),
        title: selectedResult.title,
        cover: selectedResult.image,
        type: (selectedResult.originalType as MediaType) || "books",
        status: formData.status,
        rating: formData.rating ? parseFloat(formData.rating) : undefined,
        hoursSpent: formData.hoursSpent
          ? parseFloat(formData.hoursSpent)
          : undefined,
        currentPage: formData.currentPage
          ? parseInt(formData.currentPage)
          : undefined,
        totalPages: formData.totalPages
          ? parseInt(formData.totalPages)
          : undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        platform: formData.platform || undefined,
        tags,
        externalLink: selectedResult.officialWebsite,
        description:
          selectedResult.description || formData.personalNotes || undefined,
        isFeatured: false,
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onAdd(newItem);
      showSuccess(
        "Mídia adicionada!",
        `${selectedResult.title} foi adicionado à sua biblioteca`,
      );
    } catch (error) {
      console.error("Erro ao adicionar mídia:", error);
      showError("Erro", "Não foi possível adicionar a mídia");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-6xl max-h-[95vh] mx-auto"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-tl from-violet-400/20 to-fuchsia-400/20 rounded-full blur-2xl" />
          </div>

          <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl overflow-hidden">
            <div className="flex flex-col lg:flex-row max-h-[95vh]">
              {/* Preview Section - Left Side */}
              <div className="lg:w-2/5 border-b lg:border-b-0 lg:border-r border-slate-200/50 dark:border-slate-700/50">
                {/* Header for preview */}
                <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 dark:from-emerald-400/30 dark:to-teal-400/30 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50">
                      <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        Pré-visualização
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Como aparecerá na sua biblioteca
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(95vh-200px)]">
                  {/* Cover */}
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                    {selectedResult.image ? (
                      <img
                        src={selectedResult.image}
                        alt={selectedResult.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const fallback =
                            target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center"
                      style={{
                        display: selectedResult.image ? "none" : "flex",
                      }}
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/50 dark:to-violet-900/50 rounded-2xl flex items-center justify-center mb-3 border border-slate-300 dark:border-slate-600">
                          <span className="text-slate-700 dark:text-slate-300 font-bold text-2xl">
                            {selectedResult.title.charAt(0)}
                          </span>
                        </div>
                        <span className="text-slate-500 dark:text-slate-400 text-sm">
                          Sem imagem
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                      {selectedResult.title}
                    </h3>

                    {selectedResult.year && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {selectedResult.year}
                        </span>
                      </div>
                    )}

                    {selectedResult.authors &&
                      selectedResult.authors.length > 0 && (
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Autor(es)
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {selectedResult.authors.slice(0, 2).join(", ")}
                          </p>
                        </div>
                      )}

                    {selectedResult.developer && (
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Desenvolvedor
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {selectedResult.developer}
                        </p>
                      </div>
                    )}

                    {selectedResult.genres &&
                      selectedResult.genres.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Gêneros
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {selectedResult.genres
                              .slice(0, 4)
                              .map((genre, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1.5 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-600/50"
                                >
                                  {genre}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Description */}
                  {selectedResult.description && (
                    <div className="bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 rounded-2xl p-5 border border-blue-200/50 dark:border-blue-700/50">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Sinopse
                      </h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-6">
                        {selectedResult.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Section - Right Side */}
              <div className="lg:w-3/5 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 dark:from-violet-400/30 dark:to-fuchsia-400/30 rounded-xl border border-violet-200/50 dark:border-violet-700/50">
                        <Save className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                          Adicionar à Biblioteca
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Configure os detalhes do item
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300"
                    >
                      <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                  <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[calc(95vh-200px)]">
                    {/* Status */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
                        Status *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {statusOptions.map((option) => (
                          <motion.button
                            key={option.value}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleChange("status", option.value)}
                            className={`p-4 rounded-2xl border transition-all duration-300 text-left ${
                              formData.status === option.value
                                ? `bg-gradient-to-r ${option.color} text-slate-800 dark:text-slate-200 ring-2 ring-offset-2 ring-slate-300 dark:ring-slate-600 ring-offset-white dark:ring-offset-slate-900`
                                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{option.icon}</span>
                              <span className="font-medium">
                                {option.label}
                              </span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Rating & Hours */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                          Avaliação (0-10)
                        </label>
                        <div className="relative">
                          <Star
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500"
                            size={18}
                          />
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={formData.rating}
                            onChange={(e) =>
                              handleChange("rating", e.target.value)
                            }
                            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                            placeholder="8.5"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                          Horas Gastas
                        </label>
                        <div className="relative">
                          <Clock
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500"
                            size={18}
                          />
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={formData.hoursSpent}
                            onChange={(e) =>
                              handleChange("hoursSpent", e.target.value)
                            }
                            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                            placeholder="25.5"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Pages (for books) */}
                    {(selectedResult.originalType === "book" ||
                      selectedResult.pageCount) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                            Páginas Totais
                          </label>
                          <div className="relative">
                            <BookOpen
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500"
                              size={18}
                            />
                            <input
                              type="number"
                              min="1"
                              value={formData.totalPages}
                              onChange={(e) =>
                                handleChange("totalPages", e.target.value)
                              }
                              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                              placeholder="350"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                            Página Atual
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={formData.currentPage}
                            onChange={(e) =>
                              handleChange("currentPage", e.target.value)
                            }
                            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                            placeholder="42"
                          />
                        </div>
                      </div>
                    )}

                    {/* Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                          Data de Início
                        </label>
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) =>
                            handleChange("startDate", e.target.value)
                          }
                          className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                          Data de Conclusão
                        </label>
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) =>
                            handleChange("endDate", e.target.value)
                          }
                          className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Platform */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                        Plataforma
                      </label>
                      <input
                        type="text"
                        value={formData.platform}
                        onChange={(e) =>
                          handleChange("platform", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                        placeholder="Steam, Netflix, Amazon, PlayStation, etc."
                      />
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                        <Tag className="inline w-4 h-4 mr-1" />
                        Tags
                      </label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => handleChange("tags", e.target.value)}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                        placeholder="Fantasia, RPG, Aventura (separado por vírgula)"
                      />
                    </div>

                    {/* Personal Notes */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                        Notas Pessoais
                      </label>
                      <textarea
                        value={formData.personalNotes}
                        onChange={(e) =>
                          handleChange("personalNotes", e.target.value)
                        }
                        rows={4}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 resize-none"
                        placeholder="Suas impressões, expectativas ou notas sobre este item..."
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-900/50">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors duration-300"
                      >
                        Cancelar
                      </button>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3 rounded-2xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                      >
                        <Save size={18} />
                        Adicionar à Biblioteca
                      </motion.button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddMediaFromSearchModal;
