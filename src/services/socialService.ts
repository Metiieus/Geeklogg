import { database } from "./database";
import { getUserId } from "./utils";
import {
  UserProfile,
  UserActivity,
  Notification,
  FollowRequest,
} from "../types/social";

// Mock users function for fallback when database is empty
function getMockUsers(query: string): UserProfile[] {
  const mockUsers: UserProfile[] = [
    {
      id: "mock1",
      uid: "mock1",
      name: "Demo User",
      bio: "This is a demo user account",
      avatar: "",
      email: "demo@example.com",
      followers: [],
      following: [],
      postsCount: 0,
      reviewsCount: 0,
    },
    {
      id: "mock2",
      uid: "mock2",
      name: "Test User",
      bio: "Another test user for demonstration",
      avatar: "",
      email: "test@example.com",
      followers: [],
      following: [],
      postsCount: 0,
      reviewsCount: 0,
    },
  ];

  // Filter mock users based on query
  return mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.bio.toLowerCase().includes(query.toLowerCase()),
  );
}

// Perfis de usuários
export async function searchUsers(query: string): Promise<UserProfile[]> {
  console.log("🔍 Buscando usuários:", { query });

  if (!query.trim()) {
    console.log("❌ Query vazia, retornando lista vazia");
    return [];
  }

  // Se query for muito curta, não buscar ainda
  if (query.length < 2) {
    console.log("⏳ Query muito curta, aguardando mais caracteres");
    return [];
  }

  try {
    console.log("📋 Tentando buscar usuários no banco...");

    // Primeiro tentar buscar usuários
    const users = await database.getCollection<any>(["users"]);
    console.log("✅ Dados brutos encontrados:", users.length);

    if (users.length === 0) {
      console.log("⚠️ Nenhum usuário encontrado no banco, usando mock data");
      // Não lançar erro, apenas usar mock data
      return getMockUsers(query);
    }

    // Mapear e filtrar usuários
    const mappedUsers = await Promise.all(
      users.map(async (doc) => {
        const data = doc.data || doc;
        const followers = await database.getCollection<any>([
          "users",
          doc.id,
          "followers",
        ]);
        const following = await database.getCollection<any>([
          "users",
          doc.id,
          "following",
        ]);
        return {
          id: doc.id,
          uid: data.uid || doc.id,
          name: data.name || data.nome || "Usuário Anônimo",
          bio: data.bio || "",
          avatar: data.avatar,
          email: data.email,
          followers: followers.map((f) => f.id),
          following: following.map((f) => f.id),
          postsCount: data.postsCount || 0,
          reviewsCount: data.reviewsCount || 0,
        } as UserProfile;
      }),
    );

    const filtered = mappedUsers.filter((user) => {
      const nameMatch = user.name?.toLowerCase().includes(query.toLowerCase());
      const bioMatch = user.bio?.toLowerCase().includes(query.toLowerCase());
      return nameMatch || bioMatch;
    });

    const result = filtered.slice(0, 20);

    console.log("🎯 Usuários filtrados:", result.length);
    return result;
  } catch (error) {
    console.error("❌ Erro na busca do banco, usando dados mock:", error);
    return getMockUsers(query);
  }
}

export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  try {
    const data = await database.getDocument<UserProfile>(["users", userId]);
    if (!data) return null;
    const [followers, following] = await Promise.all([
      database.getCollection<any>(["users", userId, "followers"]),
      database.getCollection<any>(["users", userId, "following"]),
    ]);
    return {
      ...data,
      followers: followers.map((f) => f.id),
      following: following.map((f) => f.id),
    } as UserProfile;
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error);
    return null;
  }
}

export async function updateUserProfile(
  profile: Partial<UserProfile>,
): Promise<void> {
  try {
    const uid = getUserId();
    await database.update(["users", uid], profile);
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    throw error;
  }
}

// Sistema de seguir
export async function followUser(targetUserId: string): Promise<void> {
  try {
    const uid = getUserId();
    await database.set(["users", uid, "following", targetUserId], {
      createdAt: new Date().toISOString(),
    });
    await database.set(["users", targetUserId, "followers", uid], {
      createdAt: new Date().toISOString(),
    });

    const currentProfile = await getUserProfile(uid);

    await createNotification(targetUserId, {
      type: "new_follower",
      title: "Novo seguidor",
      message: `${currentProfile?.name || "Alguém"} começou a seguir você`,
      fromUserId: uid,
      fromUserName: currentProfile?.name || "Alguém",
      fromUserAvatar: currentProfile?.avatar,
    });
  } catch (error) {
    console.error("Erro ao seguir usuário:", error);
    throw error;
  }
}

export async function unfollowUser(targetUserId: string): Promise<void> {
  try {
    const uid = getUserId();
    await database.delete(["users", uid, "following", targetUserId]);
    await database.delete(["users", targetUserId, "followers", uid]);
  } catch (error) {
    console.error("Erro ao parar de seguir usuário:", error);
    throw error;
  }
}

export async function isFollowing(
  userId: string,
  targetUserId: string,
): Promise<boolean> {
  try {
    const doc = await database.getDocument<any>([
      "users",
      userId,
      "following",
      targetUserId,
    ]);
    return !!doc;
  } catch (error) {
    return false;
  }
}

// Atividades
export async function getFollowingActivities(): Promise<UserActivity[]> {
  try {
    const uid = getUserId();
    const followingDocs = await database.getCollection<any>([
      "users",
      uid,
      "following",
    ]);
    const following = followingDocs.map((d) => d.id);

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
    console.error("Erro ao buscar atividades:", error);
    return [];
  }
}

// Notificações
export async function createNotification(
  userId: string,
  notification: Omit<Notification, "id" | "userId" | "timestamp" | "read">,
): Promise<void> {
  try {
    const notificationData: Record<string, unknown> = {
      ...notification,
      userId,
      timestamp: new Date().toISOString(),
      read: false,
    };

    Object.keys(notificationData).forEach((key) => {
      if (notificationData[key] === undefined) delete notificationData[key];
    });

    await database.add(["users", userId, "notifications"], notificationData);
  } catch (error) {
    console.error("Erro ao criar notificação:", error);
    throw error;
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
    console.error("Erro ao buscar notificações:", error);
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
    console.error("Erro ao marcar notificação como lida:", error);
    throw error;
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
      fromUserId: uid,
      fromUserName: currentProfile?.name || "Alguém",
      fromUserAvatar: currentProfile?.avatar,
    });
  } catch (error) {
    console.error("Erro ao enviar solicitação:", error);
    throw error;
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
    console.error("Erro ao responder solicitação:", error);
    throw error;
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
    console.error("Erro ao buscar solicitações:", error);
    return [];
  }
}

// Funções simplificadas de notificação
export async function markAllNotificationsAsRead(): Promise<void> {
  try {
    const userId = getUserId();
    // Por enquanto, implementação simplificada
    console.log("Marcando todas as notificações como lidas para:", userId);
  } catch (error) {
    console.error("Erro ao marcar todas as notificações como lidas:", error);
  }
}

// Notificações
export async function getNotifications(): Promise<Notification[]> {
  try {
    const userId = getUserId();
    const notifications = await database.getCollection<Notification>([
      "notifications",
    ]);
    return notifications
      .map((doc) => ({ ...doc.data, id: doc.id }))
      .filter((notif) => notif.toUserId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  } catch (error) {
    console.error("Erro ao buscar notificações:", error);
    return [];
  }
}
