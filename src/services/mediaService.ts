import type { MediaItem } from "../App";
import { getUserId, removeUndefinedFields, sanitizeStrings } from "./utils";
import { database } from "./database";
import { storageClient } from "./storageClient";

// Interface para atualização de mídia (exceto ID, que é passado separado)
export interface UpdateMediaData extends Partial<Omit<MediaItem, "id">> {
  coverFile?: File;
}

export async function updateMedia(
  id: string,
  data: UpdateMediaData,
): Promise<{ cover?: string }> {
  const uid = getUserId();

  if (!uid || typeof uid !== "string") {
    throw new Error("Usuário não autenticado ou UID inválido");
  }

  if (!id || typeof id !== "string" || !id.trim()) {
    throw new Error("ID ausente ou inválido ao tentar atualizar mídia");
  }

  const now = new Date().toISOString();
  const toUpdate: Record<string, unknown> = removeUndefinedFields({
    ...sanitizeStrings(data as Record<string, any>),
    updatedAt: now,
  });

  delete (toUpdate as { coverFile?: File }).coverFile;

  // Atualiza os dados principais da mídia
  await database.set(["users", uid, "medias"], id, toUpdate, { merge: true });

  let coverUrl: string | undefined;

  // Faz upload da imagem de capa, se houver
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

export async function getMedias(): Promise<MediaItem[]> {
  const uid = getUserId();

  if (!uid) {
    console.warn("User not authenticated, returning empty array");
    return [];
  }

  try {
    const medias = await database.getCollection(["users", uid, "medias"]);
    return medias.map(media => ({
      id: media.id,
      title: media.title || "",
      cover: media.cover,
      platform: media.platform,
      status: media.status || "planned",
      rating: media.rating,
      hoursSpent: media.hoursSpent,
      totalPages: media.totalPages,
      currentPage: media.currentPage,
      startDate: media.startDate,
      endDate: media.endDate,
      tags: Array.isArray(media.tags) ? media.tags : [],
      externalLink: media.externalLink,
      type: media.type || "games",
      description: media.description,
      createdAt: media.createdAt || new Date().toISOString(),
      updatedAt: media.updatedAt || new Date().toISOString()
    }));
  } catch (error) {
    console.error("Error fetching medias:", error);
    return [];
  }
}

export async function deleteMedia(id: string): Promise<void> {
  const uid = getUserId();
  await database.delete(["users", uid, "medias", id]);
  console.log("🗑️ Documento de mídia removido:", id);
  await storageClient.remove(`media/${id}`);
}
