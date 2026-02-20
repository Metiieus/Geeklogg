// Serviço avançado para Archivius com recomendações inteligentes
import { MediaItem, Review, UserSettings } from "../types";

interface SmartSuggestion {
  id: string;
  text: string;
  emoji: string;
  category: "recommendation" | "analysis" | "discovery" | "motivation";
  prompt: string;
  requiresContext: boolean;
}

interface UserAnalysis {
  dominantGenres: string[];
  averageRating: number;
  completionRate: number;
  recentTrends: string[];
  personalityType: string;
  preferredLength: string;
  topTags?: string[];
  favoriteMedia?: any[];
  consumptionPattern?: {
    binge: boolean;
    diverse: boolean;
    focused: boolean;
    explorer: boolean;
  };
  // Precomputed mediaByType and activity patterns to avoid extra passes
  mediaByType?: any[];
  activityPatterns?: any;
}

export class ArchiviusService {
  // Sugestões inteligentes pré-estabelecidas
  private smartSuggestions: SmartSuggestion[] = [
    {
      id: "personalized_rec",
      text: "Me recomenda algo baseado no que eu já tenho",
      emoji: "🎯",
      category: "recommendation",
      prompt:
        "Olha minha biblioteca e me recomenda 3 títulos que fazem sentido com o que eu já tenho. Explica por que cada um combina com meu perfil, citando títulos específicos que eu já adicionei.",
      requiresContext: true,
    },
    {
      id: "hidden_gems",
      text: "Mostra joias ocultas que combinam comigo",
      emoji: "💎",
      category: "discovery",
      prompt:
        "Baseado no que eu curto, me mostra títulos menos conhecidos que eu provavelmente adoraria. Quero descobrir coisas que pouca gente conhece mas que fazem meu estilo.",
      requiresContext: true,
    },
    {
      id: "mood_recommendation",
      text: "Recomenda algo pro meu mood atual",
      emoji: "🌙",
      category: "recommendation",
      prompt:
        "Olha o que eu tenho jogado/assistido recentemente e sugere algo que combina com meu mood atual. Considera se eu tô numa vibe de exploração, nostalgia, ou querendo algo novo.",
      requiresContext: true,
    },
    {
      id: "completion_strategy",
      text: "Me ajuda a completar minha lista de pendências",
      emoji: "📋",
      category: "analysis",
      prompt:
        "Olha o que eu tenho em progresso e planejado. Me dá uma estratégia pra eu conseguir completar mais coisas, considerando meu tempo e como eu costumo consumir conteúdo.",
      requiresContext: true,
    },
    {
      id: "genre_exploration",
      text: "Me ajuda a explorar novos gêneros",
      emoji: "🗺️",
      category: "discovery",
      prompt:
        "Olha o que eu já curti e identifica gêneros ou tipos de mídia que eu ainda não explorei mas que provavelmente adoraria. Me guia pra uma nova descoberta.",
      requiresContext: true,
    },
    {
      id: "profile_insights",
      text: "Analisa meu perfil e me dá uns insights",
      emoji: "🔍",
      category: "analysis",
      prompt:
        "Faça uma análise profunda do meu perfil. Revele padrões ocultos, tendências interessantes e insights sobre meu comportamento como consumidor de entretenimento que eu talvez não tenha percebido.",
      requiresContext: true,
    },
    {
      id: "seasonal_rec",
      text: "Recomende algo perfeito para a época atual",
      emoji: "🌸",
      category: "recommendation",
      prompt:
        "Considerando a época do ano atual e meu histórico, recomende algo que seria perfeito para assistir/jogar/ler agora. Algo que combine com o clima e meu mood sazonal.",
      requiresContext: true,
    },
    {
      id: "social_discovery",
      text: "Mostre o que pessoas com gostos similares estão curtindo",
      emoji: "👥",
      category: "discovery",
      prompt:
        "Com base no meu perfil, simule recomendações de pessoas que têm gostos similares aos meus. O que alguém com meu perfil estaria curtindo agora?",
      requiresContext: true,
    },
    {
      id: "challenge_mode",
      text: "Crie um desafio épico personalizado para mim",
      emoji: "🏆",
      category: "motivation",
      prompt:
        "Baseado no meu histórico e padrões, crie um desafio personalizado e divertido para os próximos 30 dias. Algo que me motive a descobrir coisas novas dentro do meu perfil de gosto.",
      requiresContext: true,
    },
    {
      id: "nostalgia_trip",
      text: "Leve-me numa jornada nostálgica personalizada",
      emoji: "🕰️",
      category: "discovery",
      prompt:
        "Baseado no que mais gostei no passado, me leve numa viagem nostálgica. Recomende algo que desperte memórias afetivas ou que tenha a mesma magia das coisas que mais amei.",
      requiresContext: true,
    },
    {
      id: "upgrade_favorites",
      text: "Encontre versões melhoradas dos meus favoritos",
      emoji: "⬆️",
      category: "recommendation",
      prompt:
        'Analise meus títulos favoritos e encontre obras que são como "versões melhoradas" ou "evoluções naturais" deles. Algo que capture a mesma essência mas eleve a experiência.',
      requiresContext: true,
    },
    {
      id: "productivity_boost",
      text: "Sugira algo que combine entretenimento com crescimento pessoal",
      emoji: "🚀",
      category: "motivation",
      prompt:
        "Com base no meu perfil, recomende algo que seja simultaneamente divertido e enriquecedor. Títulos que me entretenham mas também me façam crescer como pessoa.",
      requiresContext: true,
    },
  ];

