import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/features/auth/useAuth';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/layout/BottomNav';
import { useSesionStore } from '@/state/useSesionStore';

export default function Perfil() {
  const navigate = useNavigate();
  const { cerrarSesion } = useAuth();
  const { asiloActivoId } = useSesionStore();
  const [nombre, setNombre] = useState('Residente');
  const [inicial, setInicial] = useState('R');
  const [nombreAsilo, setNombreAsilo] = useState('Tu asilo');
  const [mostrarModalSalir, setMostrarModalSalir] = useState(false);

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
    { label: 'Editar mi información', icon: 'fa-solid fa-user', color: 'var(--color-blue)', path: '/perfil/informacion' },
    { label: 'Cambiar contraseña', icon: 'fa-solid fa-lock', color: 'var(--color-orange)', path: '/perfil/contrasena' },
    { label: 'Notificaciones', icon: 'fa-solid fa-bell', color: 'var(--color-olive)', path: '/perfil/notificaciones' },
    { label: 'Ayuda y soporte', icon: 'fa-solid fa-circle-question', color: 'var(--color-blue-light)', path: '/perfil/ayuda' },
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
            onClick={() => navigate(opcion.path)}
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
        onClick={() => setMostrarModalSalir(true)}
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

      {/* Modal de Cerrar Sesión */}
      {mostrarModalSalir && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(38, 38, 38, 0.95)', // Fondo oscuro como el wireframe
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--color-white)',
            borderRadius: '32px',
            padding: '32px 24px',
            width: '100%',
            maxWidth: '340px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-peach)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '24px' }}>
              👋
            </div>
            <h2 style={{ fontSize: '20px', color: 'var(--color-text)', margin: '0 0 8px 0', fontFamily: 'var(--font-title)' }}>
              ¿Quieres cerrar sesión?
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-gray)', margin: '0 0 32px 0', lineHeight: '1.5' }}>
              Podrás volver a entrar cuando quieras con tu correo y contraseña.
            </p>
            <button
              onClick={async () => await cerrarSesion()}
              style={{ width: '100%', padding: '16px', backgroundColor: 'var(--color-orange-dark)', color: 'var(--color-white)', border: 'none', borderRadius: '999px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', marginBottom: '16px' }}
            >
              Sí, cerrar sesión
            </button>
            <button
              onClick={() => setMostrarModalSalir(false)}
              style={{ width: '100%', padding: '16px', backgroundColor: 'transparent', border: '2px solid var(--color-blue)', color: 'var(--color-blue)', borderRadius: '999px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}
            >
              No, quedarme aquí
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
