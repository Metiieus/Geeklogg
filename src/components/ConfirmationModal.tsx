import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

export interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "default";
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title = "Confirmar ação",
  message = "Tem certeza?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "default",
  onConfirm,
  onCancel,
}) => {
  const confirmRef = useRef<HTMLButtonElement>(null);

  // Foco inicial no botão confirmar quando abrir
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => confirmRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // ESC cancela, Enter confirma
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onCancel, onConfirm]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            key="dialog"
            className="fixed z-[9999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              duration: 0.2,
              type: "spring",
              damping: 24,
              stiffness: 220,
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
          >
            <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Header com ícone de alerta */}
              <div className={`p-6 border-b ${
                variant === "danger"
                  ? "bg-red-500/10 border-red-500/20"
                  : "bg-slate-800/50 border-white/10"
              }`}>
                <div className="flex items-start gap-4">
                  {variant === "danger" && (
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h2
                      id="confirm-modal-title"
                      className="text-xl font-bold text-white"
                    >
                      {title}
                    </h2>
                  </div>
                  <button
                    aria-label="Fechar"
                    onClick={onCancel}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="text-slate-300" size={20} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                {message && (
                  <div className="text-slate-300 text-sm leading-relaxed">
                    {typeof message === "string" ? <p>{message}</p> : message}
                  </div>
                )}

                {variant === "danger" && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-sm text-red-300 font-medium">
                      ⚠️ Esta ação não pode ser desfeita!
                    </p>
                  </div>
                )}
              </div>

              {/* Footer com botões */}
              <div className="p-6 bg-slate-800/50 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCancel}
                  className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-colors font-medium"
                >
                  {cancelText}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  ref={confirmRef}
                  onClick={onConfirm}
                  className={`px-6 py-3 rounded-xl text-white transition-colors font-semibold shadow-lg ${
                    variant === "danger"
                      ? "bg-red-600 hover:bg-red-500 border-2 border-red-500"
                      : "bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400"
                  }`}
                >
                  {confirmText}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
