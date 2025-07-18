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
        setStatus("✅ Auth initialized, testing Firestore...");

        // Test 2: Try to access a simple collection
        const testCollection = collection(db, "test");
        await getDocs(testCollection);

        setStatus("✅ Firebase connection successful!");
        setError(null);
      } catch (err: any) {
        console.error("Firebase test failed:", err);
        setStatus("❌ Firebase connection failed");
        setError(err.message || "Unknown error");
      }
    };

    testFirebase();
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
