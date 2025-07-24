// Domain Entity: Media
export type MediaType = "games" | "anime" | "series" | "books" | "movies" | "dorama";
export type Status = "completed" | "in-progress" | "dropped" | "planned";

export interface MediaEntity {
  readonly id: string;
  readonly title: string;
  readonly cover?: string;
  readonly platform?: string;
  readonly status: Status;
  readonly rating?: number;
  readonly hoursSpent?: number;
  readonly totalPages?: number;
  readonly currentPage?: number;
  readonly startDate?: Date;
  readonly endDate?: Date;
  readonly tags: string[];
  readonly externalLink?: string;
  readonly type: MediaType;
  readonly description?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreateMediaRequest {
  title: string;
  cover?: string;
  platform?: string;
  status: Status;
  rating?: number;
  hoursSpent?: number;
  totalPages?: number;
  currentPage?: number;
  startDate?: Date;
  endDate?: Date;
  tags: string[];
  externalLink?: string;
  type: MediaType;
  description?: string;
}

export interface UpdateMediaRequest extends Partial<CreateMediaRequest> {
  id: string;
}

// Value Objects
export class MediaProgress {
  constructor(
    public readonly current: number,
    public readonly total: number
  ) {
    if (current < 0 || total < 0) {
      throw new Error("Progress values must be non-negative");
    }
    if (current > total) {
      throw new Error("Current progress cannot exceed total");
    }
  }

  get percentage(): number {
    return this.total > 0 ? (this.current / this.total) * 100 : 0;
  }

  get isCompleted(): boolean {
    return this.current >= this.total && this.total > 0;
  }
}

export class MediaRating {
  constructor(private readonly value: number) {
    if (value < 0 || value > 5) {
      throw new Error("Rating must be between 0 and 5");
    }
  }

  get score(): number {
    return this.value;
  }

  get stars(): string {
    return "⭐".repeat(Math.floor(this.value));
  }
}

// Domain Services
export class MediaDomainService {
  static calculateCompletionRate(medias: MediaEntity[]): number {
    if (medias.length === 0) return 0;
    const completed = medias.filter(m => m.status === "completed").length;
    return (completed / medias.length) * 100;
  }

  static getTopRatedMedia(medias: MediaEntity[], limit: number = 5): MediaEntity[] {
    return medias
      .filter(m => m.rating && m.rating > 0)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  }

  static getTotalHoursSpent(medias: MediaEntity[]): number {
    return medias.reduce((total, media) => total + (media.hoursSpent || 0), 0);
  }

  static getMediaByType(medias: MediaEntity[], type: MediaType): MediaEntity[] {
    return medias.filter(m => m.type === type);
  }

  static getRecentlyUpdated(medias: MediaEntity[], limit: number = 10): MediaEntity[] {
    return medias
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit);
  }
}
