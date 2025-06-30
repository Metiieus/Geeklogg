import type { Milestone } from '../App';
import { getUserId, removeUndefinedFields } from './utils';
import { database } from './database';
import { storageClient } from './storageClient';

export async function getMilestones(): Promise<Milestone[]> {
  const uid = getUserId();
  const snap = await database.getCollection<Omit<Milestone, 'id'>>(['users', uid, 'milestones']);
  console.log('📥 Milestones carregadas:', snap.docs.length);
  return snap.map(d => ({ id: d.id, ...d.data }));
}

export interface AddMilestoneData extends Omit<Milestone, 'id' | 'createdAt' | 'image'> {
  imageFile?: File;
}

export async function addMilestone(data: AddMilestoneData): Promise<Milestone> {
  const uid = getUserId();
  const now = new Date().toISOString();
  const { imageFile, ...rest } = data;

  // Montar e limpar o objeto
  let toSave: Omit<Milestone, 'id'> = {
    ...rest,
    createdAt: now
  };

  toSave = removeUndefinedFields(toSave);

  const docRef = await database.add(['users', uid, 'milestones'], toSave);
  console.log('📝 Marco criado com ID:', docRef.id);

  let imageUrl = '';

  if (imageFile instanceof File) {
    try {
      console.log('🚀 Iniciando upload da imagem do marco...');
      imageUrl = await storageClient.upload(`milestones/${docRef.id}`, imageFile);
      await database.update(['users', uid, 'milestones', docRef.id], { image: imageUrl });
      console.log('✅ Imagem do marco enviada e atualizada no Firestore.');
    } catch (err) {
      console.error('❌ Erro ao enviar imagem do marco', err);
    }
  }

  return { ...toSave, id: docRef.id, image: imageUrl };
}

export interface UpdateMilestoneData extends Partial<Omit<Milestone, 'id'>> {
  imageFile?: File;
}

export async function updateMilestone(id: string, data: UpdateMilestoneData): Promise<void> {
  const uid = getUserId();
  const { imageFile, ...rest } = data;

  const toUpdate = removeUndefinedFields(rest);

  await database.set(['users', uid, 'milestones', id], toUpdate, { merge: true });
  console.log('📝 Marco atualizado no Firestore:', id);

  if (imageFile instanceof File) {
    try {
      console.log('🚀 Iniciando upload da nova imagem do marco...');
      const url = await storageClient.upload(`milestones/${id}`, imageFile);
      await database.update(['users', uid, 'milestones', id], { image: url });
      console.log('✅ Nova imagem do marco enviada e atualizada no Firestore.');
    } catch (err) {
      console.error('❌ Erro ao atualizar imagem do marco', err);
    }
  }
}

export async function deleteMilestone(id: string): Promise<void> {
  const uid = getUserId();
  await database.delete(['users', uid, 'milestones', id]);
  console.log('🗑️ Marco removido do Firestore:', id);

  await storageClient.remove(`milestones/${id}`);
  console.log('🗑️ Imagem do marco removida do Storage.');
}
