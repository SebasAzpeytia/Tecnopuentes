import { useNavigate } from 'react-router-dom';

export default function Ajedrez() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--color-bg)', padding: '24px', textAlign: 'center' }}>
      <i className="fa-solid fa-chess-knight" style={{ fontSize: '64px', color: 'var(--color-orange)', marginBottom: '24px' }}></i>
      <h1 style={{ fontSize: '28px', color: 'var(--color-text)', marginBottom: '16px', fontFamily: 'var(--font-title)' }}>Ajedrez</h1>
      <p style={{ fontSize: '18px', color: 'var(--color-gray)', marginBottom: '32px' }}>Este juego se encuentra en construcción. ¡Vuelve pronto!</p>
      
      <button 
        onClick={() => navigate(-1)}
        style={{ padding: '16px 32px', backgroundColor: 'var(--color-blue)', color: 'var(--color-white)', border: 'none', borderRadius: '999px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <i className="fa-solid fa-arrow-left"></i> Volver a inicio
      </button>
    </div>
  );
}
