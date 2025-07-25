// IGDB API Service for Game Search
export interface IGDBGame {
  id: number;
  name: string;
  summary?: string;
  cover?: {
    id: number;
    url: string;
    image_id: string;
  };
  first_release_date?: number;
  genres?: Array<{
    id: number;
    name: string;
  }>;
  platforms?: Array<{
    id: number;
    name: string;
    abbreviation?: string;
  }>;
  rating?: number;
  rating_count?: number;
  screenshots?: Array<{
    id: number;
    url: string;
    image_id: string;
  }>;
  involved_companies?: Array<{
    id: number;
    company: {
      id: number;
      name: string;
    };
    developer: boolean;
    publisher: boolean;
  }>;
  websites?: Array<{
    id: number;
    url: string;
    category: number;
  }>;
  game_modes?: Array<{
    id: number;
    name: string;
  }>;
  player_perspectives?: Array<{
    id: number;
    name: string;
  }>;
  themes?: Array<{
    id: number;
    name: string;
  }>;
}

export interface IGDBSearchResult {
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
  source: "igdb";
  originalType: "game";
}

export interface IGDBSearchParams {
  query: string;
  limit?: number;
  offset?: number;
  filters?: {
    platforms?: string[];
    genres?: string[];
    yearRange?: { min: number; max: number };
    ratingRange?: { min: number; max: number };
  };
}

class IGDBService {
  private readonly baseUrl = "https://api.igdb.com/v4";
  private readonly clientId: string;
  private readonly accessToken: string;

  constructor() {
    this.clientId = import.meta.env.VITE_IGDB_CLIENT_ID || "";
    this.accessToken = import.meta.env.VITE_IGDB_ACCESS_TOKEN || "";

    if (!this.clientId || !this.accessToken) {
      console.warn("IGDB credentials not configured. Game search will be limited.");
    }
  }

