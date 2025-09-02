export interface UserProfile {
  uid: string;
  name: string;
  avatar?: string;
  bio?: string;
  isPublic: boolean;
  followers: string[];
  following: string[];
  createdAt: string;
  plano?: {
    status: string;
    tipo: string;
    expiraEm?: string;
    mercadoPagoPaymentId?: string;
  };
  isPremium?: boolean;
}

export interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type:
    | "media_added"
    | "media_completed"
    | "review_added"
    | "milestone_added"
    | "achievement_unlocked";
  title: string;
  description: string;
  mediaTitle?: string;
  mediaType?: string;
  timestamp: string;
  data?: any;
}

export interface Notification {
  id: string;
  userId: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar?: string;
  type: "new_follower" | "activity_update" | "follow_request";
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  activityId?: string;
}

export interface FollowRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUserName: string;
  fromUserAvatar?: string;
  timestamp: string;
}