  // Análise inteligente e profunda do perfil do usuário
  analyzeUserProfile(
    mediaItems: MediaItem[],
    reviews: Review[],
    settings: UserSettings,
  ): UserAnalysis {
    // Single-pass aggregation to avoid multiple loops over mediaItems
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    const stats = {
      total: 0,
      completedCount: 0,
      genreCount: {} as Record<string, number>,
      tagCount: {} as Record<string, number>,
      mediaByTypeMap: {} as Record<string, any[]>,
      ratingsSum: 0,
      ratingsCount: 0,
      recentTypes: new Set<string>(),
      favoriteMedia: [] as any[],
      inProgressCount: 0,
    };

    for (const item of mediaItems) {
      stats.total++;
      const updatedAt = new Date(item.updatedAt || item.createdAt).getTime();

      // status
      if (item.status === "completed") {
        stats.completedCount++;
        stats.genreCount[item.type] = (stats.genreCount[item.type] || 0) + 1;
      } else if (item.status === "in-progress") {
        stats.inProgressCount++;
      }

      // tags
      if (item.tags && item.tags.length) {
        for (const t of item.tags) stats.tagCount[t] = (stats.tagCount[t] || 0) + 1;
      }

      // group by type
      if (!stats.mediaByTypeMap[item.type]) stats.mediaByTypeMap[item.type] = [];
      stats.mediaByTypeMap[item.type].push(item);

      // recent
      if (!isNaN(updatedAt) && updatedAt > thirtyDaysAgo) {
        stats.recentTypes.add(item.type);
      }

      // rating
      if (typeof item.rating === "number" && item.rating > 0) {
        stats.ratingsSum += item.rating;
        stats.ratingsCount++;
      }

      // favorites
      if ((item.rating || 0) >= 4 || item.isFavorite) stats.favoriteMedia.push(item);
    }

    // derive values
    const averageRating = stats.ratingsCount ? stats.ratingsSum / stats.ratingsCount : 0;
    const completionRate = stats.total ? (stats.completedCount / stats.total) * 100 : 0;

    const dominantGenres = Object.entries(stats.genreCount)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([genre]) => genre);

