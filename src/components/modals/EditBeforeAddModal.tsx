import React, { useState } from "react";
import { X, Save, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { ExternalMediaResult } from "../../services/externalMediaService";

interface EditBeforeAddModalProps {
  media: ExternalMediaResult;
  onSave: (media: ExternalMediaResult) => Promise<void>;
  onCancel: () => void;
}

export const EditBeforeAddModal: React.FC<EditBeforeAddModalProps> = ({
  media,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: media.title,
    description: media.description || "",
    image: media.image || "",
    year: media.year?.toString() || "",
    authors: media.authors?.join(", ") || "",
    director: media.director || "",
    developer: media.developer || "",
    genres: media.genres?.join(", ") || "",
    rating: media.rating?.toString() || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updatedMedia: ExternalMediaResult = {
        ...media,
        title: formData.title,
        description: formData.description,
        image: formData.image,
        year: formData.year ? parseInt(formData.year) : undefined,
        authors: formData.authors ? formData.authors.split(",").map(a => a.trim()) : undefined,
        director: formData.director || undefined,
        developer: formData.developer || undefined,
        genres: formData.genres ? formData.genres.split(",").map(g => g.trim()) : undefined,
        rating: formData.rating ? parseFloat(formData.rating) : undefined,
      };

      await onSave(updatedMedia);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getCreatorLabel = () => {
    switch (media.originalType) {
      case "book":
        return "Autor(es)";
      case "movie":
      case "tv":
      case "anime":
        return "Diretor";
      case "game":
        return "Desenvolvedor";
      default:
        return "Criador";
    }
  };

  const getCreatorValue = () => {
    switch (media.originalType) {
      case "book":
        return formData.authors;
      case "movie":
      case "tv":
      case "anime":
        return formData.director;
      case "game":
        return formData.developer;
      default:
        return "";
    }
  };

  const setCreatorValue = (value: string) => {
    switch (media.originalType) {
      case "book":
        handleChange("authors", value);
        break;
      case "movie":
      case "tv":
      case "anime":
        handleChange("director", value);
        break;
      case "game":
        handleChange("developer", value);
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
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
                  <Save className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Editar Mídia</h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Ajuste as informações antes de adicionar
                  </p>
                </div>
              </div>

              <button
                onClick={onCancel}
                disabled={isSaving}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all disabled:opacity-50"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-6">
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
                    value={formData.image}
                    onChange={(e) => handleChange("image", e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
                {formData.image && (
                  <div className="mt-3">
                    <img
                      src={formData.image}
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
                {/* Creator */}
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
                    Gêneros
                  </label>
                  <input
                    type="text"
                    value={formData.genres}
                    onChange={(e) => handleChange("genres", e.target.value)}
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

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Adicione uma descrição..."
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
                  onClick={onCancel}
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all disabled:opacity-50"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50"
                >
                  {isSaving ? "Salvando..." : "Salvar e Adicionar"}
                </motion.button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
