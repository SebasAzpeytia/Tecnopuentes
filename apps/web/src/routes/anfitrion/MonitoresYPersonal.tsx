import { useNavigate } from 'react-router-dom';

export default function MonitoresYPersonal() {
  const navigate = useNavigate();

  const personal = [
    { id: 1, nombre: 'Rosa Delgado', estado: 'Activo', color: 'var(--color-blue)', rol: 'Administrador', bgRol: 'var(--color-blue)', desc: 'Acceso completo: dashboard, miembros, personalización y reportes' },
    { id: 2, nombre: 'Pedro Sánchez', estado: 'Activo', color: 'var(--color-orange-dark)', rol: 'Personalizado', bgRol: 'var(--color-orange-dark)', desc: 'Puede: ver dashboard, gestionar miembros · No puede: personalización' },
    { id: 3, nombre: 'Lucía Fernández', estado: 'Activo', color: 'var(--color-olive)', rol: 'Personalizado', bgRol: 'var(--color-orange-dark)', desc: 'Puede: solo ver dashboard y reportes' },
    { id: 4, nombre: 'Tomás Vidal', estado: 'Activo', color: 'var(--color-blue-light)', rol: 'Pendiente', bgRol: 'var(--color-light-gray)', colorRol: 'var(--color-white)', desc: 'Invitación enviada - Esperando que acepte' },
  ];

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button
          onClick={() => navigate('/panel')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '1px solid var(--color-blue)',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-blue)',
            cursor: 'pointer',
          }}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 style={{ fontSize: '20px', color: 'var(--color-text)', margin: 0, fontFamily: 'var(--font-title)' }}>
          Monitores y personal
        </h1>
        <button
          onClick={() => navigate('/panel/invitar-monitor')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-orange-dark)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-white)',
            fontSize: '20px',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(244, 92, 25, 0.3)'
          }}
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      <p style={{ fontSize: '14px', color: 'var(--color-gray)', lineHeight: '1.5', marginBottom: '24px' }}>
        Invita personal del asilo y define qué pueden hacer dentro de la app
      </p>

      <h2 style={{ fontSize: '16px', color: 'var(--color-text)', margin: '0 0 16px 0', fontFamily: 'var(--font-title)' }}>
        Personal activo ({personal.length})
      </h2>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto', marginBottom: '32px' }}>
        {personal.map(p => (
          <div key={p.id} style={{ backgroundColor: 'var(--color-white)', borderRadius: '16px', padding: '16px', border: '1px solid var(--color-light-gray)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: p.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-white)', fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-title)' }}>
                  {p.nombre.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)' }}>
                    {p.nombre}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-olive)' }}>
                    {p.estado}
                  </div>
                </div>
              </div>
              <div style={{ backgroundColor: p.bgRol, color: p.colorRol || 'var(--color-white)', fontSize: '12px', fontWeight: 700, padding: '6px 12px', borderRadius: '999px' }}>
                {p.rol}
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-gray)', lineHeight: '1.4' }}>
              {p.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Button */}
      <div style={{ marginTop: 'auto' }}>
        <button
          onClick={() => navigate('/panel/invitar-monitor')}
          style={{ width: '100%', padding: '16px', backgroundColor: 'var(--color-orange-dark)', color: 'var(--color-white)', border: 'none', borderRadius: '999px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 10px rgba(244, 92, 25, 0.3)' }}
        >
          Invitar nuevo monitor
        </button>
      </div>

    </div>
  );
}
