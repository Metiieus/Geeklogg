import { doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import type { UserSettings } from '../App';
import { storageClient } from './storageClient';
import { database } from './database';

function getUserId(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Usuário não autenticado');
  return uid;
}

export async function getSettings(): Promise<UserSettings | null> {
  const uid = getUserId();
  const snap = await database.getDocument<UserSettings>(['users', uid, 'settings', 'profile']);
  return snap;
}

export async function saveSettings(data: UserSettings): Promise<void> {
  const uid = getUserId();
  await database.set(['users', uid, 'settings', 'profile'], data, { merge: true });
}

export async function backupUserData(data: unknown): Promise<void> {
  const timestamp = Date.now();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  await storageClient.upload(`backups/${timestamp}.json`, blob);
}