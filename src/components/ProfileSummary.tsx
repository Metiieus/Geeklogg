import React from 'react';
import { 
  BookOpen, 
  MessageSquare, 
  Clock, 
  BarChart3, 
  Star, 
  TrendingUp, 
  Trophy,
  Target,
  Gamepad2,
  Film,
  Tv,
  Book,
  Sparkles
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MediaType, MediaItem, Review } from '../App';

const mediaTypeIcons = {
  games: Gamepad2,
  anime: Sparkles,
  series: Tv,
  books: Book,
  movies: Film
};

const mediaTypeColors = {
  games: 'from-blue-500 to-cyan-500',
  anime: 'from-pink-500 to-rose-500',
  series: 'from-purple-500 to-violet-500',
  books: 'from-green-500 to-emerald-500',
  movies: 'from-yellow-500 to-orange-500'
};

interface ProfileSummaryProps {
  isPublicView?: boolean;
}

export const ProfileSummary: React.FC<ProfileSummaryProps> = ({ isPublicView = false }) => {
  const { mediaItems, reviews, milestones } = useAppContext();

  // Estatísticas gerais
  const totalHours = mediaItems.reduce((sum, item) => sum + (item.hoursSpent || 0), 0);
  const totalCompleted = mediaItems.filter(item => item.status === 'completed').length;
  const ratedItems = mediaItems.filter(item => item.rating);
  const avgRating = ratedItems.length > 0 ? ratedItems.reduce((sum, item) => sum + (item.rating || 0), 0) / ratedItems.length : 0;

  // Estatísticas por tipo de mídia
  const getMediaStats = () => {
    const stats: Record<MediaType, { count: number; completed: number }> = {
      games: { count: 0, completed: 0 },
      anime: { count: 0, completed: 0 },
      series: { count: 0, completed: 0 },
      books: { count: 0, completed: 0 },
      movies: { count: 0, completed: 0 }
    };

    mediaItems.forEach(item => {
      stats[item.type].count++;
      if (item.status === 'completed') {
        stats[item.type].completed++;
      }
    });

    return stats;
  };

  // Itens recentes
  const recentItems = mediaItems
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  // Reviews recentes
  const recentReviews = reviews
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  // Top rated
  const topRated = mediaItems
    .filter(item => item.rating)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);

  const mediaStats = getMediaStats();

  return (
    <div className="space-y-6">
      {/* Estatísticas Principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Clock className="text-cyan-400" size={16} />
            </div>
            <span className="text-cyan-400 font-medium text-sm">Horas Totais</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalHours.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-xl p-4 border border-green-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Target className="text-green-400" size={16} />
            </div>
            <span className="text-green-400 font-medium text-sm">Concluídos</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalCompleted}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Star className="text-yellow-400" size={16} />
            </div>
            <span className="text-yellow-400 font-medium text-sm">Nota Média</span>
          </div>
          <p className="text-2xl font-bold text-white">{avgRating.toFixed(1)}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <MessageSquare className="text-purple-400" size={16} />
            </div>
            <span className="text-purple-400 font-medium text-sm">Reviews</span>
          </div>
          <p className="text-2xl font-bold text-white">{reviews.length}</p>
        </div>
      </div>

      {/* Biblioteca por Tipo */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="text-pink-400" size={24} />
          <h3 className="text-xl font-semibold text-white">Biblioteca</h3>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(mediaStats).map(([type, stats]) => {
            const Icon = mediaTypeIcons[type as MediaType];
            const colors = mediaTypeColors[type as MediaType];
            return (
              <div key={type} className={`bg-gradient-to-br ${colors}/10 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50`}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={18} className="text-white" />
                  <span className="text-white font-medium text-sm capitalize">{type}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total</span>
                    <span className="text-white font-medium">{stats.count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Concluídos</span>
                    <span className="text-white font-medium">{stats.completed}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Itens Recentes */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-cyan-400" size={20} />
            <h4 className="text-lg font-semibold text-white">Atualizado Recentemente</h4>
          </div>
          
          <div className="space-y-3">
            {recentItems.length > 0 ? (
              recentItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                  <div className="w-12 h-16 bg-slate-700 rounded overflow-hidden flex-shrink-0">
                    {item.cover ? (
                      <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <BookOpen size={16} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm line-clamp-1">{item.title}</p>
                    <p className="text-slate-400 text-xs">{item.status}</p>
                  </div>
                  {item.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-400" size={12} fill="currentColor" />
                      <span className="text-white text-xs">{item.rating}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">Nenhum item na biblioteca ainda</p>
            )}
          </div>
        </div>

        {/* Reviews Recentes */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="text-purple-400" size={20} />
            <h4 className="text-lg font-semibold text-white">Reviews Recentes</h4>
          </div>
          
          <div className="space-y-3">
            {recentReviews.length > 0 ? (
              recentReviews.map((review) => (
                <div key={review.id} className="p-3 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium text-sm line-clamp-1">{review.title}</p>
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-400" size={12} fill="currentColor" />
                      <span className="text-white text-xs">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-slate-300 text-xs line-clamp-2">{review.content}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">Nenhuma review escrita ainda</p>
            )}
          </div>
        </div>
      </div>

      {/* Marcos da Jornada */}
      {milestones.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="text-indigo-400" size={20} />
            <h4 className="text-lg font-semibold text-white">Marcos da Jornada</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {milestones.slice(0, 6).map((milestone) => (
              <div key={milestone.id} className="p-4 bg-slate-800/30 rounded-lg border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{milestone.icon}</span>
                  <p className="text-white font-medium text-sm">{milestone.title}</p>
                </div>
                <p className="text-slate-300 text-xs mb-1">{milestone.description}</p>
                <p className="text-slate-400 text-xs">{new Date(milestone.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