    const topTags = Object.entries(stats.tagCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag]) => tag)
      .slice(0, 5);

    const recentTrends = Array.from(stats.recentTypes);

    // personality heuristics
    let personalityType = "Explorador";
    if (completionRate > 80) personalityType = "Completista";
    else if (averageRating > 4) personalityType = "Perfeccionista";
    else if (dominantGenres.length > 2) personalityType = "Explorador";
    else if (recentTrends.length > 5) personalityType = "Consumidor Voraz";

    const preferredLength =
      stats.completedCount > 10
        ? completionRate > 70
          ? "Projetos Longos"
          : "Experiências Rápidas"
        : "Ainda Descobrindo";

    // mediaByType summary (derived from map)
    const mediaByType = Object.entries(stats.mediaByTypeMap).map(([type, items]) => {
      const ratings = items.map((i: any) => i.rating).filter((r: number) => r > 0);
      const avg = ratings.length ? Math.round((ratings.reduce((s: number, n: number) => s + n, 0) / ratings.length) * 10) / 10 : 0;
      const topTagsLocal: Record<string, number> = {};
      for (const it of items) for (const t of it.tags || []) topTagsLocal[t] = (topTagsLocal[t] || 0) + 1;
      return {
        type,
        count: items.length,
        completed: items.filter((i: any) => i.status === "completed").length,
        averageRating: avg,
        topTags: Object.entries(topTagsLocal).sort(([, a], [, b]) => b - a).slice(0, 5).map(([t]) => t),
        items,
      };
    });

    const favoriteMedia = stats.favoriteMedia
      .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 10)
      .map((item: any) => ({ title: item.title, type: item.type, rating: item.rating, tags: item.tags || [] }));

    const consumptionPattern = {
      binge: stats.completedCount > 20,
      diverse: Object.keys(stats.mediaByTypeMap).length >= 3,
      focused: Object.keys(stats.mediaByTypeMap).length <= 2,
      explorer: stats.inProgressCount > 5,
    };

    return {
      dominantGenres,
      averageRating: Math.round(averageRating * 10) / 10,
      completionRate: Math.round(completionRate),
      recentTrends,
      personalityType,
      preferredLength,
      topTags,
      favoriteMedia,
      consumptionPattern,
      mediaByType,
      activityPatterns: {
        recentActivityCount: Math.min(10, stats.total),
        lastActivity: mediaItems.length ? new Date(mediaItems[mediaItems.length - 1].updatedAt || mediaItems[mediaItems.length - 1].createdAt) : null,
        activityFrequency: this.calculateActivityFrequency([]),
      },
    };
  }

  // Obter sugestões baseadas no perfil do usuário
  getSmartSuggestions(
    userAnalysis: UserAnalysis,
    category?: string,
  ): SmartSuggestion[] {
    let suggestions = this.smartSuggestions;

    if (category) {
      suggestions = suggestions.filter((s) => s.category === category);
    }

    // Personalizar sugestões baseado no perfil
    return suggestions.map((suggestion) => ({
      ...suggestion,
      text: this.personalizeText(suggestion.text, userAnalysis),
    }));
  }

  // Personalizar texto da sugestão baseado no perfil
  private personalizeText(text: string, analysis: UserAnalysis): string {
    const replacements: Record<string, string> = {
      conquistas: `conquistas em ${analysis.dominantGenres[0] || "entretenimento"}`,
      perfil: `perfil de ${analysis.personalityType.toLowerCase()}`,
      gostos: `gostos refinados (${analysis.averageRating}⭐ de média)`,
      território: `território além de ${analysis.dominantGenres.join(" e ")}`,
      desafio: `desafio para ${analysis.personalityType.toLowerCase()}`,
    };

    let personalizedText = text;
    Object.entries(replacements).forEach(([key, value]) => {
      const regex = new RegExp(key, "gi");
      personalizedText = personalizedText.replace(regex, value);
    });

    return personalizedText;
  }

  // Gerar contexto enriquecido para a IA
  generateEnhancedContext(
    mediaItems: any[],
    reviews: any[],
    settings: any,
    milestones: any[],
  ) {
    const analysis = this.analyzeUserProfile(mediaItems, reviews, settings);

    return {
      // Dados básicos (existente)
      totalMedia: mediaItems.length,
      completedMedia: mediaItems.filter((item) => item.status === "completed")
        .length,
      averageRating: analysis.averageRating,
      totalReviews: reviews.length,

      // Análise avançada
      userAnalysis: analysis,

      // Dados detalhados por categoria - reuse precomputed mediaByType from analysis
      mediaByType: analysis.mediaByType || [],
      reviewInsights: this.analyzeReviews(reviews),

      // Padrões temporais - reuse precomputed activity patterns
      activityPatterns: analysis.activityPatterns || {},

      // Marcos importantes
      achievements: milestones.slice(0, 5),

      // Preferências extraídas (topTags, favoriteMedia, consumptionPattern)
      extractedPreferences: {
        favoriteGenres: analysis.topTags || [],
        preferredTypes: (analysis.mediaByType || []).map((m: any) => m.type),
        typicalRating: analysis.averageRating,
      },

      // Contexto do usuário
      userContext: {
        name: settings.name,
        bio: settings.bio,
        personality: analysis.personalityType,
        dominantGenres: analysis.dominantGenres,
      },
    };
  }

  private groupMediaByType(mediaItems: any[]) {
    const grouped = mediaItems.reduce(
      (acc, item) => {
        if (!acc[item.type]) acc[item.type] = [];
        acc[item.type].push({
          title: item.title,
          status: item.status,
          rating: item.rating,
          tags: item.tags,
        });
        return acc;
      },
      {} as Record<string, any[]>,
    );

    return Object.entries(grouped).map(([type, items]) => ({
      type,
      count: (items as any[]).length,
      completed: (items as any[]).filter((i: any) => i.status === "completed").length,
      averageRating: this.calculateAverage(
        (items as any[]).map((i: any) => i.rating).filter((r: number) => r > 0),
      ),
      topTags: this.getTopTags((items as any[]).flatMap((i: any) => i.tags || [])),
      items: (items as any[]), // Adiciona lista de items para IA poder filtrar recomendações
    }));
  }

  private analyzeReviews(reviews: any[]) {
    if (reviews.length === 0) return null;

    const ratings = reviews.map((r) => r.rating).filter((r) => r > 0);
    const favoriteReviews = reviews.filter((r) => r.isFavorite);

    return {
      totalReviews: reviews.length,
      averageRating: this.calculateAverage(ratings),
      favoritesCount: favoriteReviews.length,
      reviewFrequency: reviews.length > 0 ? "Regular" : "Ocasional",
      sentiment:
        ratings.length > 0
          ? this.calculateAverage(ratings) > 3.5
            ? "Positivo"
            : "Crítico"
          : "Neutro",
    };
  }

  private analyzeActivityPatterns(mediaItems: any[], reviews: any[]) {
    const recentActivity = [...mediaItems, ...reviews]
      .filter((item) => item.updatedAt || item.createdAt)
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt).getTime() -
          new Date(a.updatedAt || a.createdAt).getTime(),
      )
      .slice(0, 10);

    return {
      recentActivityCount: recentActivity.length,
      lastActivity: recentActivity[0]
        ? new Date(recentActivity[0].updatedAt || recentActivity[0].createdAt)
        : null,
      activityFrequency: this.calculateActivityFrequency(recentActivity),
    };
  }

  private extractPreferences(mediaItems: any[], reviews: any[]) {
    const allTags = mediaItems.flatMap((item) => item.tags || []);
    const topTags = this.getTopTags(allTags);

    const highRatedItems = mediaItems.filter((item) => item.rating >= 4);
    const preferredTypes = [
      ...new Set(highRatedItems.map((item) => item.type)),
    ];

    return {
      favoriteGenres: topTags.slice(0, 5),
      preferredTypes,
      typicalRating: this.calculateAverage(
        reviews.map((r) => r.rating).filter((r) => r > 0),
      ),
    };
  }

  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return (
      Math.round(
        (numbers.reduce((sum, n) => sum + n, 0) / numbers.length) * 10,
      ) / 10
    );
  }

  private getTopTags(tags: string[]): string[] {
    const tagCount = tags.reduce(
      (acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(tagCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag]) => tag);
  }

  private calculateActivityFrequency(recentActivity: any[]): string {
    if (recentActivity.length === 0) return "Inativo";
    if (recentActivity.length >= 5) return "Muito Ativo";
    if (recentActivity.length >= 3) return "Ativo";
    return "Moderado";
  }

  // Obter mídias favoritas (rating >= 4 ou marcadas como favoritas)
  private getFavoriteMedia(mediaItems: any[]): any[] {
    return mediaItems
      .filter((item) => item.rating >= 4 || item.isFavorite)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 10)
      .map((item) => ({
        title: item.title,
        type: item.type,
        rating: item.rating,
        tags: item.tags || [],
      }));
  }

  // Analisar padrão de consumo do usuário
  private analyzeConsumptionPattern(mediaItems: any[]): {
    binge: boolean;
    diverse: boolean;
    focused: boolean;
    explorer: boolean;
  } {
    const types = [...new Set(mediaItems.map((item) => item.type))];
    const completedItems = mediaItems.filter(
      (item) => item.status === "completed",
    );
    const inProgressItems = mediaItems.filter(
      (item) => item.status === "in-progress",
    );

    return {
      binge: completedItems.length > 20, // Consome muito conteúdo
      diverse: types.length >= 3, // Consome tipos variados
      focused: types.length <= 2, // Focado em poucos tipos
      explorer: inProgressItems.length > 5, // Explora várias coisas ao mesmo tempo
    };
  }
}

export const archiviusService = new ArchiviusService();
