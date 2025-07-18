import { db, auth } from "../firebase";
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
} from "firebase/firestore";

export const database = {
  // Add a document to a collection
  add: async (collectionPath: string | string[], data: any) => {
        try {
          const pathStr = Array.isArray(collectionPath)
            ? collectionPath.join("/")
            : collectionPath;
          const docRef = await addDoc(collection(db, pathStr), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          return docRef.id;
        } catch (error) {
          console.error("Error adding document:", error);
          throw error;
        }
      },

      // Set a document with a specific ID
      set: async (
        collectionPath: string | string[],
        docId: string,
        data: any,
        options?: any,
      ) => {
        try {
          const pathStr = Array.isArray(collectionPath)
            ? collectionPath.join("/")
            : collectionPath;
          await setDoc(
            doc(db, pathStr, docId),
            {
              ...data,
              updatedAt: serverTimestamp(),
            },
            options,
          );
          return docId;
        } catch (error) {
          console.error("Error setting document:", error);
          throw error;
        }
      },

      // Get a single document
      get: async (collectionPath: string | string[], docId?: string) => {
        try {
          // Check authentication for user-specific documents
          const pathStr = Array.isArray(collectionPath)
            ? collectionPath.join("/")
            : collectionPath;
          if (pathStr.startsWith("users/") && !auth.currentUser) {
            console.warn(
              "Attempting to access user document without authentication:",
              pathStr,
            );
            return { exists: () => false, data: () => null };
          }

          let docRef;
          if (docId) {
            const pathStr = Array.isArray(collectionPath)
              ? collectionPath.join("/")
              : collectionPath;
            docRef = doc(db, pathStr, docId);
          } else if (Array.isArray(collectionPath)) {
            // Handle case where path includes doc ID
            const fullPath = collectionPath.join("/");
            const parts = fullPath.split("/");
            if (parts.length % 2 === 0) {
              // Even number means we have doc path
              docRef = doc(db, fullPath);
            } else {
              throw new Error("Invalid document path");
            }
          } else {
            throw new Error("Document ID required for string collection path");
          }

          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            return {
              id: docSnap.id,
              ...docSnap.data(),
              exists: () => true,
              data: () => docSnap.data(),
            };
          } else {
            return { exists: () => false, data: () => null };
          }
        } catch (error: any) {
          console.error("Error getting document:", error);

          // Handle specific Firebase errors gracefully
          if (
            error.code === "unavailable" ||
            error.message.includes("Failed to fetch") ||
            error.message.includes("offline") ||
            error.code === "failed-precondition"
          ) {
            console.warn(
              "🌐 Network/offline issue detected, returning null document",
            );
            return { exists: () => false, data: () => null };
          }

          if (error.code === "permission-denied") {
            console.warn("🔒 Permission denied, user may not be authenticated");
            return { exists: () => false, data: () => null };
          }

          if (error.code === "unauthenticated") {
            console.warn("🔐 User not authenticated, returning null document");
            return { exists: () => false, data: () => null };
          }

          // For development, don't throw errors that break the app
          if (import.meta.env.DEV) {
            console.warn(
              "🚧 Development mode: suppressing Firebase error, returning null document",
            );
            return { exists: () => false, data: () => null };
          }

          throw error;
        }
      },

      // Get all documents from a collection
      getCollection: async (
        collectionPath: string | string[],
        queryOptions?: any,
      ) => {
        try {
          // Check if user is authenticated for user-specific collections
          const pathStr = Array.isArray(collectionPath)
            ? collectionPath.join("/")
            : collectionPath;
          if (pathStr.startsWith("users/") && !auth.currentUser) {
            console.warn(
              "Attempting to access user collection without authentication:",
              pathStr,
            );
            return [];
          }

          let q = collection(db, pathStr);

          if (queryOptions) {
            const {
              where: whereClause,
              orderBy: orderByClause,
              limit: limitClause,
            } = queryOptions;

            if (whereClause) {
              q = query(
                q,
                where(
                  whereClause.field,
                  whereClause.operator,
                  whereClause.value,
                ),
              );
            }

            if (orderByClause) {
              q = query(
                q,
                orderBy(orderByClause.field, orderByClause.direction || "asc"),
              );
            }

            if (limitClause) {
              q = query(q, limit(limitClause));
            }
          }

          const querySnapshot = await getDocs(q);
          return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
            ...doc.data(),
          }));
        } catch (error: any) {
          console.error("Error getting collection:", error);

          // Handle specific Firebase errors gracefully
          if (
            error.code === "unavailable" ||
            error.message.includes("Failed to fetch") ||
            error.message.includes("offline") ||
            error.code === "failed-precondition"
          ) {
            console.warn(
              "🌐 Network/offline issue detected, returning empty array",
            );
            return [];
          }

          if (error.code === "permission-denied") {
            console.warn("🔒 Permission denied, user may not be authenticated");
            return [];
          }

          if (error.code === "unauthenticated") {
            console.warn("🔐 User not authenticated, returning empty array");
            return [];
          }

          // For development, try localStorage fallback
          if (import.meta.env.DEV) {
            console.warn("🚧 Development mode: trying localStorage fallback");
            try {
              const fallbackData = localStorageService.getCollection(pathStr);
              console.log(
                "📂 Using localStorage fallback, found",
                fallbackData.length,
                "items",
              );
              return fallbackData.map((item) => ({
                id: item.id || Date.now().toString(),
                data: item,
                ...item,
              }));
            } catch (fallbackError) {
              console.warn("📂 localStorage fallback failed:", fallbackError);
              return [];
            }
          }

          throw error;
        }
      },

      // Update a document
      update: async (
        collectionPath: string | string[],
        docId: string,
        data: any,
      ) => {
        try {
          const pathStr = Array.isArray(collectionPath)
            ? collectionPath.join("/")
            : collectionPath;
          const docRef = doc(db, pathStr, docId);
          await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
          });
          return docId;
        } catch (error) {
          console.error("Error updating document:", error);
          throw error;
        }
      },

      // Delete a document
      delete: async (collectionPath: string | string[], docId: string) => {
        try {
          const pathStr = Array.isArray(collectionPath)
            ? collectionPath.join("/")
            : collectionPath;
          await deleteDoc(doc(db, pathStr, docId));
          return docId;
        } catch (error) {
          console.error("Error deleting document:", error);
          throw error;
        }
      },

      // Listen to real-time updates
      listen: (
        collectionPath: string | string[],
        callback: (data: any[]) => void,
        queryOptions?: any,
      ) => {
        try {
          const pathStr = Array.isArray(collectionPath)
            ? collectionPath.join("/")
            : collectionPath;
          let q = collection(db, pathStr);

          if (queryOptions) {
            const {
              where: whereClause,
              orderBy: orderByClause,
              limit: limitClause,
            } = queryOptions;

            if (whereClause) {
              q = query(
                q,
                where(
                  whereClause.field,
                  whereClause.operator,
                  whereClause.value,
                ),
              );
            }

            if (orderByClause) {
              q = query(
                q,
                orderBy(orderByClause.field, orderByClause.direction || "asc"),
              );
            }

            if (limitClause) {
              q = query(q, limit(limitClause));
            }
          }

          return onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
              ...doc.data(),
            }));
            callback(data);
          });
        } catch (error) {
          console.error("Error setting up listener:", error);
          throw error;
        }
      },

      // Add getDocument method for socialService compatibility
      getDocument: async (
        collectionPath: string | string[],
        docId?: string,
      ) => {
        return database.get(collectionPath, docId);
      },

      // Utility functions
      timestamp: Timestamp,
      serverTimestamp,
    };
