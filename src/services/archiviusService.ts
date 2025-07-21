// Serviço avançado para Archivius com recomendações inteligentes

interface SmartSuggestion {
  id: string;
  text: string;
  emoji: string;
  category: 'recommendation' | 'analysis' | 'discovery' | 'motivation';
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
}

export class ArchiviusService {
  // Sugestões inteligentes pré-estabelecidas
  private smartSuggestions: SmartSuggestion[] = [
    {
      id: 'personalized_rec',
      text: 'Forje uma recomendação épica baseada em todas as minhas conquistas',
      emoji: '⚔️',
      category: 'recommendation',
      prompt: 'Analise todo meu histórico de mídia, reviews e padrões de consumo. Com base nisso, me recomende 3 títulos que seriam perfeitos para mim, explicando por que cada um se alinha com meus gostos únicos.',
      requiresContext: true
    },
    {
      id: 'hidden_gems',
      text: 'Revele joias ocultas que combinam com meu perfil',
      emoji: '💎',
      category: 'discovery',
      prompt: 'Com base no meu histórico e preferências, encontre títulos menos conhecidos ou subestimados que seriam perfeitos para mim. Quero descobrir obras que poucos conhecem mas que eu adoraria.',
      requiresContext: true
    },
    {
      id: 'mood_recommendation',
      text: 'Sugira algo perfeito para meu humor atual',
      emoji: '🌙',
      category: 'recommendation',
      prompt: 'Baseado no meu histórico recente e padrões de consumo, sugira algo que seja perfeito para meu estado de espírito atual. Considere se estou numa fase de exploração, nostalgia, ou buscando algo novo.',
      requiresContext: true
    },
    {
      id: 'completion_strategy',
      text: 'Crie uma estratégia para completar minha lista de pendências',
      emoji: '📋',
      category: 'analysis',
      prompt: 'Analise minha lista de mídias em progresso e planejadas. Crie uma estratégia personalizada para eu conseguir completar mais títulos, considerando meu tempo disponível e padrões de consumo.',
      requiresContext: true
    },
    {
      id: 'genre_exploration',
      text: 'Guie-me para explorar um novo território inexplorado',
      emoji: '🗺️',
      category: 'discovery',
      prompt: 'Baseado no que já consumi, identifique gêneros ou tipos de mídia que eu ainda não explorei mas que provavelmente adoraria. Me guie para uma nova descoberta épica.',
      requiresContext: true
    },
    {
      id: 'profile_insights',
      text: 'Desvende os segredos ocultos do meu perfil geek',
      emoji: '🔍',
      category: 'analysis',
      prompt: 'Faça uma análise profunda do meu perfil. Revele padrões ocultos, tendências interessantes e insights sobre meu comportamento como consumidor de entretenimento que eu talvez não tenha percebido.',
      requiresContext: true
    },
    {
      id: 'seasonal_rec',
      text: 'Recomende algo perfeito para a época atual',
      emoji: '🌸',
      category: 'recommendation',
      prompt: 'Considerando a época do ano atual e meu histórico, recomende algo que seria perfeito para assistir/jogar/ler agora. Algo que combine com o clima e meu mood sazonal.',
      requiresContext: true
    },
    {
      id: 'social_discovery',
      text: 'Mostre o que pessoas com gostos similares estão curtindo',
      emoji: '👥',
      category: 'discovery',
      prompt: 'Com base no meu perfil, simule recomendações de pessoas que têm gostos similares aos meus. O que alguém com meu perfil estaria curtindo agora?',
      requiresContext: true
    },
    {
      id: 'challenge_mode',
      text: 'Crie um desafio épico personalizado para mim',
      emoji: '🏆',
      category: 'motivation',
      prompt: 'Baseado no meu histórico e padrões, crie um desafio personalizado e divertido para os próximos 30 dias. Algo que me motive a descobrir coisas novas dentro do meu perfil de gosto.',
      requiresContext: true
    },
    {
      id: 'nostalgia_trip',
      text: 'Leve-me numa jornada nostálgica personalizada',
      emoji: '🕰️',
      category: 'discovery',
      prompt: 'Baseado no que mais gostei no passado, me leve numa viagem nostálgica. Recomende algo que desperte memórias afetivas ou que tenha a mesma magia das coisas que mais amei.',
      requiresContext: true
    },
    {
      id: 'upgrade_favorites',
      text: 'Encontre versões melhoradas dos meus favoritos',
      emoji: '⬆️',
      category: 'recommendation',
      prompt: 'Analise meus títulos favoritos e encontre obras que são como "versões melhoradas" ou "evoluções naturais" deles. Algo que capture a mesma essência mas eleve a experiência.',
      requiresContext: true
    },
    {
      id: 'productivity_boost',
      text: 'Sugira algo que combine entretenimento com crescimento pessoal',
      emoji: '🚀',
      category: 'motivation',
      prompt: 'Com base no meu perfil, recomende algo que seja simultaneamente divertido e enriquecedor. Títulos que me entretenham mas também me façam crescer como pessoa.',
      requiresContext: true
    }
  ];

