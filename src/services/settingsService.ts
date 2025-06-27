import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { db, auth, storage } from '../firebase';
import type { UserSettings } from '../App';

function getUserId(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Usuário não autenticado');
  return uid;
}

const LOCAL_KEY = 'nerdlog-settings';

function loadLocal(): UserSettings | null {
  const data = localStorage.getItem(LOCAL_KEY);
  return data ? (JSON.parse(data) as UserSettings) : null;
}

function saveLocal(settings: UserSettings) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(settings));
}

export async function getSettings(): Promise<UserSettings | null> {
  const local = loadLocal();
  try {
    const uid = getUserId();
    const snap = await getDoc(doc(db, 'users', uid, 'settings', 'profile'));
    if (snap.exists()) {
      const data = snap.data() as UserSettings;
      saveLocal(data);
      return data;
    }
    return local;
  } catch {
    return local;
  }
}

export async function saveSettings(data: UserSettings): Promise<void> {
  const uid = getUserId();
  await setDoc(doc(db, 'users', uid, 'settings', 'profile'), data, { merge: true });
  saveLocal(data);
}

export async function backupUserData(data: unknown): Promise<void> {
  const uid = getUserId();
  const timestamp = Date.now();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const storageRef = ref(storage, `users/${uid}/backups/${timestamp}.json`);
  await uploadBytes(storageRef, blob);
}