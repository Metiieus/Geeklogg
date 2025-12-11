// src/services/socialService.ts
import { devLog } from "../utils/logger";
import { database } from "./database";
import {
  getUserId,
  ensureValidId,
  removeUndefinedFields,
  sanitizeStrings,
} from "./utils";
import type {
  UserProfile,
  UserActivity,
  Notification,
  FollowRequest,
} from "../types/social";

// Mock users para caso o banco esteja vazio
function getMockUsers(query: string): UserProfile[] {
  const mockUsers: UserProfile[] = [
    {
      id: "mock1",
      uid: "mock1",
      name: "Demo User",
      bio: "Demo",
      avatar: "",
      email: "",
      followers: [],
      following: [],
      postsCount: 0,
      reviewsCount: 0,
    },
    {
      id: "mock2",
      uid: "mock2",
      name: "Test User",
      bio: "Test",
      avatar: "",
      email: "",
      followers: [],
      following: [],
      postsCount: 0,
      reviewsCount: 0,
    },
  ];
  return mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      (u.bio || "").toLowerCase().includes(query.toLowerCase()),
  );
}

// Busca usuários pelo nome/bio
export async function searchUsers(query: string): Promise<UserProfile[]> {
  if (query.trim().length < 2) return [];

  try {
    devLog.log("📋 Tentando buscar usuários no banco...");
    const usersRaw = await database.getCollection<any>(["users"]);
    if (usersRaw.length === 0) return getMockUsers(query);

    const mapped = await Promise.all(
      usersRaw.map(async (doc) => {
        const data = doc.data as any;
        const [followers, following] = await Promise.all([
          database.getCollection<any>(["users", doc.id, "followers"]),
          database.getCollection<any>(["users", doc.id, "following"]),
        ]);
        return {
          id: doc.id,
          uid: data.uid || doc.id,
          name: data.name || data.nome || "Usuário Anônimo",
          bio: data.bio || "",
          avatar: data.avatar || "",
          email: data.email || "",
          followers: followers.map((f) => f.id),
          following: following.map((f) => f.id),
          postsCount: data.postsCount || 0,
          reviewsCount: data.reviewsCount || 0,
        } as UserProfile;
      }),
    );

    const filtered = mapped
      .filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          (u.bio || "").toLowerCase().includes(query.toLowerCase()),
      )
      .slice(0, 20);

    return filtered.length ? filtered : getMockUsers(query);
  } catch (err) {
    devLog.error("❌ Erro na busca, usando mock:", err);
    return getMockUsers(query);
  }
}

// Obtém um perfil completo de outro usuário
export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  ensureValidId(userId, "getUserProfile: userId inválido");

  try {
    const snap = await database.get(["users"], userId);
    if (!snap.exists()) return null;

    const data = snap.data() as any;
    const [followers, following] = await Promise.all([
      database.getCollection<any>(["users", userId, "followers"]),
      database.getCollection<any>(["users", userId, "following"]),
    ]);

    return {
      id: snap.id,
      uid: data.uid || snap.id,
      name: data.name || data.nome || "Usuário Anônimo",
      bio: data.bio || "",
      avatar: data.avatar || "",
      email: data.email || "",
      followers: followers.map((f) => f.id),
      following: following.map((f) => f.id),
      postsCount: data.postsCount || 0,
      reviewsCount: data.reviewsCount || 0,
    };
  } catch (err) {
    devLog.error("Erro ao buscar perfil:", err);
    return null;
  }
}

// Atualiza o próprio perfil
export async function updateUserProfile(
  profile: Partial<UserProfile>,
): Promise<void> {
  const uid = getUserId();
  ensureValidId(uid, "updateUserProfile: UID inválido");
  const toUpdate = removeUndefinedFields(sanitizeStrings(profile as any));
  await database.update("users", uid, toUpdate);
}

// Seguir / deixar de seguir
export async function followUser(targetUserId: string): Promise<void> {
  const uid = getUserId();
  ensureValidId(uid, "followUser: UID inválido");
  ensureValidId(targetUserId, "followUser: targetUserId inválido");

  await database.set(["users", uid, "following"], targetUserId, {
    createdAt: new Date().toISOString(),
  });
  await database.set(["users", targetUserId, "followers"], uid, {
    createdAt: new Date().toISOString(),
  });

  const me = await getUserProfile(uid);
  await createNotification(targetUserId, {
    type: "new_follower",
    title: "Novo seguidor",
    message: `${me?.name || "Alguém"} começou a seguir você`,
    fromUserId: uid,
    fromUserName: me?.name || "",
    fromUserAvatar: me?.avatar,
  });
}

