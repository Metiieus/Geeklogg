// RAWG API Service for Game Search
export interface RAWGGame {
  id: number;
  name: string;
  description?: string;
  description_raw?: string;
  background_image?: string;
  released?: string;
  rating?: number;
  rating_top?: number;
  ratings_count?: number;
  metacritic?: number;
  genres?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  platforms?: Array<{
    platform: {
      id: number;
      name: string;
      slug: string;
    };
  }>;
  developers?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  publishers?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  esrb_rating?: {
    id: number;
    name: string;
    slug: string;
  };
  screenshots?: Array<{
    id: number;
    image: string;
  }>;
  website?: string;
  playtime?: number;
  tags?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

export interface RAWGSearchResult {
  id: string;
  title: string;
  description?: string;
  image?: string;
  year?: number;
  genres?: string[];
  platforms?: string[];
  rating?: number;
  developer?: string;
  publisher?: string;
  screenshots?: string[];
  officialWebsite?: string;
  source: "rawg";
  originalType: "game";
}

export interface RAWGSearchParams {
  query: string;
  limit?: number;
  page?: number;
  filters?: {
    platforms?: string[];
    genres?: string[];
    yearRange?: { min: number; max: number };
    ratingRange?: { min: number; max: number };
  };
}

class RAWGService {
  private readonly apiKey = "5eee9c72c62241b78e6484fbd8b63f65";
  private readonly baseUrl = "https://api.rawg.io/api";

  constructor() {
    // RAWG API key fornecida pelo usuário
  }

  async searchGames(params: RAWGSearchParams): Promise<RAWGSearchResult[]> {
    try {
      const queryParams = this.buildQueryParams(params);
      console.log("🔍 RAWG Query params:", queryParams);
      console.log("📝 Parâmetros de busca:", params);

      const url = `${this.baseUrl}/games?${queryParams}`;
      const response = await fetch(url);

      if (!response.ok) {
        let errorText;
        try {
          errorText = await response.text();
        } catch (streamError) {
          errorText = "Unknown error";
        }
        console.error("❌ RAWG Error Response:", errorText);
        throw new Error(`RAWG API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      const games: RAWGGame[] = data.results || [];
      return games.map(game => this.mapToSearchResult(game));
    } catch (error) {
      console.error("Error searching games via RAWG API:", error);
      throw error;
    }
  }

  async getGameDetails(gameId: number): Promise<RAWGGame | null> {
    try {
      const url = `${this.baseUrl}/games/${gameId}?key=${this.apiKey}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        let errorText;
        try {
          errorText = await response.text();
        } catch (streamError) {
          errorText = "Unknown error";
        }
        console.error("❌ RAWG Error Response:", errorText);
        throw new Error(`RAWG API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const game: RAWGGame = await response.json();
      return game;
    } catch (error) {
      console.error("Error fetching game details via RAWG API:", error);
      throw error;
    }
  }

  async getPopularGames(limit: number = 20): Promise<RAWGSearchResult[]> {
    try {
      const url = `${this.baseUrl}/games?key=${this.apiKey}&ordering=-rating&page_size=${limit}&metacritic=80,100`;
      
      const response = await fetch(url);

      if (!response.ok) {
        let errorText;
        try {
          errorText = await response.text();
        } catch (streamError) {
          errorText = "Unknown error";
        }
        console.error("❌ RAWG Error Response:", errorText);
        throw new Error(`RAWG API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      const games: RAWGGame[] = data.results || [];
      return games.map(game => this.mapToSearchResult(game));
    } catch (error) {
      console.error("Error fetching popular games via RAWG API:", error);
      return [];
    }
  }

  async getGamesByGenre(genreName: string, limit: number = 20): Promise<RAWGSearchResult[]> {
    try {
      const genreSlug = genreName.toLowerCase().replace(/\s+/g, '-');
      const url = `${this.baseUrl}/games?key=${this.apiKey}&genres=${genreSlug}&page_size=${limit}&ordering=-rating`;
      
      const response = await fetch(url);

      if (!response.ok) {
        let errorText;
        try {
          errorText = await response.text();
        } catch (streamError) {
          errorText = "Unknown error";
        }
        console.error("❌ RAWG Error Response:", errorText);
        throw new Error(`RAWG API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      const games: RAWGGame[] = data.results || [];
      return games.map(game => this.mapToSearchResult(game));
    } catch (error) {
      console.error("Error fetching games by genre via RAWG API:", error);
      return [];
    }
  }

  async checkApiAvailability(): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/games?key=${this.apiKey}&page_size=1`;
      const response = await fetch(url);

      if (response.ok) {
        // Consume the response to prevent stream issues
        try {
          await response.json();
        } catch (streamError) {
          // Ignore stream consumption errors in availability check
        }
      }

      return response.ok;
    } catch (error) {
      console.warn("RAWG API not available:", error);
      return false;
    }
  }

  private buildQueryParams(params: RAWGSearchParams): string {
    const { query, limit = 20, page = 1, filters } = params;
    
    const searchParams = new URLSearchParams();
    searchParams.append('key', this.apiKey);
    searchParams.append('search', query);
    searchParams.append('page_size', limit.toString());
    searchParams.append('page', page.toString());
    searchParams.append('ordering', '-rating');

    // Apply filters
    if (filters) {
      if (filters.platforms && filters.platforms.length > 0) {
        // Convert platform names to RAWG platform IDs/slugs
        const platformSlugs = filters.platforms.map(p => 
          p.toLowerCase().replace(/\s+/g, '-')
        ).join(',');
        searchParams.append('platforms', platformSlugs);
      }

      if (filters.genres && filters.genres.length > 0) {
        const genreSlugs = filters.genres.map(g => 
          g.toLowerCase().replace(/\s+/g, '-')
        ).join(',');
        searchParams.append('genres', genreSlugs);
      }

      if (filters.yearRange) {
        searchParams.append('dates', `${filters.yearRange.min}-01-01,${filters.yearRange.max}-12-31`);
      }

      if (filters.ratingRange) {
        // RAWG uses 0-5 rating scale
        const minRating = Math.round(filters.ratingRange.min);
        const maxRating = Math.round(filters.ratingRange.max);
        searchParams.append('metacritic', `${minRating * 20},${maxRating * 20}`);
      }
    }

    return searchParams.toString();
  }

  private mapToSearchResult(game: RAWGGame): RAWGSearchResult {
    // Extract developer and publisher
    const developer = game.developers?.[0]?.name;
    const publisher = game.publishers?.[0]?.name;

    // Extract year from release date
    const year = game.released ? new Date(game.released).getFullYear() : undefined;

    // Map platforms
    const platforms = game.platforms?.map(p => p.platform.name) || [];

    // Map genres
    const genres = game.genres?.map(g => g.name) || [];

    // Get screenshots
    const screenshots = game.screenshots?.map(s => s.image) || [];

    // Convert rating from 0-5 to 0-10 scale if needed
    const rating = game.rating ? Math.round(game.rating * 2) : undefined;

    return {
      id: game.id.toString(),
      title: game.name,
      description: game.description_raw || game.description,
      image: game.background_image,
      year,
      genres,
      platforms,
      rating,
      developer,
      publisher,
      screenshots,
      officialWebsite: game.website,
      source: "rawg",
      originalType: "game"
    };
  }
}

export const rawgService = new RAWGService();
