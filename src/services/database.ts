// src/services/database.ts
import { devLog } from "../utils/logger";
import { db, auth, isFirebaseOffline, withRetry } from "../firebase";
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
  return isFirebaseOffline() || !db || !auth;
};

// Helper to get current user ID
const getCurrentUserId = (): string | null => {
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

    const uid = getCurrentUserId();
    devLog.log("➕ [ADD] Iniciando...");
    devLog.log("📂 Caminho:", pathStr);
    devLog.log("👤 UID:", uid);
    devLog.log("📄 Dados:", data);

    // Use offline mode if Firebase is not available
    if (shouldUseOfflineMode()) {
      devLog.warn("🔄 [ADD] Usando modo offline");
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const docData = {
        ...data,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorageService.setItem(pathStr, id, docData);
      devLog.log("✅ [ADD] Documento salvo offline com ID:", id);

      return { id } as DocumentReference;
    }

    try {
      if (!db) throw new Error("Firestore not available");

      return await withRetry(async () => {
        const docRef = await addDoc(collection(db, pathStr), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        devLog.log("✅ [ADD] Documento criado com sucesso! ID:", docRef.id);
        return docRef;
      });
    } catch (error: any) {
      devLog.error("❌ [ADD] Erro ao adicionar documento:", error.message);
      devLog.error("📍 Caminho completo:", pathStr);
      devLog.error("🔍 Código do erro:", error.code);
      devLog.error("📋 Stack:", error.stack);

      devLog.warn("⚠️ [ADD] Fallback para localStorage");

      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const docData = {
        ...data,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorageService.setItem(pathStr, id, docData);
      devLog.log("✅ [ADD] Documento salvo offline com ID:", id);
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

    const uid = getCurrentUserId();
    devLog.log("💾 [SET] Iniciando...");
    devLog.log("📂 Caminho:", pathStr);
    devLog.log("🆔 Doc ID:", docId);
    devLog.log("👤 UID:", uid);
    devLog.log("📄 Dados:", data);
    devLog.log("⚙️ Opções:", options);

    // Use offline mode if Firebase is not available
    if (shouldUseOfflineMode()) {
      devLog.warn("🔄 [SET] Usando modo offline");
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

      devLog.log("✅ [SET] Documento salvo offline");
      return docId;
    }

    try {
      if (!db) throw new Error("Firestore not available");

      await withRetry(async () => {
        await setDoc(
          doc(db, pathStr, docId),
          { ...data, updatedAt: serverTimestamp() },
          options,
        );
      });

      devLog.log("✅ [SET] Documento atualizado com sucesso!");
      return docId;
    } catch (error: any) {
      devLog.error("❌ [SET] Erro ao definir documento:", error.message);
      devLog.error("📍 Caminho completo:", pathStr + "/" + docId);
      devLog.error("🔍 Código do erro:", error.code);
      devLog.error("📋 Stack:", error.stack);

      devLog.warn("⚠️ [SET] Fallback para localStorage");

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

      devLog.log("✅ [SET] Documento salvo offline");
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

    const uid = getCurrentUserId();
    devLog.log("📖 [GET] Iniciando...");
    devLog.log("📂 Caminho:", pathStr);
    devLog.log("🆔 Doc ID:", docId);
    devLog.log("👤 UID:", uid);

    // Protege documentos do usuário quando não autenticado
    if (
      (pathStr.startsWith("users/") || pathStr === "users") &&
      !auth?.currentUser
    ) {
      devLog.warn("🔒 [GET] Tentativa de acessar documento de usuário sem login");
      devLog.warn("📍 Caminho bloqueado:", pathStr);
      return { exists: () => false, data: () => null };
    }

    // Use offline mode if Firebase is not available
    if (shouldUseOfflineMode()) {
      devLog.warn("🔄 [GET] Usando modo offline");

      let effectiveDocId = docId;
      if (!effectiveDocId) {
        const parts = pathStr.split("/");
        if (parts.length % 2 === 0) {
          effectiveDocId = parts[parts.length - 1];
        } else {
          devLog.error("❌ [GET] ID do documento ausente");
          return { exists: () => false, data: () => null };
        }
      }

      const data = localStorageService.getItem(pathStr, effectiveDocId);
      if (data) {
        devLog.log("✅ [GET] Documento encontrado no localStorage");
      } else {
        devLog.log("❌ [GET] Documento não encontrado no localStorage");
      }

      return data
        ? { id: effectiveDocId, ...data, exists: () => true, data: () => data }
        : { exists: () => false, data: () => null };
    }

    try {
      if (!db) throw new Error("Firestore not available");

      let docRef;
      if (docId) {
        docRef = doc(db, pathStr, docId);
      } else {
        const parts = pathStr.split("/");
        if (parts.length % 2 === 0) {
          docRef = doc(db, pathStr);
        } else {
          throw new Error("Document ID ausente");
        }
      }

      devLog.log("🔍 [GET] Buscando documento...");
      const docSnap = await withRetry(async () => await getDoc(docRef));
      
      if (docSnap.exists()) {
        devLog.log("✅ [GET] Documento encontrado!");
        devLog.log("📄 Dados:", docSnap.data());
      } else {
        devLog.log("❌ [GET] Documento não existe");
      }

      return docSnap.exists()
        ? {
            id: docSnap.id,
            ...docSnap.data(),
            exists: () => true,
            data: () => docSnap.data(),
          }
        : { exists: () => false, data: () => null };
    } catch (error: any) {
      devLog.error("❌ [GET] Erro ao obter documento:", error.message);
      devLog.error("📍 Caminho completo:", pathStr + (docId ? "/" + docId : ""));
      devLog.error("🔍 Código do erro:", error.code);
      devLog.error("📋 Stack:", error.stack);

      devLog.warn("⚠️ [GET] Fallback para localStorage");

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
      if (data) {
        devLog.log("✅ [GET] Documento encontrado no localStorage");
      } else {
        devLog.log("❌ [GET] Documento não encontrado no localStorage");
      }

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

    const uid = getCurrentUserId();
    devLog.log("📚 [GET_COLLECTION] Iniciando...");
    devLog.log("📂 Caminho:", pathStr);
    devLog.log("👤 UID:", uid);
    devLog.log("⚙️ Opções de query:", queryOptions);

    // Protege coleção /users quando não autenticado
    if (
      (pathStr === "users" || pathStr.startsWith("users/")) &&
      !auth?.currentUser
    ) {
      devLog.warn("🔒 [GET_COLLECTION] Tentativa de acessar coleção users sem login");
      devLog.warn("📍 Caminho bloqueado:", pathStr);
      return [];
    }

    // Use offline mode if Firebase is not available
    if (shouldUseOfflineMode()) {
      devLog.warn("🔄 [GET_COLLECTION] Usando modo offline");
      try {
        const fallback = localStorageService.getCollection(pathStr);
        let results = fallback.map((item: any, index: number) => ({
          id:
            item.id ??
            `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`,
          data: item,
          ...item,
        }));

        devLog.log(`✅ [GET_COLLECTION] ${results.length} documentos encontrados no localStorage`);

        // Apply query options to local data
        if (queryOptions) {
          const { where: w, orderBy: ob, limit: lim } = queryOptions;

          if (w) {
            results = results.filter((item) => {
              const fieldValue = item[w.field];
              switch (w.operator) {
                case "==":
                  return fieldValue === w.value;
                case "!=":
                  return fieldValue !== w.value;
                case ">":
                  return fieldValue > w.value;
                case ">=":
                  return fieldValue >= w.value;
                case "<":
                  return fieldValue < w.value;
                case "<=":
                  return fieldValue <= w.value;
                case "array-contains":
                  return (
                    Array.isArray(fieldValue) && fieldValue.includes(w.value)
                  );
                default:
                  return true;
              }
            });
          }

          if (ob) {
            results.sort((a, b) => {
              const aVal = a[ob.field];
              const bVal = b[ob.field];
              const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
              return ob.direction === "desc" ? -comparison : comparison;
            });
          }

          if (lim) {
            results = results.slice(0, lim);
          }
        }

        return results;
      } catch (error) {
        devLog.error("❌ [GET_COLLECTION] Erro ao buscar do localStorage:", error);
        return [];
      }
    }

    try {
      if (!db) throw new Error("Firestore not available");

      let q = collection(db, pathStr);

      if (queryOptions) {
        const { where: w, orderBy: ob, limit: lim } = queryOptions;
        if (w) {
          devLog.log(`🔍 [GET_COLLECTION] Aplicando filtro: ${w.field} ${w.operator} ${w.value}`);
          q = query(q, where(w.field, w.operator, w.value));
        }
        if (ob) {
          devLog.log(`📊 [GET_COLLECTION] Ordenando por: ${ob.field} ${ob.direction || "asc"}`);
          q = query(q, orderBy(ob.field, ob.direction ?? "asc"));
        }
        if (lim) {
          devLog.log(`📏 [GET_COLLECTION] Limitando a: ${lim} documentos`);
          q = query(q, limit(lim));
        }
      }

      devLog.log("🔍 [GET_COLLECTION] Executando query...");
      const snap = await withRetry(async () => await getDocs(q));
      const results = snap.docs.map((d) => ({ id: d.id, data: d.data(), ...d.data() }));
      
      devLog.log(`✅ [GET_COLLECTION] ${results.length} documentos encontrados!`);
      if (results.length > 0) {
        devLog.log("📄 Primeiro documento:", results[0]);
      }

      return results;
    } catch (error: any) {
      devLog.error("❌ [GET_COLLECTION] Erro ao buscar coleção:", error.message);
      devLog.error("📍 Caminho completo:", pathStr);
      devLog.error("🔍 Código do erro:", error.code);
      devLog.error("📋 Stack:", error.stack);
      
      // Log de permissões
      if (error.code === "permission-denied") {
        devLog.error("🚫 ERRO DE PERMISSÃO!");
        devLog.error("⚠️ Verifique:");
        devLog.error("   1. As regras do Firestore estão corretas?");
        devLog.error("   2. O usuário está autenticado?");
        devLog.error("   3. O UID do usuário corresponde ao caminho?");
        devLog.error(`   4. Caminho tentado: ${pathStr}`);
        devLog.error(`   5. UID do usuário: ${uid}`);
      }

      devLog.warn("⚠️ [GET_COLLECTION] Fallback para localStorage");

      try {
        const fallback = localStorageService.getCollection(pathStr);
        let results = fallback.map((item: any, index: number) => ({
          id:
            item.id ??
            `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`,
          data: item,
          ...item,
        }));

        devLog.log(`✅ [GET_COLLECTION] ${results.length} documentos encontrados no localStorage`);

        if (queryOptions?.limit) {
          results = results.slice(0, queryOptions.limit);
        }

        return results;
      } catch (localError) {
        devLog.error("❌ [GET_COLLECTION] Erro no localStorage também:", localError);
        return [];
      }
    }
  },

  /* ------------------------------------------------------------------ */
  update: async (
    collectionPath: string | string[],
    docId: string,
    data: any,
  ) => {
    const pathStr = Array.isArray(collectionPath)
      ? collectionPath.join("/")
      : collectionPath;

    const uid = getCurrentUserId();
    devLog.log("✏️ [UPDATE] Iniciando...");
    devLog.log("📂 Caminho:", pathStr);
    devLog.log("🆔 Doc ID:", docId);
    devLog.log("👤 UID:", uid);
    devLog.log("📄 Dados:", data);

    // Use offline mode if Firebase is not available
    if (shouldUseOfflineMode()) {
      devLog.warn("🔄 [UPDATE] Usando modo offline");
      const existing = localStorageService.getItem(pathStr, docId);
      if (existing) {
        const updated = {
          ...existing,
          ...data,
          updatedAt: new Date().toISOString(),
        };
        localStorageService.setItem(pathStr, docId, updated);
        devLog.log("✅ [UPDATE] Documento atualizado offline");
      } else {
        devLog.warn("⚠️ [UPDATE] Documento não encontrado offline");
      }
      return docId;
    }

    try {
      if (!db) throw new Error("Firestore not available");

      await withRetry(async () => {
        await updateDoc(doc(db, pathStr, docId), {
          ...data,
          updatedAt: serverTimestamp(),
        });
      });
      
      devLog.log("✅ [UPDATE] Documento atualizado com sucesso!");
      return docId;
    } catch (error: any) {
      devLog.error("❌ [UPDATE] Erro ao atualizar documento:", error.message);
      devLog.error("📍 Caminho completo:", pathStr + "/" + docId);
      devLog.error("🔍 Código do erro:", error.code);
      devLog.error("📋 Stack:", error.stack);

      devLog.warn("⚠️ [UPDATE] Fallback para localStorage");

      const existing = localStorageService.getItem(pathStr, docId);
      if (existing) {
        const updated = {
          ...existing,
          ...data,
          updatedAt: new Date().toISOString(),
        };
        localStorageService.setItem(pathStr, docId, updated);
        devLog.log("✅ [UPDATE] Documento atualizado offline");
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

    const uid = getCurrentUserId();
    devLog.log("🗑️ [DELETE] Iniciando...");
    devLog.log("📂 Caminho:", pathStr);
    devLog.log("🆔 Doc ID:", docId);
    devLog.log("👤 UID:", uid);

    if (!pathStr || pathStr.trim() === "") {
      throw new Error("Collection path é obrigatório");
    }

    if (pathStr.includes("undefined") || pathStr.includes("null")) {
      throw new Error(`Collection path contém valores inválidos: ${pathStr}`);
    }

    // Use offline mode if Firebase is not available
    if (shouldUseOfflineMode()) {
      devLog.warn("🔄 [DELETE] Usando modo offline");
      localStorageService.removeItem(pathStr, docId);
      devLog.log("✅ [DELETE] Documento removido offline");
      return docId;
    }

    try {
      if (!db) throw new Error("Firestore not available");

      await withRetry(async () => {
        await deleteDoc(doc(db, pathStr, docId));
      });
      
      devLog.log("✅ [DELETE] Documento deletado com sucesso!");
      return docId;
    } catch (error: any) {
      devLog.error("❌ [DELETE] Erro ao deletar documento:", error.message);
      devLog.error("📍 Caminho completo:", pathStr + "/" + docId);
      devLog.error("🔍 Código do erro:", error.code);
      devLog.error("📋 Stack:", error.stack);

      devLog.warn("⚠️ [DELETE] Fallback para localStorage");
      localStorageService.removeItem(pathStr, docId);
      devLog.log("✅ [DELETE] Documento removido offline");
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

    const uid = getCurrentUserId();
    devLog.log("👂 [LISTEN] Iniciando...");
    devLog.log("📂 Caminho:", pathStr);
    devLog.log("👤 UID:", uid);

    if (shouldUseOfflineMode()) {
      devLog.warn("🔄 [LISTEN] Usando modo offline");
      const intervalId = setInterval(() => {
        try {
          const data = localStorageService.getCollection(pathStr);
          callback(
            data.map((item: any, index: number) => ({
              id:
                item.id ??
                `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`,
              ...item,
            })),
          );
        } catch (error) {
          devLog.warn("⚠️ [LISTEN] Erro ao ler do localStorage:", error);
          callback([]);
        }
      }, 1000);

      return () => {
        devLog.log("🛑 [LISTEN] Parando listener offline");
        clearInterval(intervalId);
      };
    }

    try {
      if (!db) throw new Error("Firestore not available");

      let q = collection(db, pathStr);

      if (queryOptions) {
        const { where: w, orderBy: ob, limit: lim } = queryOptions;
        if (w) q = query(q, where(w.field, w.operator, w.value));
        if (ob) q = query(q, orderBy(ob.field, ob.direction ?? "asc"));
        if (lim) q = query(q, limit(lim));
      }

      devLog.log("✅ [LISTEN] Listener configurado");

      return onSnapshot(
        q,
        (snap) => {
          devLog.log(`📡 [LISTEN] Atualização recebida: ${snap.docs.length} documentos`);
          callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        },
        (error) => {
          devLog.error("❌ [LISTEN] Erro no listener:", error.message);
          devLog.error("🔍 Código do erro:", error.code);
          
          devLog.warn("⚠️ [LISTEN] Fallback para polling offline");
          const intervalId = setInterval(() => {
            try {
              const data = localStorageService.getCollection(pathStr);
              callback(
                data.map((item: any, index: number) => ({
                  id:
                    item.id ??
                    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`,
                  ...item,
                })),
              );
            } catch (localError) {
              devLog.warn("⚠️ [LISTEN] Erro no polling offline:", localError);
              callback([]);
            }
          }, 1000);

          return () => {
            devLog.log("🛑 [LISTEN] Parando polling offline");
            clearInterval(intervalId);
          };
        },
      );
    } catch (error: any) {
      devLog.error("❌ [LISTEN] Erro ao configurar listener:", error.message);
      devLog.error("📍 Caminho:", pathStr);

      const intervalId = setInterval(() => {
        try {
          const data = localStorageService.getCollection(pathStr);
          callback(
            data.map((item: any, index: number) => ({
              id:
                item.id ??
                `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`,
              ...item,
            })),
          );
        } catch (localError) {
          devLog.warn("⚠️ [LISTEN] Erro no fallback:", localError);
          callback([]);
        }
      }, 1000);

      return () => {
        devLog.log("🛑 [LISTEN] Parando listener fallback");
        clearInterval(intervalId);
      };
    }
  },

  /* ------------------------------------------------------------------ */
  getDocument: async (collectionPath: string | string[], docId?: string) =>
    database.get(collectionPath, docId),

  /* Utilitários */
  timestamp: Timestamp,
  serverTimestamp,
};
