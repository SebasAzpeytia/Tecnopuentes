import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/features/auth/useAuth';
import BottomNav from '@/components/layout/BottomNav';
import { useSesionStore } from '@/state/useSesionStore';

export default function Perfil() {
  const { cerrarSesion } = useAuth();
  const { asiloActivoId } = useSesionStore();
  const [nombre, setNombre] = useState('Residente');
  const [inicial, setInicial] = useState('R');
  const [nombreAsilo, setNombreAsilo] = useState('Tu asilo');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.nombre_completo) {
        const fullName = user.user_metadata.nombre_completo;
        setNombre(fullName);
        setInicial(fullName.charAt(0).toUpperCase());
      }
    });

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

  const opcionesMenu = [
    { label: 'Editar mi información', icon: 'fa-solid fa-user', color: 'var(--color-blue)' },
    { label: 'Cambiar contraseña', icon: 'fa-solid fa-lock', color: 'var(--color-orange)' },
    { label: 'Notificaciones', icon: 'fa-solid fa-bell', color: 'var(--color-olive)' },
    { label: 'Ayuda y soporte', icon: 'fa-solid fa-circle-question', color: 'var(--color-blue-light)' },
  ];

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        fontFamily: 'var(--font-body)',
        boxSizing: 'border-box',
        padding: '40px 24px 120px 24px', // Espacio abajo para BottomNav
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Avatar e Info Principal */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '40px',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '100px', // Estilo "píldora" alto del wireframe
            backgroundColor: 'var(--color-blue)',
            borderRadius: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-white)',
            fontSize: '40px',
            fontWeight: 'bold',
            fontFamily: 'var(--font-title)',
            marginBottom: '16px',
          }}
        >
          {inicial}
        </div>
        <h1 style={{ fontSize: '24px', color: 'var(--color-text)', margin: '0 0 4px 0', fontFamily: 'var(--font-title)' }}>
          {nombre}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--color-gray)', margin: 0 }}>
          {nombreAsilo}
        </p>
      </div>

      {/* Lista de Opciones */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
        {opcionesMenu.map((opcion, idx) => (
          <button
            key={idx}
            style={{
              backgroundColor: 'var(--color-white)',
              border: 'none',
              borderRadius: '20px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: opcion.color,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-white)',
                  fontSize: '16px',
                }}
              >
                <i className={opcion.icon}></i>
              </div>
              <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text)' }}>
                {opcion.label}
              </span>
            </div>
            <i className="fa-solid fa-chevron-right" style={{ color: 'var(--color-gray)', fontSize: '14px' }}></i>
          </button>
        ))}
      </div>

      {/* Botón de Cerrar Sesión */}
      <button
        onClick={async () => {
          await cerrarSesion();
          // El App.tsx nos redirigirá automáticamente a /bienvenida
        }}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: 'transparent',
          border: '2px solid var(--color-orange)',
          borderRadius: '999px',
          color: 'var(--color-orange-dark)',
          fontSize: '16px',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Cerrar sesión
      </button>

      <BottomNav />
    </div>
  );
}
