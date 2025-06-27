import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import type { Review } from '../App';

function getUserId(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Usuário não autenticado');
  return uid;
}

export async function getReviews(): Promise<Review[]> {
  const uid = getUserId();
  const snap = await getDocs(collection(db, 'users', uid, 'reviews'));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Review, 'id'>) }));
}

export async function addReview(data: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> {
  const uid = getUserId();
  const now = new Date().toISOString();
  const toSave: Omit<Review, 'id'> = { ...data, isFavorite: data.isFavorite ?? false, createdAt: now, updatedAt: now };
  const docRef = await addDoc(collection(db, 'users', uid, 'reviews'), toSave);
  return { id: docRef.id, ...toSave };
}

export async function updateReview(id: string, data: Partial<Review>): Promise<void> {
  const uid = getUserId();
  const now = new Date().toISOString();
  await setDoc(doc(db, 'users', uid, 'reviews', id), { ...data, updatedAt: now }, { merge: true });
  return;
}

export async function deleteReview(id: string): Promise<void> {
  const uid = getUserId();
  await deleteDoc(doc(db, 'users', uid, 'reviews', id));
  return;
}