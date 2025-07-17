import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app, "geeklog");
export const storage = getStorage(app);

console.log("✅ Firebase initialized successfully");

// Funções wrapper que funcionam com Firebase real ou mock
const createStorageRef = (path: string) => {
  if (!storage) {
    throw new Error("Storage não está inicializado");
  }
  
  try {
    const { ref } = require("firebase/storage");
    return ref(storage, path);
  } catch (e) {
    console.error("Erro ao importar firebase/storage:", e);
    throw new Error("Storage não está disponível");
  }
};

const uploadFileToStorage = async (storageRef: any, file: File | Blob) => {
  if (!storage) {
    throw new Error("Storage não está inicializado");
  }
  
  try {
    const { uploadBytes } = require("firebase/storage");
    return await uploadBytes(storageRef, file);
  } catch (e) {
    console.error("Erro ao fazer upload:", e);
    throw e;
  }
};

const getDownloadURL = async (storageRef: any) => {
  if (!storage) {
    throw new Error("Storage não está inicializado");
  }
  
  try {
    const { getDownloadURL: getURL } = require("firebase/storage");
    return await getURL(storageRef);
  } catch (e) {
    console.error("Erro ao obter URL:", e);
    throw e;
  }
};

const deleteFileFromStorage = async (storageRef: any) => {
  if (!storage) {
    throw new Error("Storage não está inicializado");
  }
  
  try {
    const { deleteObject } = require("firebase/storage");
    return await deleteObject(storageRef);
  } catch (e) {
    console.error("Erro ao deletar arquivo:", e);
    throw e;
  }
};