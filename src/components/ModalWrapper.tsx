import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useImprovedScrollLock } from '../hooks/useImprovedScrollLock';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
  overlay?: boolean;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
  isOpen,
  onClose,
  children,
  maxWidth = 'max-w-4xl',
  className = '',
  overlay = true,
  closeOnEscape = true,
  closeOnOverlayClick = true,
}) => {
  // Apply scroll lock when modal is open
  useImprovedScrollLock(isOpen);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
        style={{
          backgroundColor: overlay ? 'rgba(0, 0, 0, 0.7)' : 'transparent',
          backdropFilter: overlay ? 'blur(8px)' : 'none',
        }}
        onClick={handleOverlayClick}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ 
            duration: 0.3, 
            type: "spring", 
            damping: 25, 
            stiffness: 200 
          }}
          className={`
            w-full ${maxWidth}
            max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)]
            overflow-y-auto
            ${className}
            modal-scroll allow-scroll
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalWrapper;
