import React, { createContext, useContext, useState, useCallback } from "react";
import { View, Text, Animated } from "react-native";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastColors: Record<ToastType, string> = {
  success: "bg-green-600",
  error: "bg-red-600",
  warning: "bg-yellow-600",
  info: "bg-blue-600",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const showSuccess = useCallback((message: string) => showToast(message, "success"), [showToast]);
  const showError = useCallback((message: string) => showToast(message, "error"), [showToast]);
  const showWarning = useCallback((message: string) => showToast(message, "warning"), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning }}>
      {children}
      {/* Toast Container */}
      <View className="absolute bottom-20 left-4 right-4 z-50 gap-2">
        {toasts.map((toast) => (
          <View
            key={toast.id}
            className={`${toastColors[toast.type]} rounded-xl px-4 py-3 shadow-lg`}
          >
            <Text className="text-white font-medium text-sm">{toast.message}</Text>
          </View>
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
