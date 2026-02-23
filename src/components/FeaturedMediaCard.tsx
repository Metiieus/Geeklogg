import React from 'react';
import { Star, Clock, BookOpen, Play, Film } from 'lucide-react';
import { MediaItem } from '../types';

interface FeaturedMediaCardProps {
  media: MediaItem | null;
  onAddClick: () => void;
}

const getStatusLabel = (status: string) => {
  const labels = {
    completed: 'Concluído',
    'in-progress': 'Em Progresso',
    dropped: 'Abandonado',
    planned: 'Planejado',
  };
  return labels[status as keyof typeof labels] || status;
};

const getStatusColor = (status: string) => {
  const colors = {
    completed: 'text-green-400',
    'in-progress': 'text-blue-400',
    dropped: 'text-red-400',
    planned: 'text-yellow-400',
  };
  return colors[status as keyof typeof colors] || 'text-slate-400';
};

const getMediaIcon = (type: string) => {
  switch (type) {
    case 'game':
      return Play;
    case 'movie':
      return Film;
    case 'book':
      return BookOpen;
    default:
      return BookOpen;
  }
};

export const FeaturedMediaCard: React.FC<FeaturedMediaCardProps> = ({
  media,
  onAddClick,
}) => {
  if (!media) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <div className="text-center">
          <BookOpen className="mx-auto text-slate-600 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-white mb-2">
            Sua biblioteca está vazia
          </h3>
          <p className="text-slate-400 mb-6">
            Adicione seu primeiro jogo, filme ou livro para começar sua jornada!
          </p>
          <button
            onClick={onAddClick}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 font-medium"
          >
            Adicionar Primeiro Item
          </button>
        </div>
      </div>
    );
  }

  const MediaIcon = getMediaIcon(media.type);

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group">
      <div className="flex items-center gap-3 mb-4">
        <Star className="text-yellow-400" size={24} />
        <h2 className="text-xl font-semibold text-white">
          Atualizado Recentemente
        </h2>
      </div>

      <div className="flex gap-4">
        {/* Cover Image */}
        <div className="w-24 h-32 bg-slate-700/50 rounded-lg flex-shrink-0 overflow-hidden relative group-hover:ring-2 group-hover:ring-purple-500/50 transition-all">
          {media.cover ? (
            <img
              src={media.cover}
              alt={media.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              <MediaIcon size={32} />
            </div>
          )}
        </div>

        {/* Media Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
            {media.title}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <span className={`text-sm font-medium ${getStatusColor(media.status)}`}>
              {getStatusLabel(media.status)}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-sm text-slate-400 capitalize">{media.type}</span>
          </div>

          <div className="flex flex-wrap gap-4">
            {media.rating && (
              <div className="flex items-center gap-1.5">
                <Star className="text-yellow-400" size={16} fill="currentColor" />
                <span className="text-sm font-semibold text-white">
                  {media.rating}/10
                </span>
              </div>
            )}

            {media.hoursSpent && (
              <div className="flex items-center gap-1.5">
                <Clock className="text-blue-400" size={16} />
                <span className="text-sm font-semibold text-white">
                  {media.hoursSpent}h
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
