import { addDoc, collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Review } from '../App';
import { getUserId, uploadFileToStorage, deleteFileFromStorage } from './utils';

export async function getReviews(): Promise<Review[]> {
  const uid = getUserId();
  const snap = await getDocs(collection(db, 'users', uid, 'reviews'));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Review, 'id'>) }));
}

export interface AddReviewData extends Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'image'> {
  imageFile?: File;
}

export async function addReview(data: AddReviewData): Promise<Review> {
  const uid = getUserId();
  const now = new Date().toISOString();
  const { imageFile, ...rest } = data;
  const toSave: Omit<Review, 'id'> = { ...rest, isFavorite: rest.isFavorite ?? false, createdAt: now, updatedAt: now } as Omit<Review, 'id'>;
  const docRef = await addDoc(collection(db, 'users', uid, 'reviews'), toSave);
  console.log('📝 Review criada com ID:', docRef.id);

  if (imageFile instanceof File) {
    try {
      const imageUrl = await uploadFileToStorage(`users/${uid}/reviews/${docRef.id}`, imageFile);
      await updateDoc(doc(db, 'users', uid, 'reviews', docRef.id), { image: imageUrl });
      console.log('✅ Imagem da review enviada');
      (toSave as Review).image = imageUrl;
    } catch (err) {
      console.error('Erro ao enviar imagem da review', err);
    }
  }

  return { id: docRef.id, ...(toSave as Review) };
}

export interface UpdateReviewData extends Partial<Omit<Review, 'id'>> {
  imageFile?: File;
}

export async function updateReview(id: string, data: UpdateReviewData): Promise<void> {
  const uid = getUserId();
  const now = new Date().toISOString();
  const toUpdate: Record<string, unknown> = { ...data, updatedAt: now };
  delete (toUpdate as { imageFile?: File }).imageFile;
  await setDoc(doc(db, 'users', uid, 'reviews', id), toUpdate, { merge: true });
  console.log('📝 Review atualizada:', id);

  if (data.imageFile instanceof File) {
    try {
      const url = await uploadFileToStorage(`users/${uid}/reviews/${id}`, data.imageFile);
      await updateDoc(doc(db, 'users', uid, 'reviews', id), { image: url });
      console.log('✅ Imagem da review atualizada');
    } catch (err) {
      console.error('Erro ao atualizar imagem da review', err);
    }
  }
}

export async function deleteReview(id: string): Promise<void> {
  const uid = getUserId();
  await deleteDoc(doc(db, 'users', uid, 'reviews', id));
  console.log('🗑️ Review removida:', id);
  await deleteFileFromStorage(`users/${uid}/reviews/${id}`);
}