import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavMonitor from '@/components/layout/BottomNavMonitor';

export default function Miembros() {
  const navigate = useNavigate();
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [mostrarModalExpulsar, setMostrarModalExpulsar] = useState(false);
  const [miembroAExpulsar, setMiembroAExpulsar] = useState<any>(null);

  const filtros = [
    { label: 'Todos 32', value: 'Todos' },
    { label: 'Residentes', value: 'Residentes' },
    { label: 'Monitores', value: 'Monitores' },
    { label: 'Pendientes', value: 'Pendientes' },
  ];

  const miembros = [
    { id: 1, nombre: 'María G.', edad: '78', subtitulo: 'En línea', iconoSub: '🟢', color: 'var(--color-orange)', infoDerecha: '6.2 h', tipo: 'Residente' },
    { id: 2, nombre: 'José R.', edad: '82', subtitulo: 'En línea', iconoSub: '🟢', color: 'var(--color-blue)', infoDerecha: '5.4 h', tipo: 'Residente' },
    { id: 3, nombre: 'Carmen T.', edad: '75', subtitulo: 'Sin actividad hace 6 días', iconoSub: '⚠️', subtituloColor: 'var(--color-orange-dark)', color: 'var(--color-olive)', infoDerecha: '0.4 h', tipo: 'Residente' },
    { id: 4, nombre: 'Rosa Delgado', rol: 'Monitor • Administrador', color: 'var(--color-blue)', badge: 'Admin', badgeBg: 'var(--color-blue)', tipo: 'Monitor' },
    { id: 5, nombre: 'Pedro Sánchez', rol: 'Monitor • Personalizado', color: 'var(--color-orange-dark)', badge: 'Monitor', badgeBg: 'var(--color-orange-dark)', tipo: 'Monitor' },
    { id: 6, nombre: 'Tomás Vidal', rol: 'Invitación pendiente de aceptar', color: 'var(--color-blue-light)', badge: 'Pendiente', badgeBg: 'var(--color-blue-light)', tipo: 'Pendiente' },
  ];

  const abrirModal = (miembro: any) => {
    setMiembroAExpulsar(miembro);
    setMostrarModalExpulsar(true);
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
        <div>
          <h1 style={{ fontSize: '24px', color: 'var(--color-text)', margin: '0 0 4px 0', fontFamily: 'var(--font-title)' }}>
            Miembros
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-gray)', margin: 0 }}>
            28 residentes • 4 monitores
          </p>
        </div>
        <button
          onClick={() => navigate('/panel/agregar-miembro')}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-orange-dark)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-white)',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(244, 92, 25, 0.3)',
          }}
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      {/* Buscador */}
      <div style={{ padding: '0 24px', marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
          <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray)' }}></i>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '999px', border: '1px solid var(--color-light-gray)', outline: 'none', fontSize: '14px', fontFamily: 'var(--font-body)', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '8px', padding: '0 24px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', marginBottom: '24px' }}>
        {filtros.map(f => (
          <button
            key={f.value}
            onClick={() => setFiltroActivo(f.value)}
            style={{
              padding: '8px 16px',
              borderRadius: '999px',
              border: filtroActivo === f.value ? 'none' : '1px solid var(--color-light-gray)',
              backgroundColor: filtroActivo === f.value ? 'var(--color-blue)' : 'var(--color-white)',
              color: filtroActivo === f.value ? 'var(--color-white)' : 'var(--color-gray)',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
        {miembros.map(m => (
          <div key={m.id} style={{ backgroundColor: 'var(--color-white)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--color-light-gray)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: m.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-white)', fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-title)', flexShrink: 0 }}>
                {m.nombre.charAt(0)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)' }}>
                  {m.nombre} {m.edad ? `• ${m.edad}` : ''}
                </div>
                <div style={{ fontSize: '12px', color: m.subtituloColor || 'var(--color-gray)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {m.iconoSub && <span>{m.iconoSub}</span>}
                  {m.subtitulo || m.rol}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {m.infoDerecha && (
                <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-blue)', fontFamily: 'var(--font-title)' }}>
                  {m.infoDerecha}
                </span>
              )}
              {m.badge && (
                <div style={{ backgroundColor: m.badgeBg, color: 'var(--color-white)', fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '999px' }}>
                  {m.badge}
                </div>
              )}
              <button 
                onClick={() => abrirModal(m)}
                style={{ background: 'none', border: 'none', color: 'var(--color-gray)', cursor: 'pointer', fontSize: '18px', padding: '4px' }}
              >
                <i className="fa-solid fa-ellipsis"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      <BottomNavMonitor />

      {/* Modal Expulsar */}
      {mostrarModalExpulsar && miembroAExpulsar && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(38, 38, 38, 0.95)',
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
            <div style={{ width: '64px', height: '64px', backgroundColor: miembroAExpulsar.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, color: 'var(--color-white)', fontFamily: 'var(--font-title)', marginBottom: '24px' }}>
              {miembroAExpulsar.nombre.charAt(0)}
            </div>
            <h2 style={{ fontSize: '20px', color: 'var(--color-text)', margin: '0 0 8px 0', fontFamily: 'var(--font-title)' }}>
              ¿Expulsar a {miembroAExpulsar.nombre}?
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-gray)', margin: '0 0 32px 0', lineHeight: '1.5' }}>
              Perderá el acceso al asilo y al chat. Su historial de juego se conserva.
            </p>
            <button
              onClick={() => setMostrarModalExpulsar(false)} // En el futuro hará la llamada a DB
              style={{ width: '100%', padding: '16px', backgroundColor: 'var(--color-orange-dark)', color: 'var(--color-white)', border: 'none', borderRadius: '999px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', marginBottom: '16px' }}
            >
              Sí, expulsar
            </button>
            <button
              onClick={() => setMostrarModalExpulsar(false)}
              style={{ width: '100%', padding: '16px', backgroundColor: 'transparent', border: '2px solid var(--color-blue)', color: 'var(--color-blue)', borderRadius: '999px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', marginBottom: '16px' }}
            >
              Cancelar
            </button>
            <button
              onClick={() => setMostrarModalExpulsar(false)}
              style={{ background: 'none', border: 'none', color: 'var(--color-blue)', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
            >
              Mejor suspender temporalmente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
