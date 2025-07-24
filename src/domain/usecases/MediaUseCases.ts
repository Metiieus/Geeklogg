import { MediaEntity, CreateMediaRequest, UpdateMediaRequest, MediaType, Status, MediaDomainService } from "../entities/Media";
import { MediaRepository, MediaQueryOptions, MediaQueryResult, MediaStatistics } from "../repositories/MediaRepository";

// Use Cases (Interactors)
export class MediaUseCases {
  constructor(private readonly mediaRepository: MediaRepository) {}

  // Create a new media item
  async createMedia(request: CreateMediaRequest): Promise<MediaEntity> {
    // Domain validation
    if (!request.title?.trim()) {
      throw new Error("Title is required");
    }

    if (request.rating && (request.rating < 0 || request.rating > 5)) {
      throw new Error("Rating must be between 0 and 5");
    }

    if (request.currentPage && request.totalPages && request.currentPage > request.totalPages) {
      throw new Error("Current page cannot exceed total pages");
    }

    return await this.mediaRepository.create(request);
  }

  // Update an existing media item
  async updateMedia(request: UpdateMediaRequest): Promise<MediaEntity> {
    if (!request.id) {
      throw new Error("Media ID is required");
    }

    const existingMedia = await this.mediaRepository.findById(request.id);
    if (!existingMedia) {
      throw new Error("Media not found");
    }

    // Apply same validations as create
    if (request.title !== undefined && !request.title.trim()) {
      throw new Error("Title cannot be empty");
    }

    if (request.rating && (request.rating < 0 || request.rating > 5)) {
      throw new Error("Rating must be between 0 and 5");
    }

    if (request.currentPage && request.totalPages && request.currentPage > request.totalPages) {
      throw new Error("Current page cannot exceed total pages");
    }

    return await this.mediaRepository.update(request);
  }

  // Delete a media item
  async deleteMedia(id: string): Promise<void> {
    if (!id?.trim()) {
      throw new Error("Media ID is required");
    }

    const existingMedia = await this.mediaRepository.findById(id);
    if (!existingMedia) {
      throw new Error("Media not found");
    }

    await this.mediaRepository.delete(id);
  }

  // Get a media item by ID
  async getMediaById(id: string): Promise<MediaEntity | null> {
    if (!id?.trim()) {
      throw new Error("Media ID is required");
    }

    return await this.mediaRepository.findById(id);
  }

  // Get all media items
  async getAllMedia(): Promise<MediaEntity[]> {
    return await this.mediaRepository.findAll();
  }

  // Search and filter media
  async searchMedia(options: MediaQueryOptions): Promise<MediaQueryResult> {
    return await this.mediaRepository.findWithCriteria(options);
  }

  // Get media by type
  async getMediaByType(type: MediaType): Promise<MediaEntity[]> {
    return await this.mediaRepository.findByType(type);
  }

  // Get media by status
  async getMediaByStatus(status: Status): Promise<MediaEntity[]> {
    return await this.mediaRepository.findByStatus(status);
  }

  // Get recently updated media
  async getRecentlyUpdated(limit: number = 10): Promise<MediaEntity[]> {
    return await this.mediaRepository.findRecentlyUpdated(limit);
  }

  // Get top rated media
  async getTopRated(limit: number = 5): Promise<MediaEntity[]> {
    return await this.mediaRepository.findTopRated(limit);
  }

  // Get media statistics
  async getStatistics(): Promise<MediaStatistics> {
    return await this.mediaRepository.getStatistics();
  }

  // Mark media as completed
  async markAsCompleted(id: string): Promise<MediaEntity> {
    const media = await this.getMediaById(id);
    if (!media) {
      throw new Error("Media not found");
    }

    return await this.updateMedia({
      id,
      status: "completed",
      endDate: new Date(),
      // If it's a book and has total pages, set current page to total
      ...(media.type === "books" && media.totalPages && {
        currentPage: media.totalPages
      })
    });
  }

