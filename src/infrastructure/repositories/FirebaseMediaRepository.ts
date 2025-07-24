import {
  MediaRepository,
  AdvancedMediaRepository,
  MediaQueryOptions,
  MediaQueryResult,
  MediaStatistics,
  MediaSearchCriteria
} from "../../domain/repositories/MediaRepository";
import {
  MediaEntity,
  CreateMediaRequest,
  UpdateMediaRequest,
  MediaType,
  Status
} from "../../domain/entities/Media";
import { 
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  Timestamp
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

export class FirebaseMediaRepository implements AdvancedMediaRepository {
  private readonly collectionName = "medias";

  private getUserId(): string {
    const { user } = useAuth();
    if (!user) throw new Error("User not authenticated");
    return user.uid;
  }

  private getUserCollection() {
    return collection(db, "users", this.getUserId(), this.collectionName);
  }

  private mapFirebaseToEntity(data: any, id: string): MediaEntity {
    return {
      id,
      title: data.title,
      cover: data.cover,
      platform: data.platform,
      status: data.status,
      rating: data.rating,
      hoursSpent: data.hoursSpent,
      totalPages: data.totalPages,
      currentPage: data.currentPage,
      startDate: data.startDate?.toDate(),
      endDate: data.endDate?.toDate(),
      tags: data.tags || [],
      externalLink: data.externalLink,
      type: data.type,
      description: data.description,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    };
  }

  private mapEntityToFirebase(entity: CreateMediaRequest | UpdateMediaRequest): any {
    return {
      ...entity,
      startDate: entity.startDate ? Timestamp.fromDate(entity.startDate) : null,
      endDate: entity.endDate ? Timestamp.fromDate(entity.endDate) : null,
      updatedAt: Timestamp.now(),
      ...(!(entity as UpdateMediaRequest).id && { createdAt: Timestamp.now() })
    };
  }

  async findAll(): Promise<MediaEntity[]> {
    try {
      const querySnapshot = await getDocs(
        query(this.getUserCollection(), orderBy("updatedAt", "desc"))
      );
      
      return querySnapshot.docs.map(doc => 
        this.mapFirebaseToEntity(doc.data(), doc.id)
      );
    } catch (error) {
      console.error("Error fetching all media:", error);
      throw new Error("Failed to fetch media items");
    }
  }

  async findById(id: string): Promise<MediaEntity | null> {
    try {
      const docRef = doc(this.getUserCollection(), id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return this.mapFirebaseToEntity(docSnap.data(), docSnap.id);
    } catch (error) {
      console.error("Error fetching media by ID:", error);
      throw new Error("Failed to fetch media item");
    }
  }

  async create(media: CreateMediaRequest): Promise<MediaEntity> {
    try {
      const docRef = await addDoc(
        this.getUserCollection(),
        this.mapEntityToFirebase(media)
      );
      
      const created = await this.findById(docRef.id);
      if (!created) {
        throw new Error("Failed to create media item");
      }
      
      return created;
    } catch (error) {
      console.error("Error creating media:", error);
      throw new Error("Failed to create media item");
    }
  }

  async update(media: UpdateMediaRequest): Promise<MediaEntity> {
    try {
      const docRef = doc(this.getUserCollection(), media.id);
      const { id, ...updateData } = media;
      
      await updateDoc(docRef, this.mapEntityToFirebase(updateData));
      
      const updated = await this.findById(media.id);
      if (!updated) {
        throw new Error("Failed to update media item");
      }
      
      return updated;
    } catch (error) {
      console.error("Error updating media:", error);
      throw new Error("Failed to update media item");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(this.getUserCollection(), id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting media:", error);
      throw new Error("Failed to delete media item");
    }
  }

  async findByType(type: MediaType): Promise<MediaEntity[]> {
    try {
      const q = query(
        this.getUserCollection(),
        where("type", "==", type),
        orderBy("updatedAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => 
        this.mapFirebaseToEntity(doc.data(), doc.id)
      );
    } catch (error) {
      console.error("Error fetching media by type:", error);
      throw new Error("Failed to fetch media items by type");
    }
  }

  async findByStatus(status: Status): Promise<MediaEntity[]> {
    try {
      const q = query(
        this.getUserCollection(),
        where("status", "==", status),
        orderBy("updatedAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => 
        this.mapFirebaseToEntity(doc.data(), doc.id)
      );
    } catch (error) {
      console.error("Error fetching media by status:", error);
      throw new Error("Failed to fetch media items by status");
    }
  }

  async findByTitle(title: string): Promise<MediaEntity[]> {
    // Firebase doesn't support case-insensitive text search natively
    // We'll implement a simple approach and filter in memory
    const allMedia = await this.findAll();
    return allMedia.filter(media => 
      media.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  async findByTags(tags: string[]): Promise<MediaEntity[]> {
    try {
      const q = query(
        this.getUserCollection(),
        where("tags", "array-contains-any", tags),
        orderBy("updatedAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => 
        this.mapFirebaseToEntity(doc.data(), doc.id)
      );
    } catch (error) {
      console.error("Error fetching media by tags:", error);
      throw new Error("Failed to fetch media items by tags");
    }
  }

  async findRecentlyUpdated(limitCount: number = 10): Promise<MediaEntity[]> {
    try {
      const q = query(
        this.getUserCollection(),
        orderBy("updatedAt", "desc"),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => 
        this.mapFirebaseToEntity(doc.data(), doc.id)
      );
    } catch (error) {
      console.error("Error fetching recently updated media:", error);
      throw new Error("Failed to fetch recently updated media");
    }
  }

  async findTopRated(limitCount: number = 5): Promise<MediaEntity[]> {
    try {
      const q = query(
        this.getUserCollection(),
        where("rating", ">", 0),
        orderBy("rating", "desc"),
        orderBy("updatedAt", "desc"),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => 
        this.mapFirebaseToEntity(doc.data(), doc.id)
      );
    } catch (error) {
      console.error("Error fetching top rated media:", error);
      throw new Error("Failed to fetch top rated media");
    }
  }

  async count(): Promise<number> {
    const allMedia = await this.findAll();
    return allMedia.length;
  }

  async countByType(type: MediaType): Promise<number> {
    const mediaByType = await this.findByType(type);
    return mediaByType.length;
  }

  async countByStatus(status: Status): Promise<number> {
    const mediaByStatus = await this.findByStatus(status);
    return mediaByStatus.length;
  }

  async findWithCriteria(options: MediaQueryOptions): Promise<MediaQueryResult> {
    // For now, implement a simplified version
    // In a production app, you'd want to optimize this with proper indexing
    let media = await this.findAll();

    // Apply search criteria
    if (options.search) {
      media = this.applySearchCriteria(media, options.search);
    }

    // Apply sorting
    if (options.sort) {
      media = this.applySorting(media, options.sort);
    }

    // Calculate pagination
    const total = media.length;
    const page = options.pagination?.page || 1;
    const limitCount = options.pagination?.limit || 20;
    const totalPages = Math.ceil(total / limitCount);
    const startIndex = (page - 1) * limitCount;
    const endIndex = startIndex + limitCount;

    return {
      items: media.slice(startIndex, endIndex),
      total,
      page,
      totalPages
    };
  }

  async findSimilar(mediaId: string, limitCount: number = 5): Promise<MediaEntity[]> {
    const media = await this.findById(mediaId);
    if (!media) return [];

    const allMedia = await this.findAll();
    
    // Simple similarity based on type and tags
    const similar = allMedia
      .filter(m => m.id !== mediaId && m.type === media.type)
      .map(m => ({
        media: m,
        score: this.calculateSimilarityScore(media, m)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limitCount)
      .map(item => item.media);

    return similar;
  }

  async findByDateRange(start: Date, end: Date): Promise<MediaEntity[]> {
    const allMedia = await this.findAll();
    return allMedia.filter(media => {
      const updatedAt = media.updatedAt;
      return updatedAt >= start && updatedAt <= end;
    });
  }

  async getStatistics(): Promise<MediaStatistics> {
    const allMedia = await this.findAll();
    
    const stats: MediaStatistics = {
      totalCount: allMedia.length,
      completedCount: allMedia.filter(m => m.status === "completed").length,
      inProgressCount: allMedia.filter(m => m.status === "in-progress").length,
      plannedCount: allMedia.filter(m => m.status === "planned").length,
      droppedCount: allMedia.filter(m => m.status === "dropped").length,
      averageRating: this.calculateAverageRating(allMedia),
      totalHoursSpent: allMedia.reduce((total, m) => total + (m.hoursSpent || 0), 0),
      typeDistribution: this.calculateTypeDistribution(allMedia),
      topTags: this.calculateTopTags(allMedia),
      monthlyProgress: this.calculateMonthlyProgress(allMedia)
    };

    return stats;
  }

  // Private helper methods
  private applySearchCriteria(media: MediaEntity[], criteria: MediaSearchCriteria): MediaEntity[] {
    let filtered = media;

    if (criteria.query) {
      const query = criteria.query.toLowerCase();
      filtered = filtered.filter(m => 
        m.title.toLowerCase().includes(query) ||
        m.description?.toLowerCase().includes(query) ||
        m.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (criteria.type) {
      filtered = filtered.filter(m => m.type === criteria.type);
    }

    if (criteria.status) {
      filtered = filtered.filter(m => m.status === criteria.status);
    }

    if (criteria.tags && criteria.tags.length > 0) {
      filtered = filtered.filter(m => 
        criteria.tags!.some(tag => m.tags.includes(tag))
      );
    }

    if (criteria.ratingRange) {
      filtered = filtered.filter(m => 
        m.rating && 
        m.rating >= criteria.ratingRange!.min && 
        m.rating <= criteria.ratingRange!.max
      );
    }

    if (criteria.dateRange) {
      filtered = filtered.filter(m => 
        m.updatedAt >= criteria.dateRange!.start && 
        m.updatedAt <= criteria.dateRange!.end
      );
    }

    return filtered;
  }

  private applySorting(media: MediaEntity[], sort: { field: keyof MediaEntity; direction: "asc" | "desc" }): MediaEntity[] {
    return media.sort((a, b) => {
      const aValue = a[sort.field] as any;
      const bValue = b[sort.field] as any;
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;
      
      return sort.direction === "desc" ? -comparison : comparison;
    });
  }

  private calculateSimilarityScore(media1: MediaEntity, media2: MediaEntity): number {
    let score = 0;
    
    // Same type bonus
    if (media1.type === media2.type) score += 3;
    
    // Shared tags bonus
    const sharedTags = media1.tags.filter(tag => media2.tags.includes(tag));
    score += sharedTags.length * 2;
    
    // Similar rating bonus
    if (media1.rating && media2.rating) {
      const ratingDiff = Math.abs(media1.rating - media2.rating);
      score += Math.max(0, 2 - ratingDiff);
    }
    
    return score;
  }

  private calculateAverageRating(media: MediaEntity[]): number {
    const ratedMedia = media.filter(m => m.rating && m.rating > 0);
    if (ratedMedia.length === 0) return 0;
    
    const total = ratedMedia.reduce((sum, m) => sum + (m.rating || 0), 0);
    return total / ratedMedia.length;
  }

  private calculateTypeDistribution(media: MediaEntity[]): Record<MediaType, number> {
    const distribution: Record<MediaType, number> = {
      games: 0, anime: 0, series: 0, books: 0, movies: 0, dorama: 0
    };

    media.forEach(m => distribution[m.type]++);
    return distribution;
  }

  private calculateTopTags(media: MediaEntity[], limit: number = 10): Array<{ tag: string; count: number }> {
    const tagCounts: Record<string, number> = {};

    media.forEach(m => {
      m.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  private calculateMonthlyProgress(media: MediaEntity[]): Array<{ month: string; completed: number; added: number }> {
    const monthlyData: Record<string, { completed: number; added: number }> = {};

    media.forEach(m => {
      // Count added items
      const addedMonth = m.createdAt.toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyData[addedMonth]) {
        monthlyData[addedMonth] = { completed: 0, added: 0 };
      }
      monthlyData[addedMonth].added++;

      // Count completed items
      if (m.status === "completed" && m.endDate) {
        const completedMonth = m.endDate.toISOString().slice(0, 7);
        if (!monthlyData[completedMonth]) {
          monthlyData[completedMonth] = { completed: 0, added: 0 };
        }
        monthlyData[completedMonth].completed++;
      }
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // Last 12 months
  }
}
