import React, { useState } from "react";
import { X, Save, Upload } from "lucide-react";
import { MediaItem, MediaType, Status } from "../../types";
import { useI18n } from "../../i18n";

interface EditMediaModalProps {
  isOpen: boolean;
  item: MediaItem;
  onClose: () => void;
  onSave: (id: string, updates: Partial<MediaItem>) => void;
}

export const EditMediaModal: React.FC<EditMediaModalProps> = ({
  isOpen,
  item,
  onClose,
  onSave,
}) => {
  const { t } = useI18n();
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

  const mediaTypeLabels = {
    game: t("media_type.game"),
    anime: t("media_type.anime"),
    tv: t("media_type.tv"),
    book: t("media_type.book"),
    movie: t("media_type.movie"),
    dorama: t("media_type.dorama"), // Ensure this key exists or fallback
  };

  const statusLabels = {
    planned: t("status.planned"),
    "in-progress": t("status.in_progress"),
    completed: t("status.completed"),
    dropped: t("status.dropped"),
  };

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
            {t("modals.edit.title")}
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
                  {t("modals.manual_add.title_field")} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={t("modals.manual_add.title_field")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t("modals.manual_add.media_type")} *
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
                  {t("modals.edit.status")} *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="planned">{statusLabels["planned"]}</option>
                  <option value="in-progress">{statusLabels["in-progress"]}</option>
                  <option value="completed">{statusLabels["completed"]}</option>
                  <option value="dropped">{statusLabels["dropped"]}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t("modals.edit.platform")}
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
                  {t("modals.manual_add.rating")}
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
                  {t("modals.edit.total_pages")}
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
                  {t("modals.edit.current_page")}
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


            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t("modals.edit.start_date")}
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
                  {t("modals.edit.end_date")}
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
                {t("modals.manual_add.tags_field")}
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={t("modals.manual_add.tags_placeholder")}
              />
            </div>

            {/* External Link */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t("modals.edit.external_link")}
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
                {t("modals.edit.cover_image")}
              </label>
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <label className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white cursor-pointer hover:bg-slate-700 transition-colors">
                    <Upload size={18} />
                    {t("modals.edit.upload_image")}
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
                {t("modals.edit.description")}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder={t("modals.manual_add.notes_placeholder")}
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
                {t("actions.cancel")}
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-200 flex items-center justify-center gap-2 order-1 sm:order-2 text-sm sm:text-base"
              >
                <Save size={18} />
                {t("modals.edit.save_btn")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
