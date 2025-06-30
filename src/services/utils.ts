import { auth } from '../firebase';

export function getUserId(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Usuário não autenticado');
  return uid;
}


export function removeUndefinedFields<T extends Record<string, any>>(obj: T): T {
  const cleanedEntries = Object.entries(obj).filter(([, v]) => v !== undefined);
  return Object.fromEntries(cleanedEntries) as T;
}
