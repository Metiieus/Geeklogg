import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Verifica se as variáveis de ambiente estão disponíveis
const firebaseConfig = import.meta.env.VITE_FIREBASE_API_KEY
  ? {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    }
  : (() => {
      console.warn("⚠️ reCAPTCHA ou variáveis do Firebase não disponíveis no modo temporário.");
      return null;
    })();

// Garante que a config foi carregada
if (!firebaseConfig) {
  throw new Error("❌ Configuração Firebase ausente. Verifique suas variáveis de ambiente.");
}

// Inicializa Firebase e serviços
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

console.log("✅ Firebase initialized successfully");
