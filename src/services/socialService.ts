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
    const mappedUsers = users
      .map((doc) => {
        const data = doc.data;
        return {
          id: doc.id,
          uid: data.uid || doc.id,
          name: data.name || data.nome || "Usuário Anônimo",
          bio: data.bio || "",
          avatar: data.avatar,
          email: data.email,
          followers: data.followers || [],
          following: data.following || [],
          postsCount: data.postsCount || 0,
          reviewsCount: data.reviewsCount || 0,
        } as UserProfile;
      })
      .filter((user) => {
        const nameMatch = user.name
          ?.toLowerCase()
          .includes(query.toLowerCase());
        const bioMatch = user.bio?.toLowerCase().includes(query.toLowerCase());
        return nameMatch || bioMatch;
      })
      .slice(0, 20);

    console.log("🎯 Usuários filtrados:", mappedUsers.length);
    return mappedUsers;
  } catch (error) {
    console.error("❌ Erro na busca do banco, usando dados mock:", error);
    return getMockUsers(query);
  }
}

export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  try {
    return await database.getDocument<UserProfile>(["users", userId]);
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
    console.error("Erro ao seguir usuário:", error);
    throw error;
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
    console.error("Erro ao parar de seguir usuário:", error);
    throw error;
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
    const notificationData = {
      ...notification,
      userId,
      timestamp: new Date().toISOString(),
      read: false,
    };
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
      actionUserId: uid,
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
