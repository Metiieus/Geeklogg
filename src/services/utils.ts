import { auth } from "../firebase";

export function getUserId(): string | null {
  if (!auth) {
    console.warn("Firebase auth não está inicializado");
    return null;
  }
  const uid = auth.currentUser?.uid;
  if (!uid) {
    console.warn("Usuário não autenticado");
    return null;
  }
  return uid;
}

export function removeUndefinedFields<T extends Record<string, any>>(
  obj: T | null | undefined,
): T {
  if (!obj || typeof obj !== "object") {
    return {} as T;
  }

  const result = {} as T;
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key as keyof T] = value;
    }
  }
  return result;
}

export function sanitizeStrings(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      // Basic sanitization - remove potentially harmful characters
      result[key] = value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/javascript:/gi, "")
        .replace(/on\w+\s*=/gi, "");
    } else {
      result[key] = value;
    }
  }
  return result;
}
