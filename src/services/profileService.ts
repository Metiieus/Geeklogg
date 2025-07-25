import { database } from './database';
import { storageClient } from './storageClient';
import { getUserId, removeUndefinedFields, sanitizeStrings } from './utils';
import type { UserSettings } from '../App';

export interface SaveProfileParams {
  name: string;
  bio?: string;
  avatarFile?: File;
  coverFile?: File;
}

export async function saveProfile({ name, bio, avatarFile, coverFile }: SaveProfileParams): Promise<{ avatar?: string; cover?: string }> {
  const uid = getUserId();
  if (!uid) throw new Error('Usuário não autenticado');

  const data: Record<string, any> = removeUndefinedFields(sanitizeStrings({ name, bio }));

  let avatarUrl: string | undefined;
  let coverUrl: string | undefined;

  if (avatarFile) {
    avatarUrl = await storageClient.upload('avatar.jpg', avatarFile);
    data.avatar = avatarUrl;
  }

  if (coverFile) {
    coverUrl = await storageClient.upload('cover.jpg', coverFile);
    data.cover = coverUrl;
  }

  await database.set(['users'], uid, data, { merge: true });
  return { avatar: avatarUrl, cover: coverUrl };
}

export async function loadProfile(userId?: string): Promise<UserSettings | null> {
  try {
    const uid = userId || getUserId();
    if (!uid) return null;

    const userDoc = await database.get(['users'], uid);
    if (!userDoc.exists()) {
      return null;
    }

    const d = userDoc.data();
    const profile: UserSettings = {
      name: d.name || 'Usuário',
      avatar: d.avatar,
      cover: d.cover,
      bio: d.bio || '',
      favorites: d.favorites || { characters: [], games: [], movies: [] },
      theme: d.theme,
      defaultLibrarySort: d.defaultLibrarySort || 'updatedAt',
    };
    return profile;
  } catch (error) {
    console.error('Error loading profile:', error);
    return null;
  }
}
