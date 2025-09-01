import { getDB, getAuth, isFirebaseOffline, withRetry } from "../firebase";
import { localStorageService } from "./localStorageService";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  type DocumentReference,
} from "firebase/firestore";

// Helper to check if we should use offline mode
const shouldUseOfflineMode = (): boolean => {
  const db = getDB();
  const auth = getAuth();
  return isFirebaseOffline() || !db || !auth;
};

// Helper to get current user ID
const getCurrentUserId = (): string | null => {
  const auth = getAuth();
  return auth?.currentUser?.uid || null;
};

export const database = {
  /* ------------------------------------------------------------------ *
   * ADD – cria documento com ID gerado automaticamente
   * ------------------------------------------------------------------ */
  add: async (
    collectionPath: string | string[],
    data: any,
  ): Promise<DocumentReference> => {
    const pathStr = Array.isArray(collectionPath)
      ? collectionPath.join("/")
      : collectionPath;

    // Use offline mode if Firebase is not available
    if (shouldUseOfflineMode()) {
      console.warn("🔄 Using offline mode for add operation");
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const docData = {
        ...data,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorageService.setItem(pathStr, id, docData);

      // Return a mock DocumentReference
      return { id } as DocumentReference;
    }

    try {
      const db = getDB();
      if (!db) throw new Error("Firestore not available");

      return await withRetry(async () => {
        const docRef = await addDoc(collection(db, pathStr), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return docRef;
      });
    } catch (error: any) {
      console.warn("⚠️ Firebase add failed, falling back to local storage:", error);

      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const docData = {
        ...data,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorageService.setItem(pathStr, id, docData);
      return { id } as DocumentReference;
    }
  },

  /* ------------------------------------------------------------------ *
   * SET – cria/atualiza documento com ID explícito
   * ------------------------------------------------------------------ */
  set: async (
    collectionPath: string | string[],
    docId: unknown,
    data: any,
    options?: any,
  ): Promise<string> => {
    if (typeof docId !== "string" || docId.trim() === "") {
      throw new Error("ID inválido");
    }

    const pathStr = Array.isArray(collectionPath)
      ? collectionPath.join("/")
      : collectionPath;

    // Use offline mode if Firebase is not available
    if (shouldUseOfflineMode()) {
      console.warn("🔄 Using offline mode for set operation");
      const docData = {
        ...data,
        id: docId,
        updatedAt: new Date().toISOString(),
      };

      if (options?.merge) {
        const existing = localStorageService.getItem(pathStr, docId);
        if (existing) {
          Object.assign(existing, docData);
          localStorageService.setItem(pathStr, docId, existing);
        } else {
          localStorageService.setItem(pathStr, docId, docData);
        }
      } else {
        localStorageService.setItem(pathStr, docId, docData);
      }

      return docId;
    }

    try {
      const db = getDB();
      if (!db) throw new Error("Firestore not available");

      await withRetry(async () => {
        await setDoc(
          doc(db, pathStr, docId),
          { ...data, updatedAt: serverTimestamp() },
          options,
        );
      });

      return docId;
    } catch (error: any) {
      console.warn("⚠️ Firebase set failed, falling back to local storage:", error);

      const docData = {
        ...data,
        id: docId,
        updatedAt: new Date().toISOString(),
      };

      if (options?.merge) {
        const existing = localStorageService.getItem(pathStr, docId);
        if (existing) {
          Object.assign(existing, docData);
          localStorageService.setItem(pathStr, docId, existing);
        } else {
          localStorageService.setItem(pathStr, docId, docData);
        }
      } else {
        localStorageService.setItem(pathStr, docId, docData);
      }

      return docId;
    }
  },

  /* ------------------------------------------------------------------ *
   * GET – obtém um único documento
   * ------------------------------------------------------------------ */
  get: async (collectionPath: string | string[], docId?: string) => {
    try {
      const pathStr = Array.isArray(collectionPath)
        ? collectionPath.join("/")
        : collectionPath;

      // Protege documentos do usuário quando não autenticado
      if ((pathStr.startsWith("users/") || pathStr === "users") && !auth.currentUser) {
        console.warn("🔒 Tentativa de acessar documento de usuário sem login:", pathStr);
        return { exists: () => false, data: () => null };
      }

      let docRef;
      if (docId) {
        docRef = doc(db, pathStr, docId);
      } else {
        // collectionPath pode já conter o ID
        const parts = pathStr.split("/");
        if (parts.length % 2 === 0) {
          docRef = doc(db, pathStr);
        } else {
          throw new Error("Document ID ausente");
        }
      }

      const docSnap = await getDoc(docRef);
      return docSnap.exists()
        ? { id: docSnap.id, ...docSnap.data(), exists: () => true, data: () => docSnap.data() }
        : { exists: () => false, data: () => null };
    } catch (error: any) {
      console.error("Error getting document:", error);
      /* Tratamento de falhas de rede / permissão */
      if (
        error.code === "unavailable" ||
        error.message?.includes("Failed to fetch") ||
        error.message?.includes("offline") ||
        error.code === "failed-precondition"
      ) {
        console.warn("🌐 Offline/unavailable – retornando documento nulo");
        return { exists: () => false, data: () => null };
      }
      if (error.code === "permission-denied" || error.code === "unauthenticated") {
        console.warn("🔒 Sem permissão / não autenticado – doc nulo");
        return { exists: () => false, data: () => null };
      }
      if (import.meta.env.DEV) {
        console.warn("🚧 DEV – suprimindo erro e retornando nulo");
        return { exists: () => false, data: () => null };
      }
      throw error;
    }
  },

  /* ------------------------------------------------------------------ *
   * GET COLLECTION – lista documentos
   * ------------------------------------------------------------------ */
  getCollection: async (
    collectionPath: string | string[],
    queryOptions?: {
      where?: { field: string; operator: any; value: any };
      orderBy?: { field: string; direction?: "asc" | "desc" };
      limit?: number;
    },
  ) => {
    try {
      const pathStr = Array.isArray(collectionPath)
        ? collectionPath.join("/")
        : collectionPath;

      // Protege coleção /users quando não autenticado
      if ((pathStr === "users" || pathStr.startsWith("users/")) && !auth.currentUser) {
        console.warn("🔒 Tentativa de acessar coleção users sem login:", pathStr);
        return [];
      }

      let q = collection(db, pathStr);

      if (queryOptions) {
        const { where: w, orderBy: ob, limit: lim } = queryOptions;
        if (w) q = query(q, where(w.field, w.operator, w.value));
        if (ob) q = query(q, orderBy(ob.field, ob.direction ?? "asc"));
        if (lim) q = query(q, limit(lim));
      }

      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, data: d.data(), ...d.data() }));
    } catch (error: any) {
      console.error("Error getting collection:", error);

      if (
        error.code === "unavailable" ||
        error.message?.includes("Failed to fetch") ||
        error.message?.includes("offline") ||
        error.code === "failed-precondition"
      ) {
        console.warn("🌐 Offline/unavailable – retornando []");
        return [];
      }

      if (error.code === "permission-denied" || error.code === "unauthenticated") {
        console.warn("🔒 Sem permissão / não autenticado – retornando []");
        return [];
      }

      if (import.meta.env.DEV) {
        console.warn("🚧 DEV – usando fallback localStorage");
        try {
          const fallback = localStorageService.getCollection(
            Array.isArray(collectionPath) ? collectionPath.join("/") : collectionPath,
          );
          return fallback.map((item: any, index: number) => ({
            id: item.id ?? `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`,
            ...item
          }));
        } catch {
          return [];
        }
      }
      throw error;
    }
  },

  /* ------------------------------------------------------------------ */
  update: async (collectionPath: string | string[], docId: string, data: any) => {
    try {
      const pathStr = Array.isArray(collectionPath)
        ? collectionPath.join("/")
        : collectionPath;
      await updateDoc(doc(db, pathStr, docId), { ...data, updatedAt: serverTimestamp() });
      return docId;
    } catch (error) {
      console.error("Error updating document:", error);
      throw error;
    }
  },

  /* ------------------------------------------------------------------ */
  delete: async (collectionPath: string | string[], docId: string) => {
    try {
      if (!docId || typeof docId !== "string" || docId.trim() === "") {
        throw new Error("Document ID é obrigatório e deve ser uma string válida");
      }

      const pathStr = Array.isArray(collectionPath)
        ? collectionPath.join("/")
        : collectionPath;

      if (!pathStr || pathStr.trim() === "") {
        throw new Error("Collection path é obrigatório");
      }

      // Validate that path doesn't contain undefined parts
      if (pathStr.includes("undefined") || pathStr.includes("null")) {
        throw new Error(`Collection path contém valores inválidos: ${pathStr}`);
      }

      await deleteDoc(doc(db, pathStr, docId));
      return docId;
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  },

  /* ------------------------------------------------------------------ */
  listen: (
    collectionPath: string | string[],
    callback: (data: any[]) => void,
    queryOptions?: {
      where?: { field: string; operator: any; value: any };
      orderBy?: { field: string; direction?: "asc" | "desc" };
      limit?: number;
    },
  ) => {
    const pathStr = Array.isArray(collectionPath)
      ? collectionPath.join("/")
      : collectionPath;
    let q = collection(db, pathStr);

    if (queryOptions) {
      const { where: w, orderBy: ob, limit: lim } = queryOptions;
      if (w) q = query(q, where(w.field, w.operator, w.value));
      if (ob) q = query(q, orderBy(ob.field, ob.direction ?? "asc"));
      if (lim) q = query(q, limit(lim));
    }

    return onSnapshot(q, (snap) =>
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
  },

  /* ------------------------------------------------------------------ */
  getDocument: async (collectionPath: string | string[], docId?: string) =>
    database.get(collectionPath, docId),

  /* Utilitários */
  timestamp: Timestamp,
  serverTimestamp,
};
