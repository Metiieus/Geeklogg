import { addDoc, collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { MediaItem } from '../App';
import { getUserId, uploadFileToStorage, deleteFileFromStorage, removeUndefinedFields } from './utils';

export async function getMedias(): Promise<MediaItem[]> {
  const uid = getUserId();
  const snapshot = await getDocs(collection(db, 'users', uid, 'medias'));
  return snapshot.docs.map(d => ({ id: d.id, ...(d.data() as Omit<MediaItem, 'id'>) }));
}

export interface AddMediaData extends Omit<MediaItem, 'id' | 'createdAt' | 'updatedAt' | 'cover'> {
  coverFile?: File;
}

export async function addMedia(data: AddMediaData): Promise<MediaItem> {
  const uid = getUserId();
  const now = new Date().toISOString();
  const { coverFile, ...rest } = data;
  const toSave: Omit<MediaItem, 'id'> = removeUndefinedFields({
    ...(rest as Omit<MediaItem, 'id'>),
    createdAt: now,
    updatedAt: now
  });
  const col = collection(db, 'users', uid, 'medias');
  const docRef = await addDoc(col, toSave);
  console.log('📝 Mídia criada no Firestore com ID:', docRef.id);

  let coverUrl: string | undefined;
  if (coverFile instanceof File) {
    try {
      coverUrl = await uploadFileToStorage(`media/${docRef.id}`, coverFile);
      await updateDoc(doc(db, 'users', uid, 'medias', docRef.id), {
        cover: coverUrl
      });
      console.log('✅ URL da imagem salva no documento.');
    } catch (err) {
      console.error('Erro ao fazer upload da imagem', err);
    }
  }

  return { id: docRef.id, ...toSave, cover: coverUrl };
}

export interface UpdateMediaData extends Partial<Omit<MediaItem, 'id'>> {
  coverFile?: File;
}

export async function updateMedia(id: string, data: UpdateMediaData): Promise<{ cover?: string }> {
  const uid = getUserId();
  const now = new Date().toISOString();
  const toUpdate: Record<string, unknown> = removeUndefinedFields({
    ...data,
    updatedAt: now
  });
  delete (toUpdate as { coverFile?: File }).coverFile;
  await setDoc(doc(db, 'users', uid, 'medias', id), toUpdate, { merge: true });
  console.log('📝 Mídia atualizada no Firestore:', id);
  let coverUrl: string | undefined;
  if (data.coverFile instanceof File) {
    try {
      coverUrl = await uploadFileToStorage(`media/${id}`, data.coverFile);
      await updateDoc(doc(db, 'users', uid, 'medias', id), {
        cover: coverUrl
      });
      console.log('✅ Imagem de capa atualizada');
    } catch (err) {
      console.error('Erro ao atualizar imagem de capa', err);
    }
  }
  return { cover: coverUrl };
}

export async function deleteMedia(id: string): Promise<void> {
  const uid = getUserId();
  await deleteDoc(doc(db, 'users', uid, 'medias', id));
  console.log('🗑️ Documento de mídia removido:', id);
  await deleteFileFromStorage(`media/${id}`);
}