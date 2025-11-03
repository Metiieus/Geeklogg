import type { Milestone } from "../App";
import {
  getUserId,
  removeUndefinedFields,
  sanitizeStrings,
  ensureValidId,
} from "./utils";
import { database } from "./database";
import { storageClient } from "./storageClient";

/* -------------------------------------------------------------------------- */
/*                                 CONSULTA                                   */
/* -------------------------------------------------------------------------- */

/**
 * Retorna todos os marcos (timeline) do usuário autenticado.
 */
export async function getMilestones(): Promise<Milestone[]> {
  const uid = getUserId();
  if (!uid) {
    console.warn("User not authenticated, returning empty milestones list");
    return [];
  }

  const docs = await database.getCollection<Milestone>([
    "users",
    uid,
    "milestones",
  ]);

  console.log("📥 Milestones carregadas:", docs.length);
  return docs.map((d) => ({ id: d.id, ...(d.data || d) }));
}

/* -------------------------------------------------------------------------- */
/*                                  CREATE                                    */
/* -------------------------------------------------------------------------- */

export interface AddMilestoneData
  extends Omit<Milestone, "id" | "createdAt" | "image"> {
  imageFile?: File;
  images?: string[]; // URLs das imagens já enviadas
}

/**
 * Cria um novo marco para o usuário.
 */
export async function addMilestone(data: AddMilestoneData): Promise<Milestone> {
  const uid = getUserId();
  const now = new Date().toISOString();
  const { imageFile, ...rest } = data;

  // Limpa e prepara o objeto para salvar
  let toSave: Omit<Milestone, "id"> = {
    ...sanitizeStrings(rest as Record<string, any>),
    createdAt: now,
  };
  toSave = removeUndefinedFields(toSave);

  // 1️⃣ Adiciona o documento
  const docRef = await database.add(["users", uid, "milestones"], toSave);
  console.log("📝 Marco criado com ID:", docRef.id);

  let imageUrl = "";

  // 2️⃣ Faz upload da imagem (opcional) e atualiza o doc com o link
  if (imageFile instanceof File) {
    try {
      console.log("🚀 Iniciando upload da imagem do marco...");
      imageUrl = await storageClient.upload(
        `milestones/${docRef.id}`,
        imageFile,
      );
      await database.update(["users", uid, "milestones"], docRef.id, {
        image: imageUrl,
      });
    } catch (err) {
      console.error("❌ Erro ao enviar imagem do marco", err);
    }
  }

  return { ...toSave, id: docRef.id, image: imageUrl };
}

/* -------------------------------------------------------------------------- */
/*                                   UPDATE                                   */
/* -------------------------------------------------------------------------- */

export interface UpdateMilestoneData extends Partial<Omit<Milestone, "id">> {
  imageFile?: File;
  images?: string[]; // URLs das imagens já enviadas
}

/**
 * Atualiza um marco existente.
 */
export async function updateMilestone(
  id: string,
  data: UpdateMilestoneData,
): Promise<void> {
  ensureValidId(id, "ID ausente ou inválido ao tentar atualizar marco");

  const uid = getUserId();
  const { imageFile, ...rest } = data;

  const toUpdate = removeUndefinedFields(
    sanitizeStrings(rest as Record<string, any>),
  );

  // 1️⃣ Atualiza campos básicos
  await database.set(["users", uid, "milestones"], id, toUpdate, {
    merge: true,
  });

  // 2️⃣ Se houver nova imagem, faz upload e salva URL
  if (imageFile instanceof File) {
    try {
      const url = await storageClient.upload(`milestones/${id}`, imageFile);
      await database.update(["users", uid, "milestones"], id, { image: url });
    } catch (err) {
      console.error("❌ Erro ao atualizar imagem do marco", err);
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                                   DELETE                                   */
/* -------------------------------------------------------------------------- */

/**
 * Remove um marco e sua imagem da Storage.
 */
export async function deleteMilestone(id: string): Promise<void> {
  ensureValidId(
    id,
    "ID da milestone é obrigatório e deve ser uma string válida",
  );

  const uid = getUserId();
  if (!uid) throw new Error("Usuário não autenticado");

  // 1️⃣ Remove documento
  await database.delete(["users", uid, "milestones"], id);

  // 2️⃣ Remove imagem da Storage (se existir)
  try {
    await storageClient.remove(`milestones/${id}`);
  } catch (error) {
    console.warn("Falha ao remover imagem do marco", error);
  }
}
