import ModalBase from './ModalBase';

interface ModalConfirmacionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  isDestructive?: boolean;
}

export default function ModalConfirmacion({
  isOpen,
  onClose,
  onConfirm,
  titulo,
  mensaje,
  textoConfirmar = 'Aceptar',
  textoCancelar = 'Cancelar',
  isDestructive = true
}: ModalConfirmacionProps) {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose}>
      {isDestructive && (
        <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-red, #dc2626)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'var(--color-white)', marginBottom: '24px' }}>
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
      )}
      <h2 style={{ fontSize: '20px', color: 'var(--color-text)', margin: '0 0 8px 0', fontFamily: 'var(--font-title)' }}>
        {titulo}
      </h2>
      <p style={{ fontSize: '14px', color: 'var(--color-gray)', margin: '0 0 32px 0', lineHeight: '1.5' }}>
        {mensaje}
      </p>
      
      <button
        onClick={() => {
          onConfirm();
          onClose();
        }}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: isDestructive ? 'var(--color-red, #dc2626)' : 'var(--color-orange-dark)',
          color: 'var(--color-white)',
          border: 'none',
          borderRadius: '999px',
          fontSize: '16px',
          fontWeight: 700,
          cursor: 'pointer',
          marginBottom: '16px'
        }}
      >
        {textoConfirmar}
      </button>
      
      <button
        onClick={onClose}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: 'transparent',
          border: '2px solid var(--color-light-gray)',
          color: 'var(--color-gray)',
          borderRadius: '999px',
          fontSize: '16px',
          fontWeight: 700,
          cursor: 'pointer'
        }}
      >
        {textoCancelar}
      </button>
    </ModalBase>
  );
}
