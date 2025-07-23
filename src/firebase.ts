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
  apiKey: "AIzaSyBIQIUNwk_wmMj5IprvMjlbJaitxofLk1M",
  authDomain: "geeklog-26b2c.firebaseapp.com",
  projectId: "geeklog-26b2c",
  storageBucket: "geeklog-26b2c.firebasestorage.app",
  messagingSenderId: "367690608897",
  appId: "1:367690608897:web:4b7e084e60ad8cdb8deb00",
  measurementId: "G-KC9X0WP28Z"
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
    !value || value.includes("your_") || value === "AIzaSyBIQIUNwk_wmMj5IprvMjlbJaitxofLk1M"
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
