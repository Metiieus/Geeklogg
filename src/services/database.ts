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
    const pathStr = Array.isArray(collectionPath)
      ? collectionPath.join("/")
      : collectionPath;

    // Protege documentos do usuário quando não autenticado
    const auth = getAuth();
    if ((pathStr.startsWith("users/") || pathStr === "users") && !auth?.currentUser) {
      console.warn("🔒 Tentativa de acessar documento de usuário sem login:", pathStr);
      return { exists: () => false, data: () => null };
    }

    // Use offline mode if Firebase is not available
    if (shouldUseOfflineMode()) {
      console.warn("🔄 Using offline mode for get operation");

      let effectiveDocId = docId;
      if (!effectiveDocId) {
        const parts = pathStr.split("/");
        if (parts.length % 2 === 0) {
          effectiveDocId = parts[parts.length - 1];
        } else {
          return { exists: () => false, data: () => null };
        }
      }

      const data = localStorageService.getItem(pathStr, effectiveDocId);
      return data
        ? { id: effectiveDocId, ...data, exists: () => true, data: () => data }
        : { exists: () => false, data: () => null };
    }

    try {
      const db = getDB();
      if (!db) throw new Error("Firestore not available");

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

      const docSnap = await withRetry(async () => await getDoc(docRef));
      return docSnap.exists()
        ? { id: docSnap.id, ...docSnap.data(), exists: () => true, data: () => docSnap.data() }
        : { exists: () => false, data: () => null };
    } catch (error: any) {
      console.warn("⚠️ Firebase get failed, trying local storage:", error);

      // Fallback to local storage
      let effectiveDocId = docId;
      if (!effectiveDocId) {
        const parts = pathStr.split("/");
        if (parts.length % 2 === 0) {
          effectiveDocId = parts[parts.length - 1];
        } else {
          return { exists: () => false, data: () => null };
        }
      }

      const data = localStorageService.getItem(pathStr, effectiveDocId);
      return data
        ? { id: effectiveDocId, ...data, exists: () => true, data: () => data }
        : { exists: () => false, data: () => null };
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
    const pathStr = Array.isArray(collectionPath)
      ? collectionPath.join("/")
      : collectionPath;

    // Protege coleção /users quando não autenticado
    const auth = getAuth();
    if ((pathStr === "users" || pathStr.startsWith("users/")) && !auth?.currentUser) {
      console.warn("🔒 Tentativa de acessar coleção users sem login:", pathStr);
      return [];
    }

    // Use offline mode if Firebase is not available
    if (shouldUseOfflineMode()) {
      console.warn("🔄 Using offline mode for getCollection operation");
      try {
        const fallback = localStorageService.getCollection(pathStr);
        let results = fallback.map((item: any, index: number) => ({
          id: item.id ?? `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`,
          data: item,
          ...item
        }));

        // Apply query options to local data
        if (queryOptions) {
          const { where: w, orderBy: ob, limit: lim } = queryOptions;

          if (w) {
            results = results.filter(item => {
              const fieldValue = item[w.field];
              switch (w.operator) {
                case '==': return fieldValue === w.value;
                case '!=': return fieldValue !== w.value;
                case '>': return fieldValue > w.value;
                case '>=': return fieldValue >= w.value;
                case '<': return fieldValue < w.value;
                case '<=': return fieldValue <= w.value;
                case 'array-contains': return Array.isArray(fieldValue) && fieldValue.includes(w.value);
                default: return true;
              }
            });
          }

          if (ob) {
            results.sort((a, b) => {
              const aVal = a[ob.field];
              const bVal = b[ob.field];
              const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
              return ob.direction === 'desc' ? -comparison : comparison;
            });
          }

          if (lim) {
            results = results.slice(0, lim);
          }
        }

        return results;
      } catch {
        return [];
      }
    }

    try {
      const db = getDB();
      if (!db) throw new Error("Firestore not available");

      let q = collection(db, pathStr);

      if (queryOptions) {
        const { where: w, orderBy: ob, limit: lim } = queryOptions;
        if (w) q = query(q, where(w.field, w.operator, w.value));
        if (ob) q = query(q, orderBy(ob.field, ob.direction ?? "asc"));
        if (lim) q = query(q, limit(lim));
      }

      const snap = await withRetry(async () => await getDocs(q));
      return snap.docs.map((d) => ({ id: d.id, data: d.data(), ...d.data() }));
    } catch (error: any) {
      console.warn("⚠️ Firebase getCollection failed, trying local storage:", error);

      // Fallback to local storage
      try {
        const fallback = localStorageService.getCollection(pathStr);
        let results = fallback.map((item: any, index: number) => ({
          id: item.id ?? `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`,
          data: item,
          ...item
        }));

        // Apply query options to local data (simplified)
        if (queryOptions?.limit) {
          results = results.slice(0, queryOptions.limit);
        }

        return results;
      } catch {
        return [];
      }
    }
  },

  /* ------------------------------------------------------------------ */
  update: async (collectionPath: string | string[], docId: string, data: any) => {
    const pathStr = Array.isArray(collectionPath)
      ? collectionPath.join("/")
      : collectionPath;

    // Use offline mode if Firebase is not available
    if (shouldUseOfflineMode()) {
      console.warn("🔄 Using offline mode for update operation");
      const existing = localStorageService.getItem(pathStr, docId);
      if (existing) {
        const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
        localStorageService.setItem(pathStr, docId, updated);
      }
      return docId;
    }

    try {
      const db = getDB();
      if (!db) throw new Error("Firestore not available");

      await withRetry(async () => {
        await updateDoc(doc(db, pathStr, docId), { ...data, updatedAt: serverTimestamp() });
      });
      return docId;
    } catch (error: any) {
      console.warn("⚠️ Firebase update failed, falling back to local storage:", error);

      const existing = localStorageService.getItem(pathStr, docId);
      if (existing) {
        const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
        localStorageService.setItem(pathStr, docId, updated);
      }
      return docId;
    }
  },

  /* ------------------------------------------------------------------ */
  delete: async (collectionPath: string | string[], docId: string) => {
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

    // Use offline mode if Firebase is not available
    if (shouldUseOfflineMode()) {
      console.warn("🔄 Using offline mode for delete operation");
      localStorageService.removeItem(pathStr, docId);
      return docId;
    }

    try {
      const db = getDB();
      if (!db) throw new Error("Firestore not available");

      await withRetry(async () => {
        await deleteDoc(doc(db, pathStr, docId));
      });
      return docId;
    } catch (error: any) {
      console.warn("⚠️ Firebase delete failed, falling back to local storage:", error);
      localStorageService.removeItem(pathStr, docId);
      return docId;
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

    // Use offline mode if Firebase is not available
    if (shouldUseOfflineMode()) {
      console.warn("🔄 Using offline mode for listen operation");

      // Simulate real-time updates with periodic checks of local storage
      const intervalId = setInterval(() => {
        try {
          const data = localStorageService.getCollection(pathStr);
          callback(data.map((item: any, index: number) => ({
            id: item.id ?? `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`,
            ...item
          })));
        } catch (error) {
          console.warn("Error reading from local storage:", error);
          callback([]);
        }
      }, 1000);

      // Return cleanup function
      return () => clearInterval(intervalId);
    }

    try {
      const db = getDB();
      if (!db) throw new Error("Firestore not available");

      let q = collection(db, pathStr);

      if (queryOptions) {
        const { where: w, orderBy: ob, limit: lim } = queryOptions;
        if (w) q = query(q, where(w.field, w.operator, w.value));
        if (ob) q = query(q, orderBy(ob.field, ob.direction ?? "asc"));
        if (lim) q = query(q, limit(lim));
      }

      return onSnapshot(q,
        (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
        (error) => {
          console.warn("⚠️ Firebase listen failed, falling back to local storage:", error);
          // Fallback to periodic local storage checks
          const intervalId = setInterval(() => {
            try {
              const data = localStorageService.getCollection(pathStr);
              callback(data.map((item: any, index: number) => ({
                id: item.id ?? `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`,
                ...item
              })));
            } catch (localError) {
              console.warn("Error reading from local storage:", localError);
              callback([]);
            }
          }, 1000);

          return () => clearInterval(intervalId);
        }
      );
    } catch (error) {
      console.warn("⚠️ Firebase listen setup failed, using local storage:", error);

      // Fallback to periodic local storage checks
      const intervalId = setInterval(() => {
        try {
          const data = localStorageService.getCollection(pathStr);
          callback(data.map((item: any, index: number) => ({
            id: item.id ?? `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`,
            ...item
          })));
        } catch (localError) {
          console.warn("Error reading from local storage:", localError);
          callback([]);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  },

  /* ------------------------------------------------------------------ */
  getDocument: async (collectionPath: string | string[], docId?: string) =>
    database.get(collectionPath, docId),

  /* Utilitários */
  timestamp: Timestamp,
  serverTimestamp,
};
