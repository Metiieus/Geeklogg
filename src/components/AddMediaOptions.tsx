import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

type AddMediaOptionsProps = {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onPickImage?: () => void;
  onPickVideo?: () => void;
  onPickAudio?: () => void;
  // Optional custom trigger. If omitted, a default button is rendered.
  trigger?: (props: { onClick: () => void }) => React.ReactNode;
};

function useControllableState(
  controlled: boolean | undefined,
  onChange: ((open: boolean) => void) | undefined,
  initial = false
) {
  const [uncontrolled, setUncontrolled] = useState<boolean>(initial);
  const isControlled = typeof controlled === 'boolean';
  const value = isControlled ? (controlled as boolean) : uncontrolled;

  const setValue = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  return [value, setValue] as const;
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.createElement('div');
    el.setAttribute('data-portal', 'add-media-modal');
    document.body.appendChild(el);
    setContainer(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open || !container) return null;

  return createPortal(
    <div
      aria-modal="true"
      role="dialog"
      aria-label={title || 'Adicionar mídia'}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
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
          width: 'min(92vw, 520px)',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          padding: 16
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{title || 'Adicionar mídia'}</h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            style={{ border: 'none', background: 'transparent', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}
          >
            ×
          </button>
        </div>
        <div style={{ marginTop: 12 }}>{children}</div>
      </div>
    </div>,
    container
  );
}

export function AddMediaOptions({
  isOpen,
  onOpenChange,
  onPickImage,
  onPickVideo,
  onPickAudio,
  trigger
}: AddMediaOptionsProps) {
  const [open, setOpen] = useControllableState(isOpen, onOpenChange, false);

  const handleOpen = useCallback(() => setOpen(true), [setOpen]);
  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  const Trigger = useMemo(() => {
    if (trigger) return trigger({ onClick: handleOpen });
    return (
      <button
        type="button"
        onClick={handleOpen}
        style={{
          borderRadius: 8,
          padding: '8px 12px',
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Adicionar mídia
      </button>
    );
  }, [handleOpen, trigger]);

  return (
    <>
      {Trigger}
      <Modal open={open} onClose={handleClose} title="Adicionar mídia">
        <div style={{ display: 'grid', gap: 8 }}>
          <button
            type="button"
            onClick={() => {
              onPickImage?.();
              handleClose();
            }}
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', cursor: 'pointer' }}
          >
            Imagem
          </button>
          <button
            type="button"
            onClick={() => {
              onPickVideo?.();
              handleClose();
            }}
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', cursor: 'pointer' }}
          >
            Vídeo
          </button>
          <button
            type="button"
            onClick={() => {
              onPickAudio?.();
              handleClose();
            }}
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', cursor: 'pointer' }}
          >
            Áudio
          </button>
        </div>
      </Modal>
    </>
  );
}

export default AddMediaOptions;
