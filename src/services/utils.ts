// src/services/utils.ts

import { auth, isFirebaseOffline } from "../firebase";
import { logger } from '../utils/logger';

/**
 * Retorna o UID do usuário autenticado ou null.
 */
export function getUserId(): string | null {
  if (!auth || isFirebaseOffline()) {
    logger.warn("Firebase auth não está disponível (modo offline)");
    return null;
  }

  const uid = auth.currentUser?.uid;
  if (!uid) {
    logger.warn("Usuário não autenticado");
    return null;
  }
  return uid;
}

/**
 * Remove campos com valor undefined de um objeto.
 */
export function removeUndefinedFields<T extends Record<string, unknown>>(
  obj: T | null | undefined,
): T {
  if (!obj || typeof obj !== "object") {
    return {} as T;
  }

  const result = {} as T;
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key as keyof T] = value as T[keyof T];
    }
  }
  return result;
}

/**
 * Sanitiza valores string de um objeto,
 * removendo tags <script>, event handlers e javascript:.
 */
export function sanitizeStrings(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
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

/**
 * Remove acentuação (diacríticos) de uma string
 * e converte para lowercase, para buscas sem considerar acentos.
 */
export function removeDiacritics(str: string): string {
  return str
    .normalize("NFD") // separa base de acentos
    .replace(/[\u0300-\u036f]/g, "") // remove todos os diacríticos
    .toLowerCase();
}

/**
 * Garante que um ID exista e seja string não vazia.
 * Lança erro com a mensagem informada caso contrário.
 */
export function ensureValidId(
  id: unknown,
  message: string,
): asserts id is string {
  if (!id || typeof id !== "string" || id.trim() === "") {
    throw new Error(message);
  }
}
