import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { MediaItem, Review, Milestone, UserSettings } from './App';

export async function getUserMediaItems(uid: string): Promise<MediaItem[]> {
  const snap = await getDoc(doc(db, 'users', uid, 'data', 'mediaItems'));
  if (snap.exists()) {
    return (snap.data().items as MediaItem[]) || [];
  }
  return [];
}

export async function saveUserMediaItems(uid: string, items: MediaItem[]): Promise<void> {
  await setDoc(doc(db, 'users', uid, 'data', 'mediaItems'), { items }, { merge: true });
}

export async function getUserReviews(uid: string): Promise<Review[]> {
  const snap = await getDoc(doc(db, 'users', uid, 'data', 'reviews'));
  if (snap.exists()) {
    return (snap.data().items as Review[]) || [];
  }
  return [];
}

export async function saveUserReviews(uid: string, items: Review[]): Promise<void> {
  await setDoc(doc(db, 'users', uid, 'data', 'reviews'), { items }, { merge: true });
}

export async function getUserMilestones(uid: string): Promise<Milestone[]> {
  const snap = await getDoc(doc(db, 'users', uid, 'data', 'milestones'));
  if (snap.exists()) {
    return (snap.data().items as Milestone[]) || [];
  }
  return [];
}

export async function saveUserMilestones(uid: string, items: Milestone[]): Promise<void> {
  await setDoc(doc(db, 'users', uid, 'data', 'milestones'), { items }, { merge: true });
}

export async function getUserSettings(uid: string): Promise<UserSettings | null> {
  const snap = await getDoc(doc(db, 'users', uid, 'data', 'settings'));
  if (snap.exists()) {
    return snap.data() as UserSettings;
  }
  return null;
}

export async function saveUserSettings(uid: string, settings: UserSettings): Promise<void> {
  await setDoc(doc(db, 'users', uid, 'data', 'settings'), settings, { merge: true });
}
