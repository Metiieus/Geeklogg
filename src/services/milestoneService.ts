import type { Milestone } from "../App";
import { getUserId, removeUndefinedFields, sanitizeStrings, ensureValidId } from "./utils";
import { database } from "./database";
import { storageClient } from "./storageClient";

export async function getMilestones(): Promise<Milestone[]> {
  const uid = getUserId();
  if (!uid) {
    console.warn("User not authenticated, returning empty milestones list");
    return [];
  }
  const snap = await database.getCollection<Omit<Milestone, "id">>([
    "users",
    uid,
    "milestones",
  ]);
  console.log("📥 Milestones carregadas:", snap.length);
  return snap.map((d) => ({ id: d.id, ...(d.data || d) }));
}

export interface AddMilestoneData
  extends Omit<Milestone, "id" | "createdAt" | "image"> {
  imageFile?: File;
}

export async function addMilestone(data: AddMilestoneData): Promise<Milestone> {
  const uid = getUserId();
  const now = new Date().toISOString();
  const { imageFile, ...rest } = data;

  // Montar e limpar o objeto
  let toSave: Omit<Milestone, "id"> = {
    ...sanitizeStrings(rest as Record<string, any>),
    createdAt: now,
  };

  toSave = removeUndefinedFields(toSave);

  const docRef = await database.add(["users", uid, "milestones"], toSave);
  console.log("📝 Marco criado com ID:", docRef.id);

  let imageUrl = "";

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

export interface UpdateMilestoneData extends Partial<Omit<Milestone, "id">> {
  imageFile?: File;
}

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

  await database.set(["users", uid, "milestones"], id, toUpdate, {
    merge: true,
  });

  if (imageFile instanceof File) {
    try {
        const url = await storageClient.upload(`milestones/${id}`, imageFile);
        await database.update(["users", uid, "milestones"], id, { image: url });
    } catch (err) {
      console.error("❌ Erro ao atualizar imagem do marco", err);
    }
  }
}

export async function deleteMilestone(id: string): Promise<void> {
  const uid = getUserId();
  await database.delete(["users", uid, "milestones", id]);

  await storageClient.remove(`milestones/${id}`);
}
