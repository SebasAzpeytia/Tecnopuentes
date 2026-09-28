import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavMonitor from '@/components/layout/BottomNavMonitor';

export default function PersonalizarIconos() {
  const navigate = useNavigate();
  const [juegoExpandido, setJuegoExpandido] = useState<string | null>('Memorama');

  const juegos = [
    {
      id: 'memorama',
      nombre: 'Memorama',
      color: 'var(--color-blue)',
      icono: 'fa-solid fa-brain',
      elementos: 8,
      items: [
        { id: 'm1', nombre: 'Símbolo 1', emoji: '🐶', previewBg: '#e8eaf6' },
        { id: 'm2', nombre: 'Símbolo 2', emoji: '🌸', previewBg: '#fbe9e7' },
        { id: 'm3', nombre: 'Símbolo 3', emoji: '⭐', previewBg: '#f1f8e9' },
      ]
    },
    { id: 'ajedrez', nombre: 'Ajedrez', color: 'var(--color-orange-dark)', icono: 'fa-solid fa-chess-pawn', elementos: 6, items: [] },
    { id: 'solitario', nombre: 'Solitario', color: 'var(--color-olive)', icono: 'fa-solid fa-clone', elementos: 5, items: [] },
    { id: 'dulces', nombre: 'Combina Dulces', color: 'var(--color-peach)', icono: 'fa-solid fa-candy-cane', elementos: 6, items: [] },
    { id: 'loteria', nombre: 'Lotería', color: 'var(--color-blue-light)', icono: 'fa-solid fa-table-cells-large', elementos: 12, items: [] },
  ];

  const toggleJuego = (id: string) => {
    if (juegoExpandido === id) setJuegoExpandido(null);
    else setJuegoExpandido(id);
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        fontFamily: 'var(--font-body)',
        boxSizing: 'border-box',
        paddingBottom: '100px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px 24px 24px 24px' }}>
        <button
          onClick={() => navigate('/panel')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '1px solid var(--color-blue)',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-blue)',
            cursor: 'pointer',
          }}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 style={{ fontSize: '20px', color: 'var(--color-text)', margin: 0, fontFamily: 'var(--font-title)' }}>
          Personalizar íconos
        </h1>
        <button
          onClick={() => navigate('/panel')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-blue)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-white)',
            cursor: 'pointer',
          }}
        >
          <i className="fa-solid fa-check"></i>
        </button>
      </div>

      {/* Buscador */}
      <div style={{ padding: '0 24px', marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
          <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray)' }}></i>
          <input
            type="text"
            placeholder="Buscar juego o elemento..."
            style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '999px', border: '1px solid var(--color-light-gray)', outline: 'none', fontSize: '14px', fontFamily: 'var(--font-body)', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* Accordion de Juegos */}
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
        {juegos.map(j => (
          <div key={j.id} style={{ backgroundColor: 'var(--color-white)', borderRadius: '24px', border: '1px solid var(--color-light-gray)', overflow: 'hidden' }}>
            
            <div 
              onClick={() => toggleJuego(j.id)}
              style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: j.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-white)', fontSize: '20px' }}>
                  <i className={j.icono}></i>
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-title)' }}>
                    {j.nombre}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-gray)' }}>
                    {j.elementos} elementos personalizables
                  </div>
                </div>
              </div>
              <i className={`fa-solid ${juegoExpandido === j.id ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ color: 'var(--color-gray)' }}></i>
            </div>

            {/* Elementos Expandidos */}
            {juegoExpandido === j.id && j.items.length > 0 && (
              <div style={{ padding: '0 20px 20px 20px' }}>
                <div style={{ borderTop: '1px solid var(--color-light-gray)', margin: '0 0 16px 0' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {j.items.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '40px', height: '60px', backgroundColor: item.previewBg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
                          {item.emoji}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
                          {item.nombre}
                        </span>
                      </div>
                      <button
                        onClick={() => navigate(`/panel/personalizar/editar?juego=${j.nombre}&elemento=${item.nombre}&emoji=${item.emoji}`)}
                        style={{ padding: '8px 24px', borderRadius: '999px', border: '1px solid var(--color-blue)', backgroundColor: 'transparent', color: 'var(--color-blue)', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Editar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ))}

        <div style={{ textAlign: 'center', marginTop: '16px', marginBottom: '24px' }}>
          <p style={{ fontSize: '12px', color: 'var(--color-gray)' }}>
            Toca un juego para ver y editar todos sus íconos
          </p>
        </div>
      </div>

      <BottomNavMonitor />
    </div>
  );
}
