import { database } from "./database";
import { getUserId } from "./utils";
import {
  UserProfile,
  UserActivity,
  Notification,
  FollowRequest,
} from "../types/social";

// Perfis de usuários
export async function searchUsers(query: string): Promise<UserProfile[]> {
  try {
    if (!query.trim()) return [];

    const users = await database.getCollection<UserProfile>(["users"]);
    return users
      .map((doc) => ({ ...doc.data, id: doc.id }))
      .filter(
        (user) =>
          user.name?.toLowerCase().includes(query.toLowerCase()) ||
          user.bio?.toLowerCase().includes(query.toLowerCase()),
      )
      .slice(0, 20);
  } catch (error) {
    // Database error, likely in demo mode - return mock data
    console.log("🎭 Mock user search for demo mode");
    return [
      {
        id: "demo-user-1",
        name: "Demo Friend 1",
        avatar: undefined,
        bio: "Another demo user you can follow",
        followers: [],
        following: [],
        postsCount: 5,
        reviewsCount: 3,
      },
      {
        id: "demo-user-2",
        name: "Demo Friend 2",
        avatar: undefined,
        bio: "Yet another demo user for testing",
        followers: [],
        following: [],
        postsCount: 2,
        reviewsCount: 1,
      },
    ].filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.bio.toLowerCase().includes(query.toLowerCase()),
    );
  }
}

export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  try {
    return await database.getDocument<UserProfile>(["users", userId]);
  } catch (error) {
    console.log("🎭 Mock user profile for demo mode");
    return {
      id: userId,
      name: "Demo User",
      avatar: undefined,
      bio: "This is a demo profile.",
      followers: [],
      following: [],
      postsCount: 0,
      reviewsCount: 0,
    };
  }
}

export async function updateUserProfile(
  profile: Partial<UserProfile>,
): Promise<void> {
  try {
    const uid = getUserId();
    await database.update(["users", uid], profile);
  } catch (error) {
    console.log("🎭 Mock profile update for demo mode");
  }
}

// Sistema de seguir
export async function followUser(targetUserId: string): Promise<void> {
  try {
    const uid = getUserId();

    // Adicionar à lista de seguindo do usuário atual
    const currentProfile = await getUserProfile(uid);
    const following = [...(currentProfile?.following || []), targetUserId];
    await database.update(["users", uid], { following });

    // Adicionar à lista de seguidores do usuário alvo
    const targetProfile = await getUserProfile(targetUserId);
    const followers = [...(targetProfile?.followers || []), uid];
    await database.update(["users", targetUserId], { followers });

    // Criar notificação
    await createNotification(targetUserId, {
      type: "follow",
      title: "Novo seguidor",
      message: `${currentProfile?.name || "Alguém"} começou a seguir você`,
      actionUserId: uid,
    });
  } catch (error) {
    console.log("🎭 Mock follow action for demo mode");
  }
}

export async function unfollowUser(targetUserId: string): Promise<void> {
  try {
    const uid = getUserId();

    // Remover da lista de seguindo do usuário atual
    const currentProfile = await getUserProfile(uid);
    const following = (currentProfile?.following || []).filter(
      (id) => id !== targetUserId,
    );
    await database.update(["users", uid], { following });

    // Remover da lista de seguidores do usuário alvo
    const targetProfile = await getUserProfile(targetUserId);
    const followers = (targetProfile?.followers || []).filter(
      (id) => id !== uid,
    );
    await database.update(["users", targetUserId], { followers });
  } catch (error) {
    console.log("🎭 Mock unfollow action for demo mode");
  }
}

export async function isFollowing(
  userId: string,
  targetUserId: string,
): Promise<boolean> {
  try {
    const profile = await getUserProfile(userId);
    return profile?.following?.includes(targetUserId) || false;
  } catch (error) {
    return false;
  }
}

// Atividades
export async function getFollowingActivities(): Promise<UserActivity[]> {
  try {
    const uid = getUserId();
    const profile = await getUserProfile(uid);
    const following = profile?.following || [];

    if (following.length === 0) return [];

    const activities = await database.getCollection<UserActivity>([
      "activities",
    ]);
    return activities
      .map((doc) => ({ ...doc.data, id: doc.id }))
      .filter((activity) => following.includes(activity.userId))
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 50);
  } catch (error) {
    // Database error, likely in demo mode - return mock data
    console.log("🎭 Database error, returning mock activities for demo mode");
    return [
      {
        id: "activity1",
        userId: "demo-user-123",
        type: "review",
        content: "Demo user reviewed a great game!",
        timestamp: new Date().toISOString(),
        metadata: { title: "Demo Game", rating: 5 },
      },
      {
        id: "activity2",
        userId: "demo-user-123",
        type: "milestone",
        content: "Demo user reached a new milestone!",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        metadata: { title: "First Review" },
      },
    ];
  }
}

// Notificações
export async function createNotification(
  userId: string,
  notification: Omit<Notification, "id" | "userId" | "timestamp" | "read">,
): Promise<void> {
  try {
    const notificationData = {
      ...notification,
      userId,
      timestamp: new Date().toISOString(),
      read: false,
    };
    await database.add(["users", userId, "notifications"], notificationData);
  } catch (error) {
    console.log("🎭 Mock notification creation for demo mode");
  }
}

export async function getUserNotifications(
  userId: string,
): Promise<Notification[]> {
  try {
    const notifications = await database.getCollection<Notification>([
      "users",
      userId,
      "notifications",
    ]);
    return notifications
      .map((doc) => ({ ...doc.data, id: doc.id }))
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
  } catch (error) {
    console.log("🎭 Mock notifications for demo mode");
    return [];
  }
}

export async function markNotificationAsRead(
  userId: string,
  notificationId: string,
): Promise<void> {
  try {
    await database.update(["users", userId, "notifications", notificationId], {
      read: true,
    });
  } catch (error) {
    console.log("🎭 Mock notification mark as read for demo mode");
  }
}

// Solicitações de amizade
export async function sendFollowRequest(targetUserId: string): Promise<void> {
  try {
    const uid = getUserId();
    const currentProfile = await getUserProfile(uid);

    const requestData: Omit<FollowRequest, "id"> = {
      fromUserId: uid,
      toUserId: targetUserId,
      timestamp: new Date().toISOString(),
      status: "pending",
    };

    await database.add(["followRequests"], requestData);

    // Criar notificação
    await createNotification(targetUserId, {
      type: "follow_request",
      title: "Solicitação de amizade",
      message: `${currentProfile?.name || "Alguém"} quer ser seu amigo`,
      actionUserId: uid,
    });
  } catch (error) {
    console.log("🎭 Mock follow request for demo mode");
  }
}

export async function respondToFollowRequest(
  requestId: string,
  accept: boolean,
): Promise<void> {
  try {
    const status = accept ? "accepted" : "rejected";
    await database.update(["followRequests", requestId], { status });

    if (accept) {
      const request = await database.getDocument<FollowRequest>([
        "followRequests",
        requestId,
      ]);
      if (request) {
        await followUser(request.fromUserId);
      }
    }
  } catch (error) {
    console.log("🎭 Mock follow request response for demo mode");
  }
}

export async function getPendingFollowRequests(
  userId: string,
): Promise<FollowRequest[]> {
  try {
    const requests = await database.getCollection<FollowRequest>([
      "followRequests",
    ]);
    return requests
      .map((doc) => ({ ...doc.data, id: doc.id }))
      .filter((req) => req.toUserId === userId && req.status === "pending")
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
  } catch (error) {
    console.log("🎭 Mock follow requests for demo mode");
    return [];
  }
}
