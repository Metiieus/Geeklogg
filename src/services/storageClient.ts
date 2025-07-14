import { storage } from "../firebase";
import { getUserId } from "./utils";

/**
 * Thin wrapper around Firebase Storage operations. By routing all calls
 * through this file it becomes easier to swap the storage provider later.
 * Funciona tanto com Firebase real quanto com mock storage para demo.
 */

export interface StorageError {
  code: string;
  message: string;
  friendlyMessage: string;
}

export const getStorageErrorMessage = (error: any): StorageError => {
  const code = error?.code || "unknown";

  switch (code) {
    case "storage/quota-exceeded":
      return {
        code,
        message: error.message,
        friendlyMessage:
          "Espaço de armazenamento esgotado. Entre em contato com o suporte.",
      };
    case "storage/unauthenticated":
      return {
        code,
        message: error.message,
        friendlyMessage:
          "Você precisa estar logado para fazer upload de arquivos.",
      };
    case "storage/unauthorized":
      return {
        code,
        message: error.message,
        friendlyMessage:
          "Você não tem permissão para fazer upload neste local.",
      };
    case "storage/retry-limit-exceeded":
      return {
        code,
        message: error.message,
        friendlyMessage:
          "Muitas tentativas. Tente novamente em alguns minutos.",
      };
    case "storage/invalid-format":
      return {
        code,
        message: error.message,
        friendlyMessage: "Formato de arquivo inválido.",
      };
    case "storage/object-not-found":
      return {
        code,
        message: error.message,
        friendlyMessage: "Arquivo não encontrado.",
      };
    case "storage/canceled":
      return {
        code,
        message: error.message,
        friendlyMessage: "Upload cancelado.",
      };
    default:
      return {
        code,
        message: error.message || "Erro desconhecido",
        friendlyMessage:
          "Erro no upload. Verifique sua conexão e tente novamente.",
      };
  }
};

// Funções wrapper que funcionam com Firebase real ou mock
const createStorageRef = (path: string) => {
  if (storage && typeof storage.ref === "function") {
    // Mock storage
    return storage.ref(path);
  } else {
    // Firebase real
    try {
      const { ref } = require("firebase/storage");
      return ref(storage, path);
    } catch (e) {
      console.error("Erro ao importar firebase/storage:", e);
      throw new Error("Storage não está disponível");
    }
  }
};

const uploadFileToStorage = async (storageRef: any, file: File | Blob) => {
  if (storage && typeof storage.uploadBytes === "function") {
    // Mock storage
    return await storage.uploadBytes(storageRef, file);
  } else {
    // Firebase real
    try {
      const { uploadBytes } = require("firebase/storage");
      return await uploadBytes(storageRef, file);
    } catch (e) {
      console.error("Erro ao fazer upload:", e);
      throw e;
    }
  }
};

const getDownloadURL = async (storageRef: any) => {
  if (storage && typeof storage.getDownloadURL === "function") {
    // Mock storage
    return await storage.getDownloadURL(storageRef);
  } else {
    // Firebase real
    try {
      const { getDownloadURL: getURL } = require("firebase/storage");
      return await getURL(storageRef);
    } catch (e) {
      console.error("Erro ao obter URL:", e);
      throw e;
    }
  }
};

const deleteFileFromStorage = async (storageRef: any) => {
  if (storage && typeof storage.deleteObject === "function") {
    // Mock storage
    return await storage.deleteObject(storageRef);
  } else {
    // Firebase real
    try {
      const { deleteObject } = require("firebase/storage");
      return await deleteObject(storageRef);
    } catch (e) {
      console.error("Erro ao deletar arquivo:", e);
      throw e;
    }
  }
};

export const storageClient = {
  async upload(relativePath: string, file: File | Blob): Promise<string> {
    try {
      if (!storage) {
        throw new Error("Storage não está configurado");
      }

      const uid = getUserId();
      const fullPath = `users/${uid}/${relativePath}`;

      console.log("📤 Iniciando upload:", { fullPath, fileSize: file.size });

      // Validar tamanho do arquivo (limite do Firebase: 32MB)
      if (file.size > 32 * 1024 * 1024) {
        throw new Error("Arquivo muito grande. O tamanho máximo é 32MB.");
      }

      const fileRef = createStorageRef(fullPath);
      await uploadFileToStorage(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      console.log("✅ Upload concluído:", downloadURL);
      return downloadURL;
    } catch (error: any) {
      console.error("❌ Erro no upload (raw):", error);
      const storageError = getStorageErrorMessage(error);
      console.error("❌ Erro no upload (processado):", storageError);
      throw new Error(storageError.friendlyMessage);
    }
  },

  async remove(relativePath: string): Promise<void> {
    try {
      if (!storage) {
        throw new Error("Storage não está configurado");
      }

      const uid = getUserId();
      const fullPath = `users/${uid}/${relativePath}`;
      const fileRef = createStorageRef(fullPath);
      await deleteFileFromStorage(fileRef);

      console.log("🗑️ Arquivo removido:", fullPath);
    } catch (error: any) {
      const storageError = getStorageErrorMessage(error);
      console.error("Erro ao remover arquivo:", storageError);
      throw new Error(storageError.friendlyMessage);
    }
  },
};
