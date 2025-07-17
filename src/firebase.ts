import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Check if Firebase configuration is valid
const hasValidFirebaseConfig = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;

  return (
    apiKey &&
    projectId &&
    authDomain &&
    storageBucket &&
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

// Mock services for when Firebase is not configured
const createMockAuth = () => {
  let currentUser: any = null;
  let authStateListeners: Array<(user: any) => void> = [];

  return {
    get currentUser() {
      return currentUser;
    },
    onAuthStateChanged: (callback: (user: any) => void) => {
      authStateListeners.push(callback);
      callback(currentUser);
      return () => {
        authStateListeners = authStateListeners.filter(
          (listener) => listener !== callback,
        );
      };
    },
    signInWithEmailAndPassword: async (email: string, password: string) => {
      console.log(
        "⚠️ Usando autenticação temporária - Configure o Firebase para funcionalidade completa",
      );
      currentUser = {
        uid: "temp-user",
        email,
        displayName: email.split("@")[0],
      };
      authStateListeners.forEach((listener) => listener(currentUser));
      return { user: currentUser };
    },
    createUserWithEmailAndPassword: async (email: string, password: string) => {
      console.log(
        "⚠️ Usando registro temporário - Configure o Firebase para funcionalidade completa",
      );
      currentUser = {
        uid: "temp-user",
        email,
        displayName: email.split("@")[0],
      };
      authStateListeners.forEach((listener) => listener(currentUser));
      return { user: currentUser };
    },
    signOut: async () => {
      currentUser = null;
      authStateListeners.forEach((listener) => listener(null));
    },
  };
};

const createMockDb = () => ({
  collection: () => ({
    doc: () => ({
      get: async () => ({ exists: () => false, data: () => null }),
      set: async () =>
        console.log(
          "⚠️ Dados temporários - Configure o Firebase para persistência real",
        ),
      update: async () =>
        console.log(
          "⚠️ Dados temporários - Configure o Firebase para persistência real",
        ),
      delete: async () =>
        console.log(
          "⚠️ Dados temporários - Configure o Firebase para persistência real",
        ),
    }),
    add: async () => ({ id: "temp-doc-id" }),
    where: () => ({ get: async () => ({ docs: [] }) }),
  }),
});

const createMockStorage = () => ({
  ref: (path: string) => ({
    put: async (file: File | Blob) => {
      console.log(
        "⚠️ Upload temporário - Configure o Firebase para storage real",
      );
      return {
        ref: {
          getDownloadURL: async () => {
            return `https://via.placeholder.com/300x400/6366f1/ffffff?text=${encodeURIComponent("Temp Image")}`;
          },
        },
      };
    },
    delete: async () => console.log("⚠️ Storage temporário"),
    getDownloadURL: async () =>
      `https://via.placeholder.com/300x400/6366f1/ffffff?text=${encodeURIComponent("Temp Image")}`,
  }),
  uploadBytes: async (ref: any, file: File | Blob) => {
    console.log("⚠️ Upload temporário");
    return {};
  },
  getDownloadURL: async (ref: any) => {
    return `https://via.placeholder.com/300x400/6366f1/ffffff?text=${encodeURIComponent("Temp Image")}`;
  },
  deleteObject: async (ref: any) => {
    console.log("⚠️ Storage temporário");
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
    db = getFirestore(app);
    storage = getStorage(app);
    console.log("✅ Firebase initialized successfully");
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
    console.warn("🔄 Usando serviços temporários...");
    auth = createMockAuth();
    db = createMockDb();
    storage = createMockStorage();
  }
} else {
  console.warn(
    "⚠️ Firebase não configurado - usando serviços temporários\n\n" +
      "Para funcionalidade completa, configure as variáveis de ambiente:\n" +
      "VITE_FIREBASE_API_KEY=sua_api_key\n" +
      "VITE_FIREBASE_AUTH_DOMAIN=seu_dominio\n" +
      "VITE_FIREBASE_PROJECT_ID=seu_project_id\n" +
      "VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket\n" +
      "VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id\n" +
      "VITE_FIREBASE_APP_ID=seu_app_id\n\n" +
      "Copie o arquivo .env.example para .env e preencha com suas credenciais.",
  );

  auth = createMockAuth();
  db = createMockDb();
  storage = createMockStorage();
}

export { auth, db, storage };
