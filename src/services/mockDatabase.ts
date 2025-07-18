// Complete mock database service that simulates Firebase behavior

interface MockDocument {
  id: string;
  data: any;
  exists: () => boolean;
  data: () => any;
}

class MockDatabase {
  private storage: Map<string, any[]> = new Map();
  private documents: Map<string, any> = new Map();

  // Get all documents from a collection
  async getCollection(
    collectionPath: string | string[],
    queryOptions?: any,
  ): Promise<any[]> {
    const pathStr = Array.isArray(collectionPath)
      ? collectionPath.join("/")
      : collectionPath;
    console.log(`📦 Mock getCollection: ${pathStr}`);

    const collection = this.storage.get(pathStr) || [];

    // Simulate some default data for empty collections
    if (collection.length === 0) {
      this.seedDefaultData(pathStr);
      return this.storage.get(pathStr) || [];
    }

    return collection.map((item) => ({
      id: item.id,
      data: item,
      ...item,
    }));
  }

  // Get a single document
  async get(
    collectionPath: string | string[],
    docId?: string,
  ): Promise<MockDocument> {
    const pathStr = Array.isArray(collectionPath)
      ? collectionPath.join("/")
      : collectionPath;
    const fullPath = docId ? `${pathStr}/${docId}` : pathStr;
    console.log(`📄 Mock get: ${fullPath}`);

    const doc = this.documents.get(fullPath);

    if (doc) {
      return {
        id: doc.id || docId || "mock-id",
        data: doc,
        exists: () => true,
        data: () => doc,
      };
    }

    return {
      id: "",
      data: null,
      exists: () => false,
      data: () => null,
    };
  }

  // Add a document to a collection
  async add(collectionPath: string | string[], data: any): Promise<string> {
    const pathStr = Array.isArray(collectionPath)
      ? collectionPath.join("/")
      : collectionPath;
    const id = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log(`➕ Mock add to ${pathStr}:`, data);

    const docData = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to collection
    const collection = this.storage.get(pathStr) || [];
    collection.push(docData);
    this.storage.set(pathStr, collection);

    // Add as individual document
    this.documents.set(`${pathStr}/${id}`, docData);

    return id;
  }

  // Set a document with a specific ID
  async set(
    collectionPath: string | string[],
    docId: string,
    data: any,
    options?: any,
  ): Promise<string> {
    const pathStr = Array.isArray(collectionPath)
      ? collectionPath.join("/")
      : collectionPath;
    const fullPath = `${pathStr}/${docId}`;

    console.log(`📝 Mock set ${fullPath}:`, data);

    const docData = {
      ...data,
      id: docId,
      updatedAt: new Date().toISOString(),
    };

    this.documents.set(fullPath, docData);

    // Update in collection if exists
    const collection = this.storage.get(pathStr) || [];
    const index = collection.findIndex((item) => item.id === docId);
    if (index >= 0) {
      collection[index] = docData;
    } else {
      collection.push(docData);
    }
    this.storage.set(pathStr, collection);

    return docId;
  }

  // Update a document
  async update(
    collectionPath: string | string[],
    docId: string,
    data: any,
  ): Promise<string> {
    const pathStr = Array.isArray(collectionPath)
      ? collectionPath.join("/")
      : collectionPath;
    const fullPath = `${pathStr}/${docId}`;

    console.log(`🔄 Mock update ${fullPath}:`, data);

    const existing = this.documents.get(fullPath) || {};
    const updatedData = {
      ...existing,
      ...data,
      id: docId,
      updatedAt: new Date().toISOString(),
    };

    this.documents.set(fullPath, updatedData);

    // Update in collection
    const collection = this.storage.get(pathStr) || [];
    const index = collection.findIndex((item) => item.id === docId);
    if (index >= 0) {
      collection[index] = updatedData;
      this.storage.set(pathStr, collection);
    }

    return docId;
  }

  // Delete a document
  async delete(
    collectionPath: string | string[],
    docId: string,
  ): Promise<string> {
    const pathStr = Array.isArray(collectionPath)
      ? collectionPath.join("/")
      : collectionPath;
    const fullPath = `${pathStr}/${docId}`;

    console.log(`🗑️ Mock delete ${fullPath}`);

    this.documents.delete(fullPath);

    // Remove from collection
    const collection = this.storage.get(pathStr) || [];
    const filtered = collection.filter((item) => item.id !== docId);
    this.storage.set(pathStr, filtered);

    return docId;
  }

  // Listen to real-time updates (mock implementation)
  listen(
    collectionPath: string | string[],
    callback: (data: any[]) => void,
    queryOptions?: any,
  ) {
    const pathStr = Array.isArray(collectionPath)
      ? collectionPath.join("/")
      : collectionPath;
    console.log(`👂 Mock listen: ${pathStr}`);

    // Immediately call with current data
    const collection = this.storage.get(pathStr) || [];
    callback(
      collection.map((item) => ({
        id: item.id,
        data: item,
        ...item,
      })),
    );

    // Return unsubscribe function
    return () => console.log(`🚫 Mock unsubscribe: ${pathStr}`);
  }

  // Add getDocument method for compatibility
  async getDocument(
    collectionPath: string | string[],
    docId?: string,
  ): Promise<MockDocument> {
    return this.get(collectionPath, docId);
  }

  // Seed some default data for testing
  private seedDefaultData(pathStr: string): void {
    console.log(`🌱 Seeding default data for: ${pathStr}`);

    if (pathStr.includes("/medias")) {
      this.storage.set(pathStr, [
        {
          id: "media-1",
          title: "Example Game",
          type: "games",
          status: "completed",
          rating: 5,
          tags: ["RPG", "Adventure"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } else if (pathStr.includes("/reviews")) {
      this.storage.set(pathStr, [
        {
          id: "review-1",
          mediaId: "media-1",
          title: "Great Game!",
          content: "This is a mock review for testing.",
          rating: 5,
          isFavorite: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } else if (pathStr.includes("/milestones")) {
      this.storage.set(pathStr, [
        {
          id: "milestone-1",
          title: "First Achievement",
          description: "Completed first game!",
          date: new Date().toISOString(),
          icon: "🎮",
          createdAt: new Date().toISOString(),
        },
      ]);
    } else {
      this.storage.set(pathStr, []);
    }
  }

  // Utility functions
  timestamp = {
    now: () => ({ seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }),
  };

  serverTimestamp = () => new Date().toISOString();
}

export const mockDatabase = new MockDatabase();
