import React, { useState } from "react";
import { Database, Play, Check, AlertCircle } from "lucide-react";
import {
  initializeFirestore,
  createTestData,
  debugFirestore,
} from "../utils/initializeFirestore";

export const FirestoreInitializer: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInitialize = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await initializeFirestore();
      if (result) {
        setSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setError("Falha na inicialização");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTestData = async () => {
    setIsLoading(true);
    try {
      await createTestData();
      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDebug = () => {
    debugFirestore();
  };

  // Só mostra em desenvolvimento
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(0,0,0,0.9)",
        color: "white",
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid #374151",
        zIndex: 10000,
        minWidth: "320px",
        maxWidth: "500px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        <Database size={20} />
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
          Firestore Setup
        </h3>
      </div>

      {success && (
        <div
          style={{
            background: "#059669",
            padding: "8px 12px",
            borderRadius: "6px",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Check size={16} />
          <span>✅ Firestore inicializado! Recarregando...</span>
        </div>
      )}

      {error && (
        <div
          style={{
            background: "#DC2626",
            padding: "8px 12px",
            borderRadius: "6px",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <AlertCircle size={16} />
          <span>❌ Erro: {error}</span>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <button
          onClick={handleInitialize}
          disabled={isLoading}
          style={{
            background: "linear-gradient(135deg, #8B5CF6, #A78BFA)",
            border: "none",
            color: "white",
            padding: "10px 16px",
            borderRadius: "8px",
            cursor: isLoading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: "500",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          <Play size={16} />
          {isLoading ? "Inicializando..." : "Inicializar Firestore"}
        </button>

        <button
          onClick={handleCreateTestData}
          disabled={isLoading}
          style={{
            background: "linear-gradient(135deg, #059669, #10B981)",
            border: "none",
            color: "white",
            padding: "8px 12px",
            borderRadius: "6px",
            cursor: isLoading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            fontSize: "12px",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          <Database size={14} />
          Criar Dados de Teste
        </button>

        <button
          onClick={handleDebug}
          style={{
            background: "transparent",
            border: "1px solid #374151",
            color: "#9CA3AF",
            padding: "6px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          🔍 Debug Console
        </button>
      </div>

      <div
        style={{
          marginTop: "12px",
          padding: "8px",
          background: "rgba(59, 130, 246, 0.1)",
          borderRadius: "6px",
          fontSize: "11px",
          color: "#93C5FD",
        }}
      >
        💡 <strong>Primeiro uso?</strong> Clique em "Inicializar Firestore" para
        criar todas as coleções e dados de exemplo.
      </div>
    </div>
  );
};
