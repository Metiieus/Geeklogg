// Simple localStorage-based service for offline development fallback

export const localStorageService = {
  // Get collection from localStorage
  getCollection: (path: string | string[]): any[] => {
    try {
      const key = Array.isArray(path) ? path.join("/") : path;
      const data = localStorage.getItem(`firebase_${key}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.warn("localStorage getCollection error:", error);
      return [];
    }
  },

  // Get document from localStorage
  getDocument: (path: string | string[], docId?: string): any => {
    try {
      const key = Array.isArray(path) ? path.join("/") : path;
      const fullKey = docId ? `${key}/${docId}` : key;
      const data = localStorage.getItem(`firebase_${fullKey}`);

      if (data) {
        return {
          exists: () => true,
          data: () => JSON.parse(data),
          id: docId,
          ...JSON.parse(data),
        };
      }

      return { exists: () => false, data: () => null };
    } catch (error) {
      console.warn("localStorage getDocument error:", error);
      return { exists: () => false, data: () => null };
    }
  },

  // Add document to localStorage
  addDocument: (path: string | string[], data: any): string => {
    try {
      const key = Array.isArray(path) ? path.join("/") : path;
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const docKey = `${key}/${id}`;

      localStorage.setItem(
        `firebase_${docKey}`,
        JSON.stringify({
          ...data,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      );

      // Update collection index
      const collection = localStorageService.getCollection(key);
      collection.push({ ...data, id });
      localStorage.setItem(`firebase_${key}`, JSON.stringify(collection));

      return id;
    } catch (error) {
      console.warn("localStorage addDocument error:", error);
      return Date.now().toString();
    }
  },

  // Update document in localStorage
  updateDocument: (path: string | string[], docId: string, data: any): void => {
    try {
      const key = Array.isArray(path) ? path.join("/") : path;
      const docKey = `${key}/${docId}`;

      const existing = localStorageService.getDocument(key, docId);
      if (existing.exists()) {
        localStorage.setItem(
          `firebase_${docKey}`,
          JSON.stringify({
            ...existing.data(),
            ...data,
            updatedAt: new Date().toISOString(),
          }),
        );
      }
    } catch (error) {
      console.warn("localStorage updateDocument error:", error);
    }
  },

  // Aliases para compatibilidade com database.ts
  getItem: (path: string | string[], docId?: string) =>
    localStorageService.getDocument(path, docId),
  setItem: (path: string | string[], docId: string, data: any) =>
    localStorageService.updateDocument(path, docId, data),
  removeItem: (path: string | string[], docId: string) => {
    try {
      const key = Array.isArray(path) ? path.join("/") : path;
      const docKey = `${key}/${docId}`;
      localStorage.removeItem(`firebase_${docKey}`);
    } catch (error) {
      console.warn("localStorage removeItem error:", error);
    }
  },

  // Check if we should use localStorage fallback
  shouldUseFallback: (): boolean => {
    return (
      import.meta.env.DEV &&
      localStorage.getItem("firebase_offline_mode") === "true"
    );
  },

  enableOfflineMode: (): void => {
    localStorage.setItem("firebase_offline_mode", "true");
    console.log("📴 Offline mode enabled");
  },

  disableOfflineMode: (): void => {
    localStorage.removeItem("firebase_offline_mode");
    console.log("🌐 Offline mode disabled");
  },
};
