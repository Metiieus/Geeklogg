/**
 * Recommendations Service - Sistema de recomendações personalizadas
 * Analisa o histórico do usuário e sugere mídias relevantes
 */

import { MediaItem } from '../types';

export interface Recommendation {
  id: string;
  media: MediaItem;
  reason: string;
  score: number;
  category: 'continue' | 'similar' | 'abandoned' | 'trending' | 'hidden';
}

/**
 * Gera recomendações personalizadas baseadas no histórico do usuário
 */
export const generateRecommendations = (mediaItems: MediaItem[]): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  // 1. Continue Watching/Reading (Em Progresso)
  const inProgress = mediaItems
    .filter((item) => item.status === 'in-progress')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  inProgress.forEach((item) => {
    recommendations.push({
      id: `continue-${item.id}`,
      media: item,
      reason: 'Continue de onde parou',
      score: 100,
      category: 'continue',
    });
  });

  // 2. Baseado no que você gostou (Ratings altos)
  const highRated = mediaItems
    .filter((item) => item.rating && item.rating >= 8)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));

  if (highRated.length > 0) {
    // Encontra mídias similares (mesma categoria)
    const favoriteTypes = new Map<string, number>();
    highRated.forEach((item) => {
      favoriteTypes.set(item.type, (favoriteTypes.get(item.type) || 0) + 1);
    });

    const mostLikedType = Array.from(favoriteTypes.entries()).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0];

    if (mostLikedType) {
      const similar = mediaItems
        .filter(
          (item) =>
            item.type === mostLikedType &&
            item.status === 'planned' &&
            !highRated.includes(item)
        )
        .slice(0, 2);

      similar.forEach((item) => {
        recommendations.push({
          id: `similar-${item.id}`,
          media: item,
          reason: `Você adorou outros ${getCategoryLabel(mostLikedType)}`,
          score: 90,
          category: 'similar',
        });
      });
    }
  }

  // 3. Abandonados que valem a pena (Dropped com rating alto)
  const worthyDropped = mediaItems
    .filter((item) => item.status === 'dropped' && item.rating && item.rating >= 7)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 2);

  worthyDropped.forEach((item) => {
    recommendations.push({
      id: `abandoned-${item.id}`,
      media: item,
      reason: `Você deu nota ${item.rating}/10 - Vale a pena retomar!`,
      score: 80,
      category: 'abandoned',
    });
  });

  // 4. Trending na sua biblioteca (Mais atualizados recentemente)
  const recentlyUpdated = mediaItems
    .filter((item) => {
      const daysSinceUpdate = getDaysSince(new Date(item.updatedAt));
      return daysSinceUpdate <= 7 && item.status === 'completed';
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 2);

  recentlyUpdated.forEach((item) => {
    recommendations.push({
      id: `trending-${item.id}`,
      media: item,
      reason: 'Completado recentemente',
      score: 70,
      category: 'trending',
    });
  });

  // 5. Escondidos na biblioteca (Não visualizados há muito tempo)
  const hidden = mediaItems
    .filter((item) => {
      const daysSinceUpdate = getDaysSince(new Date(item.updatedAt));
      return daysSinceUpdate > 90 && item.status === 'planned';
    })
    .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
    .slice(0, 2);

  hidden.forEach((item) => {
    const daysSince = getDaysSince(new Date(item.updatedAt));
    recommendations.push({
      id: `hidden-${item.id}`,
      media: item,
      reason: `Adicionado há ${daysSince} dias - Que tal começar?`,
      score: 60,
      category: 'hidden',
    });
  });

  // Ordena por score e retorna top 8
  return recommendations.sort((a, b) => b.score - a.score).slice(0, 8);
};

/**
 * Filtra recomendações por categoria
 */
export const getRecommendationsByCategory = (
  recommendations: Recommendation[],
  category: Recommendation['category']
): Recommendation[] => {
  return recommendations.filter((rec) => rec.category === category);
};

/**
 * Obtém label da categoria de recomendação
 */
export const getCategoryLabel = (type: string): string => {
  const labels: Record<string, string> = {
    book: 'livros',
    game: 'jogos',
    movie: 'filmes',
    tv: 'séries',
    anime: 'animes',
  };
  return labels[type] || type;
};

/**
 * Obtém ícone da categoria de recomendação
 */
export const getCategoryIcon = (category: Recommendation['category']): string => {
  const icons: Record<string, string> = {
    continue: '▶️',
    similar: '✨',
    abandoned: '🔄',
    trending: '🔥',
    hidden: '🔍',
  };
  return icons[category] || '📌';
};

/**
 * Obtém cor da categoria de recomendação
 */
export const getCategoryColor = (category: Recommendation['category']): string => {
  const colors: Record<string, string> = {
    continue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    similar: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
    abandoned: 'from-orange-500/20 to-red-500/20 border-orange-500/30',
    trending: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    hidden: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30',
  };
  return colors[category] || 'from-slate-500/20 to-slate-600/20 border-slate-500/30';
};

/**
 * Calcula dias desde uma data
 */
const getDaysSince = (date: Date): number => {
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - date.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Gera estatísticas de recomendações
 */
export const getRecommendationStats = (recommendations: Recommendation[]) => {
  const byCategory = recommendations.reduce((acc, rec) => {
    acc[rec.category] = (acc[rec.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total: recommendations.length,
    byCategory,
    topScore: recommendations[0]?.score || 0,
  };
};
