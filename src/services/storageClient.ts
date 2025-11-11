import { storage } from "../firebase";
import { devLog } from "../utils/logger";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  StorageReference,
  UploadResult,
} from "firebase/storage";
import { getUserId } from "./utils";

class StorageClient {
  private storage = storage;

  isAvailable(): boolean {
    return !!this.storage;
  }

  createRef(path: string): StorageReference {
    if (!this.storage) {
      throw new Error("Storage não está inicializado");
    }
    return ref(this.storage, path);
  }

  async uploadFile(storageRef: StorageReference, file: File | Blob): Promise<UploadResult> {
    if (!this.storage) {
      throw new Error("Storage não está inicializado");
    }

    try {
      return await uploadBytes(storageRef, file);
    } catch (e) {
      devLog.error("Erro ao fazer upload:", e);
      throw e;
    }
  }

  async getDownloadURL(storageRef: StorageReference): Promise<string> {
    if (!this.storage) {
      throw new Error("Storage não está inicializado");
    }

    try {
      return await getDownloadURL(storageRef);
    } catch (e) {
      devLog.error("Erro ao obter URL:", e);
      throw e;
    }
  }

  async deleteFile(storageRef: StorageReference): Promise<void> {
    if (!this.storage) {
      throw new Error("Storage não está inicializado");
    }

    try {
      return await deleteObject(storageRef);
    } catch (e: unknown) {
      // Se o arquivo não existe, consideramos como sucesso
      if (e && typeof e === 'object' && 'code' in e && e.code === "storage/object-not-found") {
        devLog.log("ℹ️ Arquivo não encontrado (já foi deletado):", e);
        return; // Não é erro, apenas ignora
      }

      devLog.error("Erro ao deletar arquivo:", e);
      throw e;
    }
  }

  async upload(relativePath: string, file: File | Blob): Promise<string> {
    const uid = getUserId();
    if (!uid) {
      throw new Error("Usuário não autenticado");
    }
    const storageRef = this.createRef(`users/${uid}/${relativePath}`);
    await this.uploadFile(storageRef, file);
    return this.getDownloadURL(storageRef);
  }

  async remove(relativePath: string): Promise<void> {
    const uid = getUserId();
    if (!uid) {
      throw new Error("Usuário não autenticado");
    }
    const storageRef = this.createRef(`users/${uid}/${relativePath}`);
    await this.deleteFile(storageRef);
  }
}

export const storageClient = new StorageClient();

/**
 * Função auxiliar para upload de imagens com nome único
 * @param file - Arquivo de imagem
 * @param folder - Pasta de destino (ex: "milestones", "reviews")
 * @returns URL da imagem enviada
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const uid = getUserId();
  if (!uid) {
    throw new Error("Usuário não autenticado");
  }

  // Gerar nome único para o arquivo
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 9);
  const extension = file.name.split('.').pop() || 'jpg';
  const fileName = `${timestamp}_${randomString}.${extension}`;

  const path = `${folder}/${fileName}`;
  return storageClient.upload(path, file);
}
