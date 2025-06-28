import React, { useState } from 'react';
import { X, Save, Star } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Review } from '../../App';
import { addReview } from '../../services/reviewService';

interface AddReviewModalProps {
  onClose: () => void;
  onSave: (review: Review) => void;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({ onClose, onSave }) => {
  const { mediaItems } = useAppContext();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rating: 5,
    mediaId: '',
    isFavorite: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newReview = await addReview({
      title: formData.title,
      content: formData.content,
      rating: formData.rating,
      mediaId: formData.mediaId,
      isFavorite: formData.isFavorite
    });

    onSave(newReview);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">Nova Resenha</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="text-slate-400" size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Media Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Mídia *
            </label>
            <select
              required
              value={formData.mediaId}
              onChange={(e) => handleChange('mediaId', e.target.value)}
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
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Digite o título da sua resenha"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Avaliação *
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={formData.rating}
                onChange={(e) => handleChange('rating', parseInt(e.target.value))}
                className="flex-1"
              />
              <div className="flex items-center gap-1 min-w-[80px]">
                <Star className="text-yellow-400" size={16} fill="currentColor" />
                <span className="text-white font-medium">{formData.rating}/10</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Conteúdo da Resenha *
            </label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              rows={8}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Escreva sua resenha aqui..."
            />
          </div>

          {/* Favorite */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="favorite"
              checked={formData.isFavorite}
              onChange={(e) => handleChange('isFavorite', e.target.checked)}
              className="w-4 h-4 text-pink-500 bg-slate-700 border-slate-600 rounded focus:ring-pink-500"
            />
            <label htmlFor="favorite" className="text-slate-300">
              Marcar como resenha favorita
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-slate-300 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-200 flex items-center gap-2"
            >
              <Save size={18} />
              Salvar Resenha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};