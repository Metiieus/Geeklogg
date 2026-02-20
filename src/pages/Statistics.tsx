import React from "react";
import { logger } from '../utils/logger';
import {
  BarChart3,
  Clock,
  Star,
  TrendingUp,
  Gamepad2,
  Film,
  Tv,
  Book,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useMedias, useReviews } from "../hooks/queries";
import { MediaType } from "../types";

const mediaTypeIcons: Record<string, any> = {
  game: Gamepad2,
  anime: Sparkles,
  tv: Tv,
  book: Book,
  movie: Film,
  manga: BookOpen,
};

const mediaTypeColors: Record<string, string> = {
  game: "from-blue-500 to-cyan-500",
  anime: "from-pink-500 to-rose-500",
  tv: "from-purple-500 to-violet-500",
  book: "from-green-500 to-emerald-500",
  movie: "from-yellow-500 to-orange-500",
  manga: "from-orange-500 to-red-500",
};

const mediaTypeLabels: Record<string, string> = {
  game: "Jogos",
  anime: "Anime",
  tv: "Séries",
  book: "Livros",
  movie: "Filmes",
  manga: "Mangás",
};

const Statistics: React.FC = () => {
  const { user } = useAuth();
  const { data: mediaItems = [] } = useMedias(user?.uid);
  const { data: reviews = [] } = useReviews(user?.uid);

  const getMediaStats = () => {
    const stats: Record<
      string,
      { count: number; hours: number; avgRating: number; completed: number }
    > = {
      game: { count: 0, hours: 0, avgRating: 0, completed: 0 },
      anime: { count: 0, hours: 0, avgRating: 0, completed: 0 },
      tv: { count: 0, hours: 0, avgRating: 0, completed: 0 },
      book: { count: 0, hours: 0, avgRating: 0, completed: 0 },
      movie: { count: 0, hours: 0, avgRating: 0, completed: 0 },
      manga: { count: 0, hours: 0, avgRating: 0, completed: 0 },
    };

    mediaItems.forEach((item) => {
      // Normalizar se necessário / garantir type
      // Assumindo que item.type validou no MediaType ou fallback
      let type = item.type as string;
      // Compatibilidade com dados legados que podem estar no plural ou incorretos
      if (type === 'books') type = 'book';
      if (type === 'games') type = 'game';
      if (type === 'movies') type = 'movie';
      if (type === 'series') type = 'tv';

      if (!stats[type]) {
        // Fallback se type não estiver no map (e.g. legacy data)
        // logger.warn(`Tipo não mapeado: ${type}`);
        return;
      }

      stats[type].count++;
      stats[type].hours += item.hoursSpent || 0;
      if (item.rating) {
        const currentAvg = stats[type].avgRating;
        const currentCount = stats[type].count;
        stats[type].avgRating =
          currentCount === 1
            ? item.rating
            : (currentAvg * (currentCount - 1) + item.rating) / currentCount;
      }
      if (item.status === "completed") {
        stats[type].completed++;
      }
    });

    return stats;
  };

  const getTotalStats = () => {
    // Separar horas (jogos, filmes, séries) de páginas (livros/mangas)
    const totalHours = mediaItems
      .filter((item) => item.type !== "book" && item.type !== "manga")
      .reduce((sum, item) => sum + (item.hoursSpent || 0), 0);

    const totalPages = mediaItems
      .filter((item) => item.type === "book" || item.type === "manga")
      .reduce((sum, item) => sum + (item.hoursSpent || 0), 0);

    const totalCompleted = mediaItems.filter(
      (item) => item.status === "completed",
    ).length;
    const ratedItems = mediaItems.filter((item) => item.rating);
    const avgRating =
      ratedItems.length > 0
        ? ratedItems.reduce((sum, item) => sum + (item.rating || 0), 0) /
        ratedItems.length
        : 0;

    return {
      totalHours,
      totalPages,
      totalCompleted,
      avgRating,
      totalItems: mediaItems.length,
    };
  };

  const getTopRated = () => {
    return mediaItems
      .filter((item) => item.rating)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);
  };

  const getMostPlayed = () => {
    return mediaItems
      .filter((item) => item.hoursSpent)
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
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
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
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
          Estatísticas
        </h1>
        <p className="text-slate-400 text-sm md:text-base">
          Insights sobre seu consumo de mídia e preferências
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 animate-slide-up relative z-10">
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-blue-500/20 hover:scale-[1.02] md:hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg">
              <Clock className="text-blue-400" size={16} />
            </div>
            <span className="text-blue-400 font-medium text-xs sm:text-sm md:text-base hidden sm:inline">
              Total de Horas
            </span>
            <span className="text-blue-400 font-medium text-xs sm:hidden">
              Horas
            </span>
          </div>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            {totalStats.totalHours.toLocaleString()}
          </p>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 hidden sm:block">
            Jogos, filmes e séries
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-purple-500/20 hover:scale-[1.02] md:hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 bg-purple-500/20 rounded-lg">
              <BookOpen className="text-purple-400" size={16} />
            </div>
            <span className="text-purple-400 font-medium text-xs sm:text-sm md:text-base hidden sm:inline">
              Páginas Lidas
            </span>
            <span className="text-purple-400 font-medium text-xs sm:hidden">
              Páginas
            </span>
          </div>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            {totalStats.totalPages.toLocaleString()}
          </p>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 hidden sm:block">
            Livros
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-green-500/20 hover:scale-[1.02] md:hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="text-green-400" size={16} />
            </div>
            <span className="text-green-400 font-medium text-xs sm:text-sm md:text-base">
              Concluídos
            </span>
          </div>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            {totalStats.totalCompleted}
          </p>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            De {totalStats.totalItems}
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-yellow-500/20 hover:scale-[1.02] md:hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 bg-yellow-500/20 rounded-lg">
              <Star className="text-yellow-400" size={16} />
            </div>
            <span className="text-yellow-400 font-medium text-xs sm:text-sm md:text-base hidden sm:inline">
              Nota Média
            </span>
            <span className="text-yellow-400 font-medium text-xs sm:hidden">
              Nota
            </span>
          </div>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            {totalStats.avgRating.toFixed(1)}
          </p>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">De 10</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-purple-500/20 hover:scale-[1.02] md:hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 bg-purple-500/20 rounded-lg">
              <BarChart3 className="text-purple-400" size={16} />
            </div>
            <span className="text-purple-400 font-medium text-xs sm:text-sm md:text-base">
              Resenhas
            </span>
          </div>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            {reviews.length}
          </p>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 hidden sm:block">
            Escritas
          </p>
        </div>
      </div>

      {/* Media Type Breakdown */}
      <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 sm:p-6 border border-white/10 animate-slide-in-left hover:scale-[1.01] md:hover:scale-105 transition-all duration-300 relative z-10">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
          Por Tipo de Mídia
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 animate-fade-in">
          {Object.entries(mediaStats).map(([type, stats]) => {
            const Icon = mediaTypeIcons[type as MediaType];
            // Skip if Icon is undefined (unknown media type)
            if (!Icon) return null;

            return (
              <div
                key={type}
                className={`bg-gradient-to-br ${mediaTypeColors[type as MediaType]}/5 backdrop-blur-sm rounded-lg md:rounded-xl p-2 sm:p-3 md:p-4 border border-gray-700/50 hover:scale-[1.02] md:hover:scale-105 transition-all duration-300 hover:shadow-lg`}
              >
                <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                  <Icon
                    size={20}
                    className="text-white w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5"
                  />
                  <span className="text-white font-medium text-xs sm:text-sm">
                    {mediaTypeLabels[type as MediaType]}
                  </span>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-xs sm:text-sm">
                      Total
                    </span>
                    <span className="text-white font-medium text-xs sm:text-sm">
                      {stats.count}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-xs sm:text-sm">
                      {type === 'book' || type === 'manga' ? 'Páginas' : 'Horas'}
                    </span>
                    <span className="text-white font-medium text-xs sm:text-sm">
                      {stats.hours.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-xs sm:text-sm">
                      ✅
                    </span>
                    <span className="text-white font-medium text-xs sm:text-sm">
                      {stats.completed}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-xs sm:text-sm">
                      ⭐
                    </span>
                    <span className="text-white font-medium text-xs sm:text-sm">
                      {stats.avgRating.toFixed(1)}
                    </span>
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
        <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Star className="text-yellow-400" size={20} />
            Melhor Avaliados
          </h2>

          <div className="space-y-4">
            {topRated.length > 0 ? (
              topRated.map((item, index) => {
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors duration-200"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                      {index + 1}
                    </div>
                    <div className="w-8 h-10 sm:w-10 sm:h-12 bg-slate-700 rounded overflow-hidden flex-shrink-0">
                      {item.cover ? (
                        <img
                          src={item.cover}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-xs sm:text-sm line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-slate-400 text-xs hidden sm:block">
                        {mediaTypeLabels[item.type] || item.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                      <Star
                        className="text-yellow-400 w-3 h-3 sm:w-3.5 sm:h-3.5"
                        fill="currentColor"
                      />
                      <span className="text-white font-medium text-xs sm:text-sm">
                        {item.rating}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-400 text-center py-4">
                Nenhum item avaliado ainda
              </p>
            )}
          </div>
        </div>

        {/* Most Time Spent */}
        <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Clock className="text-blue-400" size={20} />
            Mais Tempo Gasto
          </h2>

          <div className="space-y-4">
            {mostPlayed.length > 0 ? (
              mostPlayed.map((item, index) => {
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors duration-200"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                      {index + 1}
                    </div>
                    <div className="w-8 h-10 sm:w-10 sm:h-12 bg-slate-700 rounded overflow-hidden flex-shrink-0">
                      {item.cover ? (
                        <img
                          src={item.cover}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          <Clock className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-xs sm:text-sm line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-slate-400 text-xs hidden sm:block">
                        {mediaTypeLabels[item.type] || item.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                      <Clock className="text-blue-400 w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="text-white font-medium text-xs sm:text-sm">
                        {item.hoursSpent}h
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-400 text-center py-4">
                Nenhum dado de tempo ainda
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
