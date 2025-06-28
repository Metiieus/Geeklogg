import { auth, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export function getUserId(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Usuário não autenticado');
  return uid;
}

export async function uploadFileToStorage(relativePath: string, file: File | Blob): Promise<string> {
  const uid = getUserId();
  const fullPath = `users/${uid}/${relativePath}`;
  console.log('📤 Iniciando upload para', fullPath);
  const storageRef = ref(storage, fullPath);
  await uploadBytes(storageRef, file);
  console.log('✅ Upload concluído para', fullPath);
  return getDownloadURL(storageRef);
}

export async function deleteFileFromStorage(relativePath: string): Promise<void> {
  const uid = getUserId();
  const fullPath = `users/${uid}/${relativePath}`;
  try {
    console.log('🗑️ Removendo arquivo', fullPath);
    await deleteObject(ref(storage, fullPath));
    console.log('✅ Arquivo removido', fullPath);
  } catch (err) {
    console.error('Erro ao remover arquivo', err);
  }
}

export function removeUndefinedFields<T extends Record<string, any>>(obj: T): T {
  const cleanedEntries = Object.entries(obj).filter(([, v]) => v !== undefined);
  return Object.fromEntries(cleanedEntries) as T;
}
