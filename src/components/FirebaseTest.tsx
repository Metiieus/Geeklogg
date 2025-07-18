import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export const FirebaseTest: React.FC = () => {
  const [status, setStatus] = useState<string>("Testing...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testFirebase = async () => {
      try {
        setStatus("🔍 Testing Firebase connection...");

        // Test 1: Check if auth is initialized
        if (!auth.currentUser) {
          setStatus(
            "⚠️ User not authenticated - Firebase requires authentication",
          );
          setError("Please sign in to test Firestore connection");
          return;
        }

        setStatus("✅ Auth initialized, testing Firestore...");

        // Test 2: Try to access user's own collection (which has proper permissions)
        const userCollection = collection(
          db,
          `users/${auth.currentUser.uid}/medias`,
        );
        await getDocs(userCollection);

        setStatus("✅ Firebase connection successful!");
        setError(null);
      } catch (err: any) {
        console.error("Firebase test failed:", err);
        setStatus("❌ Firebase connection failed");
        setError(err.message || "Unknown error");
      }
    };

    // Wait for auth state to be determined
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user !== undefined) {
        testFirebase();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
        zIndex: 9999,
      }}
    >
      <div>Firebase Status: {status}</div>
      {error && (
        <div style={{ color: "red", marginTop: "5px" }}>Error: {error}</div>
      )}
    </div>
  );
};
