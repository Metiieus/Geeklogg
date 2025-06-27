import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { db, auth, storage } from '../firebase';
import type { UserSettings } from '../App';

function getUserId(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Usuário não autenticado');
  return uid;
}

export async function getSettings(): Promise<UserSettings | null> {
  const uid = getUserId();
  const snap = await getDoc(doc(db, 'users', uid, 'settings', 'profile'));
  return snap.exists() ? (snap.data() as UserSettings) : null;
}

export async function saveSettings(data: UserSettings): Promise<void> {
  const uid = getUserId();
  await setDoc(doc(db, 'users', uid, 'settings', 'profile'), data, { merge: true });
}

export async function backupUserData(data: unknown): Promise<void> {
  const uid = getUserId();
  const timestamp = Date.now();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const storageRef = ref(storage, `users/${uid}/backups/${timestamp}.json`);
  await uploadBytes(storageRef, blob);
}