import React from 'react';
import { 
  BookOpen, 
  MessageSquare, 
  Clock, 
  Star, 
  TrendingUp, 
  Trophy,
  Target,
  Gamepad2,
  Film,
  Tv,
  Book,
  Sparkles,
  Play,
  CheckCircle
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MediaType } from '../App';

const mediaTypeIcons = {
  games: Gamepad2,
  anime: Sparkles,
  series: Tv,
  books: Book,
  movies: Film
};

const mediaTypeLabels = {
  games: 'Jogos',
  anime: 'Anime',
  series: 'Séries',
  books: 'Livros',
  movies: 'Filmes'
};

export const ProfileSummary: React.FC = () => {
  const { mediaItems, reviews, milestones } = useAppContext();

  // Estatísticas principais
  const totalHours = mediaItems.reduce((sum, item) => sum + (item.hoursSpent || 0), 0);
  const totalCompleted = mediaItems.filter(item => item.status === 'completed').length;
  const totalInProgress = mediaItems.filter(item => item.status === 'in-progress').length;
  const ratedItems = mediaItems.filter(item => item.rating);
  const avgRating = ratedItems.length > 0 ? ratedItems.reduce((sum, item) => sum + (item.rating || 0), 0) / ratedItems.length : 0;

  // Atividade recente (últimos 5 itens)
  const recentActivity = mediaItems
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  // Top 3 melhor avaliados
  const topRated = mediaItems
    .filter(item => item.rating && item.rating >= 8)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero Stats - Informações principais em destaque */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/10">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="text-purple-400" size={20} />
          Visão Geral
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
              <Clock className="text-cyan-400" size={20} />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">{totalHours}</p>
            <p className="text-xs sm:text-sm text-slate-400">Horas Totais</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-400" size={20} />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">{totalCompleted}</p>
            <p className="text-xs sm:text-sm text-slate-400">Concluídos</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
              <Star className="text-yellow-400" size={20} />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">{avgRating.toFixed(1)}</p>
            <p className="text-xs sm:text-sm text-slate-400">Nota Média</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-full flex items-center justify-center">
              <Play className="text-purple-400" size={20} />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">{totalInProgress}</p>
            <p className="text-xs sm:text-sm text-slate-400">Em Progresso</p>
          </div>
        </div>
      </div>

      {/* Seção de atividade dividida em duas colunas no desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Atividade Recente */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/10">
          <h4 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="text-cyan-400" size={18} />
            Atividade Recente
          </h4>
          
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-lg hover:bg-slate-800/60 transition-colors">
                  <div className="w-10 h-12 sm:w-12 sm:h-16 bg-slate-700 rounded overflow-hidden flex-shrink-0">
                    {item.cover ? (
                      <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <BookOpen size={14} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm line-clamp-1">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        item.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
                        item.status === 'planned' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {item.status === 'completed' ? 'Concluído' :
                         item.status === 'in-progress' ? 'Em Progresso' :
                         item.status === 'planned' ? 'Planejado' : 'Abandonado'}
                      </span>
                      {item.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="text-yellow-400" size={12} fill="currentColor" />
                          <span className="text-white text-xs">{item.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <BookOpen className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Nenhum item na biblioteca</p>
              </div>
            )}
          </div>
        </div>

        {/* Melhores Avaliações */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/10">
          <h4 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Star className="text-yellow-400" size={18} />
            Melhores Avaliações
          </h4>
          
          <div className="space-y-3">
            {topRated.length > 0 ? (
              topRated.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-lg border border-yellow-500/20">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="w-10 h-12 sm:w-12 sm:h-16 bg-slate-700 rounded overflow-hidden flex-shrink-0">
                    {item.cover ? (
                      <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <Star size={14} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm line-clamp-1">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-400" size={12} fill="currentColor" />
                        <span className="text-white text-sm font-semibold">{item.rating}</span>
                      </div>
                      <span className="text-slate-400 text-xs">
                        {mediaTypeLabels[item.type]}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Star className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Nenhum item avaliado</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews e Marcos - Seção inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Reviews Recentes */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/10">
          <h4 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <MessageSquare className="text-purple-400" size={18} />
            Reviews Recentes
          </h4>
          
          <div className="space-y-3">
            {reviews.length > 0 ? (
              reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="p-3 bg-slate-800/40 rounded-lg">
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
              <div className="text-center py-6">
                <MessageSquare className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Nenhuma review escrita</p>
              </div>
            )}
          </div>
        </div>

        {/* Marcos da Jornada */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/10">
          <h4 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy className="text-indigo-400" size={18} />
            Marcos da Jornada
          </h4>
          
          <div className="space-y-3">
            {milestones.length > 0 ? (
              milestones.slice(0, 3).map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">{milestone.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">{milestone.title}</p>
                    <p className="text-slate-400 text-xs">{new Date(milestone.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Trophy className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Nenhum marco registrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
