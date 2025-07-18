import { db, auth } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

// Script para inicializar o Firestore com dados de exemplo
export const initializeFirestore = async () => {
  const user = auth.currentUser;

  if (!user) {
    console.error("❌ Usuário não está logado");
    return false;
  }

  const userId = user.uid;
  console.log("🚀 Inicializando Firestore para usuário:", userId);

  try {
    // 1. Criar perfil do usuário
    console.log("👤 Criando perfil do usuário...");
    await setDoc(doc(db, "users", userId), {
      uid: userId,
      name: "Matheus Nascimento",
      email: user.email || "usuario@example.com",
      bio: "Geek apaixonado por jogos, animes e séries!",
      avatar: "",
      isPublic: true,
      isPremium: false,
      favorites: [],
      defaultLibrarySort: "updatedAt",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // 2. Criar mídias de exemplo
    console.log("🎮 Criando mídias de exemplo...");

    const mediasRef = collection(db, "users", userId, "medias");

    await addDoc(mediasRef, {
      title: "The Legend of Zelda: Breath of the Wild",
      type: "games",
      status: "completed",
      rating: 5,
      hoursSpent: 120,
      platform: "Nintendo Switch",
      tags: ["Aventura", "Mundo Aberto", "RPG"],
      description: "Um dos melhores jogos já criados!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await addDoc(mediasRef, {
      title: "Attack on Titan",
      type: "anime",
      status: "completed",
      rating: 5,
      tags: ["Ação", "Drama", "Militar"],
      description: "Anime épico sobre a luta da humanidade.",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await addDoc(mediasRef, {
      title: "Breaking Bad",
      type: "series",
      status: "completed",
      rating: 5,
      tags: ["Drama", "Crime", "Suspense"],
      description: "A melhor série já feita.",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await addDoc(mediasRef, {
      title: "1984",
      type: "books",
      status: "in-progress",
      rating: 4,
      totalPages: 328,
      currentPage: 150,
      tags: ["Ficção Científica", "Distopia", "Clássico"],
      description: "Livro profético de George Orwell.",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // 3. Criar reviews de exemplo
    console.log("⭐ Criando reviews de exemplo...");

    const reviewsRef = collection(db, "users", userId, "reviews");

    await addDoc(reviewsRef, {
      mediaId: "zelda-botw",
      title: "Uma Obra-Prima",
      content:
        "Zelda BOTW redefiniu o que significa um jogo de mundo aberto. A liberdade de exploração é incomparável!",
      rating: 5,
      isFavorite: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await addDoc(reviewsRef, {
      mediaId: "attack-on-titan",
      title: "Épico do Início ao Fim",
      content:
        "Attack on Titan me deixou sem palavras. A narrativa, os personagens, tudo é perfeito.",
      rating: 5,
      isFavorite: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // 4. Criar milestones de exemplo
    console.log("🎯 Criando milestones de exemplo...");

    const milestonesRef = collection(db, "users", userId, "milestones");

    await addDoc(milestonesRef, {
      title: "Primeiro Jogo Zerado",
      description: "Completei meu primeiro jogo da biblioteca!",
      date: new Date().toISOString(),
      icon: "🎮",
      mediaId: "zelda-botw",
      createdAt: serverTimestamp(),
    });

    await addDoc(milestonesRef, {
      title: "100 Horas de Jogos",
      description: "Alcancei 100 horas totais jogando!",
      date: new Date().toISOString(),
      icon: "⏰",
      createdAt: serverTimestamp(),
    });

    await addDoc(milestonesRef, {
      title: "Primeira Review",
      description: "Escrevi minha primeira review!",
      date: new Date().toISOString(),
      icon: "✍️",
      createdAt: serverTimestamp(),
    });

    // 5. Criar conquistas de exemplo
    console.log("🏆 Criando conquistas de exemplo...");

    const achievementsRef = collection(db, "users", userId, "achievements");

    await addDoc(achievementsRef, {
      title: "Bem-vindo!",
      description: "Criou sua conta no MyDiaryGeek",
      icon: "👋",
      category: "Geral",
      points: 10,
      unlockedAt: serverTimestamp(),
    });

    await addDoc(achievementsRef, {
      title: "Primeira Mídia",
      description: "Adicionou sua primeira mídia",
      icon: "📚",
      category: "Biblioteca",
      points: 25,
      unlockedAt: serverTimestamp(),
    });

    await addDoc(achievementsRef, {
      title: "Crítico",
      description: "Escreveu sua primeira review",
      icon: "⭐",
      category: "Reviews",
      points: 50,
      unlockedAt: serverTimestamp(),
    });

    console.log("✅ Firestore inicializado com sucesso!");
    console.log("🎉 Recarregue a página para ver os dados!");

    return true;
  } catch (error) {
    console.error("❌ Erro ao inicializar Firestore:", error);
    return false;
  }
};

// Função para criar dados adicionais de teste
export const createTestData = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const userId = user.uid;

  try {
    // Criar mais mídias para testar filtros
    const mediasRef = collection(db, "users", userId, "medias");

    const testMedias = [
      {
        title: "Demon Slayer",
        type: "anime",
        status: "in-progress",
        rating: 4,
        tags: ["Ação", "Sobrenatural", "Shounen"],
      },
      {
        title: "God of War",
        type: "games",
        status: "planned",
        tags: ["Ação", "Aventura", "Mitologia"],
      },
      {
        title: "Dune",
        type: "movies",
        status: "completed",
        rating: 4,
        tags: ["Ficção Científica", "Épico"],
      },
      {
        title: "The Witcher",
        type: "books",
        status: "dropped",
        rating: 3,
        totalPages: 400,
        currentPage: 100,
        tags: ["Fantasia", "Aventura"],
      },
    ];

    for (const media of testMedias) {
      await addDoc(mediasRef, {
        ...media,
        description: `Descrição de ${media.title}`,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    console.log("✅ Dados de teste adicionais criados!");
  } catch (error) {
    console.error("❌ Erro ao criar dados de teste:", error);
  }
};

// Função para debug - mostrar estrutura atual
export const debugFirestore = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.log("❌ Usuário não logado");
    return;
  }

  console.log("🔍 Estrutura atual do Firestore:");
  console.log("📁 users/");
  console.log(`  📄 ${user.uid}/`);
  console.log("    📁 medias/");
  console.log("    📁 reviews/");
  console.log("    📁 milestones/");
  console.log("    📁 achievements/");
  console.log("    📁 following/");
  console.log("    📁 followers/");
  console.log("    📁 notifications/");
  console.log("📁 activities/");
  console.log("📁 notifications/");
  console.log("📁 followRequests/");
};
