import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Simple wrapper around Firestore.  Having these functions isolated
 * allows replacing the implementation by another database in the future
 * without touching the rest of the application.
 */
export const database = {
  async add(path: string[], data: unknown) {
    const col = collection(db, ...path);
    return addDoc(col, data);
  },

  async set(path: string[], data: unknown, opts?: { merge?: boolean }) {
    return setDoc(doc(db, ...path), data, opts);
  },

  async update(path: string[], data: unknown) {
    return updateDoc(doc(db, ...path), data);
  },

  async getCollection<T>(path: string[]): Promise<{ id: string; data: T }[]> {
    const snap = await getDocs(collection(db, ...path));
    return snap.docs.map(d => ({ id: d.id, data: d.data() as T }));
  },

  async getDocument<T>(path: string[]): Promise<T | null> {
    const snap = await getDoc(doc(db, ...path));
    return snap.exists() ? (snap.data() as T) : null;
  },

  async delete(path: string[]) {
    return deleteDoc(doc(db, ...path));
  },
};
