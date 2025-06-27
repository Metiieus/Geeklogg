import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import type { Milestone } from '../App';

function getUserId(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Usuário não autenticado');
  return uid;
}

export async function getMilestones(): Promise<Milestone[]> {
  const uid = getUserId();
  const snap = await getDocs(collection(db, 'users', uid, 'milestones'));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Milestone, 'id'>) }));
}

export async function addMilestone(data: Omit<Milestone, 'id' | 'createdAt'>): Promise<Milestone> {
  const uid = getUserId();
  const now = new Date().toISOString();
  const toSave: Omit<Milestone, 'id'> = { ...data, createdAt: now };
  const docRef = await addDoc(collection(db, 'users', uid, 'milestones'), toSave);
  return { id: docRef.id, ...toSave };
}

export async function updateMilestone(id: string, data: Partial<Milestone>): Promise<void> {
  const uid = getUserId();
  await setDoc(doc(db, 'users', uid, 'milestones', id), data, { merge: true });
  return;
}

export async function deleteMilestone(id: string): Promise<void> {
  const uid = getUserId();
  await deleteDoc(doc(db, 'users', uid, 'milestones', id));
  return;
}
  