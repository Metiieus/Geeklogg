import { MediaEntity, CreateMediaRequest, UpdateMediaRequest, MediaType, Status } from "../entities/Media";

// Repository Interface (Port)
export interface MediaRepository {
  // Basic CRUD operations
  findAll(): Promise<MediaEntity[]>;
  findById(id: string): Promise<MediaEntity | null>;
  create(media: CreateMediaRequest): Promise<MediaEntity>;
  update(media: UpdateMediaRequest): Promise<MediaEntity>;
  delete(id: string): Promise<void>;

  // Query operations
  findByType(type: MediaType): Promise<MediaEntity[]>;
  findByStatus(status: Status): Promise<MediaEntity[]>;
  findByTitle(title: string): Promise<MediaEntity[]>;
  findByTags(tags: string[]): Promise<MediaEntity[]>;
  findRecentlyUpdated(limit?: number): Promise<MediaEntity[]>;
  findTopRated(limit?: number): Promise<MediaEntity[]>;

  // Aggregate operations
  count(): Promise<number>;
  countByType(type: MediaType): Promise<number>;
  countByStatus(status: Status): Promise<number>;
}

// Search and Filter types
export interface MediaSearchCriteria {
  query?: string;
  type?: MediaType;
  status?: Status;
  tags?: string[];
  ratingRange?: { min: number; max: number };
  dateRange?: { start: Date; end: Date };
}

export interface MediaSortOptions {
  field: keyof MediaEntity;
  direction: "asc" | "desc";
}

export interface MediaPaginationOptions {
  page: number;
  limit: number;
}

export interface MediaQueryOptions {
  search?: MediaSearchCriteria;
  sort?: MediaSortOptions;
  pagination?: MediaPaginationOptions;
}

export interface MediaQueryResult {
  items: MediaEntity[];
  total: number;
  page: number;
  totalPages: number;
}

// Extended repository interface for advanced queries
export interface AdvancedMediaRepository extends MediaRepository {
  findWithCriteria(options: MediaQueryOptions): Promise<MediaQueryResult>;
  findSimilar(mediaId: string, limit?: number): Promise<MediaEntity[]>;
  findByDateRange(start: Date, end: Date): Promise<MediaEntity[]>;
  getStatistics(): Promise<MediaStatistics>;
}

export interface MediaStatistics {
  totalCount: number;
  completedCount: number;
  inProgressCount: number;
  plannedCount: number;
  droppedCount: number;
  averageRating: number;
  totalHoursSpent: number;
  typeDistribution: Record<MediaType, number>;
  topTags: Array<{ tag: string; count: number }>;
  monthlyProgress: Array<{ month: string; completed: number; added: number }>;
}
