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

// ✅ Inicializa Firebase só uma vez
const app = initializeApp(firebaseConfig);

// ✅ Exporta serviços prontos
export const auth = getAuth(app);

// ✅ Usa o banco padrão do Firebase
export const db = getFirestore(app);

export const storage = getStorage(app);

// ✅ Habilita cache offline do Firestore
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    console.warn("⚠️ Persistence falhou: várias abas abertas");
  } else if (err.code === "unimplemented") {
    console.warn("⚠️ Navegador não suporta persistence");
  }
});

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
  " | Firestore conectado em banco:",
  db.databaseId?.database ?? "(default)",
);
