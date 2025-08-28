import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type ConfirmationModalProps = {
  open: boolean;
  title?: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  danger?: boolean;
  disabled?: boolean;
};

function PortalModal({ open, children, onClose, ariaLabel }: { open: boolean; children: React.ReactNode; onClose: () => void; ariaLabel?: string }) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.createElement('div');
    el.setAttribute('data-portal', 'confirmation-modal');
    document.body.appendChild(el);
    setContainer(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', keyHandler);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener('keydown', keyHandler);
    };
  }, [open, onClose]);

  if (!open || !container) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || 'Confirmação'}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          color: '#111827',
          borderRadius: 12,
          width: 'min(92vw, 460px)',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          padding: 16
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    container
  );
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  title = 'Confirmar ação',
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  danger,
  disabled
}) => {
  return (
    <PortalModal open={open} onClose={onCancel} ariaLabel={title}>
      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{title}</h3>
          <button
            onClick={onCancel}
            aria-label="Fechar"
            style={{ border: 'none', background: 'transparent', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}
          >
            ×
          </button>
        </div>
        {description && <div style={{ color: '#4b5563' }}>{description}</div>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={disabled}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: '#fff',
              color: '#111827',
              cursor: 'pointer',
              opacity: disabled ? 0.6 : 1
            }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={disabled}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid transparent',
              background: danger ? '#dc2626' : '#2563eb',
              color: '#fff',
              cursor: 'pointer',
              opacity: disabled ? 0.6 : 1
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </PortalModal>
  );
};

export default ConfirmationModal;

