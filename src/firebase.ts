import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  enableIndexedDbPersistence,
  enableNetwork,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration is loaded from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate Firebase configuration
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
  console.error(
    "❌ Firebase configuration error: Missing or invalid environment variables:",
    missingVars,
  );
  console.error(
    "📝 Please check your .env file and ensure all Firebase variables are properly configured.",
  );
  console.error(
    "🔧 Copy .env.example to .env and replace placeholder values with your actual Firebase credentials.",
  );
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase services with error handling
export const auth = getAuth(app);

// Initialize Firestore with offline support
export const db = getFirestore(app, "geeklog");

// Simple Firebase configuration
if (import.meta.env.DEV) {
  console.log("🔧 Development mode: Firebase initialized with basic settings");

  enableIndexedDbPersistence(db)
    .then(() => console.log("💾 Offline persistence enabled"))
    .catch((err) => console.warn("⚠️ Persistence setup failed:", err));
} else {
  // Production: normal configuration
  enableNetwork(db).catch((err) =>
    console.warn("Network enable warning:", err),
  );
}

export const storage = getStorage(app);

// Export app for use in other files
export { app };

if (missingVars.length === 0) {
  console.log("✅ Firebase initialized successfully");
} else {
  console.warn(
    "⚠️ Firebase initialized with missing configuration - some features may not work",
  );
}
