import { auth } from "../firebase";

export function getUserId(): string {
  if (!auth) throw new Error("Firebase auth não inicializado");
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Usuário não autenticado");
  return uid;
}

export function removeUndefinedFields<T extends Record<string, any>>(
  obj: T,
): T {
  const cleanedEntries = Object.entries(obj).filter(([, v]) => v !== undefined);
  return Object.fromEntries(cleanedEntries) as T;
}
