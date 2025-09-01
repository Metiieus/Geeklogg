import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import {
  getFirestore,
  enableIndexedDbPersistence,
  enableNetwork,
  type Firestore,
  connectFirestoreEmulator,
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
const checkConnectivity = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined') {
      resolve(true);
      return;
    }

    if (!navigator.onLine) {
      resolve(false);
      return;
    }

    // Use a more reliable connectivity check
    const timeoutId = setTimeout(() => resolve(false), 5000);

    // Try to fetch a simple resource that supports CORS
    fetch('https://httpbin.org/status/200', {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Accept': 'application/json'
      }
    })
      .then((response) => {
        clearTimeout(timeoutId);
        resolve(response.ok);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        console.warn('Connectivity check failed:', error.message);
        // If the specific check fails, assume we're online if navigator says so
        resolve(navigator.onLine);
      });
  });
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

// Estado global para controlar o modo de operação
let isOfflineMode = false;

if (!hasValidConfig) {
  console.warn("⚠️ Firebase config incompleta - executando em modo offline");
  console.warn("Para produção, configure as variáveis Firebase no ambiente");
  console.log("🔧 Modo offline ativado - dados serão salvos localmente");
  isOfflineMode = true;
} else {
  console.log("✅ Firebase configurado corretamente");
  console.log("🔧 Firebase config:", {
    apiKey: firebaseConfig.apiKey ? "✅ Definido" : "❌ Indefinido",
    authDomain: firebaseConfig.authDomain ? "✅ Definido" : "❌ Indefinido",
    projectId: firebaseConfig.projectId ? "✅ Definido" : "❌ Indefinido",
  });
}

// Inicializa o app Firebase com tratamento de erro robusto
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

const initializeFirebase = async () => {
  if (!hasValidConfig) {
    isOfflineMode = true;
    return;
  }

  try {
    // Check connectivity first
    const isOnline = await checkConnectivity();
    if (!isOnline) {
      console.warn("⚠️ Sem conectividade - modo offline ativado");
      isOfflineMode = true;
      return;
    }

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    
    // Initialize Firestore with proper error handling
    try {
      db = getFirestore(app);
      
      // Test Firestore connectivity
      if (db) {
        // Try to enable offline persistence
        try {
          await enableIndexedDbPersistence(db, {
            forceOwnership: false
          });
          console.log("✅ Firestore persistence enabled");
        } catch (persistenceError: any) {
          if (persistenceError.code === 'failed-precondition') {
            console.warn("⚠️ Multiple tabs open, persistence can only be enabled in one tab at a time.");
          } else if (persistenceError.code === 'unimplemented') {
            console.warn("⚠️ The current browser doesn't support all features required for persistence");
          } else {
            console.warn("⚠️ Failed to enable persistence:", persistenceError);
          }
        }
      }
      
      console.log("🚀 Firebase initialized successfully");
    } catch (firestoreError) {
      console.warn("⚠️ Firestore initialization failed:", firestoreError);
      db = null;
      isOfflineMode = true;
    }
  } catch (error) {
    console.warn("⚠️ Firebase initialization failed:", error);
    console.warn("Switching to offline mode");
    app = null;
    auth = null;
    db = null;
    isOfflineMode = true;
  }

  // Set offline mode flag in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem("firebase_offline_mode", isOfflineMode.toString());
  }
};

// Initialize Firebase immediately but don't block
initializeFirebase().catch((error) => {
  console.warn("⚠️ Failed to initialize Firebase:", error);
  isOfflineMode = true;
  if (typeof window !== 'undefined') {
    localStorage.setItem("firebase_offline_mode", "true");
  }
});

// Export reactive getters that check current state
export const getFirebaseApp = () => app;
export const getAuth = () => auth;
export const getDB = () => db;
export const isFirebaseOffline = () => isOfflineMode;

// Legacy exports for compatibility
export { app, auth, db };

// Storage - only initialize if app is valid
export const storage = app ? getStorage(app) : null;

// Network status detection
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log("🌐 Network connectivity restored");
    if (hasValidConfig && !app) {
      console.log("🔄 Attempting to reconnect to Firebase...");
      initializeFirebase();
    }
  });

  window.addEventListener('offline', () => {
    console.warn("⚠️ Network connectivity lost");
    isOfflineMode = true;
    if (typeof window !== 'undefined') {
      localStorage.setItem("firebase_offline_mode", "true");
    }
  });
}

// Retry mechanism for Firebase operations
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      if (attempt === maxRetries) {
        throw error;
      }

      // Check if it's a network error that might benefit from retry
      const isNetworkError =
        error.code === 'unavailable' ||
        error.code === 'deadline-exceeded' ||
        error.name === 'TypeError' ||
        (error.message && (
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError') ||
          error.message.includes('network') ||
          error.message.includes('timeout')
        ));

      if (isNetworkError) {
        console.warn(`⚠️ Network error on attempt ${attempt}:`, error.message || error.code);
        console.warn(`🔄 Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        console.warn(`❌ Non-retryable error:`, error);
        throw error; // Don't retry non-network errors
      }
    }
  }
  throw new Error('All retry attempts failed');
};

// Status reporting
const logFinalStatus = () => {
  if (app && db) {
    console.log("✅ Firebase online - dados sincronizados na nuvem");
  } else {
    console.log("💾 Modo offline ativado - dados salvos localmente");
    console.log("📝 Para ativar Firebase: configure as variáveis de ambiente");
  }
};

// Log status after a delay to allow initialization
setTimeout(logFinalStatus, 2000);
