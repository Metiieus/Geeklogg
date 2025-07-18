import type { MediaItem } from "../App";
import { getUserId, removeUndefinedFields, sanitizeStrings } from "./utils";
import { database } from "./database";
import { storageClient } from "./storageClient";

export async function getMedias(): Promise<MediaItem[]> {
  const uid = getUserId();
  if (!uid) {
    console.warn("User not authenticated, returning empty media list");
    return [];
  }
  const snapshot = await database.getCollection<Omit<MediaItem, "id">>([
    "users",
    uid,
    "medias",
  ]);
  return snapshot.map((d) => ({ id: d.id, ...(d.data || d) }));
}

export interface AddMediaData
  extends Omit<MediaItem, "id" | "createdAt" | "updatedAt" | "cover"> {
  coverFile?: File;
  cover?: string; // URL externa da imagem
}

export async function addMedia(data: AddMediaData): Promise<MediaItem> {
  const uid = getUserId();
  const now = new Date().toISOString();
  const { coverFile, cover: externalCoverUrl, ...rest } = data;
  const sanitized = sanitizeStrings(rest as Record<string, any>);
  const toSave: Omit<MediaItem, "id"> = removeUndefinedFields({
    ...(sanitized as Omit<MediaItem, "id">),
    createdAt: now,
    updatedAt: now,
    // Se há URL externa e não há arquivo para upload, usar a URL externa
    ...(externalCoverUrl && !coverFile && { cover: externalCoverUrl }),
  });
  const docRef = await database.add(["users", uid, "medias"], toSave);

  let finalCoverUrl: string | undefined = externalCoverUrl;

  // Upload de arquivo tem prioridade sobre URL externa
  if (coverFile instanceof File) {
    try {
      finalCoverUrl = await storageClient.upload(
        `media/${docRef.id}`,
        coverFile,
      );
      await database.update(["users", uid, "medias", docRef.id], {
        cover: finalCoverUrl,
      });
    } catch (err) {
      console.error("Erro ao fazer upload da imagem", err);
      // Se falhar o upload mas há URL externa, usar a externa
      if (externalCoverUrl) {
        finalCoverUrl = externalCoverUrl;
      } else {
        // Re-lançar o erro apenas se não há fallback
        throw err;
      }
    }
  }

  return { id: docRef.id, ...toSave, cover: finalCoverUrl };
}

export interface UpdateMediaData extends Partial<Omit<MediaItem, "id">> {
  coverFile?: File;
  // Não precisamos de cover?: string aqui pois UpdateMediaData já herda cover de MediaItem
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

  let coverUrl: string | undefined;
  if (data.coverFile instanceof File) {
    try {
      coverUrl = await storageClient.upload(`media/${id}`, data.coverFile);
      await database.update(["users", uid, "medias", id], { cover: coverUrl });
    } catch (err) {
      console.error("Erro ao atualizar imagem de capa", err);
    }
  }
  return { cover: coverUrl };
}

export async function deleteMedia(id: string): Promise<void> {
  const uid = getUserId();
  await database.delete(["users", uid, "medias", id]);
  console.log("🗑️ Documento de mídia removido:", id);
  await storageClient.remove(`media/${id}`);
}
