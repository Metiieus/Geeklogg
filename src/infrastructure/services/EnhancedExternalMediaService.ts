import { MediaType } from "../../domain/entities/Media";
import { 
  externalMediaService as originalService, 
  ExternalMediaResult, 
  SearchParams 
} from "../../services/externalMediaService";
import { igdbService, IGDBSearchResult } from "./IGDBService";

export interface EnhancedSearchParams extends SearchParams {
  includeGames?: boolean;
  gameFilters?: {
    platforms?: string[];
    genres?: string[];
    yearRange?: { min: number; max: number };
    ratingRange?: { min: number; max: number };
  };
}

export interface EnhancedExternalMediaResult extends ExternalMediaResult {
  // Additional fields from IGDB
  platforms?: string[];
  developer?: string;
  publisher?: string;
  screenshots?: string[];
  officialWebsite?: string;
  metacriticScore?: number;
}

class EnhancedExternalMediaService {
  async searchMedia(params: EnhancedSearchParams): Promise<EnhancedExternalMediaResult[]> {
    const { query, type, limit = 10 } = params;

    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      let results: EnhancedExternalMediaResult[] = [];

      // Handle games with IGDB
      if (type === "games") {
        const igdbResults = await this.searchGames(query, limit, params.gameFilters);
        results = igdbResults.map(this.mapIGDBToEnhanced);
      } else {
        // Use original service for other media types
        const originalResults = await originalService.searchMedia({
          query,
          type,
          limit
        });
        results = originalResults.map(this.mapOriginalToEnhanced);
      }

      return results;
    } catch (error) {
      console.error(`Error searching ${type}:`, error);
      
      // Fallback to original service if IGDB fails for games
      if (type === "games") {
        console.warn("IGDB failed, falling back to original service");
        const fallbackResults = await originalService.searchMedia({ query, type, limit });
        return fallbackResults.map(this.mapOriginalToEnhanced);
      }
      
      throw error;
    }
  }

  async searchGames(
    query: string, 
    limit: number = 10, 
    filters?: {
      platforms?: string[];
      genres?: string[];
      yearRange?: { min: number; max: number };
      ratingRange?: { min: number; max: number };
    }
  ): Promise<IGDBSearchResult[]> {
    return await igdbService.searchGames({ query, limit, filters });
  }

  async getPopularGames(limit: number = 20): Promise<EnhancedExternalMediaResult[]> {
    try {
      const games = await igdbService.getPopularGames(limit);
      return games.map(this.mapIGDBToEnhanced);
    } catch (error) {
      console.error("Error fetching popular games:", error);
      return [];
    }
  }

  async getGamesByGenre(genre: string, limit: number = 20): Promise<EnhancedExternalMediaResult[]> {
    try {
      const games = await igdbService.getGamesByGenre(genre, limit);
      return games.map(this.mapIGDBToEnhanced);
    } catch (error) {
      console.error("Error fetching games by genre:", error);
      return [];
    }
  }

  async getGameRecommendations(
    currentGame: EnhancedExternalMediaResult,
    limit: number = 10
  ): Promise<EnhancedExternalMediaResult[]> {
    try {
      // Find games with similar genres
      if (currentGame.genres && currentGame.genres.length > 0) {
        const recommendations = await this.getGamesByGenre(currentGame.genres[0], limit * 2);
        
        // Filter out the current game and return limited results
        return recommendations
          .filter(game => game.id !== currentGame.id)
          .slice(0, limit);
      }
      
      return [];
    } catch (error) {
      console.error("Error getting game recommendations:", error);
      return [];
    }
  }

  async checkApiAvailability(): Promise<{
    googleBooks: boolean;
    tmdb: boolean;
    igdb: boolean;
  }> {
    const [originalStatus, igdbStatus] = await Promise.all([
      originalService.checkApiAvailability(),
      igdbService.checkApiAvailability()
    ]);

    return {
      ...originalStatus,
      igdb: igdbStatus
    };
  }

  // Get trending content across all platforms
  async getTrendingContent(): Promise<{
    games: EnhancedExternalMediaResult[];
    movies: EnhancedExternalMediaResult[];
    books: EnhancedExternalMediaResult[];
  }> {
    try {
      const [games, movies, books] = await Promise.all([
        this.getPopularGames(10).catch(() => []),
        this.getTrendingMovies(10).catch(() => []),
        this.getTrendingBooks(10).catch(() => [])
      ]);

      return { games, movies, books };
    } catch (error) {
      console.error("Error fetching trending content:", error);
      return { games: [], movies: [], books: [] };
    }
  }

  // Enhanced search with AI-powered suggestions
  async smartSearch(query: string, userPreferences?: {
    favoriteGenres?: string[];
    preferredPlatforms?: string[];
    ratingThreshold?: number;
  }): Promise<{
    exact: EnhancedExternalMediaResult[];
    suggestions: EnhancedExternalMediaResult[];
    trending: EnhancedExternalMediaResult[];
  }> {
    try {
      // Exact search results
      const exactPromises: Promise<EnhancedExternalMediaResult[]>[] = [
        this.searchMedia({ query, type: "games", limit: 5 }),
        this.searchMedia({ query, type: "movies", limit: 5 }),
        this.searchMedia({ query, type: "books", limit: 5 }),
        this.searchMedia({ query, type: "series", limit: 5 })
      ];

      const exactResults = await Promise.all(exactPromises);
      const exact = exactResults.flat();

      // Generate suggestions based on user preferences
      let suggestions: EnhancedExternalMediaResult[] = [];
      if (userPreferences?.favoriteGenres && userPreferences.favoriteGenres.length > 0) {
        const genrePromises = userPreferences.favoriteGenres.slice(0, 3).map(genre =>
          this.getGamesByGenre(genre, 3).catch(() => [])
        );
        const genreResults = await Promise.all(genrePromises);
        suggestions = genreResults.flat();
      }

      // Get trending content
      const trending = await this.getPopularGames(10);

      return {
        exact,
        suggestions,
        trending
      };
    } catch (error) {
      console.error("Error in smart search:", error);
      return { exact: [], suggestions: [], trending: [] };
    }
  }

  private async getTrendingMovies(limit: number): Promise<EnhancedExternalMediaResult[]> {
    // This would ideally use a trending endpoint from TMDB
    const results = await originalService.searchMedia({
      query: "2024", // Search for recent content
      type: "movies",
      limit
    });
    return results.map(this.mapOriginalToEnhanced);
  }

  private async getTrendingBooks(limit: number): Promise<EnhancedExternalMediaResult[]> {
    // Search for popular/recent books
    const results = await originalService.searchMedia({
      query: "bestseller",
      type: "books",
      limit
    });
    return results.map(this.mapOriginalToEnhanced);
  }

  private mapIGDBToEnhanced = (igdbResult: IGDBSearchResult): EnhancedExternalMediaResult => {
    return {
      id: igdbResult.id,
      title: igdbResult.title,
      description: igdbResult.description,
      image: igdbResult.image,
      year: igdbResult.year,
      genres: igdbResult.genres,
      platforms: igdbResult.platforms,
      developer: igdbResult.developer,
      publisher: igdbResult.publisher,
      screenshots: igdbResult.screenshots,
      officialWebsite: igdbResult.officialWebsite,
      source: "igdb",
      originalType: "game",
      rating: igdbResult.rating
    };
  };

  private mapOriginalToEnhanced = (originalResult: ExternalMediaResult): EnhancedExternalMediaResult => {
    return {
      ...originalResult,
      platforms: undefined,
      developer: undefined,
      publisher: undefined,
      screenshots: undefined,
      officialWebsite: undefined
    };
  };
}

export const enhancedExternalMediaService = new EnhancedExternalMediaService();
