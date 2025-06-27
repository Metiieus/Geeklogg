import { addDoc, collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, auth, storage } from '../firebase';
import type { MediaItem } from '../App';

function getUserId(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Usuário não autenticado');
  return uid;
}

const LOCAL_KEY = 'nerdlog-media';

function loadLocal(): MediaItem[] {
  const data = localStorage.getItem(LOCAL_KEY);
  return data ? (JSON.parse(data) as MediaItem[]) : [];
}

function saveLocal(items: MediaItem[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

export async function getMedias(): Promise<MediaItem[]> {
  const local = loadLocal();
  try {
    const uid = getUserId();
    const snapshot = await getDocs(collection(db, 'users', uid, 'medias'));
    const items: MediaItem[] = snapshot.docs.map(d => ({ id: d.id, ...(d.data() as Omit<MediaItem, 'id'>) }));
    saveLocal(items);
    return items;
  } catch {
    return local;
  }
}

export interface AddMediaData extends Omit<MediaItem, 'id' | 'createdAt' | 'updatedAt' | 'cover'> {
  coverFile?: File;
}

export async function addMedia(data: AddMediaData): Promise<MediaItem> {
  const uid = getUserId();
  const now = new Date().toISOString();
  const { coverFile, ...rest } = data;
  const toSave: Omit<MediaItem, 'id'> = {
    ...(rest as Omit<MediaItem, 'id'>),
    createdAt: now,
    updatedAt: now
  };
  const col = collection(db, 'users', uid, 'medias');
  const docRef = await addDoc(col, toSave);
  let coverUrl: string | undefined = undefined;
  if (coverFile instanceof File) {
    try {
      const storageRef = ref(storage, `users/${uid}/covers/${docRef.id}.jpg`);
      await uploadBytes(storageRef, coverFile);
      coverUrl = await getDownloadURL(storageRef);
      await updateDoc(doc(db, 'users', uid, 'medias', docRef.id), {
        cover: coverUrl
      });
    } catch (err) {
      console.error('Erro ao fazer upload da imagem', err);
    }
  }
  const item: MediaItem = { id: docRef.id, ...toSave, cover: coverUrl };
  const local = loadLocal();
  local.push(item);
  saveLocal(local);
  return item;
}

export interface UpdateMediaData extends Partial<Omit<MediaItem, 'id'>> {
  coverFile?: File;
}

export async function updateMedia(id: string, data: UpdateMediaData): Promise<void> {
  const uid = getUserId();
  const now = new Date().toISOString();
  const toUpdate: Record<string, unknown> = { ...data, updatedAt: now };
  delete (toUpdate as { coverFile?: File }).coverFile;
  await setDoc(doc(db, 'users', uid, 'medias', id), toUpdate, { merge: true });
  let coverUrl: string | undefined;
  if (data.coverFile instanceof File) {
    try {
      const storageRef = ref(storage, `users/${uid}/covers/${id}.jpg`);
      await uploadBytes(storageRef, data.coverFile);
      coverUrl = await getDownloadURL(storageRef);
      await updateDoc(doc(db, 'users', uid, 'medias', id), {
        cover: coverUrl
      });
    } catch (err) {
      console.error('Erro ao atualizar imagem de capa', err);
    }
  }
  const local = loadLocal();
  const idx = local.findIndex(m => m.id === id);
  if (idx !== -1) {
    local[idx] = { ...local[idx], ...(toUpdate as Partial<MediaItem>), id, cover: coverUrl ?? local[idx].cover } as MediaItem;
    saveLocal(local);
  }
}

export async function deleteMedia(id: string): Promise<void> {
  const uid = getUserId();
  await deleteDoc(doc(db, 'users', uid, 'medias', id));
  await deleteObject(ref(storage, `users/${uid}/covers/${id}.jpg`)).catch(() => {});
  const local = loadLocal();
  saveLocal(local.filter(m => m.id !== id));
}