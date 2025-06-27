import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const registerUser = async (nome: string, apelido: string, dataNascimento: string, email: string, senha: string) => {
  console.log('🚀 Iniciando cadastro no Firebase Auth...');

  const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
  const user = userCredential.user;

  console.log('✅ Usuário criado com UID:', user.uid);

  await new Promise(resolve => {
    console.log('⏳ Aguardando confirmação de autenticação...');
    const unsubscribe = auth.onAuthStateChanged(firebaseUser => {
      console.log('🧐 Firebase authStateChanged: ', firebaseUser?.uid);
      if (firebaseUser && firebaseUser.uid === user.uid) {
        console.log('✅ Autenticação confirmada para UID:', firebaseUser.uid);
        unsubscribe();
        resolve(firebaseUser);
      }
    });
  });

  console.log('✍️ Gravando dados do usuário no Firestore...');

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    nome,
    apelido,
    dataNascimento,
    email,
    createdAt: serverTimestamp(),
  });

  console.log('✅ Dados do usuário salvos no Firestore com sucesso.');

  return user;
};
