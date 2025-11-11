import React, { useState } from "react";
import { X, Save, Star } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { Review } from "../../App";
import { addReview } from "../../services/reviewService";
import { sanitizeText } from "../../utils/sanitizer";
import { ModalWrapper } from "../ModalWrapper";
import { useImprovedScrollLock } from "../../hooks/useImprovedScrollLock";
import { RichTextEditor } from "../RichTextEditor";

interface AddReviewModalProps {
  onClose: () => void;
  onSave: (review: Review) => void;
  isOpen?: boolean;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  onClose,
  onSave,
  isOpen = true,
}) => {
  const { mediaItems } = useAppContext();

  // Apply scroll lock
  useImprovedScrollLock(isOpen);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    rating: 5,
    mediaId: "",
    isFavorite: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newReview = await addReview({
      title: formData.title,
      content: formData.content,
      rating: formData.rating,
      mediaId: formData.mediaId,
      isFavorite: formData.isFavorite,
    });

    onSave(newReview);
  };

  const handleChange = (field: string, value: any) => {
    // Não aplicar sanitização no título para permitir espaços
    // Apenas limitar o tamanho
    if (typeof value === "string" && field === "title") {
      value = value.substring(0, 200);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-3xl"
      className="modal-desktop-medium modal-performance modal-interactive"
    >
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl sm:rounded-2xl border border-white/20 w-full flex flex-col modal-h-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/20">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Nova Resenha
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
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col overflow-hidden min-h-0"
        >
          <div className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto min-h-0">
            {/* Media Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Mídia *
              </label>
              <select
                required
                value={formData.mediaId}
                onChange={(e) => handleChange("mediaId", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecione uma mídia</option>
                {mediaItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} ({item.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Título da Resenha *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Digite o título da sua resenha"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Avaliação *
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={formData.rating}
                  onChange={(e) =>
                    handleChange("rating", parseInt(e.target.value))
                  }
                  className="w-full sm:flex-1"
                />
                <div className="flex items-center gap-1 min-w-[80px]">
                  <Star
                    className="text-yellow-400"
                    size={16}
                    fill="currentColor"
                  />
                  <span className="text-white font-medium">
                    {formData.rating}/10
                  </span>
                </div>
              </div>
            </div>

            {/* Content - Rich Text Editor */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Conteúdo da Resenha *
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => handleChange("content", value)}
                placeholder="Escreva sua resenha aqui... Use a barra de ferramentas para formatar o texto."
                minHeight="250px"
                maxLength={5000}
              />
              <p className="text-xs text-slate-400 mt-2">
                💡 Dica: Use <strong>negrito</strong>, <em>itálico</em> e listas para destacar pontos importantes!
              </p>
            </div>

            {/* Favorite */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="favorite"
                checked={formData.isFavorite}
                onChange={(e) => handleChange("isFavorite", e.target.checked)}
                className="w-4 h-4 text-pink-500 bg-slate-700 border-slate-600 rounded focus:ring-pink-500"
              />
              <label htmlFor="favorite" className="text-slate-300">
                Marcar como resenha favorita
              </label>
            </div>
          </div>

          {/* Actions - Fixed at bottom */}
          <div className="flex-shrink-0 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent p-4 sm:p-6 border-t border-white/20">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-slate-300 hover:text-white transition-colors order-2 sm:order-1"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-200 flex items-center justify-center gap-2 order-1 sm:order-2"
              >
                <Save size={18} />
                Salvar Resenha
              </button>
            </div>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};
