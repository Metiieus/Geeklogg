import React, { useState } from 'react';
import { X, Save, Star, Calendar, Tag, ExternalLink, Clock, BookOpen } from 'lucide-react';
import { ExternalMediaResult } from '../../services/externalMediaService';
import { MediaItem, MediaType, Status } from '../../App';
import { ModalWrapper } from '../ModalWrapper';
import { useToast } from '../../context/ToastContext';

interface AddMediaFromSearchModalProps {
  selectedResult: ExternalMediaResult;
  onAdd: (item: MediaItem) => void;
  onClose: () => void;
}

const statusOptions = [
  { value: 'planned', label: 'Planejado', icon: '📅', color: 'from-purple-500/20 to-purple-400/10 border-purple-500/30' },
  { value: 'in-progress', label: 'Em Progresso', icon: '⏳', color: 'from-blue-500/20 to-blue-400/10 border-blue-500/30' },
  { value: 'completed', label: 'Concluído', icon: '✅', color: 'from-emerald-500/20 to-emerald-400/10 border-emerald-500/30' },
  { value: 'dropped', label: 'Abandonado', icon: '❌', color: 'from-red-500/20 to-red-400/10 border-red-500/30' },
];

const typeLabels = {
  games: 'Jogo',
  anime: 'Anime',
  series: 'Série',
  books: 'Livro',
  movies: 'Filme',
};

export const AddMediaFromSearchModal: React.FC<AddMediaFromSearchModalProps> = ({
  selectedResult,
  onAdd,
  onClose,
}) => {
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    status: 'planned' as Status,
    rating: '',
    hoursSpent: '',
    currentPage: '',
    totalPages: selectedResult.pageCount?.toString() || '',
    startDate: '',
    endDate: '',
    platform: '',
    tags: selectedResult.genres?.join(', ') || '',
    personalNotes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newItem: MediaItem = {
        id: crypto.randomUUID(),
        title: selectedResult.title,
        cover: selectedResult.image,
        type: (selectedResult.originalType as MediaType) || 'books',
        status: formData.status,
        rating: formData.rating ? parseFloat(formData.rating) : undefined,
        hoursSpent: formData.hoursSpent ? parseFloat(formData.hoursSpent) : undefined,
        currentPage: formData.currentPage ? parseInt(formData.currentPage) : undefined,
        totalPages: formData.totalPages ? parseInt(formData.totalPages) : undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        platform: formData.platform || undefined,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        externalLink: selectedResult.officialWebsite,
        description: selectedResult.description || formData.personalNotes || undefined,
        isFeatured: false,
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onAdd(newItem);
      showSuccess('Mídia adicionada!', `${selectedResult.title} foi adicionado à sua biblioteca`);
    } catch (error) {
      console.error('Erro ao adicionar mídia:', error);
      showError('Erro', 'Não foi possível adicionar a mídia');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ModalWrapper
      isOpen={true}
      onClose={onClose}
      maxWidth="max-w-4xl"
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl sm:rounded-2xl border border-white/20 overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row max-h-[90vh]">
        {/* Preview Section - Lado Esquerdo */}
        <div className="lg:w-2/5 p-6 border-b lg:border-b-0 lg:border-r border-white/10">
          <div className="sticky top-0 space-y-4">
            {/* Capa */}
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-700 border border-white/10">
              {selectedResult.image ? (
                <img
                  src={selectedResult.image}
                  alt={selectedResult.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="w-full h-full bg-gradient-to-br from-slate-700/60 to-slate-800/80 flex items-center justify-center"
                style={{ display: selectedResult.image ? 'none' : 'flex' }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-full flex items-center justify-center mb-3 border border-white/20">
                    <span className="text-white font-bold text-2xl">{selectedResult.title.charAt(0)}</span>
                  </div>
                  <span className="text-white/60 text-sm">Prévia</span>
                </div>
              </div>
            </div>

            {/* Informações básicas */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white line-clamp-2">
                {selectedResult.title}
              </h3>

              {selectedResult.year && (
                <div className="flex items-center gap-2 text-white/60">
                  <Calendar size={14} />
                  <span className="text-sm">{selectedResult.year}</span>
                </div>
              )}

              {selectedResult.authors && selectedResult.authors.length > 0 && (
                <p className="text-white/60 text-sm">
                  <strong>Autor(es):</strong> {selectedResult.authors.slice(0, 2).join(', ')}
                </p>
              )}

              {selectedResult.developer && (
                <p className="text-white/60 text-sm">
                  <strong>Desenvolvedor:</strong> {selectedResult.developer}
                </p>
              )}

              {selectedResult.genres && selectedResult.genres.length > 0 && (
                <div>
                  <p className="text-white/60 text-sm mb-2"><strong>Gêneros:</strong></p>
                  <div className="flex flex-wrap gap-1">
                    {selectedResult.genres.slice(0, 4).map((genre, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80 border border-white/20"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Descrição */}
            {selectedResult.description && (
              <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
                <h4 className="text-white font-medium mb-2">Sinopse</h4>
                <p className="text-white/70 text-sm leading-relaxed line-clamp-6">
                  {selectedResult.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Form Section - Lado Direito */}
        <div className="lg:w-3/5 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Adicionar à Biblioteca</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors lg:hidden"
            >
              <X className="text-slate-400" size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-3">
                  Status *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleChange('status', option.value)}
                      className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                        formData.status === option.value
                          ? `bg-gradient-to-r ${option.color} text-white ring-2 ring-white/20`
                          : 'bg-slate-800/50 border-white/10 text-white/80 hover:bg-slate-700/50 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{option.icon}</span>
                        <span className="font-medium">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating & Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Avaliação (0-10)
                  </label>
                  <div className="relative">
                    <Star className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400" size={16} />
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => handleChange('rating', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="8.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Horas Gastas
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={formData.hoursSpent}
                      onChange={(e) => handleChange('hoursSpent', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="25.5"
                    />
                  </div>
                </div>
              </div>

              {/* Pages (for books) */}
              {(selectedResult.originalType === 'book' || selectedResult.pageCount) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Páginas Totais
                    </label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" size={16} />
                      <input
                        type="number"
                        min="1"
                        value={formData.totalPages}
                        onChange={(e) => handleChange('totalPages', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="350"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Página Atual
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.currentPage}
                      onChange={(e) => handleChange('currentPage', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="42"
                    />
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Data de Conclusão
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Platform */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Plataforma
                </label>
                <input
                  type="text"
                  value={formData.platform}
                  onChange={(e) => handleChange('platform', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Steam, Netflix, Amazon, PlayStation, etc."
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  <Tag className="inline w-4 h-4 mr-1" />
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Fantasia, RPG, Aventura (separado por vírgula)"
                />
              </div>

              {/* Personal Notes */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Notas Pessoais
                </label>
                <textarea
                  value={formData.personalNotes}
                  onChange={(e) => handleChange('personalNotes', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Suas impressões, expectativas ou notas sobre este item..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-white/10 bg-gradient-to-t from-slate-900/50 to-transparent">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 text-white/80 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-6 py-3 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-lg"
                >
                  <Save size={18} />
                  Adicionar à Biblioteca
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default AddMediaFromSearchModal;