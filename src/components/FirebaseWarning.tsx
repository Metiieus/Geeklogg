import React, { useState } from "react";
import { AlertTriangle, X, ExternalLink } from "lucide-react";

export const FirebaseWarning: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  // Verificar se Firebase está configurado
  const isFirebaseConfigured = () => {
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

    return (
      apiKey &&
      projectId &&
      !apiKey.includes("your_") &&
      !projectId.includes("your_project_id")
    );
  };

  // Se Firebase está configurado ou o aviso foi dispensado, não mostrar
  if (isFirebaseConfigured() || dismissed) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm animate-slide-down">
      <div className="bg-gradient-to-r from-yellow-900/90 to-orange-900/90 backdrop-blur-xl border border-yellow-500/50 rounded-xl p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <AlertTriangle
            className="text-yellow-400 flex-shrink-0 mt-0.5"
            size={20}
          />

          <div className="flex-1 min-w-0">
            <h3 className="text-yellow-100 font-semibold text-sm mb-1">
              Modo Temporário
            </h3>
            <p className="text-yellow-200 text-xs leading-relaxed mb-3">
              Firebase não configurado. Os dados não serão salvos
              permanentemente.
            </p>

            <div className="flex gap-2">
              <a
                href="https://firebase.google.com/docs/web/setup"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-100 px-2 py-1 rounded transition-colors"
              >
                <ExternalLink size={12} />
                Configurar
              </a>
              <button
                onClick={() => setDismissed(true)}
                className="text-xs bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-100 px-2 py-1 rounded transition-colors"
              >
                Dispensar
              </button>
            </div>
          </div>

          <button
            onClick={() => setDismissed(true)}
            className="text-yellow-400/70 hover:text-yellow-400 transition-colors flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
