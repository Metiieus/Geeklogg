import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export async function initializeFirestoreData() {
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error(
      "Usuário não autenticado. Faça login antes de inicializar o Firestore.",
    );
  }

  const uid = user.uid;

  // 1. Perfil do usuário
  await setDoc(doc(db, "users", uid), {
    name: user.displayName || "Usuário Geek",
    avatar: user.photoURL || "",
    bio: "Sou fã de tudo que é geek!",
    createdAt: serverTimestamp(),
  });

  // 2. Mídias
  const mediaExamples = [
    { title: "Zelda: Breath of the Wild", type: "games" },
    { title: "Fullmetal Alchemist", type: "anime" },
    { title: "Breaking Bad", type: "series" },
    { title: "Senhor dos Anéis", type: "books" },
    { title: "Interestelar", type: "movies" },
  ];

  for (const media of mediaExamples) {
    await addDoc(collection(db, `users/${uid}/medias`), {
      ...media,
      status: "completed",
      rating: 5,
      hoursSpent: 10,
      tags: ["favorito"],
      description: `Descrição de ${media.title}`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  // 3. Reviews
  await addDoc(collection(db, `users/${uid}/reviews`), {
    mediaId: "1", // fake, só de exemplo
    title: "Melhor jogo que já joguei!",
    content: "Zelda é uma obra de arte interativa.",
    rating: 5,
    isFavorite: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // 4. Milestones
  await addDoc(collection(db, `users/${uid}/milestones`), {
    title: "Terminei Zelda!",
    description: "Concluí o jogo com 100%",
    date: new Date().toISOString(),
    icon: "🏆",
    createdAt: serverTimestamp(),
  });

  // 5. Achievements
  await addDoc(collection(db, `users/${uid}/achievements`), {
    title: "Primeiro marco!",
    description: "Você adicionou seu primeiro marco.",
    unlockedAt: serverTimestamp(),
  });

  // 6. Notificações pessoais
  await addDoc(collection(db, `users/${uid}/notifications`), {
    message: "Bem-vindo ao NerdLog!",
    read: false,
    createdAt: serverTimestamp(),
  });

  // 7. Atividades globais
  await addDoc(collection(db, "activities"), {
    type: "user-joined",
    userId: uid,
    username: user.displayName || "Geek",
    timestamp: serverTimestamp(),
  });

  // 8. Notificações globais
  await addDoc(collection(db, "notifications"), {
    message: "Novo recurso: Estatísticas por tipo de mídia!",
    createdAt: serverTimestamp(),
  });

  // 9. Solicitações de amizade (exemplo)
  await addDoc(collection(db, "followRequests"), {
    from: uid,
    to: "fake-user-id",
    status: "pending",
    requestedAt: serverTimestamp(),
  });

  console.log("✅ Firestore inicializado com dados de exemplo.");
}
export async function initializeFirestore() {
  try {
    await initializeFirestoreData();
  } catch (error) {
    console.error("Erro ao inicializar Firestore:", error);
  }
}

export async function createTestData() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    const errorMsg =
      "Usuário não autenticado. Faça login antes de criar dados de teste.";
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    await initializeFirestoreData();
    console.log("✅ Dados de teste criados com sucesso!");
  } catch (error) {
    console.error("Erro ao criar dados de teste:", error);
    throw error;
  }
}

export function debugFirestore() {
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  console.log("🔍 Debug Firestore:");
  console.log("- Database instance:", db);
  console.log("- Auth instance:", auth);
  console.log("- Current user:", user);
  console.log("- User ID:", user?.uid);
  console.log("- User email:", user?.email);
}

initializeFirestore();
