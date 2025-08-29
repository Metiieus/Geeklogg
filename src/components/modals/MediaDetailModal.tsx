import React from 'react';
import { X, Edit, Trash2, ExternalLink, Star, Clock, Calendar, Tag, Play, BookOpen } from 'lucide-react';
import { MediaItem } from '../../App';
import { ModalWrapper } from '../ModalWrapper';

interface MediaDetailModalProps {
  item: MediaItem;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const statusConfig = {
  completed: { label: 'Concluído', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', icon: '✅' },
  'in-progress': { label: 'Em Progresso', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', icon: '⏳' },
  dropped: { label: 'Abandonado', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', icon: '❌' },
  planned: { label: 'Planejado', color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30', icon: '📅' },
};

const typeLabels = {
  games: 'Jogo',
  anime: 'Anime',
  series: 'Série',
  books: 'Livro',
  movies: 'Filme',
};

const typeColors = {
  games: 'from-cyan-500/20 to-cyan-400/10 text-cyan-300',
  anime: 'from-pink-500/20 to-pink-400/10 text-pink-300',
  series: 'from-indigo-500/20 to-indigo-400/10 text-indigo-300',
  books: 'from-amber-500/20 to-amber-400/10 text-amber-300',
  movies: 'from-fuchsia-500/20 to-fuchsia-400/10 text-fuchsia-300',
};

export const MediaDetailModal: React.FC<MediaDetailModalProps> = ({
  item,
  onClose,
  onEdit,
  onDelete,
}) => {
  const statusInfo = statusConfig[item.status];

  return (
    <ModalWrapper
      isOpen={true}
      onClose={onClose}
      maxWidth="max-w-3xl"
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl sm:rounded-2xl border border-white/20 overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row max-h-[90vh]">
        {/* Seção da Capa - Lado Esquerdo */}
        <div className="lg:w-2/5 relative">
          <div className="aspect-[3/4] lg:h-full relative overflow-hidden bg-slate-800">
            {item.cover ? (
              <img
                src={item.cover}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            
            {/* Fallback sempre presente */}
            <div 
              className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center absolute inset-0"
              style={{ display: item.cover ? 'none' : 'flex' }}
            >
              <div className="text-center">
                <div className={`w-20 h-20 bg-gradient-to-br ${typeColors[item.type]} rounded-full flex items-center justify-center mb-4 border border-white/20`}>
                  <span className="text-3xl font-bold text-white">{item.title.charAt(0)}</span>
                </div>
                <span className="text-white/60 text-lg font-medium">{typeLabels[item.type]}</span>
              </div>
            </div>

            {/* Overlay gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors z-10"
            >
              <X className="text-white" size={20} />
            </button>

            {/* Rating Badge */}
            {item.rating && (
              <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 bg-yellow-500/20 backdrop-blur-sm rounded-full border border-yellow-500/30">
                <Star size={14} className="text-yellow-400 fill-current" />
                <span className="text-white font-bold">{item.rating}/10</span>
              </div>
            )}

            {/* Status Badge */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.color} border ${statusInfo.border}`}>
                <span className="text-lg">{statusInfo.icon}</span>
                <span>{statusInfo.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Conteúdo - Lado Direito */}
        <div className="lg:w-3/5 flex flex-col">
          {/* Header do conteúdo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 line-clamp-2">
                  {item.title}
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-3 py-1 bg-gradient-to-r ${typeColors[item.type]} rounded-full text-sm font-medium border border-current/30`}>
                    {typeLabels[item.type]}
                  </span>
                  {item.platform && (
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm">
                      {item.platform}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo scrollável */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Description */}
            {item.description && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Descrição</h3>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
                  <p className="text-white/80 leading-relaxed">{item.description}</p>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Estatísticas</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {item.hoursSpent && (
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-white/10">
                    <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <p className="text-white font-semibold">{item.hoursSpent}h</p>
                    <p className="text-white/60 text-sm">Tempo Gasto</p>
                  </div>
                )}

                {item.type === 'books' && item.totalPages && (
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-white/10">
                    <BookOpen className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <p className="text-white font-semibold">
                      {item.currentPage || 0}/{item.totalPages}
                    </p>
                    <p className="text-white/60 text-sm">Páginas</p>
                  </div>
                )}

                {item.rating && (
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-white/10">
                    <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2 fill-current" />
                    <p className="text-white font-semibold">{item.rating}/10</p>
                    <p className="text-white/60 text-sm">Avaliação</p>
                  </div>
                )}
              </div>
            </div>

            {/* Datas */}
            {(item.startDate || item.endDate) && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Datas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {item.startDate && (
                    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-white/10">
                      <Calendar className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-white/60 text-sm">Início</p>
                        <p className="text-white font-medium">
                          {new Date(item.startDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  )}
                  {item.endDate && (
                    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-white/10">
                      <Calendar className="w-5 h-5 text-red-400" />
                      <div>
                        <p className="text-white/60 text-sm">Conclusão</p>
                        <p className="text-white font-medium">
                          {new Date(item.endDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm border border-white/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions - Footer fixo */}
          <div className="p-6 border-t border-white/10 bg-gradient-to-t from-slate-900/50 to-transparent">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onEdit}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl transition-all duration-200 font-medium shadow-lg"
              >
                <Edit size={18} />
                Editar
              </button>

              {item.externalLink && (
                <a
                  href={item.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white rounded-xl transition-all duration-200 font-medium shadow-lg"
                >
                  <ExternalLink size={18} />
                  Ver Online
                </a>
              )}

              <button
                onClick={onDelete}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl transition-all duration-200 font-medium shadow-lg"
              >
                <Trash2 size={18} />
                Remover
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default MediaDetailModal;