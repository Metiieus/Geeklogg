import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  enableIndexedDbPersistence,
  enableNetwork,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Carrega configuração do Firebase das variáveis de ambiente
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
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
    !value || value.includes("your_") || value === "your_firebase_api_key_here"
  );
});

if (missingVars.length > 0) {
  console.error("❌ Firebase config incompleta:", missingVars);
  console.warn("Verifique seu arquivo .env");
}

// Inicializa o app Firebase
export const app = initializeApp(firebaseConfig);

// Autenticação
export const auth = getAuth(app);

// Firestore com uso fixo do banco `geeklog`
export const db = getFirestore(app, "geeklog");

// Configuração especial para DEV e produção
if (import.meta.env.DEV) {
  console.log("🔧 Modo DEV: Firebase com suporte offline");

  enableIndexedDbPersistence(db)
    .then(() => console.log("💾 Offline persistence habilitado"))
    .catch((err) => console.warn("⚠️ Falha ao ativar persistence:", err));
} else {
  enableNetwork(db).catch((err) =>
    console.warn("⚠️ Falha ao ativar rede no modo produção:", err),
  );
}

// Storage
export const storage = getStorage(app);

// Mensagem final de status
if (missingVars.length === 0) {
  console.log("✅ Firebase inicializado com sucesso");
} else {
  console.warn("⚠️ Firebase inicializado com variáveis faltando");
}
