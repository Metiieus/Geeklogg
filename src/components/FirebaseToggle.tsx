import React, { useState, useEffect } from "react";

export const FirebaseToggle: React.FC = () => {
  const [useMock, setUseMock] = useState(true);

  useEffect(() => {
    const mockSetting = localStorage.getItem("use_firebase_mock");
    setUseMock(mockSetting !== "false");
  }, []);

  const toggleFirebase = () => {
    const newUseMock = !useMock;
    setUseMock(newUseMock);
    localStorage.setItem("use_firebase_mock", newUseMock ? "true" : "false");

    // Show reload message
    if (confirm("Setting changed. Reload page to apply changes?")) {
      window.location.reload();
    }
  };

  // Only show in development
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "10px",
        left: "10px",
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "8px 12px",
        borderRadius: "5px",
        fontSize: "12px",
        zIndex: 9999,
        cursor: "pointer",
        userSelect: "none",
      }}
      onClick={toggleFirebase}
    >
      <div>🔧 Dev Mode</div>
      <div style={{ marginTop: "2px" }}>
        Database: {useMock ? "📦 Mock" : "🔥 Firebase"}
      </div>
      <div style={{ fontSize: "10px", opacity: 0.7, marginTop: "2px" }}>
        Click to toggle
      </div>
    </div>
  );
};
