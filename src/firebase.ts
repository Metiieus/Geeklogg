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

const hasValidConfig = missingVars.length === 0;

if (!hasValidConfig) {
  console.warn("⚠️ Firebase config incompleta - executando em modo offline");
  console.warn("Para produção, configure as variáveis Firebase no ambiente");
  console.log("🔧 Modo offline ativado - dados serão salvos localmente");
} else {
  console.log("✅ Firebase configurado corretamente");
  console.log("🔧 Firebase config:", {
    apiKey: firebaseConfig.apiKey ? "✅ Definido" : "❌ Indefinido",
    authDomain: firebaseConfig.authDomain ? "✅ Definido" : "❌ Indefinido",
    projectId: firebaseConfig.projectId ? "✅ Definido" : "❌ Indefinido",
  });
}

// Inicializa o app Firebase com tratamento de erro
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (hasValidConfig) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app, 'geeklog');
    console.log("🚀 Firebase inicializado com sucesso");
  } catch (error) {
    console.warn("⚠️ Firebase initialization failed:", error);
    console.warn("Executando em modo offline");
  }
} else {
  console.log("🔄 Executando em modo offline - dados salvos localmente");
  // Enable offline mode in localStorage service
  if (typeof window !== 'undefined') {
    localStorage.setItem("firebase_offline_mode", "true");
  }
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
  if (!checkConnectivity()) {
    console.warn("⚠️ Sem conectividade com a internet");
  }
} else {
  console.warn("Firebase não foi inicializado");
}

// Detectar mudanças de conectividade
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log("🌐 Conectividade restaurada");
  });

  window.addEventListener('offline', () => {
    console.warn("⚠️ Conectividade perdida");
  });
}
