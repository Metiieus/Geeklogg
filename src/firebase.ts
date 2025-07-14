import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Check if Firebase configuration is valid
const hasValidFirebaseConfig = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  return (
    apiKey &&
    projectId &&
    !apiKey.includes("your_") &&
    !apiKey.includes("Demo") &&
    !projectId.includes("your_") &&
    !projectId.includes("demo-")
  );
};

// Firebase configuration is loaded from environment variables to keep
// secrets out of the repository. Vite exposes variables prefixed with
// `VITE_` to the client side.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Mock user for demo mode
const mockUser = {
  uid: "demo-user-123",
  email: "demo@example.com",
  displayName: "Demo User",
};

// Mock authentication system
const createMockAuth = () => {
  let currentUser: any = null;
  let authStateListeners: Array<(user: any) => void> = [];

  const mockAuth = {
    get currentUser() {
      return currentUser;
    },
    onAuthStateChanged: (callback: (user: any) => void) => {
      authStateListeners.push(callback);
      // Immediately call with current user
      callback(currentUser);
      // Return unsubscribe function
      return () => {
        authStateListeners = authStateListeners.filter(
          (listener) => listener !== callback,
        );
      };
    },
    signInWithEmailAndPassword: async (email: string, password: string) => {
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
    createUserWithEmailAndPassword: async (email: string, password: string) => {
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
  ref: (path: string) => ({
    put: async (file: File | Blob) => {
      console.log("🎭 Mock Storage upload for demo mode:", path);
      return {
        ref: {
          getDownloadURL: async () => {
            // Retorna uma URL mock mas válida para imagens
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
  uploadBytes: async (ref: any, file: File | Blob) => {
    console.log("🎭 Mock uploadBytes for demo mode");
    return {};
  },
  getDownloadURL: async (ref: any) => {
    console.log("🎭 Mock getDownloadURL for demo mode");
    return `https://via.placeholder.com/300x400/6366f1/ffffff?text=${encodeURIComponent("Demo Image")}`;
  },
  deleteObject: async (ref: any) => {
    console.log("🎭 Mock deleteObject for demo mode");
  },
});

let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

if (hasValidFirebaseConfig()) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app, "geeklog");
    storage = getStorage(app);
    console.log("✅ Firebase initialized successfully");
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
  }
} else {
  console.warn(
    "🎭 Firebase not configured - using mock authentication for demo mode",
  );
  auth = createMockAuth();
  db = createMockDb();
  storage = null;
}

export { auth, db, storage };
