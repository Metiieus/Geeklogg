import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export async function registerUser(
  name: string,
  nickname: string,
  birthdate: string,
  email: string,
  password: string
): Promise<void> {
  try {
    const credentials = await createUserWithEmailAndPassword(auth, email, password);
    const { uid } = credentials.user;
    await setDoc(doc(db, 'users', uid), {
      uid,
      email,
      name,
      nickname,
      birthdate,
      createdAt: serverTimestamp(),
    });
    console.log('Usuário registrado com sucesso:', uid);
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    throw error;
  }
}
