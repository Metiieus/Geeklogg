/**
 * Storage Service - React Native
 * Substitui o localStorage do browser pelo AsyncStorage do React Native.
 * A API é similar para facilitar a migração.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

export const storageService = {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return null;
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("AsyncStorage setItem error:", error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("AsyncStorage removeItem error:", error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("AsyncStorage clear error:", error);
    }
  },
};

// Chaves de storage usadas no app
export const StorageKeys = {
  USER_PREFERENCES: "@geeklogg/user_preferences",
  CACHED_MEDIA: "@geeklogg/cached_media",
  LAST_SYNC: "@geeklogg/last_sync",
  ONBOARDING_DONE: "@geeklogg/onboarding_done",
  BIOMETRIC_ENABLED: "@geeklogg/biometric_enabled",
  THEME: "@geeklogg/theme",
} as const;
