import { database } from "./database";
import { devLog } from "../utils/logger";
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
  cover?: string; // URL pública
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Salva alterações no perfil do usuário, fazendo upload das imagens se presentes
 * e gravando as URLs em Firestore.
 */
export async function saveProfile(data: SaveProfileInput): Promise<Profile> {
  devLog.log("🔥 saveProfile iniciado:", data);

  const uid = getUserId();
  if (!uid) throw new Error("Usuário não autenticado");
  devLog.log("✅ UID obtido:", uid);

  // Carrega os dados existentes do perfil
  devLog.log("📖 Carregando perfil existente...");
  const existingProfile = await loadProfile();
  devLog.log("📋 Perfil existente:", existingProfile);

  // --------------------
  // 1. Upload de imagens
  // --------------------
  let avatarUrl: string | undefined;
  let coverUrl: string | undefined;

  if (data.avatarFile instanceof File) {
    devLog.log("🖼️ Fazendo upload do avatar...");
    try {
      avatarUrl = await storageClient.upload(
        `users/${uid}/avatar.jpg`,
        data.avatarFile,
      );
      devLog.log("✅ Avatar upload concluído:", avatarUrl);
    } catch (err) {
      devLog.warn(
        "⚠️ Erro ao fazer upload do avatar (continuando sem avatar):",
        err,
      );
    }
  }
  if (data.coverFile instanceof File) {
    devLog.log("🖼️ Fazendo upload da capa...");
    try {
      coverUrl = await storageClient.upload(
        `users/${uid}/cover.jpg`,
        data.coverFile,
      );
      devLog.log("✅ Capa upload concluído:", coverUrl);
    } catch (err) {
      devLog.warn(
        "⚠️ Erro ao fazer upload da capa (continuando sem capa):",
        err,
      );
    }
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

  devLog.log("💾 Payload para salvar no Firestore:", payload);
  devLog.log("📍 Caminho: users/" + uid);

  try {
    await database.set(["users"], uid, payload, { merge: true });
    devLog.log("✅ Firestore atualizado com sucesso!");
  } catch (error) {
    devLog.error("❌ Erro ao salvar no Firestore:", error);
    throw error;
  }

  const result = {
    id: uid,
    name: data.name,
    bio: data.bio,
    avatar: avatarUrl || existingProfile?.avatar,
    cover: coverUrl || existingProfile?.cover,
    updatedAt: now,
  };

  devLog.log("🎉 saveProfile concluído, retornando:", result);
  return result;
}

/**
 * Carrega o perfil do usuário logado.
 */
export async function loadProfile(): Promise<Profile | null> {
  devLog.log("📖 loadProfile iniciado");

  const uid = getUserId();
  if (!uid) {
    devLog.log("❌ UID não encontrado no loadProfile");
    return null;
  }
  devLog.log("✅ UID para loadProfile:", uid);

  try {
    const doc = await database.get(["users"], uid);
    devLog.log("📄 Documento carregado:", doc);

    if (!doc) {
      devLog.log("❌ Documento não encontrado");
      return null;
    }

    const profile = {
      id: uid,
      ...doc,
    } as Profile;

    devLog.log("✅ Perfil carregado:", profile);
    return profile;
  } catch (error) {
    devLog.error("❌ Erro ao carregar perfil:", error);
    return null;
  }
}
