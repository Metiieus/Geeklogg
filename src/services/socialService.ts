import { database } from './database';
import { getUserId } from './utils';
import { UserProfile, UserActivity, Notification, FollowRequest } from '../types/social';

// Perfis de usuários
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  return await database.getDocument<UserProfile>(['users', userId]);
}

export async function updateUserProfile(profile: Partial<UserProfile>): Promise<void> {
  const uid = getUserId();
  await database.set(['users', uid], profile, { merge: true });
}

export async function searchUsers(query: string): Promise<UserProfile[]> {
  // Implementação simplificada - em produção usaria índices do Firestore
  const allUsers = await database.getCollection<UserProfile>(['users']);
  return allUsers
    .map(doc => ({ ...doc.data, uid: doc.id }))
    .filter(user => 
      user.isPublic && 
      user.name.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 10);
}

// Sistema de seguir
export async function followUser(targetUserId: string): Promise<void> {
  const uid = getUserId();
  
  // Adicionar à lista de seguindo do usuário atual
  const currentProfile = await getUserProfile(uid);
  const following = currentProfile?.following || [];
  if (!following.includes(targetUserId)) {
    following.push(targetUserId);
    await database.update(['users', uid], { following });
  }

  // Adicionar à lista de seguidores do usuário alvo
  const targetProfile = await getUserProfile(targetUserId);
  const followers = targetProfile?.followers || [];
  if (!followers.includes(uid)) {
    followers.push(uid);
    await database.update(['users', targetUserId], { followers });
    
    // Criar notificação
    await createNotification(targetUserId, {
      fromUserId: uid,
      fromUserName: currentProfile?.name || 'Usuário',
      fromUserAvatar: currentProfile?.avatar,
      type: 'new_follower',
      title: 'Novo seguidor!',
      message: `${currentProfile?.name || 'Usuário'} começou a te seguir`,
    });
  }
}

export async function unfollowUser(targetUserId: string): Promise<void> {
  const uid = getUserId();
  
  // Remover da lista de seguindo do usuário atual
  const currentProfile = await getUserProfile(uid);
  const following = (currentProfile?.following || []).filter(id => id !== targetUserId);
  await database.update(['users', uid], { following });

  // Remover da lista de seguidores do usuário alvo
  const targetProfile = await getUserProfile(targetUserId);
  const followers = (targetProfile?.followers || []).filter(id => id !== uid);
  await database.update(['users', targetUserId], { followers });
}

export async function isFollowing(targetUserId: string): Promise<boolean> {
  const uid = getUserId();
  const profile = await getUserProfile(uid);
  return (profile?.following || []).includes(targetUserId);
}

// Atividades
export async function createActivity(activity: Omit<UserActivity, 'id' | 'timestamp'>): Promise<void> {
  const uid = getUserId();
  const activityData = {
    ...activity,
    userId: uid,
    timestamp: new Date().toISOString()
  };
  
  await database.add(['activities'], activityData);
  
  // Notificar seguidores (com debounce)
  await notifyFollowers(uid, activityData);
}

export async function getFollowingActivities(): Promise<UserActivity[]> {
  const uid = getUserId();
  const profile = await getUserProfile(uid);
  const following = profile?.following || [];
  
  if (following.length === 0) return [];
  
  const activities = await database.getCollection<UserActivity>(['activities']);
  return activities
    .map(doc => ({ ...doc.data, id: doc.id }))
    .filter(activity => following.includes(activity.userId))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 50);
}

// Notificações
export async function createNotification(
  userId: string, 
  notification: Omit<Notification, 'id' | 'userId' | 'timestamp' | 'read'>
): Promise<void> {
  const notificationData = {
    ...notification,
    userId,
    read: false,
    timestamp: new Date().toISOString()
  };
  
  await database.add(['users', userId, 'notifications'], notificationData);
}

export async function getNotifications(): Promise<Notification[]> {
  const uid = getUserId();
  const notifications = await database.getCollection<Notification>(['users', uid, 'notifications']);
  return notifications
    .map(doc => ({ ...doc.data, id: doc.id }))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const uid = getUserId();
  await database.update(['users', uid, 'notifications', notificationId], { read: true });
}

export async function markAllNotificationsAsRead(): Promise<void> {
  const uid = getUserId();
  const notifications = await getNotifications();
  const unreadNotifications = notifications.filter(n => !n.read);
  
  for (const notification of unreadNotifications) {
    await database.update(['users', uid, 'notifications', notification.id], { read: true });
  }
}

// Sistema de debounce para notificações
const userActivityBuffer = new Map<string, { activities: UserActivity[], timeout: NodeJS.Timeout }>();

async function notifyFollowers(userId: string, activity: UserActivity): Promise<void> {
  const profile = await getUserProfile(userId);
  const followers = profile?.followers || [];
  
  if (followers.length === 0) return;
  
  // Implementar debounce - agrupar atividades em 5 minutos
  const bufferKey = userId;
  const existingBuffer = userActivityBuffer.get(bufferKey);
  
  if (existingBuffer) {
    clearTimeout(existingBuffer.timeout);
    existingBuffer.activities.push(activity);
  } else {
    userActivityBuffer.set(bufferKey, {
      activities: [activity],
      timeout: setTimeout(() => {}, 0) // Placeholder
    });
  }
  
  const buffer = userActivityBuffer.get(bufferKey)!;
  buffer.timeout = setTimeout(async () => {
    const activities = buffer.activities;
    userActivityBuffer.delete(bufferKey);
    
    // Criar notificação agrupada
    let message = '';
    if (activities.length === 1) {
      const act = activities[0];
      message = getActivityMessage(act);
    } else {
      message = `${profile?.name} fez ${activities.length} atualizações recentes`;
    }
    
    // Notificar todos os seguidores
    for (const followerId of followers) {
      await createNotification(followerId, {
        fromUserId: userId,
        fromUserName: profile?.name || 'Usuário',
        fromUserAvatar: profile?.avatar,
        type: 'activity_update',
        title: 'Nova atividade!',
        message,
        activityId: activities[0].id
      });
    }
  }, 5 * 60 * 1000); // 5 minutos
}

function getActivityMessage(activity: UserActivity): string {
  switch (activity.type) {
    case 'media_added':
      return `adicionou "${activity.mediaTitle}" à biblioteca`;
    case 'media_completed':
      return `finalizou "${activity.mediaTitle}"`;
    case 'review_added':
      return `escreveu uma resenha: "${activity.title}"`;
    case 'milestone_added':
      return `alcançou um novo marco: "${activity.title}"`;
    case 'achievement_unlocked':
      return `desbloqueou a conquista: "${activity.title}"`;
    default:
      return 'fez uma atualização';
  }
}