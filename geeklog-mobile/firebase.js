import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Mock user for demo mode
const mockUser = {
  uid: "demo-user-123",
  email: "demo@example.com",
  displayName: "Demo User",
};

// Mock authentication system
const createMockAuth = () => {
  let currentUser = null;
  let authStateListeners = [];

  const mockAuth = {
    get currentUser() {
      return currentUser;
    },
    onAuthStateChanged: (callback) => {
      authStateListeners.push(callback);
      callback(currentUser);
      return () => {
        authStateListeners = authStateListeners.filter(
          (listener) => listener !== callback,
        );
      };
    },
    signInWithEmailAndPassword: async (email, password) => {
      console.log("🎭 Mock login for demo mode");
      currentUser = { ...mockUser, email };
      authStateListeners.forEach((listener) => listener(currentUser));
      return { user: currentUser };
    },
    signOut: async () => {
      console.log("🎭 Mock logout for demo mode");
      currentUser = null;
      authStateListeners.forEach((listener) => listener(null));
    },
    createUserWithEmailAndPassword: async (email, password) => {
      console.log("🎭 Mock registration for demo mode");
      currentUser = { ...mockUser, email };
      authStateListeners.forEach((listener) => listener(currentUser));
      return { user: currentUser };
    },
  };

  return mockAuth;
};

// Mock Firestore
const createMockDb = () => ({
  collection: () => ({
    doc: () => ({
      get: async () => ({ exists: () => false, data: () => null }),
      set: async () => console.log("🎭 Mock Firestore write for demo mode"),
      update: async () => console.log("🎭 Mock Firestore update for demo mode"),
      delete: async () => console.log("🎭 Mock Firestore delete for demo mode"),
    }),
    add: async () => ({ id: "mock-doc-id" }),
    where: () => ({ get: async () => ({ docs: [] }) }),
  }),
});

// Mock Storage
const createMockStorage = () => ({
  ref: (path) => ({
    put: async (file) => {
      console.log("🎭 Mock Storage upload for demo mode:", path);
      return {
        ref: {
          getDownloadURL: async () => {
            return `https://via.placeholder.com/300x400/6366f1/ffffff?text=${encodeURIComponent("Demo Image")}`;
          },
        },
      };
    },
    delete: async () =>
      console.log("🎭 Mock Storage delete for demo mode:", path),
    getDownloadURL: async () =>
      `https://via.placeholder.com/300x400/6366f1/ffffff?text=${encodeURIComponent("Demo Image")}`,
  }),
});

// Para demo, usamos mock services
console.log("🎭 Using mock Firebase services for demo mode");
export const auth = createMockAuth();
export const db = createMockDb();
export const storage = createMockStorage();
