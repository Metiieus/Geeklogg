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
  console.log("🔥 saveProfile iniciado:", data);

  const uid = getUserId();
  if (!uid) throw new Error("Usuário não autenticado");
  console.log("✅ UID obtido:", uid);

  // Carrega os dados existentes do perfil
  console.log("📖 Carregando perfil existente...");
  const existingProfile = await loadProfile();
  console.log("📋 Perfil existente:", existingProfile);

  // --------------------
  // 1. Upload de imagens
  // --------------------
  let avatarUrl: string | undefined;
  let coverUrl: string | undefined;

  if (data.avatarFile instanceof File) {
    console.log("🖼️ Fazendo upload do avatar...");
    try {
      avatarUrl = await storageClient.upload(`users/${uid}/avatar.jpg`, data.avatarFile);
      console.log("✅ Avatar upload concluído:", avatarUrl);
    } catch (err) {
      console.warn("⚠️ Erro ao fazer upload do avatar (continuando sem avatar):", err);
    }
  }
  if (data.coverFile instanceof File) {
    console.log("🖼️ Fazendo upload da capa...");
    try {
      coverUrl = await storageClient.upload(`users/${uid}/cover.jpg`, data.coverFile);
      console.log("✅ Capa upload concluído:", coverUrl);
    } catch (err) {
      console.warn("⚠️ Erro ao fazer upload da capa (continuando sem capa):", err);
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

  console.log("💾 Payload para salvar no Firestore:", payload);
  console.log("📍 Caminho: users/" + uid);

  try {
    await database.set(["users"], uid, payload, { merge: true });
    console.log("✅ Firestore atualizado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao salvar no Firestore:", error);
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

  console.log("🎉 saveProfile concluído, retornando:", result);
  return result;
}

/**
 * Carrega o perfil do usuário logado.
 */
export async function loadProfile(): Promise<Profile | null> {
  console.log("📖 loadProfile iniciado");

  const uid = getUserId();
  if (!uid) {
    console.log("❌ UID não encontrado no loadProfile");
    return null;
  }
  console.log("✅ UID para loadProfile:", uid);

  try {
    const doc = await database.get(["users"], uid);
    console.log("📄 Documento carregado:", doc);

    if (!doc) {
      console.log("❌ Documento não encontrado");
      return null;
    }

    const profile = {
      id: uid,
      ...doc,
    } as Profile;

    console.log("✅ Perfil carregado:", profile);
    return profile;
  } catch (error) {
    console.error("❌ Erro ao carregar perfil:", error);
    return null;
  }
}
