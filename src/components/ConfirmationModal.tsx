import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { ModalWrapper } from './ModalWrapper';

interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title = 'Confirmar Ação',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  variant = 'warning'
}) => {
  if (!isOpen) return null;

  const getVariantClasses = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: Trash2,
          iconColor: 'text-red-400',
          iconBg: 'bg-red-500/20',
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
          titleColor: 'text-red-400'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-400',
          iconBg: 'bg-yellow-500/20',
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
          titleColor: 'text-yellow-400'
        };
      case 'info':
      default:
        return {
          icon: AlertTriangle,
          iconColor: 'text-blue-400',
          iconBg: 'bg-blue-500/20',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
          titleColor: 'text-blue-400'
        };
    }
  };

  const variantConfig = getVariantClasses();
  const Icon = variantConfig.icon;

  const handleConfirm = () => {
    onConfirm();
    onCancel(); // Fechar modal após confirmar
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onCancel}
      maxWidth="max-w-md"
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/20 overflow-hidden shadow-2xl"
    >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${variantConfig.iconBg}`}>
              <Icon className={`w-5 h-5 ${variantConfig.iconColor}`} />
            </div>
            <h2 className={`text-lg font-bold ${variantConfig.titleColor}`}>
              {title}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="text-slate-400" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6 pt-0">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 rounded-lg"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${variantConfig.confirmButton}`}
          >
            {confirmText}
          </button>
        </div>
    </ModalWrapper>
  );
};

export default ConfirmationModal;
