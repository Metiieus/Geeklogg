import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const registerUser = async (name: string, nickname: string, birthdate: string, email: string, password: string) => {
  console.log('🚀 Iniciando cadastro no Firebase Auth...');

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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

  console.log('✍️ Gravando dados no Firestore...');

  // Cria o documento principal do usuário
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email,
    name,
    nickname,
    birthdate,
    createdAt: serverTimestamp(),
  });

  console.log('✅ Documento principal criado no Firestore.');

  // Cria o documento de configurações do usuário
  const settings = {
    name: nickname,
    theme: 'dark',
    defaultLibrarySort: 'updatedAt'
  };

  await setDoc(doc(db, 'users', user.uid, 'settings', 'preferences'), settings);

  console.log('✅ Configurações iniciais gravadas no Firestore.');

  // 🔒 Proteção antes de criar o documento inicial
  if (!user?.uid) {
    console.error('❌ UID não disponível para criação do documento inicial.');
    return;
  }

  const initialData = { value: 'initialValue' };

  console.log('✍️ Criando documento inicial em users/{uid}/data/initial...');

  await setDoc(doc(db, 'users', user.uid, 'data', 'initial'), initialData);

  console.log('✅ Documento inicial criado com sucesso.');

  return user;
};
