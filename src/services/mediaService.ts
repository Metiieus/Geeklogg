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
export interface AddMediaData
  extends Omit<MediaItem, "id" | "createdAt" | "updatedAt"> {
  coverFile?: File;
}

/**
 * Atualiza um documento de mídia.
 * Mantém campos existentes (merge) e faz upload opcional da nova capa.
 */
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

  // Não queremos salvar o File binário no Firestore
  delete (toUpdate as { coverFile?: File }).coverFile;

  // 1️⃣ Atualiza os dados principais (merge mantém o que já existe)
  await database.set(["users", uid, "medias"], id, toUpdate, { merge: true });

  let coverUrl: string | undefined;

  // 2️⃣ Se veio nova imagem de capa, faz upload e salva a URL
  if (data.coverFile instanceof File) {
    try {
      coverUrl = await storageClient.upload(`media/${id}`, data.coverFile);
      await database.update(["users", uid, "medias"], id, { cover: coverUrl });
    } catch (err) {
      console.error("Erro ao atualizar imagem de capa", err);
    }
  }

  return { cover: coverUrl };
}

/**
 * Cria uma nova mídia na biblioteca do usuário.
 */
export async function addMedia(data: AddMediaData): Promise<MediaItem> {
  const uid = getUserId();
  if (!uid || typeof uid !== "string") {
    throw new Error("Usuário não autenticado ou UID inválido");
  }

  const now = new Date().toISOString();
  const { coverFile, ...mediaData } = data;

  const sanitizedData = sanitizeStrings(mediaData as Record<string, any>);

  // Ensure category tag based on type (Portuguese tags as requested)
  const typeToCategoryTag = (t?: string): string | null => {
    switch ((t || "").toLowerCase()) {
      case "game":
      case "games":
        return "game";
      case "movie":
      case "movies":
        return "filme";
      case "tv":
      case "series":
        return "serie";
      case "book":
      case "books":
        return "livro";
      case "anime":
        return "anime";
      default:
        return null;
    }
  };

  const categoryTag = typeToCategoryTag((sanitizedData as any).type);
  let incomingTags: string[] = Array.isArray((sanitizedData as any).tags)
    ? ((sanitizedData as any).tags as string[])
    : [];

  // Normalize, lowercase and ensure category tag is present
  incomingTags = incomingTags
    .map((t) => t.trim().toLowerCase())
    .filter((t) => !!t);
  if (categoryTag && !incomingTags.includes(categoryTag)) {
    incomingTags.unshift(categoryTag);
  }

  if (incomingTags.length === 0) {
    throw new Error(
      "Tags são obrigatórias. Adicione pelo menos uma tag (ex.: game, filme, serie, livro, anime).",
    );
  }

  const toSave: Omit<MediaItem, "id"> = removeUndefinedFields({
    ...sanitizedData,
    createdAt: now,
    updatedAt: now,
    tags: Array.from(new Set(incomingTags)),
  });

  // 1️⃣ Adiciona o documento
  const docRef = await database.add(["users", uid, "medias"], toSave);
  const mediaId = docRef.id;

  let coverUrl: string | undefined;

  // 2️⃣ Faz upload da capa se houver
  if (coverFile instanceof File) {
    try {
      coverUrl = await storageClient.upload(`media/${mediaId}`, coverFile);
      await database.update(["users", uid, "medias"], mediaId, {
        cover: coverUrl,
      });
    } catch (err) {
      console.error("Erro ao fazer upload da capa:", err);
    }
  }

  return {
    id: mediaId,
    ...toSave,
    cover: coverUrl || toSave.cover,
  } as MediaItem;
}

/**
 * Retorna todas as mídias da biblioteca do usuário.
 */
export async function getMedias(): Promise<MediaItem[]> {
  const uid = getUserId();
  if (!uid) {
    console.warn("User not authenticated, returning empty array");
    return [];
  }

  try {
    const medias = await database.getCollection(["users", uid, "medias"]);
    return medias
      .filter((media) => {
        const hasValidId =
          media.id && typeof media.id === "string" && media.id.trim() !== "";
        if (!hasValidId) {
          console.warn("Documento de mídia encontrado sem ID válido:", media);
        }
        return hasValidId;
      })
      .map((media) => {
        // Normaliza tipo antigo "jogos" → "games"
        let normalizedType = media.type || "games";
        if (normalizedType === "jogos") {
          normalizedType = "games";
        }

        return {
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
          type: normalizedType,
          description: media.description,
          createdAt: media.createdAt || new Date().toISOString(),
          updatedAt: media.updatedAt || new Date().toISOString(),
        };
      });
  } catch (error) {
    console.error("Error fetching medias:", error);
    return [];
  }
}

/**
 * Remove uma mídia (documento e arquivo de capa).
 */
export async function deleteMedia(id: string): Promise<void> {
  if (!id || typeof id !== "string" || id.trim() === "") {
    throw new Error("ID da mídia é obrigatório e deve ser uma string válida");
  }

  const uid = getUserId();
  if (!uid) {
    throw new Error("Usuário não autenticado");
  }

  // Remove documento
  await database.delete(["users", uid, "medias"], id);
  secureLog.info("🗑️ Documento de mídia removido", { id });

  // Remove arquivo da Storage (ignora erro caso não exista)
  try {
    await storageClient.remove(`media/${id}`);
  } catch (error) {
    secureLog.warn("Falha ao remover arquivo da mídia", error);
  }
}
