import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import type { Review } from '../App';

function getUserId(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Usuário não autenticado');
  return uid;
}

const LOCAL_KEY = 'nerdlog-reviews';

function loadLocal(): Review[] {
  const data = localStorage.getItem(LOCAL_KEY);
  return data ? (JSON.parse(data) as Review[]) : [];
}

function saveLocal(items: Review[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

export async function getReviews(): Promise<Review[]> {
  const local = loadLocal();
  try {
    const uid = getUserId();
    const snap = await getDocs(collection(db, 'users', uid, 'reviews'));
    const items: Review[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Review, 'id'>) }));
    saveLocal(items);
    return items;
  } catch {
    return local;
  }
}

export async function addReview(data: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> {
  const uid = getUserId();
  const now = new Date().toISOString();
  const toSave: Omit<Review, 'id'> = { ...data, isFavorite: data.isFavorite ?? false, createdAt: now, updatedAt: now };
  const docRef = await addDoc(collection(db, 'users', uid, 'reviews'), toSave);
  const item: Review = { id: docRef.id, ...toSave };
  const local = loadLocal();
  local.push(item);
  saveLocal(local);
  return item;
}

export async function updateReview(id: string, data: Partial<Review>): Promise<void> {
  const uid = getUserId();
  const now = new Date().toISOString();
  await setDoc(doc(db, 'users', uid, 'reviews', id), { ...data, updatedAt: now }, { merge: true });
  const local = loadLocal();
  const idx = local.findIndex(r => r.id === id);
  if (idx !== -1) {
    local[idx] = { ...local[idx], ...data, id, updatedAt: now } as Review;
    saveLocal(local);
  }
}

export async function deleteReview(id: string): Promise<void> {
  const uid = getUserId();
  await deleteDoc(doc(db, 'users', uid, 'reviews', id));
  const local = loadLocal();
  saveLocal(local.filter(r => r.id !== id));
}