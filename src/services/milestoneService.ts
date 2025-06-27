import { addDoc, collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Milestone } from '../App';
import { getUserId, uploadFileToStorage, deleteFileFromStorage, removeUndefinedFields } from './utils';

export async function getMilestones(): Promise<Milestone[]> {
  const uid = getUserId();
  const snap = await getDocs(collection(db, 'users', uid, 'milestones'));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Milestone, 'id'>) }));
}

export interface AddMilestoneData extends Omit<Milestone, 'id' | 'createdAt' | 'image'> {
  imageFile?: File;
}

export async function addMilestone(data: AddMilestoneData): Promise<Milestone> {
  const uid = getUserId();
  const now = new Date().toISOString();
  const { imageFile, ...rest } = data;
  const toSave: Omit<Milestone, 'id'> = removeUndefinedFields({
    ...rest,
    createdAt: now
  }) as Omit<Milestone, 'id'>;
  const docRef = await addDoc(collection(db, 'users', uid, 'milestones'), toSave);
  console.log('📝 Marco criado com ID:', docRef.id);

  if (imageFile instanceof File) {
    try {
      const url = await uploadFileToStorage(`users/${uid}/milestones/${docRef.id}`, imageFile);
      await updateDoc(doc(db, 'users', uid, 'milestones', docRef.id), { image: url });
      console.log('✅ Imagem do marco enviada');
      (toSave as Milestone).image = url;
    } catch (err) {
      console.error('Erro ao enviar imagem do marco', err);
    }
  }

  return { id: docRef.id, ...(toSave as Milestone) };
}

export interface UpdateMilestoneData extends Partial<Omit<Milestone, 'id'>> {
  imageFile?: File;
}

export async function updateMilestone(id: string, data: UpdateMilestoneData): Promise<void> {
  const uid = getUserId();
  const toUpdate: Record<string, unknown> = removeUndefinedFields({
    ...data
  });
  delete (toUpdate as { imageFile?: File }).imageFile;
  await setDoc(doc(db, 'users', uid, 'milestones', id), toUpdate, { merge: true });
  console.log('📝 Marco atualizado:', id);

  if (data.imageFile instanceof File) {
    try {
      const url = await uploadFileToStorage(`users/${uid}/milestones/${id}`, data.imageFile);
      await updateDoc(doc(db, 'users', uid, 'milestones', id), { image: url });
      console.log('✅ Imagem do marco atualizada');
    } catch (err) {
      console.error('Erro ao atualizar imagem do marco', err);
    }
  }
}

export async function deleteMilestone(id: string): Promise<void> {
  const uid = getUserId();
  await deleteDoc(doc(db, 'users', uid, 'milestones', id));
  console.log('🗑️ Marco removido:', id);
  await deleteFileFromStorage(`users/${uid}/milestones/${id}`);
}
  