import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useSesionStore } from '@/state/useSesionStore';
import BottomNav from '@/components/layout/BottomNav';

const JUEGOS = [
  { id: 'memorama', nombre: 'Memorama', icon: 'fa-solid fa-brain', bgColor: 'var(--color-blue)', borderColor: 'var(--color-blue-light)' },
  { id: 'solitario', nombre: 'Solitario', icon: 'fa-solid fa-clone', bgColor: 'var(--color-blue)', borderColor: 'var(--color-blue-light)' },
  { id: 'ajedrez', nombre: 'Ajedrez', icon: 'fa-solid fa-chess-knight', bgColor: 'var(--color-orange)', borderColor: 'var(--color-peach)' },
  { id: 'dulces', nombre: 'Combina Dulces', icon: 'fa-solid fa-candy-cane', bgColor: 'var(--color-peach)', borderColor: 'var(--color-peach)' },
];

export default function Home() {
  const navigate = useNavigate();
  const { asiloActivoId } = useSesionStore();
  const [nombreResidente, setNombreResidente] = useState<string | null>(null);
  const [nombreAsilo, setNombreAsilo] = useState<string | null>(null);

  useEffect(() => {
    // 1. Obtener nombre del usuario
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.nombre_completo) {
        setNombreResidente(user.user_metadata.nombre_completo.split(' ')[0]);
      } else {
        setNombreResidente('');
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
        width: '100%',
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
          <h1 style={{ fontSize: '24px', color: 'var(--color-text)', margin: '0 0 4px 0', minHeight: '33px', display: 'flex', alignItems: 'center' }}>
            {nombreResidente === null ? (
              <span style={{ width: '150px', height: '24px', backgroundColor: 'var(--color-light-gray)', borderRadius: '4px', opacity: 0.5 }}></span>
            ) : (
              `Hola${nombreResidente ? `, ${nombreResidente}` : ''}`
            )}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-gray)', margin: 0, minHeight: '19px', display: 'flex', alignItems: 'center' }}>
            {nombreAsilo === null ? (
              <span style={{ width: '100px', height: '14px', backgroundColor: 'var(--color-light-gray)', borderRadius: '4px', opacity: 0.5, marginTop: '4px' }}></span>
            ) : (
              nombreAsilo
            )}
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
          <i className="fa-solid fa-bell" style={{ fontSize: '20px', color: 'var(--color-white)' }}></i>
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
            onClick={() => navigate('/juegos/' + juego.id)}
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
                fontSize: '28px', // Tamaño del icono
                color: 'var(--color-white)', // Color del icono FontAwesome
              }}
            >
              <i className={juego.icon}></i>
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