  // Análise inteligente do perfil do usuário
  analyzeUserProfile(mediaItems: any[], reviews: any[], settings: any): UserAnalysis {
    const completedItems = mediaItems.filter(item => item.status === 'completed');
    const genres = completedItems.map(item => item.type);
    const genreCount = genres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const dominantGenres = Object.entries(genreCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);

    const ratings = reviews.map(review => review.rating).filter(r => r > 0);
    const averageRating = ratings.length > 0 ? 
      ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0;

    const completionRate = mediaItems.length > 0 ? 
      (completedItems.length / mediaItems.length) * 100 : 0;

    // Análise de tendências recentes (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentItems = completedItems.filter(item => 
      new Date(item.updatedAt) > thirtyDaysAgo
    );
    const recentTrends = [...new Set(recentItems.map(item => item.type))];

    // Determinação do tipo de personalidade baseado nos dados
    let personalityType = 'Explorador'; // default
    if (completionRate > 80) personalityType = 'Completista';
    else if (averageRating > 4) personalityType = 'Perfeccionista';
    else if (dominantGenres.length > 2) personalityType = 'Explorador';
    else if (recentItems.length > 5) personalityType = 'Consumidor Voraz';

    // Preferência de duração baseada no histórico
    const preferredLength = completedItems.length > 10 ? 
      (completionRate > 70 ? 'Projetos Longos' : 'Experiências Rápidas') : 
      'Ainda Descobrindo';

