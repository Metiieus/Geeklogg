import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase';
import { getUserId } from './utils';

/**
 * Thin wrapper around Firebase Storage operations.  By routing all calls
 * through this file it becomes easier to swap the storage provider later.
 */
export const storageClient = {
  async upload(relativePath: string, file: File | Blob): Promise<string> {
    const uid = getUserId();
    const fullPath = `users/${uid}/${relativePath}`;
    const storageRef = ref(storage, fullPath);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  },

  async remove(relativePath: string): Promise<void> {
    const uid = getUserId();
    const fullPath = `users/${uid}/${relativePath}`;
    await deleteObject(ref(storage, fullPath));
  },
};
