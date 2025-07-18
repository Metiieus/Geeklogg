import React, { useState } from "react";
import { Database, Play } from "lucide-react";
import { initializeFirestore } from "../utils/initializeFirestore";

export const FirestoreInitializer: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  if (!import.meta.env.DEV) return null;

  const handleInitialize = async () => {
    setIsLoading(true);
    try {
      const { getAuth } = await import("firebase/auth");
      const auth = getAuth();
      if (!auth.currentUser) return;

      const result = await initializeFirestore();
      if (result) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 rounded-xl border border-slate-700 bg-slate-800/90 p-4 text-white">
      <div className="mb-3 flex items-center gap-2">
        <Database size={20} />
        <h3 className="m-0 text-sm font-bold">Firestore Setup</h3>
      </div>
      <button
        onClick={handleInitialize}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 rounded-lg bg-violet-600/90 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600 disabled:opacity-70"
      >
        <Play size={16} />
        {isLoading ? "Inicializando..." : "Inicializar Firestore"}
      </button>
    </div>
  );
};
