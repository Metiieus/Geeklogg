import { database } from "./database";
import { removeUndefinedFields, sanitizeStrings, getUserId } from "./utils";

export interface UserSettings {
  name?: string;
  avatar?: string;
  bio?: string;
  favorites?: string[];
  defaultLibrarySort?: string;
}

export async function getSettings(
  userId?: string,
): Promise<UserSettings | null> {
  try {
    const uid = userId || getUserId();

    if (!uid) {
      console.warn("User not authenticated, skipping settings fetch");
      return null;
    }

    const userDoc = await database.get(["users"], uid);

    if (!userDoc.exists()) {
      return null;
    }

    const userData = userDoc.data();

    // Extract settings-related fields
    const settings: UserSettings = {
      name: userData.name,
      avatar: userData.avatar,
      bio: userData.bio,
      favorites: userData.favorites,
      defaultLibrarySort: userData.defaultLibrarySort,
    };

    // Remove undefined fields and sanitize strings
    return sanitizeStrings(removeUndefinedFields(settings));
  } catch (error) {
    console.error("Error fetching user settings:", error);
    throw error;
  }
}

export async function saveSettings(
  userId: string,
  settings: UserSettings,
): Promise<void> {
  try {
    // Sanitize and clean the settings data
    const cleanSettings = sanitizeStrings(removeUndefinedFields(settings));

    // Update the user document with the new settings
    await database.update(["users"], userId, cleanSettings);
  } catch (error) {
    console.error("Error saving user settings:", error);
    throw error;
  }
}
