import React from 'react';
import { BarChart3, Clock, Star, TrendingUp, Gamepad2, Film, Tv, Book, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MediaType } from '../App';

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

const mediaTypeLabels = {
  games: 'Jogos',
  anime: 'Anime',
  series: 'Séries',
  books: 'Livros',
  movies: 'Filmes'
};

const Statistics: React.FC = () => {
  const { mediaItems, reviews } = useAppContext();

  const getMediaStats = () => {
    const stats: Record<MediaType, { count: number; hours: number; avgRating: number; completed: number }> = {
      games: { count: 0, hours: 0, avgRating: 0, completed: 0 },
      anime: { count: 0, hours: 0, avgRating: 0, completed: 0 },
      series: { count: 0, hours: 0, avgRating: 0, completed: 0 },
      books: { count: 0, hours: 0, avgRating: 0, completed: 0 },
      movies: { count: 0, hours: 0, avgRating: 0, completed: 0 }
    };

    mediaItems.forEach(item => {
      stats[item.type].count++;
      stats[item.type].hours += item.hoursSpent || 0;
      if (item.rating) {
        const currentAvg = stats[item.type].avgRating;
        const currentCount = stats[item.type].count;
        stats[item.type].avgRating = currentCount === 1 ? item.rating : (currentAvg * (currentCount - 1) + item.rating) / currentCount;
      }
      if (item.status === 'completed') {
        stats[item.type].completed++;
      }
    });

    return stats;
  };

  const getTotalStats = () => {
    const totalHours = mediaItems.reduce((sum, item) => sum + (item.hoursSpent || 0), 0);
    const totalCompleted = mediaItems.filter(item => item.status === 'completed').length;
    const ratedItems = mediaItems.filter(item => item.rating);
    const avgRating = ratedItems.length > 0 ? ratedItems.reduce((sum, item) => sum + (item.rating || 0), 0) / ratedItems.length : 0;
    
    return { totalHours, totalCompleted, avgRating, totalItems: mediaItems.length };
  };

  const getTopRated = () => {
    return mediaItems
      .filter(item => item.rating)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);
  };

  const getMostPlayed = () => {
    return mediaItems
      .filter(item => item.hoursSpent)
      .sort((a, b) => (b.hoursSpent || 0) - (a.hoursSpent || 0))
      .slice(0, 5);
  };

  const mediaStats = getMediaStats();
  const totalStats = getTotalStats();
  const topRated = getTopRated();
  const mostPlayed = getMostPlayed();

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 space-y-6 md:space-y-8 relative">
      {/* Fragmentos animados no fundo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-cyan-400/20 rounded-full animate-pulse`}
            style={{
              left: `${(i % 5) * 20 + Math.random() * 15}%`,
              top: `${Math.floor(i / 5) * 25 + Math.random() * 20}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${2.5 + Math.random() * 2}s`,
            }}
          />
        ))}
        {[...Array(8)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className={`absolute w-2 h-2 bg-purple-400/15 rounded-full animate-bounce`}
            style={{
              left: `${15 + (i % 3) * 30 + Math.random() * 10}%`,
              top: `${20 + Math.floor(i / 3) * 30 + Math.random() * 15}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${3 + Math.random() * 1.5}s`,
            }}
          />
        ))}
      </div>
      {/* Header */}
      <div className="animate-slide-down relative z-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Estatísticas</h1>
        <p className="text-slate-400 text-sm md:text-base">Insights sobre seu consumo de mídia e preferências</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Clock className="text-blue-400" size={20} />
            </div>
            <span className="text-blue-400 font-medium">Total de Horas</span>
          </div>
          <p className="text-3xl font-bold text-white">{totalStats.totalHours.toLocaleString()}</p>
          <p className="text-slate-400 text-sm mt-1">Tempo investido</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="text-green-400" size={20} />
            </div>
            <span className="text-green-400 font-medium">Concluídos</span>
          </div>
          <p className="text-3xl font-bold text-white">{totalStats.totalCompleted}</p>
          <p className="text-slate-400 text-sm mt-1">De {totalStats.totalItems} total</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Star className="text-yellow-400" size={20} />
            </div>
            <span className="text-yellow-400 font-medium">Nota Média</span>
          </div>
          <p className="text-3xl font-bold text-white">{totalStats.avgRating.toFixed(1)}</p>
          <p className="text-slate-400 text-sm mt-1">De 10</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <BarChart3 className="text-purple-400" size={20} />
            </div>
            <span className="text-purple-400 font-medium">Resenhas</span>
          </div>
          <p className="text-3xl font-bold text-white">{reviews.length}</p>
          <p className="text-slate-400 text-sm mt-1">Escritas</p>
        </div>
      </div>

      {/* Media Type Breakdown */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 animate-slide-in-left hover:scale-105 transition-all duration-300">
        <h2 className="text-xl font-semibold text-white mb-6">Por Tipo de Mídia</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 animate-fade-in">
          {Object.entries(mediaStats).map(([type, stats]) => {
            console.log('Media stats', type, stats);
            const Icon = mediaTypeIcons[type as MediaType];
            return (
              <div key={type} className={`bg-gradient-to-br ${mediaTypeColors[type as MediaType]}/5 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:scale-105 transition-all duration-300 hover:shadow-lg`}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={20} className="text-white" />
                  <span className="text-white font-medium">{mediaTypeLabels[type as MediaType]}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Total</span>
                    <span className="text-white font-medium">{stats.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Horas</span>
                    <span className="text-white font-medium">{stats.hours.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Concluídos</span>
                    <span className="text-white font-medium">{stats.completed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Nota Média</span>
                    <span className="text-white font-medium">{stats.avgRating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Rated */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Star className="text-yellow-400" size={20} />
            Melhor Avaliados
          </h2>
          
          <div className="space-y-4">
            {topRated.length > 0 ? (
              topRated.map((item, index) => {
                console.log('Top rated', item);
                return (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="w-10 h-12 bg-slate-700 rounded overflow-hidden">
                    {item.cover ? (
                      <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <Star size={14} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm line-clamp-1">{item.title}</p>
                    <p className="text-slate-400 text-xs">{mediaTypeLabels[item.type]}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400" size={14} fill="currentColor" />
                    <span className="text-white font-medium">{item.rating}</span>
                  </div>
                </div>
                );
              })
            ) : (
              <p className="text-slate-400 text-center py-4">Nenhum item avaliado ainda</p>
            )}
          </div>
        </div>

        {/* Most Time Spent */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Clock className="text-blue-400" size={20} />
            Mais Tempo Gasto
          </h2>
          
          <div className="space-y-4">
            {mostPlayed.length > 0 ? (
              mostPlayed.map((item, index) => {
                console.log('Most played', item);
                return (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="w-10 h-12 bg-slate-700 rounded overflow-hidden">
                    {item.cover ? (
                      <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <Clock size={14} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm line-clamp-1">{item.title}</p>
                    <p className="text-slate-400 text-xs">{mediaTypeLabels[item.type]}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="text-blue-400" size={14} />
                    <span className="text-white font-medium">{item.hoursSpent}h</span>
                  </div>
                </div>
                );
              })
            ) : (
              <p className="text-slate-400 text-center py-4">Nenhum dado de tempo ainda</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};export default Statistics;
