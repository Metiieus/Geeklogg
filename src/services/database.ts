import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Simple wrapper around Firestore. Having these functions isolated
 * allows replacing the implementation by another database in the future
 * without touching the rest of the application.
 */

export const database = {
  async add(path: string[], data: unknown) {
    if (isMockMode()) {
      const id = Math.random().toString(36).substr(2, 9);
      const pathKey = path.join("/");
      const collection = mockData.get(pathKey) || [];
      collection.push({ id, ...data });
      mockData.set(pathKey, collection);
      return { id };
    }

    const col = collection(db, ...path);
    return addDoc(col, data);
  },

  async set(path: string[], data: unknown, opts?: { merge?: boolean }) {
    if (isMockMode()) {
      const pathKey = path.join("/");
      if (opts?.merge) {
        const existing = mockData.get(pathKey) || {};
        mockData.set(pathKey, { ...existing, ...data });
      } else {
        mockData.set(pathKey, data);
      }
      return;
    }

    return setDoc(doc(db, ...path), data, opts);
  },

  async update(path: string[], data: unknown) {
    if (isMockMode()) {
      const pathKey = path.join("/");
      const existing = mockData.get(pathKey) || {};
      mockData.set(pathKey, { ...existing, ...data });
      return;
    }

    return updateDoc(doc(db, ...path), data);
  },

  async getCollection<T>(path: string[]): Promise<{ id: string; data: T }[]> {
    if (isMockMode()) {
      const pathKey = path.join("/");
      const collection = mockData.get(pathKey) || [];
      return collection.map((item: any) => ({
        id: item.id || Math.random().toString(36).substr(2, 9),
        data: item,
      }));
    }

    const snap = await getDocs(collection(db, ...path));
    return snap.docs.map((doc) => ({ id: doc.id, data: doc.data() as T }));
  },

  async getDocument<T>(path: string[]): Promise<T | null> {
    if (isMockMode()) {
      const pathKey = path.join("/");
      return mockData.get(pathKey) || null;
    }

    const snap = await getDoc(doc(db, ...path));
    return snap.exists() ? (snap.data() as T) : null;
  },

  async delete(path: string[]) {
    if (isMockMode()) {
      const pathKey = path.join("/");
      mockData.delete(pathKey);
      return;
    }

    return deleteDoc(doc(db, ...path));
  },
};
