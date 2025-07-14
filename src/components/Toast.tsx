import React, { useEffect } from "react";
import { CheckCircle, AlertCircle, X, Info, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastComponent: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const { id, type, title, message, duration = 5000, action } = toast;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onRemove(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onRemove]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case "error":
        return <AlertCircle className="w-6 h-6 text-red-400" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
      case "info":
        return <Info className="w-6 h-6 text-blue-400" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return "border-green-500 bg-green-950/90";
      case "error":
        return "border-red-500 bg-red-950/90";
      case "warning":
        return "border-yellow-500 bg-yellow-950/90";
      case "info":
        return "border-blue-500 bg-blue-950/90";
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border ${getStyles()} backdrop-blur-sm animate-slide-in-right shadow-lg max-w-md`}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium text-sm">{title}</h4>
          {message && (
            <p className="text-slate-300 text-sm mt-1 leading-relaxed">
              {message}
            </p>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 text-xs font-medium text-purple-400 hover:text-purple-300 underline"
            >
              {action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => onRemove(id)}
          className="text-slate-400 hover:text-white p-1 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};