  // Mark media as in progress
  async markAsInProgress(id: string): Promise<MediaEntity> {
    const media = await this.getMediaById(id);
    if (!media) {
      throw new Error("Media not found");
    }

    return await this.updateMedia({
      id,
      status: "in-progress",
      startDate: media.startDate || new Date()
    });
  }

  // Update reading/viewing progress
  async updateProgress(id: string, current: number): Promise<MediaEntity> {
    const media = await this.getMediaById(id);
    if (!media) {
      throw new Error("Media not found");
    }

    const updates: UpdateMediaRequest = { id };

    if (media.type === "books") {
      updates.currentPage = current;
      // Auto-complete if reached total pages
      if (media.totalPages && current >= media.totalPages) {
        updates.status = "completed";
        updates.endDate = new Date();
        updates.currentPage = media.totalPages;
      }
    } else {
      updates.hoursSpent = current;
    }

    return await this.updateMedia(updates);
  }

  // Get completion statistics
  async getCompletionStats(): Promise<{
    completionRate: number;
    totalHours: number;
    averageRating: number;
    topRatedMedia: MediaEntity[];
  }> {
    const allMedia = await this.getAllMedia();
    
    return {
      completionRate: MediaDomainService.calculateCompletionRate(allMedia),
      totalHours: MediaDomainService.getTotalHoursSpent(allMedia),
      averageRating: this.calculateAverageRating(allMedia),
      topRatedMedia: MediaDomainService.getTopRatedMedia(allMedia)
    };
  }

  // Get media insights
  async getInsights(): Promise<{
    mostActiveType: MediaType | null;
    longestSeries: MediaEntity | null;
    quickestCompletion: MediaEntity | null;
    favoriteGenres: string[];
  }> {
    const allMedia = await this.getAllMedia();
    
    return {
      mostActiveType: this.getMostActiveType(allMedia),
      longestSeries: this.getLongestSeries(allMedia),
      quickestCompletion: this.getQuickestCompletion(allMedia),
      favoriteGenres: this.getFavoriteGenres(allMedia)
    };
  }

  // Private helper methods
  private calculateAverageRating(medias: MediaEntity[]): number {
    const ratedMedia = medias.filter(m => m.rating && m.rating > 0);
    if (ratedMedia.length === 0) return 0;
    
    const total = ratedMedia.reduce((sum, m) => sum + (m.rating || 0), 0);
    return total / ratedMedia.length;
  }

  private getMostActiveType(medias: MediaEntity[]): MediaType | null {
    const typeCounts: Record<MediaType, number> = {
      games: 0, anime: 0, series: 0, books: 0, movies: 0, dorama: 0
    };

    medias.forEach(m => typeCounts[m.type]++);

    let maxType: MediaType | null = null;
    let maxCount = 0;

    Object.entries(typeCounts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxType = type as MediaType;
      }
    });

    return maxType;
  }

  private getLongestSeries(medias: MediaEntity[]): MediaEntity | null {
    return medias
      .filter(m => m.hoursSpent && m.hoursSpent > 0)
      .sort((a, b) => (b.hoursSpent || 0) - (a.hoursSpent || 0))[0] || null;
  }

  private getQuickestCompletion(medias: MediaEntity[]): MediaEntity | null {
    const completedMedia = medias.filter(m => 
      m.status === "completed" && 
      m.startDate && 
      m.endDate
    );

    if (completedMedia.length === 0) return null;

    return completedMedia.reduce((quickest, current) => {
      const currentDuration = current.endDate!.getTime() - current.startDate!.getTime();
      const quickestDuration = quickest.endDate!.getTime() - quickest.startDate!.getTime();
      
      return currentDuration < quickestDuration ? current : quickest;
    });
  }

  private getFavoriteGenres(medias: MediaEntity[]): string[] {
    const tagCounts: Record<string, number> = {};

    medias.forEach(m => {
      m.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag]) => tag);
  }
}
