import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration is loaded from environment variables
const firebaseConfig = {
      console.warn("⚠️ reCAPTCHA não disponível no modo temporário");

      return null;
// Initialize Firebase
    if (!db) {
      throw new Error("Firestore não está inicializado");
    }
    },
const app = initializeApp(firebaseConfig);
    _initializeRecaptchaConfig: async () => {

      console.warn("⚠️ reCAPTCHA não disponível no modo temporário");
// Initialize Firebase services
      return null;
export const auth = getAuth(app);
    },
export const db = getFirestore(app, "geeklog");
export const storage = getStorage(app);

console.log("✅ Firebase initialized successfully");