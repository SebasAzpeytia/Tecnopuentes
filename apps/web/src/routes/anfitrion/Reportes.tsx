import { useState } from 'react';
import BottomNavMonitor from '@/components/layout/BottomNavMonitor';

export default function Reportes() {
  const [nombreAsilo] = useState('Asilo Los Álamos'); // Mock V1

  const tiposReporte = [
    { id: 1, titulo: 'Actividad general', desc: 'Resumen de horas jugadas y juegos más populares del asilo', icono: 'fa-solid fa-chart-line', color: 'var(--color-blue)' },
    { id: 2, titulo: 'Individual por residente', desc: 'Historial, progreso y juego favorito de una persona', icono: 'fa-solid fa-user', color: 'var(--color-orange-dark)' },
    { id: 3, titulo: 'Bienestar y alertas', desc: 'Inactividad prolongada o uso excesivo de pantalla', icono: 'fa-solid fa-heart', color: 'var(--color-peach)' },
    { id: 4, titulo: 'Uso de la plataforma', desc: 'Errores, accesos y actividad del chat entre residentes', icono: 'fa-solid fa-desktop', color: 'var(--color-olive)' },
  ];

  const historial = [
    { id: 1, titulo: 'Actividad general - Semana 38', fecha: '19 sep 2026', formato: 'PDF', color: 'var(--color-orange-dark)' },
    { id: 2, titulo: 'Reporte de María G.', fecha: '12 sep 2026', formato: 'PDF', color: 'var(--color-orange-dark)' },
    { id: 3, titulo: 'Uso de plataforma - Agosto', fecha: '01 sep 2026', formato: 'XLS', color: 'var(--color-olive)' },
  ];

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px 24px 16px 24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', color: 'var(--color-text)', margin: '0 0 4px 0', fontFamily: 'var(--font-title)' }}>
            Reportes
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-gray)', margin: 0 }}>
            {nombreAsilo}
          </p>
        </div>
        <button
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-blue-light)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-white)',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <i className="fa-solid fa-gear" style={{ fontSize: '18px' }}></i>
        </button>
      </div>

      {/* Filtros rápidos */}
      <div style={{ display: 'flex', gap: '8px', padding: '0 24px', marginBottom: '24px' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '999px', backgroundColor: 'var(--color-blue)', color: 'var(--color-white)', border: 'none', fontSize: '14px', fontWeight: 700 }}>
          <span>📅</span> Últimos 7 días
        </button>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '999px', backgroundColor: 'transparent', color: 'var(--color-gray)', border: '1px solid var(--color-light-gray)', fontSize: '14px', fontWeight: 700 }}>
          <span>👥</span> Todos
        </button>
      </div>

      {/* Tipos de reporte */}
      <div style={{ padding: '0 24px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', color: 'var(--color-text)', margin: '0 0 16px 0', fontFamily: 'var(--font-title)' }}>
          Tipos de reporte
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tiposReporte.map((tipo) => (
            <button
              key={tipo.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                backgroundColor: 'var(--color-white)',
                border: '1px solid var(--color-light-gray)',
                borderRadius: '16px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: tipo.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-white)', fontSize: '20px', flexShrink: 0 }}>
                  <i className={tipo.icono}></i>
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>
                    {tipo.titulo}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-gray)', lineHeight: '1.4' }}>
                    {tipo.desc}
                  </div>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right" style={{ color: 'var(--color-gray)', fontSize: '12px', marginLeft: '16px' }}></i>
            </button>
          ))}
        </div>
      </div>

      {/* Botón generar */}
      <div style={{ padding: '0 24px', marginBottom: '32px' }}>
        <button style={{ width: '100%', padding: '16px', backgroundColor: 'var(--color-orange-dark)', color: 'var(--color-white)', border: 'none', borderRadius: '999px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 10px rgba(244, 92, 25, 0.3)' }}>
          Generar nuevo reporte
        </button>
      </div>

      {/* Historial */}
      <div style={{ padding: '0 24px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', color: 'var(--color-text)', margin: 0, fontFamily: 'var(--font-title)' }}>
            Historial
          </h2>
          <button style={{ background: 'none', border: 'none', color: 'var(--color-blue)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            Ver todos
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {historial.map((hist) => (
            <div key={hist.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: hist.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-white)', fontSize: '12px', fontWeight: 800, fontFamily: 'var(--font-title)' }}>
                  {hist.formato}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>
                    {hist.titulo}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-gray)' }}>
                    {hist.fecha}
                  </div>
                </div>
              </div>
              <button style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#e8eaf6', border: 'none', color: 'var(--color-blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <i className="fa-solid fa-arrow-down"></i>
              </button>
            </div>
          ))}
        </div>
      </div>

      <BottomNavMonitor />
    </div>
  );
}
