import { logger } from "./utils/logger";
import { AppRoutes } from "./routes/AppRoutes";
import React, { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import "./utils/connectivityTest";

// Loading Screen
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
      <p className="text-slate-300">Carregando...</p>
    </div>
  </div>
);

// Main App Content
const AppContent: React.FC = () => {
  const { loading: authLoading } = useAuth();

  if (authLoading) return <LoadingScreen />;

  return (
    <AppRoutes />
  );
};

// Error Boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error("Error boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <p className="text-red-400">
            Erro inesperado: {this.state.error?.message}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Root App is handled in main.tsx (BrowserRouter)
const App: React.FC = () => {
  // Error handlers...
  useEffect(() => {
    const handler = (event: PromiseRejectionEvent) => {
      try {
        const reason = (event && (event.reason as any)) || null;
        const message = reason && (reason.message || String(reason)) ? (reason.message || String(reason)) : "";
        if (typeof message === "string" && message.includes("ReadableStreamDefaultReader constructor can only accept readable streams")) {
          logger.warn("Suppressed known Firestore ReadableStream error:", message);
          event.preventDefault();
          return;
        }
      } catch (e) { }
    };
    window.addEventListener("unhandledrejection", handler as any);
    return () => window.removeEventListener("unhandledrejection", handler as any);
  }, []);

  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;
