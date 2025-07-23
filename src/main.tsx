import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./mobile-improvements.css";
import "./library-mobile-optimizations.css";
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
