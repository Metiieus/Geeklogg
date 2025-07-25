import type { Review } from "../App";
import {
  getUserId,
  removeUndefinedFields,
  sanitizeStrings,
  ensureValidId,
} from "./utils";
import { database } from "./database";
import { storageClient } from "./storageClient";

/* -------------------------------------------------------------------------- */
/*                                   READ                                     */
/* -------------------------------------------------------------------------- */

export async function getReviews(): Promise<Review[]> {
  const uid = getUserId();
  if (!uid) {
    console.warn("User not authenticated, returning empty reviews list");
    return [];
  }

  const docs = await database.getCollection<Review>([
    "users",
    uid,
    "reviews",
  ]);

  return docs.map((d) => ({ id: d.id, ...(d.data || d) }));
}

/* -------------------------------------------------------------------------- */
/*                                   CREATE                                   */
/* -------------------------------------------------------------------------- */

export interface AddReviewData
  extends Omit<Review, "id" | "createdAt" | "updatedAt" | "image"> {
  imageFile?: File;
}

export async function addReview(data: AddReviewData): Promise<Review> {
  const uid = getUserId();
  const now = new Date().toISOString();

  const { imageFile, ...rest } = data;
  const sanitized = sanitizeStrings(rest as Record<string, any>);

  const toSave: Omit<Review, "id"> = removeUndefinedFields({
    ...sanitized,
    isFavorite: rest.isFavorite ?? false,
    createdAt: now,
    updatedAt: now,
  }) as Omit<Review, "id">;

  // 1️⃣ Adiciona o doc
  const docRef = await database.add(["users", uid, "reviews"], toSave);
  console.log("📝 Review criada com ID:", docRef.id);

  // 2️⃣ Upload opcional da imagem
  if (imageFile instanceof File) {
    try {
      const imageUrl = await storageClient.upload(`reviews/${docRef.id}`, imageFile);
      await database.update(["users", uid, "reviews"], docRef.id, { image: imageUrl });
      (toSave as Review).image = imageUrl;
      console.log("✅ Imagem da review enviada");
    } catch (err) {
      console.error("Erro ao enviar imagem da review", err);
    }
  }

  return { id: docRef.id, ...(toSave as Review) };
}

/* -------------------------------------------------------------------------- */
/*                                   UPDATE                                   */
/* -------------------------------------------------------------------------- */

export interface UpdateReviewData extends Partial<Omit<Review, "id">> {
  imageFile?: File;
}

export async function updateReview(id: string, data: UpdateReviewData): Promise<void> {
  ensureValidId(id, "ID ausente ou inválido ao tentar atualizar review");
  const uid = getUserId();
  const now = new Date().toISOString();

  const { imageFile, ...rest } = data;

  const toUpdate: Record<string, unknown> = removeUndefinedFields({
    ...sanitizeStrings(rest as Record<string, any>),
    updatedAt: now,
  });
  delete (toUpdate as { imageFile?: File }).imageFile;

  // 1️⃣ Atualiza campos de texto
  await database.set(["users", uid, "reviews"], id, toUpdate, { merge: true });
  console.log("📝 Review atualizada:", id);

  // 2️⃣ Nova imagem? Faz upload e salva URL
  if (imageFile instanceof File) {
    try {
      const url = await storageClient.upload(`reviews/${id}`, imageFile);
      await database.update(["users", uid, "reviews"], id, { image: url });
      console.log("✅ Imagem da review atualizada");
    } catch (err) {
      console.error("Erro ao atualizar imagem da review", err);
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                                   DELETE                                   */
/* -------------------------------------------------------------------------- */

export async function deleteReview(id: string): Promise<void> {
  ensureValidId(id, "ID da review é obrigatório e deve ser uma string válida");
  const uid = getUserId();
  if (!uid) throw new Error("Usuário não autenticado");

  // 1️⃣ Remove documento
  await database.delete(["users", uid, "reviews"], id);
  console.log("🗑️ Review removida:", id);

  // 2️⃣ Remove imagem
  try {
    await storageClient.remove(`reviews/${id}`);
  } catch (error) {
    console.warn("Falha ao remover imagem da review", error);
  }
}
