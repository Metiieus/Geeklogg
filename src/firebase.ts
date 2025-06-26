import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAOWlubX-pUfAmb0hDpL8YIvrIvlW4xAc4',
  authDomain: 'geeklog-22d87.firebaseapp.com',
  projectId: 'geeklog-22d87',
  storageBucket: 'geeklog-22d87.firebasestorage.app',
  messagingSenderId: '916719631860',
  appId: '1:916719631860:web:b0754c1620547c4b2fcda1',
  measurementId: "G-DTDRPDM9F4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
