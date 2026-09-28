import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InvitarMonitor() {
  const navigate = useNavigate();
  const [nivelAcceso, setNivelAcceso] = useState<'Admin' | 'Personalizado'>('Personalizado');
  const [permisos, setPermisos] = useState({
    dashboard: true,
    miembros: true,
    personalizacion: false,
    reportes: false,
    chat: false,
  });

  const togglePermiso = (key: keyof typeof permisos) => {
    if (nivelAcceso === 'Admin') return; // Bloquear si es admin
    setPermisos(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        fontFamily: 'var(--font-body)',
        boxSizing: 'border-box',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--color-blue)', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-blue)', cursor: 'pointer' }}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 style={{ fontSize: '20px', color: 'var(--color-text)', margin: 0, fontFamily: 'var(--font-title)' }}>
          Invitar monitor
        </h1>
        <button
          onClick={() => navigate(-1)}
          style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-blue)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-white)', cursor: 'pointer' }}
        >
          <i className="fa-solid fa-check"></i>
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '32px' }}>
        
        {/* Datos de contacto */}
        <h2 style={{ fontSize: '16px', color: 'var(--color-text)', margin: '0 0 12px 0', fontFamily: 'var(--font-title)' }}>
          Datos de contacto
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          <input
            type="text"
            placeholder="Correo electrónico o teléfono"
            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-light-gray)', outline: 'none', fontSize: '14px', fontFamily: 'var(--font-body)', boxSizing: 'border-box' }}
          />
          <input
            type="text"
            placeholder="Nombre completo"
            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-light-gray)', outline: 'none', fontSize: '14px', fontFamily: 'var(--font-body)', boxSizing: 'border-box' }}
          />
        </div>

        {/* Nivel de acceso */}
        <h2 style={{ fontSize: '16px', color: 'var(--color-text)', margin: '0 0 12px 0', fontFamily: 'var(--font-title)' }}>
          Nivel de acceso
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          
          <div 
            onClick={() => setNivelAcceso('Admin')}
            style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '16px', border: nivelAcceso === 'Admin' ? '2px solid var(--color-blue)' : '1px solid var(--color-light-gray)', backgroundColor: nivelAcceso === 'Admin' ? '#e8eaf6' : 'var(--color-white)', cursor: 'pointer' }}
          >
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: nivelAcceso === 'Admin' ? '6px solid var(--color-blue)' : '2px solid var(--color-gray)', boxSizing: 'border-box' }}></div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>
                Acceso completo (Administrador)
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-gray)' }}>
                Puede ver todo y administrar miembros, personalización y reportes
              </div>
            </div>
          </div>

          <div 
            onClick={() => setNivelAcceso('Personalizado')}
            style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '16px', border: nivelAcceso === 'Personalizado' ? '2px solid var(--color-blue)' : '1px solid var(--color-light-gray)', backgroundColor: nivelAcceso === 'Personalizado' ? '#e8eaf6' : 'var(--color-white)', cursor: 'pointer' }}
          >
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: nivelAcceso === 'Personalizado' ? '6px solid var(--color-blue)' : '2px solid var(--color-gray)', boxSizing: 'border-box' }}></div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>
                Personalizado
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-gray)' }}>
                Elige exactamente qué puede ver y hacer este monitor
              </div>
            </div>
          </div>

        </div>

        {/* Permisos personalizados */}
        <h2 style={{ fontSize: '16px', color: 'var(--color-text)', margin: '0 0 16px 0', fontFamily: 'var(--font-title)', opacity: nivelAcceso === 'Admin' ? 0.5 : 1 }}>
          Permisos personalizados
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', opacity: nivelAcceso === 'Admin' ? 0.5 : 1, pointerEvents: nivelAcceso === 'Admin' ? 'none' : 'auto' }}>
          
          {[
            { key: 'dashboard', label: 'Ver dashboard', desc: 'Estadísticas y lista de miembros' },
            { key: 'miembros', label: 'Gestionar miembros', desc: 'Agregar o expulsar residentes' },
            { key: 'personalizacion', label: 'Personalización del asilo', desc: 'Editar emojis, imágenes y símbolos' },
            { key: 'reportes', label: 'Ver y generar reportes', desc: 'Exportar reportes de actividad' },
            { key: 'chat', label: 'Moderar chat', desc: 'Ver y moderar mensajes entre residentes' },
          ].map(p => (
            <div key={p.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>
                  {p.label}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-gray)' }}>
                  {p.desc}
                </div>
              </div>
              <div 
                onClick={() => togglePermiso(p.key as any)}
                style={{
                  width: '48px',
                  height: '24px',
                  borderRadius: '999px',
                  backgroundColor: permisos[p.key as keyof typeof permisos] ? 'var(--color-blue)' : 'var(--color-light-gray)',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  flexShrink: 0
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-white)',
                  position: 'absolute',
                  top: '2px',
                  left: permisos[p.key as keyof typeof permisos] ? '26px' : '2px',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }}></div>
              </div>
            </div>
          ))}

        </div>

      </div>

      <div style={{ marginTop: 'auto' }}>
        <button style={{ width: '100%', padding: '16px', backgroundColor: 'var(--color-orange-dark)', color: 'var(--color-white)', border: 'none', borderRadius: '999px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 10px rgba(244, 92, 25, 0.3)' }}>
          Enviar invitación
        </button>
      </div>

    </div>
  );
}
