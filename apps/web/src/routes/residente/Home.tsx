import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useSesionStore } from '@/state/useSesionStore';
import BottomNav from '@/components/layout/BottomNav';

const JUEGOS = [
  { id: 'memorama', nombre: 'Memorama', emoji: '🧠', bgColor: 'var(--color-blue)', borderColor: 'var(--color-blue-light)' },
  { id: 'trivia', nombre: 'Trivia', emoji: '❓', bgColor: 'var(--color-orange)', borderColor: 'var(--color-peach)' },
  { id: 'damaschinas', nombre: 'Damas chinas', emoji: '⚫', bgColor: 'var(--color-blue-light)', borderColor: 'var(--color-blue-light)' },
  { id: 'ajedrez', nombre: 'Ajedrez', emoji: '♟️', bgColor: 'var(--color-orange)', borderColor: 'var(--color-peach)' },
  { id: 'solitario', nombre: 'Solitario', emoji: '🃏', bgColor: 'var(--color-blue)', borderColor: 'var(--color-blue-light)' },
  { id: 'loteria', nombre: 'Lotería', emoji: '🎴', bgColor: 'var(--color-peach)', borderColor: 'var(--color-peach)' },
];

export default function Home() {
  const { asiloActivoId } = useSesionStore();
  const [nombreResidente, setNombreResidente] = useState<string>('Residente');
  const [nombreAsilo, setNombreAsilo] = useState<string>('Tu asilo');

  useEffect(() => {
    // 1. Obtener nombre del usuario
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.nombre_completo) {
        setNombreResidente(user.user_metadata.nombre_completo.split(' ')[0]);
      }
    });

    // 2. Obtener nombre del asilo si tenemos el ID
    if (asiloActivoId) {
      supabase
        .from('asilos')
        .select('nombre')
        .eq('id', asiloActivoId)
        .single()
        .then(({ data }) => {
          if (data) setNombreAsilo(data.nombre);
        });
    }
  }, [asiloActivoId]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        paddingBottom: '100px', // Espacio para el BottomNav
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Header superior */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '32px 24px 24px 24px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', color: 'var(--color-text)', margin: '0 0 4px 0' }}>
            Hola, {nombreResidente}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-gray)', margin: 0 }}>
            {nombreAsilo}
          </p>
        </div>
        
        {/* Botón de notificaciones (Campana) */}
        <button
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-blue-light)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '24px' }}>🔔</span>
        </button>
      </div>

      {/* Título de sección */}
      <h2 style={{ fontSize: '20px', color: 'var(--color-text)', padding: '0 24px', marginBottom: '20px' }}>
        Tus juegos
      </h2>

      {/* Grilla de juegos */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          padding: '0 24px',
        }}
      >
        {JUEGOS.map((juego) => (
          <button
            key={juego.id}
            onClick={() => alert(`Próximamente: ${juego.nombre}`)} // Temporalmente
            style={{
              backgroundColor: 'var(--color-white)',
              border: `2px solid ${juego.borderColor}`,
              borderRadius: '24px', // Radios grandes como en el wireframe
              padding: '24px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              gap: '16px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
            }}
          >
            {/* Círculo central del juego */}
            <div
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: juego.bgColor,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px', // Tamaño del emoji
              }}
            >
              {juego.emoji}
            </div>
            
            {/* Nombre del juego */}
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-title)' }}>
              {juego.nombre}
            </span>
          </button>
        ))}
      </div>

      {/* Barra de Navegación Inferior */}
      <BottomNav />
    </div>
  );
}
