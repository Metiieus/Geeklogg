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

export function sanitizeInput(value: string): string {
  return value.replace(/[<>`"'\\]/g, "");
}

export function sanitizeStrings<T extends Record<string, any>>(obj: T): T {
  for (const key in obj) {
    const val = obj[key];
    if (typeof val === "string") {
      obj[key] = sanitizeInput(val) as T[keyof T];
    } else if (Array.isArray(val)) {
      obj[key] = val.map((v) =>
        typeof v === "string" ? sanitizeInput(v) : v,
      ) as T[keyof T];
    }
  }
  return obj;
}
