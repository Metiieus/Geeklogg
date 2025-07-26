import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getUserId } from "./utils";

class StorageClient {
  private storage = storage;

  createRef(path: string) {
    if (!this.storage) {
      throw new Error("Storage não está inicializado");
    }
    return ref(this.storage, path);
  }

  async uploadFile(storageRef: any, file: File | Blob) {
    if (!this.storage) {
      throw new Error("Storage não está inicializado");
    }
    
    try {
      return await uploadBytes(storageRef, file);
    } catch (e) {
      console.error("Erro ao fazer upload:", e);
      throw e;
    }
  }

  async getDownloadURL(storageRef: any) {
    if (!this.storage) {
      throw new Error("Storage não está inicializado");
    }
    
    try {
      return await getDownloadURL(storageRef);
    } catch (e) {
      console.error("Erro ao obter URL:", e);
      throw e;
    }
  }

  async deleteFile(storageRef: any) {
    if (!this.storage) {
      throw new Error("Storage não está inicializado");
    }

    try {
      return await deleteObject(storageRef);
    } catch (e: any) {
      // Se o arquivo não existe, consideramos como sucesso
      if (e.code === 'storage/object-not-found') {
        console.log("ℹ️ Arquivo não encontrado (já foi deletado):", e);
        return; // Não é erro, apenas ignora
      }

      console.error("Erro ao deletar arquivo:", e);
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
