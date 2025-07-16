import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Check if Firebase configuration is valid
const hasValidFirebaseConfig = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;

  return (
    apiKey &&
    projectId &&
    authDomain &&
    storageBucket &&
    !apiKey.includes("your_") &&
    !apiKey.includes("Demo") &&
    !projectId.includes("your_") &&
    !projectId.includes("demo-")
  );
};

// Firebase configuration is loaded from environment variables to keep
// secrets out of the repository. Vite exposes variables prefixed with
// `VITE_` to the client side.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

if (!hasValidFirebaseConfig()) {
  throw new Error(
    "❌ Firebase não configurado! Por favor, configure as variáveis de ambiente do Firebase no arquivo .env:\n\n" +
      "VITE_FIREBASE_API_KEY=sua_api_key\n" +
      "VITE_FIREBASE_AUTH_DOMAIN=seu_dominio\n" +
      "VITE_FIREBASE_PROJECT_ID=seu_project_id\n" +
      "VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket\n" +
      "VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id\n" +
      "VITE_FIREBASE_APP_ID=seu_app_id\n\n" +
      "Copie o arquivo .env.example para .env e preencha com suas credenciais do Firebase.",
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, "geeklog");
const storage = getStorage(app);

console.log("✅ Firebase initialized successfully");

export { auth, db, storage };
