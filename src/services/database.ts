// src/services/database.ts
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
    console.log("➕ [ADD] Iniciando...");
    console.log("📂 Caminho:", pathStr);
    console.log("👤 UID:", uid);
    console.log("📄 Dados:", data);

    // Use offline mode if Firebase is not available
    if (shouldUseOfflineMode()) {
      console.warn("🔄 [ADD] Usando modo offline");
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const docData = {
        ...data,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorageService.setItem(pathStr, id, docData);
      console.log("✅ [ADD] Documento salvo offline com ID:", id);

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
        console.log("✅ [ADD] Documento criado com sucesso! ID:", docRef.id);
        return docRef;
      });
    } catch (error: any) {
      console.error("❌ [ADD] Erro ao adicionar documento:", error.message);
      console.error("📍 Caminho completo:", pathStr);
      console.error("🔍 Código do erro:", error.code);
      console.error("📋 Stack:", error.stack);

      console.warn("⚠️ [ADD] Fallback para localStorage");

      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const docData = {
        ...data,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorageService.setItem(pathStr, id, docData);
      console.log("✅ [ADD] Documento salvo offline com ID:", id);
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
    console.log("💾 [SET] Iniciando...");
    console.log("📂 Caminho:", pathStr);
    console.log("🆔 Doc ID:", docId);
    console.log("👤 UID:", uid);
    console.log("📄 Dados:", data);
    console.log("⚙️ Opções:", options);

    // Use offline mode if Firebase is not available
    if (shouldUseOfflineMode()) {
      console.warn("🔄 [SET] Usando modo offline");
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

      console.log("✅ [SET] Documento salvo offline");
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

      console.log("✅ [SET] Documento atualizado com sucesso!");
      return docId;
    } catch (error: any) {
      console.error("❌ [SET] Erro ao definir documento:", error.message);
      console.error("📍 Caminho completo:", pathStr + "/" + docId);
      console.error("🔍 Código do erro:", error.code);
      console.error("📋 Stack:", error.stack);

      console.warn("⚠️ [SET] Fallback para localStorage");

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

      console.log("✅ [SET] Documento salvo offline");
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
    console.log("📖 [GET] Iniciando...");
    console.log("📂 Caminho:", pathStr);
    console.log("🆔 Doc ID:", docId);
    console.log("👤 UID:", uid);

    // Protege documentos do usuário quando não autenticado
    if (
      (pathStr.startsWith("users/") || pathStr === "users") &&
      !auth?.currentUser
    ) {
      console.warn("🔒 [GET] Tentativa de acessar documento de usuário sem login");
      console.warn("📍 Caminho bloqueado:", pathStr);
      return { exists: () => false, data: () => null };
    }

    // Use offline mode if Firebase is not available
    if (shouldUseOfflineMode()) {
      console.warn("🔄 [GET] Usando modo offline");

      let effectiveDocId = docId;
      if (!effectiveDocId) {
        const parts = pathStr.split("/");
        if (parts.length % 2 === 0) {
          effectiveDocId = parts[parts.length - 1];
        } else {
          console.error("❌ [GET] ID do documento ausente");
          return { exists: () => false, data: () => null };
        }
      }

      const data = localStorageService.getItem(pathStr, effectiveDocId);
      if (data) {
        console.log("✅ [GET] Documento encontrado no localStorage");
      } else {
        console.log("❌ [GET] Documento não encontrado no localStorage");
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

      console.log("🔍 [GET] Buscando documento...");
      const docSnap = await withRetry(async () => await getDoc(docRef));
      
      if (docSnap.exists()) {
        console.log("✅ [GET] Documento encontrado!");
        console.log("📄 Dados:", docSnap.data());
      } else {
        console.log("❌ [GET] Documento não existe");
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
      console.error("❌ [GET] Erro ao obter documento:", error.message);
      console.error("📍 Caminho completo:", pathStr + (docId ? "/" + docId : ""));
      console.error("🔍 Código do erro:", error.code);
      console.error("📋 Stack:", error.stack);

      console.warn("⚠️ [GET] Fallback para localStorage");

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
        console.log("✅ [GET] Documento encontrado no localStorage");
      } else {
        console.log("❌ [GET] Documento não encontrado no localStorage");
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
    console.log("📚 [GET_COLLECTION] Iniciando...");
    console.log("📂 Caminho:", pathStr);
    console.log("👤 UID:", uid);
    console.log("⚙️ Opções de query:", queryOptions);

    // Protege coleção /users quando não autenticado
    if (
      (pathStr === "users" || pathStr.startsWith("users/")) &&
      !auth?.currentUser
    ) {
      console.warn("🔒 [GET_COLLECTION] Tentativa de acessar coleção users sem login");
      console.warn("📍 Caminho bloqueado:", pathStr);
      return [];
    }

    // Use offline mode if Firebase is not available
    if (shouldUseOfflineMode()) {
      console.warn("🔄 [GET_COLLECTION] Usando modo offline");
      try {
        const fallback = localStorageService.getCollection(pathStr);
        let results = fallback.map((item: any, index: number) => ({
          id:
            item.id ??
            `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`,
          data: item,
          ...item,
        }));

        console.log(`✅ [GET_COLLECTION] ${results.length} documentos encontrados no localStorage`);

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
        console.error("❌ [GET_COLLECTION] Erro ao buscar do localStorage:", error);
        return [];
      }
    }

    try {
      if (!db) throw new Error("Firestore not available");

      let q = collection(db, pathStr);

      if (queryOptions) {
        const { where: w, orderBy: ob, limit: lim } = queryOptions;
        if (w) {
          console.log(`🔍 [GET_COLLECTION] Aplicando filtro: ${w.field} ${w.operator} ${w.value}`);
          q = query(q, where(w.field, w.operator, w.value));
        }
        if (ob) {
          console.log(`📊 [GET_COLLECTION] Ordenando por: ${ob.field} ${ob.direction || "asc"}`);
          q = query(q, orderBy(ob.field, ob.direction ?? "asc"));
        }
        if (lim) {
          console.log(`📏 [GET_COLLECTION] Limitando a: ${lim} documentos`);
          q = query(q, limit(lim));
        }
      }

      console.log("🔍 [GET_COLLECTION] Executando query...");
      const snap = await withRetry(async () => await getDocs(q));
      const results = snap.docs.map((d) => ({ id: d.id, data: d.data(), ...d.data() }));
      
      console.log(`✅ [GET_COLLECTION] ${results.length} documentos encontrados!`);
      if (results.length > 0) {
        console.log("📄 Primeiro documento:", results[0]);
      }

      return results;
    } catch (error: any) {
      console.error("❌ [GET_COLLECTION] Erro ao buscar coleção:", error.message);
      console.error("📍 Caminho completo:", pathStr);
      console.error("🔍 Código do erro:", error.code);
      console.error("📋 Stack:", error.stack);
      
      // Log de permissões
      if (error.code === "permission-denied") {
        console.error("🚫 ERRO DE PERMISSÃO!");
        console.error("⚠️ Verifique:");
        console.error("   1. As regras do Firestore estão corretas?");
        console.error("   2. O usuário está autenticado?");
        console.error("   3. O UID do usuário corresponde ao caminho?");
        console.error(`   4. Caminho tentado: ${pathStr}`);
        console.error(`   5. UID do usuário: ${uid}`);
      }

      console.warn("⚠️ [GET_COLLECTION] Fallback para localStorage");

      try {
        const fallback = localStorageService.getCollection(pathStr);
        let results = fallback.map((item: any, index: number) => ({
          id:
            item.id ??
            `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`,
          data: item,
          ...item,
        }));

        console.log(`✅ [GET_COLLECTION] ${results.length} documentos encontrados no localStorage`);

        if (queryOptions?.limit) {
          results = results.slice(0, queryOptions.limit);
        }

        return results;
      } catch (localError) {
        console.error("❌ [GET_COLLECTION] Erro no localStorage também:", localError);
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
    console.log("✏️ [UPDATE] Iniciando...");
    console.log("📂 Caminho:", pathStr);
    console.log("🆔 Doc ID:", docId);
    console.log("👤 UID:", uid);
    console.log("📄 Dados:", data);

    // Use offline mode if Firebase is not available
    if (shouldUseOfflineMode()) {
      console.warn("🔄 [UPDATE] Usando modo offline");
      const existing = localStorageService.getItem(pathStr, docId);
      if (existing) {
        const updated = {
          ...existing,
          ...data,
          updatedAt: new Date().toISOString(),
        };
        localStorageService.setItem(pathStr, docId, updated);
        console.log("✅ [UPDATE] Documento atualizado offline");
      } else {
        console.warn("⚠️ [UPDATE] Documento não encontrado offline");
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
      
      console.log("✅ [UPDATE] Documento atualizado com sucesso!");
      return docId;
    } catch (error: any) {
      console.error("❌ [UPDATE] Erro ao atualizar documento:", error.message);
      console.error("📍 Caminho completo:", pathStr + "/" + docId);
      console.error("🔍 Código do erro:", error.code);
      console.error("📋 Stack:", error.stack);

      console.warn("⚠️ [UPDATE] Fallback para localStorage");

      const existing = localStorageService.getItem(pathStr, docId);
      if (existing) {
        const updated = {
          ...existing,
          ...data,
          updatedAt: new Date().toISOString(),
        };
        localStorageService.setItem(pathStr, docId, updated);
        console.log("✅ [UPDATE] Documento atualizado offline");
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
    console.log("🗑️ [DELETE] Iniciando...");
    console.log("📂 Caminho:", pathStr);
    console.log("🆔 Doc ID:", docId);
    console.log("👤 UID:", uid);

    if (!pathStr || pathStr.trim() === "") {
      throw new Error("Collection path é obrigatório");
    }

    if (pathStr.includes("undefined") || pathStr.includes("null")) {
      throw new Error(`Collection path contém valores inválidos: ${pathStr}`);
    }

    // Use offline mode if Firebase is not available
    if (shouldUseOfflineMode()) {
      console.warn("🔄 [DELETE] Usando modo offline");
      localStorageService.removeItem(pathStr, docId);
      console.log("✅ [DELETE] Documento removido offline");
      return docId;
    }

    try {
      if (!db) throw new Error("Firestore not available");

      await withRetry(async () => {
        await deleteDoc(doc(db, pathStr, docId));
      });
      
      console.log("✅ [DELETE] Documento deletado com sucesso!");
      return docId;
    } catch (error: any) {
      console.error("❌ [DELETE] Erro ao deletar documento:", error.message);
      console.error("📍 Caminho completo:", pathStr + "/" + docId);
      console.error("🔍 Código do erro:", error.code);
      console.error("📋 Stack:", error.stack);

      console.warn("⚠️ [DELETE] Fallback para localStorage");
      localStorageService.removeItem(pathStr, docId);
      console.log("✅ [DELETE] Documento removido offline");
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
    console.log("👂 [LISTEN] Iniciando...");
    console.log("📂 Caminho:", pathStr);
    console.log("👤 UID:", uid);

    if (shouldUseOfflineMode()) {
      console.warn("🔄 [LISTEN] Usando modo offline");
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
          console.warn("⚠️ [LISTEN] Erro ao ler do localStorage:", error);
          callback([]);
        }
      }, 1000);

      return () => {
        console.log("🛑 [LISTEN] Parando listener offline");
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

      console.log("✅ [LISTEN] Listener configurado");

      return onSnapshot(
        q,
        (snap) => {
          console.log(`📡 [LISTEN] Atualização recebida: ${snap.docs.length} documentos`);
          callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        },
        (error) => {
          console.error("❌ [LISTEN] Erro no listener:", error.message);
          console.error("🔍 Código do erro:", error.code);
          
          console.warn("⚠️ [LISTEN] Fallback para polling offline");
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
              console.warn("⚠️ [LISTEN] Erro no polling offline:", localError);
              callback([]);
            }
          }, 1000);

          return () => {
            console.log("🛑 [LISTEN] Parando polling offline");
            clearInterval(intervalId);
          };
        },
      );
    } catch (error: any) {
      console.error("❌ [LISTEN] Erro ao configurar listener:", error.message);
      console.error("📍 Caminho:", pathStr);

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
          console.warn("⚠️ [LISTEN] Erro no fallback:", localError);
          callback([]);
        }
      }, 1000);

      return () => {
        console.log("🛑 [LISTEN] Parando listener fallback");
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
