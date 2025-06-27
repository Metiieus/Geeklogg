import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import type { Milestone } from '../App';

function getUserId(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Usuário não autenticado');
  return uid;
}

const LOCAL_KEY = 'nerdlog-milestones';

function loadLocal(): Milestone[] {
  const data = localStorage.getItem(LOCAL_KEY);
  return data ? (JSON.parse(data) as Milestone[]) : [];
}

function saveLocal(items: Milestone[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

export async function getMilestones(): Promise<Milestone[]> {
  const local = loadLocal();
  try {
    const uid = getUserId();
    const snap = await getDocs(collection(db, 'users', uid, 'milestones'));
    const items: Milestone[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Milestone, 'id'>) }));
    saveLocal(items);
    return items;
  } catch {
    return local;
  }
}

export async function addMilestone(data: Omit<Milestone, 'id' | 'createdAt'>): Promise<Milestone> {
  const uid = getUserId();
  const now = new Date().toISOString();
  const toSave: Omit<Milestone, 'id'> = { ...data, createdAt: now };
  const docRef = await addDoc(collection(db, 'users', uid, 'milestones'), toSave);
  const item: Milestone = { id: docRef.id, ...toSave };
  const local = loadLocal();
  local.push(item);
  saveLocal(local);
  return item;
}

export async function updateMilestone(id: string, data: Partial<Milestone>): Promise<void> {
  const uid = getUserId();
  await setDoc(doc(db, 'users', uid, 'milestones', id), data, { merge: true });
  const local = loadLocal();
  const idx = local.findIndex(m => m.id === id);
  if (idx !== -1) {
    local[idx] = { ...local[idx], ...data, id } as Milestone;
    saveLocal(local);
  }
}

export async function deleteMilestone(id: string): Promise<void> {
  const uid = getUserId();
  await deleteDoc(doc(db, 'users', uid, 'milestones', id));
  const local = loadLocal();
  saveLocal(local.filter(m => m.id !== id));
}
