import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCwRkjTvTAEf_9lOG8WOXAD9l_NoVOMZvs",
  authDomain: "geeklog-26b2c.firebaseapp.com",
  projectId: "geeklog-26b2c",
  // Use the standard Firebase Storage bucket domain
  storageBucket: "geeklog-26b2c.appspot.com",
  messagingSenderId: "367690608897",
  appId: "1:367690608897:web:4b7e084e60ad8cdb8deb00",
  measurementId: "G-KC9X0WP28Z"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// The project uses a Firestore database with ID "geeklog"
export const db = getFirestore(app, 'geeklog');
export const storage = getStorage(app);

