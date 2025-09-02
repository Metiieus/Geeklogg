import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

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
            <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="confirm-modal-title"
                    className="text-xl font-bold text-white"
                  >
                    {title}
                  </h2>
                  {message && (
                    <div className="mt-2 text-white/80 text-sm leading-relaxed">
                      {typeof message === "string" ? <p>{message}</p> : message}
                    </div>
                  )}
                </div>
                <button
                  aria-label="Fechar"
                  onClick={onCancel}
                  className="p-2 rounded-lg hover:bg-slate-700/60 transition-colors"
                >
                  <X className="text-slate-300" size={20} />
                </button>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  ref={confirmRef}
                  onClick={onConfirm}
                  className={`px-4 py-2 rounded-xl text-white transition-colors ${
                    variant === "danger"
                      ? "bg-red-600 hover:bg-red-500"
                      : "bg-cyan-600 hover:bg-cyan-500"
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