  async searchGames(params: IGDBSearchParams): Promise<IGDBSearchResult[]> {
    if (!this.clientId || !this.accessToken) {
      console.warn("IGDB API credentials not configured");
      return [];
    }

    try {
      const query = this.buildQuery(params);

      const response = await fetch(`${this.baseUrl}/games`, {
        method: "POST",
        headers: {
          "Client-ID": this.clientId,
          "Authorization": `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: query,
      });

      if (!response.ok) {
        console.warn(`IGDB API error: ${response.status} ${response.statusText}`);
        return [];
      }

      const games: IGDBGame[] = await response.json();
      return games.map(game => this.mapToSearchResult(game));
    } catch (error) {
      console.warn("IGDB API not accessible (likely CORS issue):", error.message);
      // Return empty array instead of throwing to allow fallback
      return [];
    }
  }

  async getGameDetails(gameId: number): Promise<IGDBGame | null> {
    if (!this.clientId || !this.accessToken) {
      throw new Error("IGDB API credentials not configured");
    }

    try {
      const query = `
        fields id, name, summary, cover.url, cover.image_id, first_release_date, 
               genres.name, platforms.name, platforms.abbreviation, rating, rating_count,
               screenshots.url, screenshots.image_id, involved_companies.company.name,
               involved_companies.developer, involved_companies.publisher,
               websites.url, websites.category, game_modes.name,
               player_perspectives.name, themes.name;
        where id = ${gameId};
      `;

      const response = await fetch(`${this.baseUrl}/games`, {
        method: "POST",
        headers: {
          "Client-ID": this.clientId,
          "Authorization": `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: query,
      });

      if (!response.ok) {
        throw new Error(`IGDB API error: ${response.status} ${response.statusText}`);
      }

      const games: IGDBGame[] = await response.json();
      return games.length > 0 ? games[0] : null;
    } catch (error) {
      console.error("Error fetching game details from IGDB:", error);
      throw error;
    }
  }

  async getPopularGames(limit: number = 20): Promise<IGDBSearchResult[]> {
    if (!this.clientId || !this.accessToken) {
      return [];
    }

    try {
      const query = `
        fields id, name, summary, cover.url, cover.image_id, first_release_date,
               genres.name, platforms.name, platforms.abbreviation, rating, rating_count;
        where rating_count > 100 & rating > 75;
        sort rating desc;
        limit ${limit};
      `;

      const response = await fetch(`${this.baseUrl}/games`, {
        method: "POST",
        headers: {
          "Client-ID": this.clientId,
          "Authorization": `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: query,
      });

      if (!response.ok) {
        console.warn(`IGDB API error: ${response.status} ${response.statusText}`);
        return [];
      }

      const games: IGDBGame[] = await response.json();
      return games.map(game => this.mapToSearchResult(game));
    } catch (error) {
      console.warn("IGDB API not accessible for popular games:", error.message);
      return [];
    }
  }

  async getGamesByGenre(genreName: string, limit: number = 20): Promise<IGDBSearchResult[]> {
    if (!this.clientId || !this.accessToken) {
      return [];
    }

    try {
      const query = `
        fields id, name, summary, cover.url, cover.image_id, first_release_date,
               genres.name, platforms.name, platforms.abbreviation, rating, rating_count;
        where genres.name ~ "${genreName}" & rating_count > 10;
        sort rating desc;
        limit ${limit};
      `;

      const response = await fetch(`${this.baseUrl}/games`, {
        method: "POST",
        headers: {
          "Client-ID": this.clientId,
          "Authorization": `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: query,
      });

      if (!response.ok) {
        throw new Error(`IGDB API error: ${response.status} ${response.statusText}`);
      }

      const games: IGDBGame[] = await response.json();
      return games.map(game => this.mapToSearchResult(game));
    } catch (error) {
      console.error("Error fetching games by genre from IGDB:", error);
      return [];
    }
  }

  async checkApiAvailability(): Promise<boolean> {
    if (!this.clientId || !this.accessToken) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/games`, {
        method: "POST",
        headers: {
          "Client-ID": this.clientId,
          "Authorization": `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: "fields id; limit 1;",
      });

      return response.ok;
    } catch (error) {
      console.warn("IGDB API not available (likely CORS restriction):", error.message);
      return false;
    }
  }

  private buildQuery(params: IGDBSearchParams): string {
    const { query, limit = 20, offset = 0, filters } = params;
    
    let queryParts = [
      "fields id, name, summary, cover.url, cover.image_id, first_release_date,",
      "       genres.name, platforms.name, platforms.abbreviation, rating, rating_count,",
      "       involved_companies.company.name, involved_companies.developer,",
      "       involved_companies.publisher, websites.url, websites.category;"
    ];

    // Search condition
    const searchCondition = `search "${query.replace(/"/g, '\\"')}"`;
    const whereConditions = [searchCondition];

    // Apply filters
    if (filters) {
      if (filters.platforms && filters.platforms.length > 0) {
        const platformFilter = filters.platforms
          .map(p => `"${p.replace(/"/g, '\\"')}"`)
          .join(",");
        whereConditions.push(`platforms.name = (${platformFilter})`);
      }

      if (filters.genres && filters.genres.length > 0) {
        const genreFilter = filters.genres
          .map(g => `"${g.replace(/"/g, '\\"')}"`)
          .join(",");
        whereConditions.push(`genres.name = (${genreFilter})`);
      }

      if (filters.yearRange) {
        const startDate = new Date(filters.yearRange.min, 0, 1).getTime() / 1000;
        const endDate = new Date(filters.yearRange.max + 1, 0, 1).getTime() / 1000;
        whereConditions.push(`first_release_date >= ${startDate} & first_release_date < ${endDate}`);
      }

      if (filters.ratingRange) {
        whereConditions.push(
          `rating >= ${filters.ratingRange.min} & rating <= ${filters.ratingRange.max}`
        );
      }
    }

    queryParts.push(`where ${whereConditions.join(" & ")};`);
    queryParts.push(`sort rating desc;`);
    queryParts.push(`limit ${limit};`);
    
    if (offset > 0) {
      queryParts.push(`offset ${offset};`);
    }

    return queryParts.join("\n");
  }

  private mapToSearchResult(game: IGDBGame): IGDBSearchResult {
    const getCoverUrl = (imageId: string): string => {
      return `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.jpg`;
    };

    const getScreenshotUrl = (imageId: string): string => {
      return `https://images.igdb.com/igdb/image/upload/t_screenshot_med/${imageId}.jpg`;
    };

    // Extract developer and publisher
    const companies = game.involved_companies || [];
    const developer = companies.find(c => c.developer)?.company?.name;
    const publisher = companies.find(c => c.publisher)?.company?.name;

    // Find official website
    const websites = game.websites || [];
    const officialSite = websites.find(w => w.category === 1)?.url; // Category 1 is official website

    return {
      id: game.id.toString(),
      title: game.name,
      description: game.summary,
      image: game.cover?.image_id ? getCoverUrl(game.cover.image_id) : undefined,
      year: game.first_release_date ? new Date(game.first_release_date * 1000).getFullYear() : undefined,
      genres: game.genres?.map(g => g.name) || [],
      platforms: game.platforms?.map(p => p.abbreviation || p.name) || [],
      rating: game.rating ? Math.round(game.rating / 20) : undefined, // Convert 0-100 to 0-5
      developer,
      publisher,
      screenshots: game.screenshots?.map(s => getScreenshotUrl(s.image_id)) || [],
      officialWebsite: officialSite,
      source: "igdb",
      originalType: "game"
    };
  }
}

export const igdbService = new IGDBService();
