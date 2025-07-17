import { db } from '../firebase';
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
  serverTimestamp
} from 'firebase/firestore';

export const database = {
  // Add a document to a collection
  add: async (collectionName: string, data: any) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  },

  // Set a document with a specific ID
  set: async (collectionName: string, docId: string, data: any) => {
    try {
      await setDoc(doc(db, collectionName, docId), {
        ...data,
        updatedAt: serverTimestamp()
      });
      return docId;
    } catch (error) {
      console.error('Error setting document:', error);
      throw error;
    }
  },

  // Get a single document
  get: async (collectionName: string, docId: string) => {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  },

  // Get all documents from a collection
  getCollection: async (collectionName: string, queryOptions?: any) => {
    try {
      let q = collection(db, collectionName);
      
      if (queryOptions) {
        const { where: whereClause, orderBy: orderByClause, limit: limitClause } = queryOptions;
        
        if (whereClause) {
          q = query(q, where(whereClause.field, whereClause.operator, whereClause.value));
        }
        
        if (orderByClause) {
          q = query(q, orderBy(orderByClause.field, orderByClause.direction || 'asc'));
        }
        
        if (limitClause) {
          q = query(q, limit(limitClause));
        }
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting collection:', error);
      throw error;
    }
  },

  // Update a document
  update: async (collectionName: string, docId: string, data: any) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return docId;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  },

  // Delete a document
  delete: async (collectionName: string, docId: string) => {
    try {
      await deleteDoc(doc(db, collectionName, docId));
      return docId;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  },

  // Listen to real-time updates
  listen: (collectionName: string, callback: (data: any[]) => void, queryOptions?: any) => {
    try {
      let q = collection(db, collectionName);
      
      if (queryOptions) {
        const { where: whereClause, orderBy: orderByClause, limit: limitClause } = queryOptions;
        
        if (whereClause) {
          q = query(q, where(whereClause.field, whereClause.operator, whereClause.value));
        }
        
        if (orderByClause) {
          q = query(q, orderBy(orderByClause.field, orderByClause.direction || 'asc'));
        }
        
        if (limitClause) {
          q = query(q, limit(limitClause));
        }
      }
      
      return onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(data);
      });
    } catch (error) {
      console.error('Error setting up listener:', error);
      throw error;
    }
  },

  // Utility functions
  timestamp: Timestamp,
  serverTimestamp
};