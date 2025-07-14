import { database } from "./database";
import { getUserId } from "./utils";
import {
  UserAchievement,
  AchievementNode,
  AchievementProgress,
} from "../types/achievements";
import { ACHIEVEMENTS_DATA } from "../data/achievementsData";
import { MediaItem, Review, UserSettings } from "../App";

export async function getUserAchievements(): Promise<UserAchievement[]> {
  try {
    const uid = getUserId();
    const snap = await database.getCollection<UserAchievement>([
      "users",
      uid,
      "achievements",
    ]);
    return snap.map((d) => ({ ...d.data, id: d.id }));
  } catch (error) {
    console.log("🎭 Returning mock achievements for demo mode");
    // Retornar algumas conquistas mock para demonstração
    return [
      {
        id: "mock-achievement-1",
        achievementId: "first-review",
        unlockedAt: new Date().toISOString(),
        userId: "demo-user-123",
      },
      {
        id: "mock-achievement-2",
        achievementId: "library-starter",
        unlockedAt: new Date(Date.now() - 86400000).toISOString(),
        userId: "demo-user-123",
      },
    ];
  }
}

export async function unlockAchievement(achievementId: string): Promise<void> {
  try {
    const uid = getUserId();
    const achievement = ACHIEVEMENTS_DATA.find((a) => a.id === achievementId);
    if (!achievement) return;

    const userAchievement: Omit<UserAchievement, "id"> = {
      achievementId,
      unlockedAt: new Date().toISOString(),
      title: achievement.title,
      image: achievement.image,
      category: achievement.category,
    };

    await database.add(["users", uid, "achievements"], userAchievement);
    console.log("🏆 Conquista desbloqueada:", achievement.title);
  } catch (error) {
    console.log("🎭 Mock achievement unlock for demo mode:", achievementId);
  }
}

export function getAchievementsWithProgress(
  userAchievements: UserAchievement[],
): AchievementNode[] {
  const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));

  return ACHIEVEMENTS_DATA.map((achievement) => {
    const unlocked = unlockedIds.has(achievement.id);
    const userAchievement = userAchievements.find(
      (ua) => ua.achievementId === achievement.id,
    );

    // Verificar dependências
    const canUnlock =
      !achievement.dependsOn ||
      achievement.dependsOn.every((depId) => unlockedIds.has(depId));

    return {
      ...achievement,
      unlockedAt: userAchievement?.unlockedAt,
      // Mostrar como disponível apenas se as dependências foram atendidas
      unlocked:
        unlocked || (canUnlock && checkAchievementCondition(achievement.id)),
    };
  });
}

export function getAchievementProgress(
  userAchievements: UserAchievement[],
): AchievementProgress {
  const totalAvailable = ACHIEVEMENTS_DATA.length;
  const totalUnlocked = userAchievements.length;

  const byCategory = ACHIEVEMENTS_DATA.reduce(
    (acc, achievement) => {
      if (!acc[achievement.category]) {
        acc[achievement.category] = { unlocked: 0, total: 0 };
      }
      acc[achievement.category].total++;

      const isUnlocked = userAchievements.some(
        (ua) => ua.achievementId === achievement.id,
      );
      if (isUnlocked) {
        acc[achievement.category].unlocked++;
      }

      return acc;
    },
    {} as Record<string, { unlocked: number; total: number }>,
  );

  return {
    totalUnlocked,
    totalAvailable,
    byCategory: byCategory as any,
  };
}

function checkAchievementCondition(achievementId: string): boolean {
  // Esta função será chamada pelo checkAchievements para verificar condições específicas
  // Por enquanto retorna false, será implementada quando chamada
  return false;
}

export async function checkAchievements(
  mediaItems: MediaItem[],
  reviews: Review[],
  settings: UserSettings,
): Promise<string[]> {
  const uid = getUserId();
  const userAchievements = await getUserAchievements();
  const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));
  const newlyUnlocked: string[] = [];

  // Verificar cada conquista
  for (const achievement of ACHIEVEMENTS_DATA) {
    if (unlockedIds.has(achievement.id)) continue;

    // Verificar dependências
    if (
      achievement.dependsOn &&
      !achievement.dependsOn.every((depId) => unlockedIds.has(depId))
    ) {
      continue;
    }

    let shouldUnlock = false;

    switch (achievement.id) {
      case "primeiro_game":
        shouldUnlock = mediaItems.some((item) => item.type === "games");
        break;

      case "completou_primeiro_game":
        shouldUnlock = mediaItems.some(
          (item) => item.type === "games" && item.status === "completed",
        );
        break;

      case "viciado_em_horas":
        shouldUnlock = mediaItems.some(
          (item) => item.type === "games" && (item.hoursSpent || 0) >= 100,
        );
        break;

      case "primeiro_livro":
        shouldUnlock = mediaItems.some((item) => item.type === "books");
        break;

      case "devorador_de_livros":
        shouldUnlock =
          mediaItems.filter(
            (item) => item.type === "books" && item.status === "completed",
          ).length >= 10;
        break;

      case "primeiro_filme":
        shouldUnlock = mediaItems.some(
          (item) => item.type === "movies" || item.type === "series",
        );
        break;

      case "maratonista":
        const totalAudiovisualHours = mediaItems
          .filter((item) => item.type === "movies" || item.type === "series")
          .reduce((sum, item) => sum + (item.hoursSpent || 0), 0);
        shouldUnlock = totalAudiovisualHours >= 50;
        break;

      case "mini_review":
        shouldUnlock = reviews.some((review) => review.content.length >= 100);
        break;

      case "critico_experiente":
        shouldUnlock =
          reviews.filter((review) => review.content.length >= 100).length >= 5;
        break;

      case "personalizou_perfil":
        shouldUnlock = !!(settings.name && settings.avatar && settings.bio);
        break;

      case "mestre_multimidia":
        const completedTypes = new Set(
          mediaItems
            .filter((item) => item.status === "completed")
            .map((item) => item.type),
        );
        shouldUnlock = completedTypes.size >= 3;
        break;
    }

    if (shouldUnlock) {
      await unlockAchievement(achievement.id);
      newlyUnlocked.push(achievement.id);
      unlockedIds.add(achievement.id);
    }
  }

  return newlyUnlocked;
}
