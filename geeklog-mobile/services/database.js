import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Database service for mobile app
 */
export const database = {
  async add(path, data) {
    try {
      const segments = Array.isArray(path) ? path : path.split("/");
      const col = collection(db, ...segments);
      return await addDoc(col, {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Database add error:", error);
      throw error;
    }
  },

  async set(path, data, opts = {}) {
    try {
      const segments = Array.isArray(path) ? path : path.split("/");
      const dataToSave = {
        ...data,
        updatedAt: new Date(),
      };

      if (!opts.merge) {
        dataToSave.createdAt = new Date();
      }

      return await setDoc(doc(db, ...segments), dataToSave, opts);
    } catch (error) {
      console.error("Database set error:", error);
      throw error;
    }
  },

  async update(path, data) {
    try {
      const segments = Array.isArray(path) ? path : path.split("/");
      return await updateDoc(doc(db, ...segments), {
        ...data,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Database update error:", error);
      throw error;
    }
  },

  async getCollection(path, filters = []) {
    try {
      const segments = Array.isArray(path) ? path : path.split("/");
      let q = collection(db, ...segments);

      // Apply filters if provided
      if (filters.length > 0) {
        const constraints = filters
          .map((filter) => {
            if (filter.type === "where") {
              return where(filter.field, filter.operator, filter.value);
            } else if (filter.type === "orderBy") {
              return orderBy(filter.field, filter.direction || "asc");
            } else if (filter.type === "limit") {
              return limit(filter.value);
            }
            return null;
          })
          .filter(Boolean);

        if (constraints.length > 0) {
          q = query(q, ...constraints);
        }
      }

      const snap = await getDocs(q);
      return snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Database getCollection error:", error);
      throw error;
    }
  },

  async getDocument(path) {
    try {
      const segments = Array.isArray(path) ? path : path.split("/");
      const snap = await getDoc(doc(db, ...segments));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    } catch (error) {
      console.error("Database getDocument error:", error);
      throw error;
    }
  },

  async delete(path) {
    try {
      const segments = Array.isArray(path) ? path : path.split("/");
      return await deleteDoc(doc(db, ...segments));
    } catch (error) {
      console.error("Database delete error:", error);
      throw error;
    }
  },

  // Utility functions for common queries
  async getUserData(userId) {
    return await this.getDocument(["users", userId]);
  },

  async getUserMedia(userId) {
    return await this.getCollection(
      ["users", userId, "media"],
      [{ type: "orderBy", field: "createdAt", direction: "desc" }],
    );
  },

  async getUserReviews(userId) {
    return await this.getCollection(
      ["users", userId, "reviews"],
      [{ type: "orderBy", field: "createdAt", direction: "desc" }],
    );
  },

  async getUserMilestones(userId) {
    return await this.getCollection(
      ["users", userId, "milestones"],
      [{ type: "orderBy", field: "createdAt", direction: "desc" }],
    );
  },

  async getUserSettings(userId) {
    return await this.getDocument(["users", userId, "private", "settings"]);
  },

  async updateUserSettings(userId, settings) {
    return await this.set(["users", userId, "private", "settings"], settings, {
      merge: true,
    });
  },
};
