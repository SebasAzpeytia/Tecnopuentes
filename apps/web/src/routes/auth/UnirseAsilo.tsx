import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

export default function UnirseAsilo() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState<string>('');

  useEffect(() => {
    // Obtenemos el nombre del usuario directamente de su sesión de Supabase
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.nombre_completo) {
        // Tomamos solo el primer nombre para que se vea más amigable
        const primerNombre = user.user_metadata.nombre_completo.split(' ')[0];
        setNombre(primerNombre);
      }
    });
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '24px',
        boxSizing: 'border-box',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      <h1
        style={{
          fontSize: '28px',
          color: 'var(--color-text)',
          marginBottom: '8px',
          textAlign: 'center',
        }}
      >
        ¡Ya casi{nombre ? `, ${nombre}` : ''}!
      </h1>
      <p
        style={{
          fontSize: '14px',
          color: 'var(--color-gray)',
          textAlign: 'center',
          maxWidth: '260px',
          marginBottom: '40px',
        }}
      >
        Elige cómo quieres continuar en TecnoPuentes
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
        {/* Tarjeta: Tengo código */}
        <button
          onClick={() => navigate('/ingresar-codigo')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            backgroundColor: 'var(--color-white)',
            border: '2px solid var(--color-blue-light)',
            borderRadius: 'var(--radius-card)',
            padding: '20px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.03)',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              minWidth: '48px',
              backgroundColor: 'var(--color-blue)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <i className="fa-solid fa-key" style={{ color: '#FDE047', fontSize: '20px' }}></i>
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: 'var(--color-text)' }}>
              Tengo un código de invitación
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-gray)', lineHeight: '1.4' }}>
              Únete como residente o monitor de un asilo ya registrado
            </p>
          </div>
        </button>

        {/* Tarjeta: Registrar asilo */}
        <button
          onClick={() => navigate('/registrar-asilo')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            backgroundColor: 'var(--color-white)',
            border: '2px solid var(--color-peach)',
            borderRadius: 'var(--radius-card)',
            padding: '20px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.03)',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              minWidth: '48px',
              backgroundColor: 'var(--color-orange)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <i className="fa-solid fa-house" style={{ color: 'var(--color-bg)', fontSize: '20px' }}></i>
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: 'var(--color-text)' }}>
              Quiero registrar mi asilo
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-gray)', lineHeight: '1.4' }}>
              Crea un nuevo espacio como dueño o administrador
            </p>
          </div>
        </button>
      </div>

      {/* Botón para cerrar sesión */}
      <div style={{ marginTop: '32px' }}>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            // El useEffect en App.tsx detectará el cambio y limpiará el estado global,
            // pero podemos forzar la navegación por precaución.
            navigate('/bienvenida');
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-gray)',
            fontSize: '14px',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontFamily: 'var(--font-body)',
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
