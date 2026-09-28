import BottomNav from '@/components/layout/BottomNav';

export default function Actividad() {
  // Datos mockeados para la V1 (luego se conectarán a sesiones_juego)
  const resumen = [
    { valor: '2.5 h', etiqueta: 'Tiempo hoy', color: 'var(--color-blue)', bg: '#e8f0fe', border: 'var(--color-blue-light)' },
    { valor: '6', etiqueta: 'Días seguidos', color: 'var(--color-orange-dark)', bg: '#fff0e6', border: 'var(--color-peach)' },
    { valor: 'Lotería', etiqueta: 'Tu favorito', color: 'var(--color-olive)', bg: '#f1f8e9', border: '#c5e1a5' },
  ];

  const dias = [
    { dia: 'L', height: '40%', color: 'var(--color-blue-light)' },
    { dia: 'M', height: '70%', color: 'var(--color-blue)' },
    { dia: 'M', height: '30%', color: 'var(--color-blue-light)' },
    { dia: 'J', height: '90%', color: 'var(--color-blue)' },
    { dia: 'V', height: '50%', color: 'var(--color-blue-light)' },
    { dia: 'S', height: '95%', color: 'var(--color-orange)' },
    { dia: 'D', height: '40%', color: 'var(--color-blue-light)' },
  ];

  const juegos = [
    { nombre: 'Lotería', horas: '3.2 h', icon: 'fa-solid fa-table-cells-large', color: 'var(--color-orange)', porcentaje: '80%' },
    { nombre: 'Memorama', horas: '2.0 h', icon: 'fa-solid fa-brain', color: 'var(--color-blue)', porcentaje: '50%' },
    { nombre: 'Solitario', horas: '1.1 h', icon: 'fa-solid fa-clone', color: 'var(--color-olive)', porcentaje: '30%' },
  ];

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        paddingBottom: '100px', // Espacio para el BottomNav
        fontFamily: 'var(--font-body)',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '32px 24px 24px 24px' }}>
        <h1 style={{ fontSize: '28px', color: 'var(--color-text)', margin: '0 0 4px 0' }}>
          Tu actividad
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--color-gray)', margin: 0 }}>
          Así has jugado esta semana
        </p>
      </div>

      {/* Tarjetas de resumen (Scroll horizontal) */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '12px', 
          padding: '0 24px', 
          overflowX: 'auto', 
          paddingBottom: '8px',
          // Ocultar scrollbar
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {resumen.map((item, i) => (
          <div
            key={i}
            style={{
              minWidth: '100px',
              backgroundColor: item.bg,
              border: `1px solid ${item.border}`,
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}
          >
            <span style={{ fontSize: '20px', fontWeight: 800, color: item.color, fontFamily: 'var(--font-title)', marginBottom: '4px' }}>
              {item.valor}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--color-gray)', textAlign: 'center' }}>
              {item.etiqueta}
            </span>
          </div>
        ))}
      </div>

      {/* Gráfica de barras: Esta semana */}
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '18px', color: 'var(--color-text)', margin: '0 0 16px 0' }}>
          Esta semana
        </h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', gap: '8px' }}>
          {dias.map((d, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '8px' }}>
              {/* Barra */}
              <div 
                style={{ 
                  width: '100%', 
                  maxWidth: '32px', 
                  height: d.height, 
                  backgroundColor: d.color, 
                  borderRadius: '8px' 
                }} 
              />
              {/* Etiqueta del día */}
              <span style={{ fontSize: '12px', color: 'var(--color-gray)', fontWeight: 600 }}>
                {d.dia}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Progreso por juego */}
      <div style={{ padding: '0 24px 24px 24px' }}>
        <h2 style={{ fontSize: '18px', color: 'var(--color-text)', margin: '0 0 16px 0' }}>
          Tus juegos
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {juegos.map((juego, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Encabezado del juego */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '20px', textAlign: 'center', color: juego.color }}>
                    <i className={juego.icon}></i>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>
                    {juego.nombre}
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--color-gray)' }}>
                  {juego.horas}
                </span>
              </div>
              
              {/* Barra de progreso */}
              <div style={{ width: '100%', height: '12px', backgroundColor: 'var(--color-light-gray)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: juego.porcentaje, height: '100%', backgroundColor: juego.color, borderRadius: '6px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
