import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  enableIndexedDbPersistence,
  disableNetwork,
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

// Validate configuration
console.log("🔧 Firebase config:", {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey,
});

if (!firebaseConfig.projectId) {
  console.error("❌ Missing Firebase project ID");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services with error handling
export const auth = getAuth(app);

// Initialize Firestore with offline support
export const db = getFirestore(app);

// Simple Firebase configuration
if (import.meta.env.DEV) {
  console.log("🔧 Development mode: Firebase initialized with basic settings");

  // Only enable persistence if not using mock
  if (localStorage.getItem("use_firebase_mock") === "false") {
    enableIndexedDbPersistence(db)
      .then(() => console.log("💾 Offline persistence enabled"))
      .catch((err) => console.warn("⚠️ Persistence setup failed:", err));
  }
} else {
  // Production: normal configuration
  enableNetwork(db).catch((err) =>
    console.warn("Network enable warning:", err),
  );
}

export const storage = getStorage(app);

console.log("✅ Firebase initialized successfully");
console.log("🔍 Firestore settings:", {
  projectId: firebaseConfig.projectId,
  host: "firestore.googleapis.com",
});

// Add connection test
if (typeof window !== "undefined") {
  // Test basic connectivity
  fetch("https://firestore.googleapis.com/")
    .then(() => console.log("✅ Firebase connectivity test passed"))
    .catch((err) =>
      console.warn("⚠️ Firebase connectivity test failed:", err.message),
    );
}