export async function unfollowUser(targetUserId: string): Promise<void> {
  const uid = getUserId();
  ensureValidId(uid, "unfollowUser: UID inválido");
  ensureValidId(targetUserId, "unfollowUser: targetUserId inválido");

  await database.delete(["users", uid, "following"], targetUserId);
  await database.delete(["users", targetUserId, "followers"], uid);
}

export async function isFollowing(targetUserId: string): Promise<boolean> {
  const uid = getUserId();
  ensureValidId(uid, "isFollowing: UID inválido");
  const doc = await database.get(["users", uid, "following"], targetUserId);
  return doc.exists();
}

// Feed de atividades
export async function getFollowingActivities(): Promise<UserActivity[]> {
  const uid = getUserId();
  ensureValidId(uid, "getFollowingActivities: UID inválido");

  const followingDocs = await database.getCollection<any>([
    "users",
    uid,
    "following",
  ]);
  const following = followingDocs.map((d) => d.id);
  if (!following.length) return [];

  const acts = await database.getCollection<UserActivity>(["activities"]);
  return acts
    .filter((a) => following.includes(a.userId))
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, 50);
}

// Notificações
export async function createNotification(
  userId: string,
  notification: Omit<Notification, "id" | "userId" | "timestamp" | "read">,
): Promise<void> {
  ensureValidId(userId, "createNotification: userId inválido");
  const payload = {
    ...notification,
    userId,
    timestamp: new Date().toISOString(),
    read: false,
  };
  await database.add(["users", userId, "notifications"], payload);
}

export async function getUserNotifications(
  userId: string,
): Promise<Notification[]> {
  ensureValidId(userId, "getUserNotifications: userId inválido");
  const nots = await database.getCollection<Notification>([
    "users",
    userId,
    "notifications",
  ]);
  return nots
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
}

export async function markNotificationAsRead(
  userId: string,
  notificationId: string,
): Promise<void> {
  ensureValidId(userId, "markNotificationAsRead: userId inválido");
  ensureValidId(
    notificationId,
    "markNotificationAsRead: notificationId inválido",
  );
  await database.update(["users", userId, "notifications"], notificationId, {
    read: true,
  });
}

// Follow requests (opcional)
export async function sendFollowRequest(targetUserId: string): Promise<void> {
  const uid = getUserId();
  ensureValidId(uid, "sendFollowRequest: UID inválido");
  ensureValidId(targetUserId, "sendFollowRequest: targetUserId inválido");

  const me = await getUserProfile(uid);
  const req: Omit<FollowRequest, "id"> = {
    fromUserId: uid,
    toUserId: targetUserId,
    fromUserName: me?.name || "Usuário",
    fromUserAvatar: me?.avatar,
    timestamp: new Date().toISOString(),
    status: "pending",
  };
  await database.add(["followRequests"], req);
  await createNotification(targetUserId, {
    type: "follow_request",
    title: "Solicitação de amizade",
    message: `${me?.name || "Alguém"} quer ser seu amigo`,
    fromUserId: uid,
    fromUserName: me?.name || "",
    fromUserAvatar: me?.avatar,
  });
}

export async function respondToFollowRequest(
  requestId: string,
  accept: boolean,
): Promise<void> {
  ensureValidId(requestId, "respondToFollowRequest: requestId inválido");
  const status = accept ? "accepted" : "rejected";
  await database.update(["followRequests"], requestId, { status });
  if (accept) {
    const req = await database.get(["followRequests"], requestId);
    if (req.exists())
      await followUser((req.data() as FollowRequest).fromUserId);
  }
}

export async function getPendingFollowRequests(
  userId: string,
): Promise<FollowRequest[]> {
  ensureValidId(userId, "getPendingFollowRequests: userId inválido");
  const all = await database.getCollection<FollowRequest>(["followRequests"]);
  return all
    .filter((r) => r.toUserId === userId && r.status === "pending")
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
}

export async function markAllNotificationsAsRead(): Promise<void> {
  const uid = getUserId();
  ensureValidId(uid, "markAllNotificationsAsRead: UID inválido");
  devLog.log("📖 (implementação futura) marcar todas como lidas para", uid);
}
