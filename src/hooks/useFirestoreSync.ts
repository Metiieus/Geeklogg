import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export function useFirestoreSync<T>(key: string, value: T, setValue: (v: T) => void) {
  const { user } = useAuth();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const ref = doc(db, 'users', user.uid, 'data', key);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setValue(snap.data().value as T);
      }
      setInitialized(true);
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    if (!user || !initialized) return;
    const saveData = async () => {
      const ref = doc(db, 'users', user.uid, 'data', key);
      await setDoc(ref, { value });
    };
    saveData();
  }, [user, value, initialized]);
}
