import type { MediaItem } from "../App";
import { getUserId, removeUndefinedFields, sanitizeStrings } from "./utils";
import { database } from "./database";
import { storageClient } from "./storageClient";
import secureLog from "../utils/secureLogger";

export async function getMedias(): Promise<MediaItem[]> {
  const uid = getUserId();
  const snapshot = await database.getCollection<Omit<MediaItem, "id">>([
    "users",
    uid,
    "medias",
  ]);
  return snapshot.map((d) => ({ id: d.id, ...d.data }));
}

export interface AddMediaData
  extends Omit<MediaItem, "id" | "createdAt" | "updatedAt" | "cover"> {
  coverFile?: File;
}

export async function addMedia(data: AddMediaData): Promise<MediaItem> {
  const uid = getUserId();
  const now = new Date().toISOString();
  const { coverFile, ...rest } = data;
  const sanitized = sanitizeStrings(rest as Record<string, any>);
  const toSave: Omit<MediaItem, "id"> = removeUndefinedFields({
    ...(sanitized as Omit<MediaItem, "id">),
    createdAt: now,
    updatedAt: now,
  });
  const docRef = await database.add(["users", uid, "medias"], toSave);
  console.log("📝 Mídia criada no Firestore com ID:", docRef.id);

  let coverUrl: string | undefined;
  if (coverFile instanceof File) {
    try {
      coverUrl = await storageClient.upload(`media/${docRef.id}`, coverFile);
      await database.update(["users", uid, "medias", docRef.id], {
        cover: coverUrl,
      });
      console.log("✅ URL da imagem salva no documento.");
    } catch (err) {
      console.error("Erro ao fazer upload da imagem", err);
      // Re-lançar o erro para que seja tratado pelo componente
      throw err;
    }
  }

  return { id: docRef.id, ...toSave, cover: coverUrl };
}

export interface UpdateMediaData extends Partial<Omit<MediaItem, "id">> {
  coverFile?: File;
}

export async function updateMedia(
  id: string,
  data: UpdateMediaData,
): Promise<{ cover?: string }> {
  const uid = getUserId();
  const now = new Date().toISOString();
  const toUpdate: Record<string, unknown> = removeUndefinedFields({
    ...sanitizeStrings(data as Record<string, any>),
    updatedAt: now,
  });
  delete (toUpdate as { coverFile?: File }).coverFile;
  await database.set(["users", uid, "medias", id], toUpdate, { merge: true });
  console.log("📝 Mídia atualizada no Firestore:", id);
  let coverUrl: string | undefined;
  if (data.coverFile instanceof File) {
    try {
      coverUrl = await storageClient.upload(`media/${id}`, data.coverFile);
      await database.update(["users", uid, "medias", id], { cover: coverUrl });
      console.log("✅ Imagem de capa atualizada");
    } catch (err) {
      console.error("Erro ao atualizar imagem de capa", err);
    }
  }
  return { cover: coverUrl };
}

export async function deleteMedia(id: string): Promise<void> {
  const uid = getUserId();
  await database.delete(["users", uid, "medias", id]);
  secureLog.info("🗑️ Documento de mídia removido", { id });
  try {
    await storageClient.remove(`media/${id}`);
  } catch (error) {
    secureLog.warn("Falha ao remover arquivo da mídia", error);
  }
}
