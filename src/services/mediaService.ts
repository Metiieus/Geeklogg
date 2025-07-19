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

export async function deleteMedia(id: string): Promise<void> {
  const uid = getUserId();
  await database.delete(["users", uid, "medias", id]);
  console.log("🗑️ Documento de mídia removido:", id);
  await storageClient.remove(`media/${id}`);
}
