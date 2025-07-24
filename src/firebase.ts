import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  enableIndexedDbPersistence,
  enableNetwork,
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
  return (
    !value || value.includes("your_")
  );
});

if (missingVars.length > 0) {
  console.error("❌ Firebase config incompleta:", missingVars);
  console.warn("Verifique seu arquivo .env");
}

// Inicializa o app Firebase com tratamento de erro
let app: any = null;
let auth: any = null;
let db: any = null;

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
  if (import.meta.env.DEV) {
    enableIndexedDbPersistence(db).catch((err) =>
      console.warn("⚠️ Falha ao ativar persistence:", err),
    );
  } else {
    enableNetwork(db).catch((err) =>
      console.warn("⚠️ Falha ao ativar rede no modo produção:", err),
    );
  }
}

// Storage
export const storage = getStorage(app);

// Mensagem final de status
