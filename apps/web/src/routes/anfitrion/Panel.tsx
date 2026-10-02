import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavMonitor from '@/components/layout/BottomNavMonitor';
import { useSesionStore } from '@/state/useSesionStore';

export default function Panel() {
  const navigate = useNavigate();
  const { rolActivo } = useSesionStore();
  const [nombreAsilo, setNombreAsilo] = useState('Asilo Los Álamos'); // Mock V1

  const resumen = [
    { valor: '28', etiqueta: 'Residentes activos', color: 'var(--color-blue)', bg: '#e8f0fe', border: 'var(--color-blue-light)' },
    { valor: '1.4h', etiqueta: 'Tiempo prom. / día', color: 'var(--color-orange-dark)', bg: '#fff0e6', border: 'var(--color-peach)' },
    { valor: 'Lotería', etiqueta: 'Juego más jugado', color: 'var(--color-olive)', bg: '#f1f8e9', border: '#c5e1a5' },
  ];

  const miembros = [
    { id: 1, nombre: 'María G.', edad: 78, favorito: 'Lotería', tiempo: '6.2 h', color: 'var(--color-orange)' },
    { id: 2, nombre: 'José R.', edad: 82, favorito: 'Memorama', tiempo: '5.4 h', color: 'var(--color-blue)' },
    { id: 3, nombre: 'Carmen T.', edad: 75, favorito: 'Solitario', tiempo: '4.1 h', color: 'var(--color-olive)' },
    { id: 4, nombre: 'Luis P.', edad: 80, favorito: 'Ajedrez', tiempo: '2.8 h', color: 'var(--color-blue-light)' },
    { id: 5, nombre: 'Ana M.', edad: 73, favorito: 'Trivia', tiempo: '1.3 h', color: 'var(--color-peach)' },
  ];

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        fontFamily: 'var(--font-body)',
        boxSizing: 'border-box',
        paddingBottom: '100px', // Espacio para BottomNav
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px 24px 24px 24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', color: 'var(--color-text)', margin: '0 0 4px 0', fontFamily: 'var(--font-title)' }}>
            Panel del Asilo
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-gray)', margin: 0 }}>
            {nombreAsilo}
          </p>
        </div>
        {rolActivo === 'anfitrion' && (
          <button
            onClick={() => navigate('/panel/miembros')}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-blue-light)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-white)',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <i className="fa-solid fa-gear" style={{ fontSize: '18px' }}></i>
          </button>
        )}
      </div>

      {/* Tarjetas de Resumen (Scroll Horizontal) */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '12px', 
          padding: '0 24px', 
          overflowX: 'auto', 
          paddingBottom: '8px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          marginBottom: '24px',
        }}
      >
        {resumen.map((item, i) => (
          <div
            key={i}
            style={{
              minWidth: '110px',
              backgroundColor: item.bg,
              border: `1px solid ${item.border}`,
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
            }}
          >
            <span style={{ fontSize: '24px', fontWeight: 800, color: item.color, fontFamily: 'var(--font-title)', marginBottom: '4px' }}>
              {item.valor}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-gray)', lineHeight: '1.2' }}>
              {item.etiqueta}
            </span>
          </div>
        ))}
      </div>

      {/* Alerta de inactividad */}
      <div style={{ padding: '0 24px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: '#fff3e0', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>⚠️</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-orange-dark)' }}>
            3 residentes sin actividad hace más de 5 días
          </span>
        </div>
      </div>

      {/* Lista de Miembros */}
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', color: 'var(--color-text)', margin: 0, fontFamily: 'var(--font-title)' }}>
            Miembros
          </h2>
          <button style={{ background: 'none', border: 'none', color: 'var(--color-blue)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            Tiempo de juego ↓
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {miembros.map((m) => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: m.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-white)', fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-title)' }}>
                  {m.nombre.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)' }}>
                    {m.nombre}, {m.edad}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-gray)' }}>
                    Favorito: {m.favorito}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-blue)', fontFamily: 'var(--font-title)' }}>
                {m.tiempo}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNavMonitor />
    </div>
  );
}
