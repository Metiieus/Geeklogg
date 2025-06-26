import { useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export function useFirestoreSync<T>(key: string, value: T, setValue: (v: T) => void) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const ref = doc(db, 'users', user.uid, 'data', key);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setValue(snap.data().value as T);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const saveData = async () => {
      const ref = doc(db, 'users', user.uid, 'data', key);
      await setDoc(ref, { value });
    };
    saveData();
  }, [user, value]);
}
