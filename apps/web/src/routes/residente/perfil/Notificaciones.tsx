import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Notificaciones() {
  const navigate = useNavigate();
  const [mensajes, setMensajes] = useState(true);
  const [recordar, setRecordar] = useState(true);
  const [avisos, setAvisos] = useState(false);

  // Helper componente para un switch/toggle
  const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (val: boolean) => void }) => (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: '50px',
        height: '30px',
        backgroundColor: checked ? 'var(--color-blue)' : 'var(--color-light-gray)',
        borderRadius: '15px',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
      }}
    >
      <div
        style={{
          width: '24px',
          height: '24px',
          backgroundColor: 'var(--color-white)',
          borderRadius: '50%',
          position: 'absolute',
          top: '3px',
          left: checked ? '23px' : '3px',
          transition: 'left 0.3s',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', padding: '24px', fontFamily: 'var(--font-body)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--color-blue)', backgroundColor: 'transparent', color: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 style={{ fontSize: '20px', color: 'var(--color-text)', margin: 0, fontFamily: 'var(--font-title)' }}>
          Notificaciones
        </h1>
      </div>

      <p style={{ fontSize: '14px', color: 'var(--color-gray)', marginBottom: '32px' }}>
        Elige qué avisos quieres recibir.
      </p>

      {/* Lista de Opciones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        
        {/* Item 1 */}
        <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-white)', fontSize: '16px' }}>
              <i className="fa-solid fa-comment-dots"></i>
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)' }}>Mensajes</div>
              <div style={{ fontSize: '12px', color: 'var(--color-gray)' }}>Cuando alguien escribe en el chat</div>
            </div>
          </div>
          <Toggle checked={mensajes} onChange={setMensajes} />
        </div>

        {/* Item 2 */}
        <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-orange-dark)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-white)', fontSize: '16px' }}>
              <i className="fa-solid fa-gamepad"></i>
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)' }}>Recordar jugar</div>
              <div style={{ fontSize: '12px', color: 'var(--color-gray)' }}>Un aviso amable para jugar</div>
            </div>
          </div>
          <Toggle checked={recordar} onChange={setRecordar} />
        </div>

        {/* Item 3 */}
        <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-olive)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-white)', fontSize: '16px' }}>
              <i className="fa-solid fa-house"></i>
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)' }}>Avisos del asilo</div>
              <div style={{ fontSize: '12px', color: 'var(--color-gray)' }}>Noticias de tu asilo</div>
            </div>
          </div>
          <Toggle checked={avisos} onChange={setAvisos} />
        </div>

      </div>

      <button style={{ width: '100%', padding: '16px', backgroundColor: 'var(--color-orange-dark)', color: 'var(--color-white)', border: 'none', borderRadius: '999px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 10px rgba(244, 92, 25, 0.3)', marginTop: '24px' }}>
        Guardar
      </button>

    </div>
  );
}
