import { ReactNode, useEffect } from 'react';

interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function ModalBase({ isOpen, onClose, children }: ModalBaseProps) {
  // Evitar scroll del fondo cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(38, 38, 38, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        zIndex: 1000,
      }}
      onClick={onClose} // Cierra al hacer clic fuera del contenido
    >
      <div
        style={{
          backgroundColor: 'var(--color-white)',
          borderRadius: '32px',
          padding: '32px 24px',
          width: '100%',
          maxWidth: '340px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic dentro de la tarjeta
      >
        {children}
      </div>
    </div>
  );
}
