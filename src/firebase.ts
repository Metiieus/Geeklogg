import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Inicializar Firebase somente se a chave estiver definida e estivermos no browser
let app: any = null;
let _auth: any = null;
let _db: any = null;
let _storage: any = null;

if (firebaseConfig.apiKey && typeof window !== "undefined") {
  try {
    app = initializeApp(firebaseConfig);
    _auth = getAuth(app);
    _db = getFirestore(app);
    _storage = getStorage(app);

    // Habilita cache offline do Firestore somente quando apropriado.
    // Em alguns ambientes (dev/local) a persistência pode causar erros de stream não tratados.
    try {
      const hostname = typeof window !== "undefined" ? window.location.hostname : "";
      const shouldEnablePersistence = hostname !== "localhost" && !hostname.startsWith("192.168") && typeof indexedDB !== "undefined";
      if (shouldEnablePersistence) {
        (async () => {
          try {
            await enableIndexedDbPersistence(_db);
          } catch (err: any) {
            if (err && err.code === "failed-precondition") {
              console.warn("⚠️ Persistence falhou: várias abas abertas");
            } else if (err && err.code === "unimplemented") {
              console.warn("⚠️ Navegador não suporta persistence");
            } else {
              console.warn("⚠️ Erro ao habilitar persistence:", err);
            }
          }
        })();
      } else {
        console.info("ℹ️ IndexedDB persistence não habilitada neste ambiente (localhost ou não suportado).");
      }
    } catch (err) {
      console.warn("⚠️ Erro verificando IndexedDB/persistência:", err);
    }
  } catch (e) {
    console.warn("⚠️ Falha ao inicializar Firebase:", e);
    app = null;
    _auth = null;
    _db = null;
    _storage = null;
  }
} else {
  console.warn(
    "⚠️ Variáveis de ambiente do Firebase não configuradas ou código rodando fora do navegador. Autenticação e Firestore estarão desabilitados.",
  );
}

// Exporta serviços (podem ser null se Firebase não configurado)
export const auth = _auth;
export const db = _db;
export const storage = _storage;

export const isFirebaseOffline = (): boolean => {
  return typeof navigator !== "undefined" && !navigator.onLine;
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= retries) throw err;
      await new Promise((resolve) => setTimeout(resolve, delay));
      attempt++;
    }
  }
}

console.log(
  "🔥 Firebase inicializado com Auth:",
  !!auth,
  " | Firestore conectado:",
  !!db,
);
