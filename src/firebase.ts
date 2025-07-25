import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import {
  getFirestore,
  enableIndexedDbPersistence,
  enableNetwork,
  type Firestore,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Verificação de conectividade
const checkConnectivity = () => {
  if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
    return navigator.onLine;
  }
  return true; // Assume online se não puder verificar
};

// Verifica se todas as variáveis obrigatórias estão definidas
const requiredEnvVars = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

const missingVars = requiredEnvVars.filter((varName) => {
  const value = import.meta.env[varName];
  // Check for missing, empty, or placeholder-like values
  return (
    !value ||
    value.trim() === "" ||
    /^your[_-]/i.test(value)
  );
});

if (missingVars.length > 0) {
  console.error("❌ Firebase config incompleta:", missingVars);
  console.warn("Verifique seu arquivo .env");
}

// Inicializa o app Firebase com tratamento de erro
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn("⚠️ Firebase initialization failed:", error);
  console.warn("App will run in offline mode. Please configure Firebase environment variables.");
}

export { app, auth, db };

// Configuração especial para DEV e produção
if (db) {
  try {
    if (import.meta.env.DEV) {
      enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn("⚠️ Multiple tabs open, persistence can only be enabled in one tab at a time.");
        } else if (err.code === 'unimplemented') {
          console.warn("⚠️ The current browser doesn't support all of the features required to enable persistence");
        } else {
          console.warn("⚠️ Falha ao ativar persistence:", err);
        }
      });
    } else {
      enableNetwork(db).catch((err) =>
        console.warn("⚠️ Falha ao ativar rede no modo produção:", err),
      );
    }
  } catch (error) {
    console.warn("⚠️ Erro na configuração do Firestore:", error);
  }
}

// Storage
export const storage = getStorage(app);

// Mensagem final de status
if (app) {
  console.log("Firebase inicializado");
} else {
  console.warn("Firebase não foi inicializado");
}
