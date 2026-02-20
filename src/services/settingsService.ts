import { database } from "./database";
import { logger } from '../utils/logger';
import { removeUndefinedFields, sanitizeStrings, getUserId } from "./utils";
import { logger } from '../utils/logger';
import { UserSettings } from "../types";
import { logger } from '../utils/logger';

export async function getSettings(
  userId?: string,
): Promise<UserSettings | null> {
  try {
    const uid = userId || getUserId();

    if (!uid) {
      logger.warn("User not authenticated, skipping settings fetch");
      return null;
    }

    const userDoc = await database.get(["users"], uid);

    if (!userDoc.exists()) {
      return null;
    }

    const userData = userDoc.data();

    if (!userData) {
      return null;
    }

    // Extract settings-related fields
    const settings: UserSettings = {
      name: userData.name,
      avatar: userData.avatar,
      cover: userData.cover,
      bio: userData.bio,
      favorites: userData.favorites || { characters: [], games: [], movies: [] },
      theme: userData.theme,
      defaultLibrarySort: userData.defaultLibrarySort,
    };
    return settings;
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return null;
  }
}

export async function saveSettings(
  userId: string,
  settings: UserSettings,
): Promise<void> {
  try {
    // Sanitize and clean the settings data
    const cleanSettings = sanitizeStrings(removeUndefinedFields(settings as any));

    // Update the user document with the new settings
    await database.update(["users"], userId, cleanSettings);
  } catch (error) {
    console.error("Error saving user settings:", error);
    throw error;
  }
}
