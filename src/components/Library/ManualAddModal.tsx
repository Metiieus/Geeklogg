import React, { useState } from "react";
import { X, BookOpen, Film, Gamepad2, Tv, Image as ImageIcon, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useAppContext } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { addMedia } from "../../services/mediaService";

interface ManualAddModalProps {
  onClose: () => void;
}

export const ManualAddModal: React.FC<ManualAddModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "book",
    cover: "",
    year: "",
    author: "",
    director: "",
    developer: "",
    genre: "",
    tags: "",
    rating: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mediaItems, setMediaItems } = useAppContext();
  const { showToast } = useToast();

  const mediaTypes = [
    { id: "book", label: "Livro", icon: BookOpen },
    { id: "movie", label: "Filme", icon: Film },
    { id: "game", label: "Jogo", icon: Gamepad2 },
    { id: "tv", label: "Série", icon: Tv },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const rawTags = formData.tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t);
      if (rawTags.length === 0) {
        showToast("Tags obrigatórias. Adicione pelo menos uma tag (ex.: game, filme, serie, livro, anime)", "error");
        setIsSubmitting(false);
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
      const categoryTag = typeToCategoryTag(formData.type);
      const tags = Array.from(new Set(categoryTag ? [categoryTag, ...rawTags] : rawTags));

      const newMedia = await addMedia({
        title: formData.title,
        type: formData.type,
        cover: formData.cover,
        year: formData.year ? parseInt(formData.year) : undefined,
        author: formData.author,
        director: formData.director,
        genre: formData.genre,
        rating: formData.rating ? parseFloat(formData.rating) : undefined,
        notes: formData.notes,
        status: "completed",
        isFavorite: false,
        tags,
      });

      setMediaItems([...mediaItems, newMedia]);
      showToast("Mídia adicionada com sucesso!", "success");
      onClose();
    } catch (error) {
      console.error("Erro ao adicionar mídia:", error);
      showToast("Erro ao adicionar mídia. Tente novamente.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getCreatorLabel = () => {
    switch (formData.type) {
      case "book":
        return "Autor";
      case "movie":
      case "tv":
        return "Diretor";
      case "game":
        return "Desenvolvedor";
      default:
        return "Criador";
    }
  };

  const getCreatorValue = () => {
    switch (formData.type) {
      case "book":
        return formData.author;
      case "movie":
      case "tv":
        return formData.director;
      case "game":
        return formData.developer;
      default:
        return "";
    }
  };

  const setCreatorValue = (value: string) => {
    switch (formData.type) {
      case "book":
        handleChange("author", value);
        break;
      case "movie":
      case "tv":
        handleChange("director", value);
        break;
      case "game":
        handleChange("developer", value);
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-slate-900/90 to-slate-800/90 p-6 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Adicionar Manualmente</h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Preencha os detalhes manualmente
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all disabled:opacity-50"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-6">
              {/* Media Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Tipo de Mídia
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {mediaTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <motion.button
                        key={type.id}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleChange("type", type.id)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                          formData.type === type.id
                            ? "bg-gradient-to-br from-violet-500 to-cyan-500 text-white"
                            : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="text-xs font-medium">{type.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Título <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Digite o título"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                />
              </div>

              {/* Cover Image URL */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  URL da Capa
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="url"
                    value={formData.cover}
                    onChange={(e) => handleChange("cover", e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
                {formData.cover && (
                  <div className="mt-3">
                    <img
                      src={formData.cover}
                      alt="Pré-visualização"
                      className="w-32 h-48 object-cover rounded-xl border border-white/10"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Creator (Author/Director/Developer) */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    {getCreatorLabel()}
                  </label>
                  <input
                    type="text"
                    value={getCreatorValue()}
                    onChange={(e) => setCreatorValue(e.target.value)}
                    placeholder={`Digite o ${getCreatorLabel().toLowerCase()}`}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Ano
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleChange("year", e.target.value)}
                    placeholder="2024"
                    min="1900"
                    max="2100"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Genre */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Gênero
                  </label>
                  <input
                    type="text"
                    value={formData.genre}
                    onChange={(e) => handleChange("genre", e.target.value)}
                    placeholder="Ação, Drama, etc."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Avaliação (0-10)
                  </label>
                  <input
                    type="number"
                    value={formData.rating}
                    onChange={(e) => handleChange("rating", e.target.value)}
                    placeholder="7.5"
                    min="0"
                    max="10"
                    step="0.1"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Notas / Descrição
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Adicione seus pensamentos, notas ou descrição..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all disabled:opacity-50"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Adicionando..." : "Adicionar à Biblioteca"}
                </motion.button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
