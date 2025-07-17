import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

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
    } catch (e) {
      console.error("Erro ao deletar arquivo:", e);
      throw e;
    }
  }
}

export const storageClient = new StorageClient();