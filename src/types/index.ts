export type MediaType = "game" | "movie" | "tv" | "book" | "anime" | "manga";
export type Status = "completed" | "in-progress" | "dropped" | "planned";

export type ActivePage =
    | "dashboard"
    | "library"
    | "reviews"
    | "timeline"
    | "statistics"
    | "social"
    | "settings"
    | "profile"
    | "add-media"
    | "edit-media"
    | "user-profile";

export interface MediaItem {
    id: string;
    title: string;
    type: MediaType;
    status: Status;
    rating?: number;
    notes?: string;
    startDate?: string;
    endDate?: string;
    hoursSpent?: number;
    cover?: string;
    genres?: string[];
    platforms?: string[];
    createdAt: string;
    updatedAt: string;
    isFavorite?: boolean;
    tags?: string[];
    externalId?: string;
    description?: string;
    platform?: string;
    totalPages?: number;
    currentPage?: number;
    externalLink?: string;
}

export interface Review {
    id: string;
    mediaId: string;
    title: string;
    content: string;
    rating: number;
    spoilers: boolean;
    createdAt: string;
    updatedAt: string;
    likes?: number;
    isPublic?: boolean;
}

export interface Milestone {
    id: string;
    title: string;
    description: string;
    icon: string;
    date: string;
    type: "achievement" | "goal" | "event";
    mediaId?: string;
    images?: string[]; // URLs das imagens (máximo 2)
    data?: any;
}

export interface UserSettings {
    name: string;
    avatar?: string;
    bio?: string;
    favoriteGenres: string[];
    theme: "dark" | "light";
    language: "pt" | "en";
    notifications: {
        achievements: boolean;
        social: boolean;
        reminders: boolean;
    };
    privacy: {
        profilePublic: boolean;
        reviewsPublic: boolean;
        statsPublic: boolean;
    };
}

// Unified UserProfile matching both Auth needs and Social needs
export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    name?: string; // Legacy/Social compatibility
    avatar?: string; // Social compatibility
    profileImage?: string; // Auth compatibility
    isPremium?: boolean;
    bio?: string;
    favoriteGenres?: string[];
    isPublic?: boolean;
    followers?: string[];
    following?: string[];
    createdAt?: string;
    isFollowing?: boolean; // UI state
    plano?: {
        status: string;
        tipo: string;
        expiraEm?: string;
        mercadoPagoPaymentId?: string;
    };
}

export interface FavoriteItem {
    id: string;
    name: string;
    image?: string;
}
