import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AgregarMiembro() {
  const navigate = useNavigate();
  const [rol, setRol] = useState<'Residente' | 'Monitor'>('Residente');
  const [codigo] = useState('B3K84M'); // Mock del código generado

  const [nivelAcceso, setNivelAcceso] = useState<'Admin' | 'Personalizado'>('Admin');
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--color-blue)', backgroundColor: 'transparent', color: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 style={{ fontSize: '20px', color: 'var(--color-text)', margin: 0, fontFamily: 'var(--font-title)' }}>
          Agregar miembro
        </h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '32px' }}>
        <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '16px' }}>
          ¿A quién vas a invitar?
        </p>

        {/* Toggle Residente / Monitor */}
        <div style={{ display: 'flex', borderRadius: '999px', border: '1px solid var(--color-light-gray)', overflow: 'hidden', marginBottom: '24px' }}>
          <button
            onClick={() => setRol('Residente')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              backgroundColor: rol === 'Residente' ? 'var(--color-white)' : 'transparent',
              color: rol === 'Residente' ? 'var(--color-blue)' : 'var(--color-gray)',
              borderRight: '1px solid var(--color-light-gray)',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              borderRadius: rol === 'Residente' ? '999px' : '0',
              boxShadow: rol === 'Residente' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            Residente
          </button>
          <button
            onClick={() => setRol('Monitor')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              backgroundColor: rol === 'Monitor' ? 'var(--color-blue)' : 'transparent',
              color: rol === 'Monitor' ? 'var(--color-white)' : 'var(--color-gray)',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              borderRadius: rol === 'Monitor' ? '999px' : '0',
              boxShadow: rol === 'Monitor' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            Monitor / Personal
          </button>
        </div>

        {/* Configuración de Permisos (Solo para Monitor) */}
        {rol === 'Monitor' && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', color: 'var(--color-text)', margin: '0 0 12px 0', fontFamily: 'var(--font-title)' }}>
              Nivel de acceso
            </h2>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <div 
                onClick={() => setNivelAcceso('Admin')}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', borderRadius: '16px', border: nivelAcceso === 'Admin' ? '2px solid var(--color-blue)' : '1px solid var(--color-light-gray)', backgroundColor: 'var(--color-white)', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: nivelAcceso === 'Admin' ? '5px solid var(--color-blue)' : '2px solid var(--color-gray)', boxSizing: 'border-box' }}></div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>Administrador</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-gray)', marginLeft: '24px' }}>
                  Acceso completo a todo
                </div>
              </div>

              <div 
                onClick={() => setNivelAcceso('Personalizado')}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', borderRadius: '16px', border: nivelAcceso === 'Personalizado' ? '2px solid var(--color-blue)' : '1px solid var(--color-light-gray)', backgroundColor: 'var(--color-white)', cursor: 'pointer', boxShadow: nivelAcceso === 'Personalizado' ? '0 0 0 4px rgba(29, 69, 158, 0.1)' : 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: nivelAcceso === 'Personalizado' ? '5px solid var(--color-blue)' : '2px solid var(--color-gray)', boxSizing: 'border-box' }}></div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>Personalizado</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-gray)', marginLeft: '24px' }}>
                  Tú eliges qué puede hacer
                </div>
              </div>
            </div>

            <h2 style={{ fontSize: '16px', color: 'var(--color-text)', margin: '0 0 16px 0', fontFamily: 'var(--font-title)' }}>
              Permisos
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderRadius: '16px', padding: '16px', opacity: nivelAcceso === 'Admin' ? 0.5 : 1, pointerEvents: nivelAcceso === 'Admin' ? 'none' : 'auto' }}>
              {[
                { key: 'dashboard', label: 'Ver dashboard', desc: 'Estadísticas y lista de miembros' },
                { key: 'miembros', label: 'Gestionar miembros', desc: 'Agregar o expulsar residentes' },
                { key: 'personalizacion', label: 'Personalización', desc: 'Editar emojis, imágenes y símbolos' },
                { key: 'reportes', label: 'Reportes', desc: 'Ver y generar reportes' },
                { key: 'chat', label: 'Moderar chat', desc: 'Ver y borrar mensajes' },
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
                      width: '44px',
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
                      left: permisos[p.key as keyof typeof permisos] ? '22px' : '2px',
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mensaje descriptivo para Residente */}
        {rol === 'Residente' && (
          <p style={{ fontSize: '14px', color: 'var(--color-gray)', lineHeight: '1.5', marginBottom: '24px' }}>
            Comparte este código. La persona lo escribe al unirse y entra a tu asilo como residente.
          </p>
        )}

        {/* Caja del Código (Se muestra siempre, pero se empuja hacia abajo si hay permisos) */}
        <div style={{ border: '2px dashed var(--color-blue-light)', borderRadius: '24px', padding: '24px', textAlign: 'center', backgroundColor: 'var(--color-white)' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-gray)', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
            Código de invitación
          </p>
          <h2 style={{ fontSize: '40px', color: 'var(--color-blue)', fontFamily: 'var(--font-title)', letterSpacing: '4px', margin: '0 0 12px 0' }}>
            {codigo}
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--color-gray)', margin: 0 }}>
            Vence en 7 días • Un solo uso
          </p>
        </div>
      </div>

      {/* Botones de acción */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexShrink: 0 }}>
        <button style={{ flex: 1, padding: '16px', backgroundColor: 'var(--color-blue)', color: 'var(--color-white)', border: 'none', borderRadius: '999px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 10px rgba(29, 69, 158, 0.3)' }}>
          Copiar código
        </button>
        <button style={{ flex: 1, padding: '16px', backgroundColor: 'var(--color-white)', border: '2px solid var(--color-orange-dark)', color: 'var(--color-orange-dark)', borderRadius: '999px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
          Compartir
        </button>
      </div>
    </div>
  );
}
