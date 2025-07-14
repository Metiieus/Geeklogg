import type { Review } from '../App';
import { getUserId, removeUndefinedFields, sanitizeStrings } from './utils';
import { database } from './database';
import { storageClient } from './storageClient';

export async function getReviews(): Promise<Review[]> {
  const uid = getUserId();
  const snap = await database.getCollection<Omit<Review, 'id'>>(['users', uid, 'reviews']);
  return snap.map(d => ({ id: d.id, ...d.data }));
}

export interface AddReviewData extends Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'image'> {
  imageFile?: File;
}

export async function addReview(data: AddReviewData): Promise<Review> {
  const uid = getUserId();
  const now = new Date().toISOString();
  const { imageFile, ...rest } = data;
  const sanitized = sanitizeStrings(rest as Record<string, any>);
  const toSave: Omit<Review, 'id'> = removeUndefinedFields({
    ...sanitized,
    isFavorite: rest.isFavorite ?? false,
    createdAt: now,
    updatedAt: now
  }) as Omit<Review, 'id'>;
  const docRef = await database.add(['users', uid, 'reviews'], toSave);
  console.log('📝 Review criada com ID:', docRef.id);

  if (imageFile instanceof File) {
    try {
      const imageUrl = await storageClient.upload(`reviews/${docRef.id}`, imageFile);
      await database.update(['users', uid, 'reviews', docRef.id], { image: imageUrl });
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
  const toUpdate: Record<string, unknown> = removeUndefinedFields({
    ...sanitizeStrings(data as Record<string, any>),
    updatedAt: now
  });
  delete (toUpdate as { imageFile?: File }).imageFile;
  await database.set(['users', uid, 'reviews', id], toUpdate, { merge: true });
  console.log('📝 Review atualizada:', id);

  if (data.imageFile instanceof File) {
    try {
      const url = await storageClient.upload(`reviews/${id}`, data.imageFile);
      await database.update(['users', uid, 'reviews', id], { image: url });
      console.log('✅ Imagem da review atualizada');
    } catch (err) {
      console.error('Erro ao atualizar imagem da review', err);
    }
  }
}

export async function deleteReview(id: string): Promise<void> {
  const uid = getUserId();
  await database.delete(['users', uid, 'reviews', id]);
  console.log('🗑️ Review removida:', id);
  await storageClient.remove(`reviews/${id}`);
}