    return {
      dominantGenres,
      averageRating: Math.round(averageRating * 10) / 10,
      completionRate: Math.round(completionRate),
      recentTrends,
      personalityType,
      preferredLength
    };
  }

  // Obter sugestões baseadas no perfil do usuário
  getSmartSuggestions(userAnalysis: UserAnalysis, category?: string): SmartSuggestion[] {
    let suggestions = this.smartSuggestions;
    
    if (category) {
      suggestions = suggestions.filter(s => s.category === category);
    }

    // Personalizar sugestões baseado no perfil
    return suggestions.map(suggestion => ({
      ...suggestion,
      text: this.personalizeText(suggestion.text, userAnalysis)
    }));
  }

  // Personalizar texto da sugestão baseado no perfil
  private personalizeText(text: string, analysis: UserAnalysis): string {
    const replacements: Record<string, string> = {
      'conquistas': `conquistas em ${analysis.dominantGenres[0] || 'entretenimento'}`,
      'perfil': `perfil de ${analysis.personalityType.toLowerCase()}`,
      'gostos': `gostos refinados (${analysis.averageRating}⭐ de média)`,
      'território': `território além de ${analysis.dominantGenres.join(' e ')}`,
      'desafio': `desafio para ${analysis.personalityType.toLowerCase()}`
    };

    let personalizedText = text;
    Object.entries(replacements).forEach(([key, value]) => {
      const regex = new RegExp(key, 'gi');
      personalizedText = personalizedText.replace(regex, value);
    });

    return personalizedText;
  }

  // Gerar contexto enriquecido para a IA
  generateEnhancedContext(mediaItems: any[], reviews: any[], settings: any, milestones: any[]) {
    const analysis = this.analyzeUserProfile(mediaItems, reviews, settings);
    
    return {
      // Dados básicos (existente)
      totalMedia: mediaItems.length,
      completedMedia: mediaItems.filter(item => item.status === 'completed').length,
      averageRating: analysis.averageRating,
      totalReviews: reviews.length,

      // Análise avançada
      userAnalysis: analysis,
      
      // Dados detalhados por categoria
      mediaByType: this.groupMediaByType(mediaItems),
      reviewInsights: this.analyzeReviews(reviews),
      
      // Padrões temporais
      activityPatterns: this.analyzeActivityPatterns(mediaItems, reviews),
      
      // Marcos importantes
      achievements: milestones.slice(0, 5),
      
      // Preferências extraídas
      extractedPreferences: this.extractPreferences(mediaItems, reviews),
      
      // Contexto do usuário
      userContext: {
        name: settings.name,
        bio: settings.bio,
        personality: analysis.personalityType,
        dominantGenres: analysis.dominantGenres
      }
    };
  }

  private groupMediaByType(mediaItems: any[]) {
    const grouped = mediaItems.reduce((acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push({
        title: item.title,
        status: item.status,
        rating: item.rating,
        tags: item.tags
      });
      return acc;
    }, {} as Record<string, any[]>);

    return Object.entries(grouped).map(([type, items]) => ({
      type,
      count: items.length,
      completed: items.filter(i => i.status === 'completed').length,
      averageRating: this.calculateAverage(items.map(i => i.rating).filter(r => r > 0)),
      topTags: this.getTopTags(items.flatMap(i => i.tags || []))
    }));
  }

  private analyzeReviews(reviews: any[]) {
    if (reviews.length === 0) return null;

    const ratings = reviews.map(r => r.rating).filter(r => r > 0);
    const favoriteReviews = reviews.filter(r => r.isFavorite);
    
    return {
      totalReviews: reviews.length,
      averageRating: this.calculateAverage(ratings),
      favoritesCount: favoriteReviews.length,
      reviewFrequency: reviews.length > 0 ? 'Regular' : 'Ocasional',
      sentiment: ratings.length > 0 ? (this.calculateAverage(ratings) > 3.5 ? 'Positivo' : 'Crítico') : 'Neutro'
    };
  }

  private analyzeActivityPatterns(mediaItems: any[], reviews: any[]) {
    const recentActivity = [...mediaItems, ...reviews]
      .filter(item => item.updatedAt || item.createdAt)
      .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
      .slice(0, 10);

    return {
      recentActivityCount: recentActivity.length,
      lastActivity: recentActivity[0] ? new Date(recentActivity[0].updatedAt || recentActivity[0].createdAt) : null,
      activityFrequency: this.calculateActivityFrequency(recentActivity)
    };
  }

  private extractPreferences(mediaItems: any[], reviews: any[]) {
    const allTags = mediaItems.flatMap(item => item.tags || []);
    const topTags = this.getTopTags(allTags);
    
    const highRatedItems = mediaItems.filter(item => item.rating >= 4);
    const preferredTypes = [...new Set(highRatedItems.map(item => item.type))];

    return {
      favoriteGenres: topTags.slice(0, 5),
      preferredTypes,
      typicalRating: this.calculateAverage(reviews.map(r => r.rating).filter(r => r > 0))
    };
  }

  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return Math.round((numbers.reduce((sum, n) => sum + n, 0) / numbers.length) * 10) / 10;
  }

  private getTopTags(tags: string[]): string[] {
    const tagCount = tags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(tagCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag]) => tag);
  }

  private calculateActivityFrequency(recentActivity: any[]): string {
    if (recentActivity.length === 0) return 'Inativo';
    if (recentActivity.length >= 5) return 'Muito Ativo';
    if (recentActivity.length >= 3) return 'Ativo';
    return 'Moderado';
  }
}

export const archiviusService = new ArchiviusService();
