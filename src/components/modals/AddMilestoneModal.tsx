import React, { useState } from "react";
import { X, Save, Calendar, Image as ImageIcon, Trash2 } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { Milestone } from "../../types";
import { addMilestone } from "../../services/milestoneService";
import { uploadImage } from "../../services/storageClient";
import { RichTextEditor } from "../RichTextEditor";

interface AddMilestoneModalProps {
  onClose: () => void;
  onSave: (milestone: Milestone) => void;
}

const commonIcons = [
  "🎮",
  "🏆",
  "⭐",
  "🎯",
  "🔥",
  "💎",
  "🚀",
  "🎊",
  "🎉",
  "👑",
  "🌟",
  "💪",
  "🎪",
  "🎭",
  "🎨",
];

export const AddMilestoneModal: React.FC<AddMilestoneModalProps> = ({
  onClose,
  onSave,
}) => {
  const { mediaItems } = useAppContext();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    icon: "🎮",
    mediaId: "",
    images: [] as string[], // URLs das imagens
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newMilestone = await addMilestone({
      title: formData.title,
      description: formData.description,
      date: formData.date,
      icon: formData.icon,
      mediaId: formData.mediaId || undefined,
      images: formData.images,
    });

    onSave(newMilestone);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Verificar se já tem 2 imagens
    if (formData.images.length >= 2) {
      setImageError("Você pode adicionar no máximo 2 imagens");
      return;
    }

    const file = files[0];

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError("A imagem deve ter no máximo 5MB");
      return;
    }

    // Validar tipo
    if (!file.type.startsWith("image/")) {
      setImageError("Apenas imagens são permitidas");
      return;
    }

    setImageError("");
    setUploadingImage(true);

    try {
      const imageUrl = await uploadImage(file, "milestones");
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }));
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      setImageError("Erro ao fazer upload da imagem. Tente novamente.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImageError("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fade-in">
      <div
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl sm:rounded-2xl border border-white/20 max-w-3xl w-full overflow-hidden animate-slide-up flex flex-col"
        style={{
          maxHeight: "calc(100vh - 2rem)",
          minHeight: "auto",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/20 flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Novo Marco
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
            {/* Title */}
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
                placeholder="Ex: Zerei Dark Souls 3"
              />
            </div>

            {/* Description - Rich Text Editor */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Descrição *
              </label>
              <RichTextEditor
                value={formData.description}
                onChange={(value) => handleChange("description", value)}
                placeholder="Descreva este momento especial... Use a barra de ferramentas para formatar o texto."
                minHeight="180px"
                maxLength={2000}
              />
              <p className="text-xs text-slate-400 mt-2">
                💡 Dica: Use <strong>negrito</strong> e <em>itálico</em> para destacar momentos importantes!
              </p>
            </div>

            {/* Images Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Imagens (opcional - máximo 2)
              </label>

              {/* Preview das imagens */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {formData.images.map((imageUrl, index) => (
                    <div
                      key={index}
                      className="relative group rounded-lg overflow-hidden border-2 border-slate-600 hover:border-purple-500 transition-colors"
                    >
                      <img
                        src={imageUrl}
                        alt={`Imagem ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Remover imagem"
                      >
                        <Trash2 size={16} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Botão de upload */}
              {formData.images.length < 2 && (
                <div>
                  <label
                    htmlFor="image-upload"
                    className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-slate-700/30 transition-colors ${
                      uploadingImage ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <ImageIcon size={20} className="text-slate-400" />
                    <span className="text-slate-300">
                      {uploadingImage
                        ? "Enviando imagem..."
                        : "Adicionar imagem"}
                    </span>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Formatos aceitos: JPG, PNG, GIF (máximo 5MB por imagem)
                  </p>
                </div>
              )}

              {/* Mensagem de erro */}
              {imageError && (
                <p className="text-sm text-red-400 mt-2">{imageError}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Data *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Ícone *
              </label>
              <div className="grid grid-cols-8 gap-2 mb-3">
                {commonIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => handleChange("icon", icon)}
                    className={`p-3 text-2xl rounded-lg border-2 transition-all ${
                      formData.icon === icon
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-slate-600 hover:border-slate-500"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => handleChange("icon", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ou digite um emoji personalizado"
              />
            </div>

            {/* Related Media */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Mídia Relacionada (opcional)
              </label>
              <select
                value={formData.mediaId}
                onChange={(e) => handleChange("mediaId", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Nenhuma mídia selecionada</option>
                {mediaItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} ({item.type})
                  </option>
                ))}
              </select>
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
                disabled={uploadingImage}
                className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-200 flex items-center justify-center gap-2 order-1 sm:order-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {uploadingImage ? "Aguarde..." : "Salvar Marco"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
