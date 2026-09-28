import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AgregarMiembro() {
  const navigate = useNavigate();
  const [rol, setRol] = useState<'Residente' | 'Monitor'>('Residente');
  const [codigo] = useState('A7X92K'); // Mock del código generado

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
            backgroundColor: rol === 'Residente' ? 'var(--color-blue)' : 'var(--color-white)',
            color: rol === 'Residente' ? 'var(--color-white)' : 'var(--color-gray)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            borderRadius: '999px',
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
            backgroundColor: rol === 'Monitor' ? 'var(--color-blue)' : 'var(--color-white)',
            color: rol === 'Monitor' ? 'var(--color-white)' : 'var(--color-gray)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            borderRadius: '999px',
          }}
        >
          Monitor / Personal
        </button>
      </div>

      <p style={{ fontSize: '14px', color: 'var(--color-gray)', lineHeight: '1.5', marginBottom: '32px' }}>
        Comparte este código. La persona lo escribe al unirse y entra a tu asilo con el rol elegido.
      </p>

      {/* Caja del Código */}
      <div style={{ border: '2px dashed var(--color-blue-light)', borderRadius: '24px', padding: '32px', textAlign: 'center', backgroundColor: 'var(--color-white)', marginBottom: '24px' }}>
        <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-gray)', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 16px 0' }}>
          Código de invitación
        </p>
        <h2 style={{ fontSize: '48px', color: 'var(--color-blue)', fontFamily: 'var(--font-title)', letterSpacing: '4px', margin: '0 0 16px 0' }}>
          {codigo}
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--color-gray)', margin: 0 }}>
          Vence en 7 días • Un solo uso
        </p>
      </div>

      {/* Alerta / Tip para Monitor */}
      <div style={{ backgroundColor: '#eef2f6', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: 'auto' }}>
        <span style={{ fontSize: '16px' }}>💡</span>
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text)', lineHeight: '1.5' }}>
          Si eliges Monitor, defines sus permisos en el siguiente paso antes de generar el código.
        </p>
      </div>

      {/* Botones de acción */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '40px' }}>
        <button style={{ width: '100%', padding: '16px', backgroundColor: 'var(--color-blue)', color: 'var(--color-white)', border: 'none', borderRadius: '999px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 10px rgba(29, 69, 158, 0.3)' }}>
          Copiar código
        </button>
        <button style={{ width: '100%', padding: '16px', backgroundColor: 'transparent', border: '2px solid var(--color-orange-dark)', color: 'var(--color-orange-dark)', borderRadius: '999px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>
          Compartir por WhatsApp
        </button>
        <button style={{ background: 'none', border: 'none', color: 'var(--color-blue)', fontSize: '14px', fontWeight: 700, cursor: 'pointer', padding: '8px', marginTop: '8px' }}>
          Generar otro código
        </button>
      </div>
    </div>
  );
}
