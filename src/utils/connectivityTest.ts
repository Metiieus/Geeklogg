import { db, auth, isFirebaseOffline, withRetry } from "../firebase";
import { logger } from '../utils/logger';
import { database } from "../services/database";
import { logger } from '../utils/logger';

export interface ConnectivityTestResult {
  networkStatus: boolean;
  firebaseStatus: boolean;
  authStatus: boolean;
  databaseStatus: boolean;
  error?: string;
  timestamp: string;
}

export const runConnectivityTest =
  async (): Promise<ConnectivityTestResult> => {
    const timestamp = new Date().toISOString();

    try {
      // Test 1: Basic network connectivity
      const networkStatus = navigator.onLine;

      // Test 2: Firebase initialization status
      const firebaseOffline = isFirebaseOffline();

      const firebaseStatus = !firebaseOffline && !!db && !!auth;
      const authStatus = !!auth;

      // Test 3: Database connectivity (try a simple read operation)
      let databaseStatus = false;
      try {
        // Try to test Firestore connectivity with a simple operation
        if (db && !firebaseOffline) {
          await withRetry(
            async () => {
              // This will try to connect to Firestore or fail gracefully
              const testDoc = await database.get(["test"], "connectivity-test");
              return testDoc;
            },
            1,
            500,
          ); // Single retry with short delay for quick test
          databaseStatus = true;
        }
      } catch (error: any) {
        logger.warn("Database connectivity test failed:", error.message);
        databaseStatus = false;
      }

      return {
        networkStatus,
        firebaseStatus,
        authStatus,
        databaseStatus,
        timestamp,
      };
    } catch (error: any) {
      return {
        networkStatus: false,
        firebaseStatus: false,
        authStatus: false,
        databaseStatus: false,
        error: error.message || "Unknown error during connectivity test",
        timestamp,
      };
    }
  };

export const logConnectivityStatus = async () => {
  console.group("🔍 Connectivity Test Results");

  const result = await runConnectivityTest();

  logger.log("📊 Test Results:");
  logger.log(
    `  🌐 Network: ${result.networkStatus ? "✅ Online" : "❌ Offline"}`,
  );
  logger.log(
    `  🔥 Firebase: ${result.firebaseStatus ? "✅ Connected" : "❌ Disconnected"}`,
  );
  logger.log(
    `  🔐 Auth: ${result.authStatus ? "✅ Available" : "❌ Unavailable"}`,
  );
  logger.log(
    `  💾 Database: ${result.databaseStatus ? "✅ Accessible" : "❌ Inaccessible"}`,
  );

  if (result.error) {
    console.error("❌ Error:", result.error);
  }

  logger.log(`⏰ Timestamp: ${result.timestamp}`);
  console.groupEnd();

  return result;
};

// Auto-run connectivity test in development
if (import.meta.env.DEV) {
  setTimeout(() => {
    logConnectivityStatus().catch(console.error);
  }, 2000); // Wait 2 seconds for Firebase to initialize
}
