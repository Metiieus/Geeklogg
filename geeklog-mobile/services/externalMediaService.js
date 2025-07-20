// React Native External Media Service
// Provides search functionality for Google Books and TMDb APIs

export const ExternalMediaService = {
  // Google Books API configuration
  GOOGLE_BOOKS_API_URL: "https://www.googleapis.com/books/v1/volumes",
  
  // TMDb API configuration
  TMDB_API_URL: "https://api.themoviedb.org/3",
  TMDB_API_KEY: "ff4f571701b6696898c90a6995891283", // In production, use secure storage
  
  // Search books using Google Books API
  async searchBooks(query, limit = 10) {
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `${this.GOOGLE_BOOKS_API_URL}?q=${encodedQuery}&maxResults=${limit}&printType=books`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.items) {
        return [];
      }
      
      return data.items.map(item => this.transformGoogleBooksResult(item));
    } catch (error) {
      console.error("Error searching books:", error);
      throw new Error("Failed to search books");
    }
  },
  
  // Search movies using TMDb API
  async searchMovies(query, limit = 10) {
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `${this.TMDB_API_URL}/search/movie?api_key=${this.TMDB_API_KEY}&query=${encodedQuery}&page=1`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.results) {
        return [];
      }
      
      return data.results.slice(0, limit).map(item => this.transformTMDbMovieResult(item));
    } catch (error) {
      console.error("Error searching movies:", error);
      throw new Error("Failed to search movies");
    }
  },
  
  // Search TV series using TMDb API
  async searchTvSeries(query, limit = 10) {
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `${this.TMDB_API_URL}/search/tv?api_key=${this.TMDB_API_KEY}&query=${encodedQuery}&page=1`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.results) {
        return [];
      }
      
      return data.results.slice(0, limit).map(item => this.transformTMDbTvResult(item));
    } catch (error) {
      console.error("Error searching TV series:", error);
      throw new Error("Failed to search TV series");
    }
  },
  
  // Main search method that routes to appropriate service
  async searchMedia({ query, type, limit = 10 }) {
    if (!query || query.length < 2) {
      return [];
    }
    
    try {
      switch (type) {
        case "books":
          return await this.searchBooks(query, limit);
        case "movies":
          return await this.searchMovies(query, limit);
        case "series":
        case "anime":
        case "dorama":
          return await this.searchTvSeries(query, limit);
        case "games":
          // For now, return empty array for games (would need IGDB API)
          return [];
        default:
          return [];
      }
    } catch (error) {
      console.error(`Error searching ${type}:`, error);
      return [];
    }
  },
  
  // Transform Google Books API result to our format
  transformGoogleBooksResult(item) {
    const volumeInfo = item.volumeInfo || {};
    const imageLinks = volumeInfo.imageLinks || {};
    
    return {
      id: item.id,
      title: volumeInfo.title || "Título não disponível",
      description: volumeInfo.description,
      image: imageLinks.thumbnail || imageLinks.smallThumbnail,
      year: volumeInfo.publishedDate ? new Date(volumeInfo.publishedDate).getFullYear() : null,
      genres: volumeInfo.categories,
      authors: volumeInfo.authors,
      publisher: volumeInfo.publisher,
      pageCount: volumeInfo.pageCount,
      isbn: volumeInfo.industryIdentifiers 
        ? volumeInfo.industryIdentifiers.find(id => id.type === "ISBN_13")?.identifier
        : null,
      source: "google-books",
      originalType: "book"
    };
  },
  
  // Transform TMDb movie result to our format
  transformTMDbMovieResult(item) {
    return {
      id: item.id.toString(),
      title: item.title || item.original_title || "Título não disponível",
      description: item.overview,
      image: item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : null,
      year: item.release_date ? new Date(item.release_date).getFullYear() : null,
      genres: item.genre_ids, // TMDb returns genre IDs, would need mapping
      runtime: null, // Not available in search results
      tmdbId: item.id,
      source: "tmdb",
      originalType: "movie"
    };
  },
  
  // Transform TMDb TV result to our format
  transformTMDbTvResult(item) {
    return {
      id: item.id.toString(),
      title: item.name || item.original_name || "Título não disponível",
      description: item.overview,
      image: item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : null,
      year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : null,
      genres: item.genre_ids, // TMDb returns genre IDs, would need mapping
      tmdbId: item.id,
      source: "tmdb",
      originalType: "tv"
    };
  },
  
  // Check API availability
  async checkApiAvailability() {
    const status = { googleBooks: true, tmdb: true };
    
    try {
      // Test Google Books API
      const booksResponse = await fetch(`${this.GOOGLE_BOOKS_API_URL}?q=test&maxResults=1`);
      status.googleBooks = booksResponse.ok;
    } catch (error) {
      status.googleBooks = false;
    }
    
    try {
      // Test TMDb API
      const tmdbResponse = await fetch(`${this.TMDB_API_URL}/search/movie?api_key=${this.TMDB_API_KEY}&query=test`);
      status.tmdb = tmdbResponse.ok;
    } catch (error) {
      status.tmdb = false;
    }
    
    return status;
  }
};

export default ExternalMediaService;
