import { useState } from 'react';
import BottomNav from '@/components/layout/BottomNav';

export default function Chat() {
  const [mensaje, setMensaje] = useState('');

  // Datos mockeados para V1
  const mensajes = [
    { id: 1, usuario: 'Carmen', inicial: 'C', color: 'var(--color-orange-dark)', texto: '¡Buenos días a todos! ¿Alguien quiere jugar Lotería hoy? 🎴', mio: false },
    { id: 2, usuario: 'Yo', texto: '¡Sí! Yo me apunto, a las 5pm 😁', mio: true },
    { id: 3, usuario: 'Luis', inicial: 'L', color: 'var(--color-blue-light)', texto: 'Yo también voy, ya extrañaba jugar con ustedes', mio: false },
  ];

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        fontFamily: 'var(--font-body)',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header del Chat */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '24px',
          gap: '16px',
          backgroundColor: 'var(--color-white)',
          borderBottom: '1px solid var(--color-light-gray)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            backgroundColor: 'var(--color-blue)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-white)',
            fontSize: '20px',
          }}
        >
          <i className="fa-solid fa-house"></i>
        </div>
        <div>
          <h1 style={{ fontSize: '18px', color: 'var(--color-text)', margin: '0 0 4px 0', fontFamily: 'var(--font-title)' }}>
            Asilo Los Álamos
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--color-gray)', margin: 0 }}>
            28 miembros • Moderado
          </p>
        </div>
      </div>

      {/* Área de mensajes */}
      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', paddingBottom: '160px' }}>
        {mensajes.map((m) => (
          <div
            key={m.id}
            style={{
              display: 'flex',
              gap: '12px',
              alignSelf: m.mio ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
            }}
          >
            {/* Avatar (solo para los demás) */}
            {!m.mio && (
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: m.color,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-white)',
                  fontWeight: 'bold',
                  flexShrink: 0,
                }}
              >
                {m.inicial}
              </div>
            )}

            {/* Burbuja de mensaje */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: m.mio ? 'flex-end' : 'flex-start' }}>
              {!m.mio && (
                <span style={{ fontSize: '12px', color: 'var(--color-gray)', marginBottom: '4px', marginLeft: '4px' }}>
                  {m.usuario}
                </span>
              )}
              <div
                style={{
                  backgroundColor: m.mio ? 'var(--color-blue)' : 'var(--color-white)',
                  color: m.mio ? 'var(--color-white)' : 'var(--color-text)',
                  padding: '16px',
                  borderRadius: m.mio ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  border: m.mio ? 'none' : '1px solid var(--color-light-gray)',
                  fontSize: '14px',
                  lineHeight: '1.4',
                }}
              >
                {m.texto}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div
        style={{
          position: 'fixed',
          bottom: '80px', // Justo arriba del BottomNav
          left: 0,
          right: 0,
          padding: '16px 24px',
          backgroundColor: 'var(--color-bg)',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          style={{
            flex: 1,
            padding: '16px 20px',
            borderRadius: '999px',
            border: '1px solid var(--color-light-gray)',
            outline: 'none',
            fontSize: '14px',
            fontFamily: 'var(--font-body)',
          }}
        />
        <button
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-orange)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-white)',
            fontSize: '18px',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
