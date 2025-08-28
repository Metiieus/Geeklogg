import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type AddMediaFromSearchModalProps = {
  open: boolean;
  onClose: () => void;
  onSearch?: (query: string) => void;
};

function Portal({ children }: { children: React.ReactNode }) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const node = document.createElement('div');
    node.setAttribute('data-portal', 'add-media-from-search');
    document.body.appendChild(node);
    setEl(node);
    return () => {
      document.body.removeChild(node);
    };
  }, []);
  if (!el) return null;
  return createPortal(children, el);
}

export const AddMediaFromSearchModal: React.FC<AddMediaFromSearchModalProps> = ({ open, onClose, onSearch }) => {
  const [query, setQuery] = useState('');

  // lock scroll and escape to close
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Adicionar nova mídia"
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
            background: '#0b1020',
            color: '#e5e7eb',
            borderRadius: 12,
            width: 'min(92vw, 720px)',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            padding: 16,
            border: '1px solid rgba(255,255,255,0.08)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Adicionar nova mídia</h2>
            <button
              onClick={onClose}
              aria-label="Fechar"
              style={{ border: 'none', background: 'transparent', fontSize: 22, cursor: 'pointer', color: '#fff' }}
            >
              ×
            </button>
          </div>

          <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
            <input
              placeholder="Buscar por título, autor, etc."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSearch?.(query);
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.06)',
                color: '#e5e7eb'
              }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'transparent',
                  color: '#e5e7eb',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => onSearch?.(query)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid transparent',
                  background: '#7c3aed',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default AddMediaFromSearchModal;
