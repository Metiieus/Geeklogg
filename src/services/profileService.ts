import { database } from "./database";
import { storageClient } from "./storageClient";
import { getUserId, removeUndefinedFields, sanitizeStrings } from "./utils";

export interface SaveProfileInput {
  name: string;
  bio: string;
  avatarFile?: File;
  coverFile?: File;
}

export interface Profile {
  id: string;
  name: string;
  bio?: string;
  avatar?: string; // URL pública
  cover?: string;  // URL pública
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Salva alterações no perfil do usuário, fazendo upload das imagens se presentes
 * e gravando as URLs em Firestore.
 */
export async function saveProfile(data: SaveProfileInput): Promise<Profile> {
  const uid = getUserId();
  if (!uid) throw new Error("Usuário não autenticado");

  // Carrega os dados existentes do perfil
  const existingProfile = await loadProfile();

  // --------------------
  // 1. Upload de imagens
  // --------------------
  let avatarUrl: string | undefined;
  let coverUrl: string | undefined;

  if (data.avatarFile instanceof File) {
    avatarUrl = await storageClient.upload(`users/${uid}/avatar.jpg`, data.avatarFile);
  }
  if (data.coverFile instanceof File) {
    coverUrl = await storageClient.upload(`users/${uid}/cover.jpg`, data.coverFile);
  }

  // ---------------------------
  // 2. Atualiza Firestore (merge)
  // ---------------------------
  const now = new Date().toISOString();
  const payload = removeUndefinedFields({
    ...sanitizeStrings({ name: data.name, bio: data.bio }),
    ...(avatarUrl && { avatar: avatarUrl }),
    ...(coverUrl && { cover: coverUrl }),
    updatedAt: now,
  });

  await database.set(["users"], uid, payload, { merge: true });

  return {
    id: uid,
    name: data.name,
    bio: data.bio,
    avatar: avatarUrl || existingProfile?.avatar,
    cover: coverUrl || existingProfile?.cover,
    updatedAt: now,
  };
}

/**
 * Carrega o perfil do usuário logado.
 */
export async function loadProfile(): Promise<Profile | null> {
  const uid = getUserId();
  if (!uid) return null;

  const doc = await database.getDoc(["users"], uid);
  if (!doc) return null;

  return {
    id: uid,
    ...doc,
  } as Profile;
}
