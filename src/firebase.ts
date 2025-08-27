import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import {
  getFirestore,
  enableIndexedDbPersistence,
  enableNetwork,
  type Firestore,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuração do Firebase (usa variáveis de ambiente quando disponíveis, com fallback seguro para valores públicos fornecidos)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBIQIUNwk_wmMj5IprvMjlbJaitxofLk1M",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "geeklog-26b2c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "geeklog-26b2c",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "geeklog-26b2c.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "367690608897",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:367690608897:web:4b7e084e60ad8cdb8deb00",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-KC9X0WP28Z"
};

// Verificação de conectividade
const checkConnectivity = () => {
  if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
    return navigator.onLine;
  }
  return true; // Assume online se não puder verificar
};

// Validar configuração efetiva (não apenas env)
const requiredConfigKeys: (keyof typeof firebaseConfig)[] = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
];

const missingConfig = requiredConfigKeys.filter((k) => {
  const value = (firebaseConfig as any)[k];
  return !value || String(value).trim() === "";
});

const hasValidConfig = missingConfig.length === 0;

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

// Storage - only initialize if app is valid
export const storage = app ? getStorage(app) : null;

// Mensagem final de status
if (app) {
  console.log("✅ Firebase online - dados sincronizados na nuvem");
  if (!checkConnectivity()) {
    console.warn("⚠️ Sem conectividade com a internet");
  }
} else {
  console.log("💾 Modo offline ativado - dados salvos localmente");
  console.log("📝 Para ativar Firebase: configure as variáveis de ambiente");
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
