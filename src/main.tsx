import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./mobile-improvements.css";
import "./library-mobile-optimizations.css";
import "./production-optimizations.css";
import "./library-frames.css";
import "./animation-fixes.css";
import "./design-system/typography.css";
import "./styles/responsive-fixes.css";
import { AuthProvider } from "./context/AuthContext";

// Inicializar proteções de segurança
// import "./utils/consoleProtection"; // Desabilitado para debug

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
