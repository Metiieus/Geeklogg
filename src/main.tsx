import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./modal-center-force.css";
import "./modal-scroll-fixes.css";
import { AuthProvider } from "./context/AuthContext";
import { initializeViewportHeight } from "./utils/viewportHeight";

// Inicializar proteções de segurança
// import "./utils/consoleProtection"; // Desabilitado para debug

// Inicializar viewport height para mobile
initializeViewportHeight();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
