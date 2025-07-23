import type { MediaItem } from "../App";
import { getUserId, removeUndefinedFields, sanitizeStrings } from "./utils";
import { database } from "./database";
import { storageClient } from "./storageClient";
import secureLog from "../utils/secureLogger";

// Interface para atualização de mídia (exceto ID, que é passado separado)
export interface UpdateMediaData extends Partial<Omit<MediaItem, "id">> {
  coverFile?: File;
}

// Interface para adição de mídia
export interface AddMediaData extends Omit<MediaItem, "id" | "createdAt" | "updatedAt"> {
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

export async function addMedia(data: AddMediaData): Promise<MediaItem> {
  const uid = getUserId();

  if (!uid || typeof uid !== "string") {
    throw new Error("Usuário não autenticado ou UID inválido");
  }

  const now = new Date().toISOString();
  const { coverFile, ...mediaData } = data;

  const sanitizedData = sanitizeStrings(mediaData as Record<string, any>);
  const toSave: Omit<MediaItem, "id"> = removeUndefinedFields({
    ...sanitizedData,
    createdAt: now,
    updatedAt: now,
    tags: Array.isArray(sanitizedData.tags) ? sanitizedData.tags : []
  });

  // Add the media document
  const docRef = await database.add(["users", uid, "medias"], toSave);
  const mediaId = docRef.id;

  let coverUrl: string | undefined;

  // Upload cover image if provided
  if (coverFile instanceof File) {
    try {
      coverUrl = await storageClient.upload(`media/${mediaId}`, coverFile);
      await database.update(["users", uid, "medias", mediaId], { cover: coverUrl });
    } catch (err) {
      console.error("Erro ao fazer upload da capa:", err);
    }
  }

  return {
    id: mediaId,
    ...toSave,
    cover: coverUrl || toSave.cover
  } as MediaItem;
}

export async function getMedias(): Promise<MediaItem[]> {
  const uid = getUserId();

  if (!uid) {
    console.warn("User not authenticated, returning empty array");
    return [];
  }

  try {
    console.log("🔍 Fetching medias for user:", uid);
    const medias = await database.getCollection(["users", uid, "medias"]);
    console.log("📦 Raw medias from database:", medias);

    const processedMedias = medias
      .filter(media => {
        // Filter out any media items without valid IDs
        const hasValidId = media.id && typeof media.id === "string" && media.id.trim() !== "";
        if (!hasValidId) {
          console.warn("⚠️ Documento de mídia encontrado sem ID válido:", media);
        }
        return hasValidId;
      })
      .map(media => {
        const processedMedia = {
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
        };
        console.log("✅ Processed media item:", { id: processedMedia.id, title: processedMedia.title });
        return processedMedia;
      });

    console.log("📋 Final processed medias count:", processedMedias.length);
    return processedMedias;
  } catch (error) {
    console.error("❌ Error fetching medias:", error);
    return [];
  }
}

export async function deleteMedia(id: string): Promise<void> {
  if (!id || typeof id !== "string" || id.trim() === "") {
    throw new Error("ID da mídia é obrigatório e deve ser uma string válida");
  }

  const uid = getUserId();
  if (!uid) {
    throw new Error("Usuário não autenticado");
  }

  await database.delete(["users", uid, "medias", id]);
  secureLog.info("🗑️ Documento de mídia removido", { id });
  try {
    await storageClient.remove(`media/${id}`);
  } catch (error) {
    secureLog.warn("Falha ao remover arquivo da mídia", error);
  }
}
