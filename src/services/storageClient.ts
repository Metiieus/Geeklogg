import { storage } from "../firebase";
import { getUserId } from "./utils";

// Funções que funcionam tanto com Firebase real quanto mock
const storageRef = (path: string) => {
  if (storage.ref) {
    // Mock storage
    return storage.ref(path);
  } else {
    // Firebase real
    const { ref } = require("firebase/storage");
    return ref(storage, path);
  }
};

const uploadFile = async (storageRef: any, file: File | Blob) => {
  if (storage.uploadBytes) {
    // Mock storage
    return await storage.uploadBytes(storageRef, file);
  } else {
    // Firebase real
    const { uploadBytes } = require("firebase/storage");
    return await uploadBytes(storageRef, file);
  }
};

const getURL = async (storageRef: any) => {
  if (storage.getDownloadURL) {
    // Mock storage
    return await storage.getDownloadURL(storageRef);
  } else {
    // Firebase real
    const { getDownloadURL } = require("firebase/storage");
    return await getDownloadURL(storageRef);
  }
};

const deleteFile = async (storageRef: any) => {
  if (storage.deleteObject) {
    // Mock storage
    return await storage.deleteObject(storageRef);
  } else {
    // Firebase real
    const { deleteObject } = require("firebase/storage");
    return await deleteObject(storageRef);
  }
};

/**
 * Thin wrapper around Firebase Storage operations.  By routing all calls
 * through this file it becomes easier to swap the storage provider later.
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

export const storageClient = {
  async upload(relativePath: string, file: File | Blob): Promise<string> {
    try {
      const uid = getUserId();
      const fullPath = `users/${uid}/${relativePath}`;
      const storageRef = ref(storage, fullPath);

      // Validar tamanho do arquivo (limite do Firebase: 32MB)
      if (file.size > 32 * 1024 * 1024) {
        throw new Error("Arquivo muito grande. O tamanho máximo é 32MB.");
      }

      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    } catch (error: any) {
      console.error("Erro no upload (raw):", error);
      const storageError = getStorageErrorMessage(error);
      console.error("Erro no upload (processado):", storageError);
      throw new Error(storageError.friendlyMessage);
    }
  },

  async remove(relativePath: string): Promise<void> {
    try {
      const uid = getUserId();
      const fullPath = `users/${uid}/${relativePath}`;
      await deleteObject(ref(storage, fullPath));
    } catch (error: any) {
      const storageError = getStorageErrorMessage(error);
      console.error("Erro ao remover arquivo:", storageError);
      throw new Error(storageError.friendlyMessage);
    }
  },
};
