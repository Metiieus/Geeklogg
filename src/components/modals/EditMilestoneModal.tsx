import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Milestone } from '../../App';
import { updateMilestone } from '../../services/milestoneService';

interface EditMilestoneModalProps {
  milestone: Milestone;
  onClose: () => void;
  onSave: (milestone: Milestone) => void;
}

const commonIcons = ['🎮', '🏆', '⭐', '🎯', '🔥', '💎', '🚀', '🎊', '🎉', '👑', '🌟', '💪', '🎪', '🎭', '🎨'];

export const EditMilestoneModal: React.FC<EditMilestoneModalProps> = ({ milestone, onClose, onSave }) => {
  const { mediaItems } = useAppContext();
  const [formData, setFormData] = useState({
    title: milestone.title,
    description: milestone.description,
    date: milestone.date,
    icon: milestone.icon,
    mediaId: milestone.mediaId || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateMilestone(milestone.id, {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      icon: formData.icon,
      mediaId: formData.mediaId || undefined,
    });

    const updatedMilestone: Milestone = {
      ...milestone,
      title: formData.title,
      description: formData.description,
      date: formData.date,
      icon: formData.icon,
      mediaId: formData.mediaId || undefined,
    };

    onSave(updatedMilestone);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white">Editar Marco</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="text-slate-400" size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Título *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ex: Zerei Dark Souls 3"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Descrição *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Descreva este momento especial..."
            />
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
              onChange={(e) => handleChange('date', e.target.value)}
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
                  onClick={() => handleChange('icon', icon)}
                  className={`p-3 text-2xl rounded-lg border-2 transition-all ${
                    formData.icon === icon
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => handleChange('icon', e.target.value)}
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
              onChange={(e) => handleChange('mediaId', e.target.value)}
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

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/20">
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
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};