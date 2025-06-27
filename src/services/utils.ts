import { auth, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export function getUserId(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Usuário não autenticado');
  return uid;
}

export async function uploadFileToStorage(path: string, file: File | Blob): Promise<string> {
  console.log('📤 Iniciando upload para', path);
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  console.log('✅ Upload concluído para', path);
  return getDownloadURL(storageRef);
}

export async function deleteFileFromStorage(path: string): Promise<void> {
  try {
    console.log('🗑️ Removendo arquivo', path);
    await deleteObject(ref(storage, path));
    console.log('✅ Arquivo removido', path);
  } catch (err) {
    console.error('Erro ao remover arquivo', err);
  }
}

export function removeUndefinedFields<T extends Record<string, any>>(obj: T): T {
  const cleanedEntries = Object.entries(obj).filter(([, v]) => v !== undefined);
  return Object.fromEntries(cleanedEntries) as T;
}
