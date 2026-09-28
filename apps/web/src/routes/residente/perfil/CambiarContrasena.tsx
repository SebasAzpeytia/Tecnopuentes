import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CambiarContrasena() {
  const navigate = useNavigate();
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [repite, setRepite] = useState('');
  const [mostrarActual, setMostrarActual] = useState(false);
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [mostrarRepite, setMostrarRepite] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', padding: '24px', fontFamily: 'var(--font-body)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header con botón regresar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--color-blue)', backgroundColor: 'transparent', color: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 style={{ fontSize: '20px', color: 'var(--color-text)', margin: 0, fontFamily: 'var(--font-title)' }}>
          Cambiar contraseña
        </h1>
      </div>

      <p style={{ fontSize: '14px', color: 'var(--color-gray)', marginBottom: '32px', lineHeight: '1.5' }}>
        Escribe tu contraseña actual y luego elige una nueva.
      </p>

      {/* Formulario */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>Contraseña actual</label>
          <div style={{ position: 'relative' }}>
            <input
              type={mostrarActual ? "text" : "password"}
              value={actual}
              onChange={(e) => setActual(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '16px', paddingRight: '48px', borderRadius: '12px', border: '1px solid var(--color-light-gray)', outline: 'none', fontSize: '14px', fontFamily: 'var(--font-body)', boxSizing: 'border-box' }}
            />
            <button type="button" onClick={() => setMostrarActual(!mostrarActual)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-gray)', cursor: 'pointer' }}>
              <i className={`fa-solid ${mostrarActual ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>Contraseña nueva</label>
          <div style={{ position: 'relative' }}>
            <input
              type={mostrarNueva ? "text" : "password"}
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              style={{ width: '100%', padding: '16px', paddingRight: '48px', borderRadius: '12px', border: '1px solid var(--color-light-gray)', outline: 'none', fontSize: '14px', fontFamily: 'var(--font-body)', boxSizing: 'border-box' }}
            />
            <button type="button" onClick={() => setMostrarNueva(!mostrarNueva)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-gray)', cursor: 'pointer' }}>
              <i className={`fa-solid ${mostrarNueva ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>Repite la contraseña nueva</label>
          <div style={{ position: 'relative' }}>
            <input
              type={mostrarRepite ? "text" : "password"}
              value={repite}
              onChange={(e) => setRepite(e.target.value)}
              placeholder="Escríbela otra vez"
              style={{ width: '100%', padding: '16px', paddingRight: '48px', borderRadius: '12px', border: '1px solid var(--color-light-gray)', outline: 'none', fontSize: '14px', fontFamily: 'var(--font-body)', boxSizing: 'border-box' }}
            />
            <button type="button" onClick={() => setMostrarRepite(!mostrarRepite)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-gray)', cursor: 'pointer' }}>
              <i className={`fa-solid ${mostrarRepite ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>

        {/* Tip Card */}
        <div style={{ backgroundColor: '#eef2f6', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '16px' }}>💡</span>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text)', lineHeight: '1.5' }}>
            Usa algo que recuerdes fácil, como el nombre de tu mascota y tu año favorito.
          </p>
        </div>
      </div>

      <button style={{ width: '100%', padding: '16px', backgroundColor: 'var(--color-blue)', color: 'var(--color-white)', border: 'none', borderRadius: '999px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 10px rgba(29, 69, 158, 0.3)', marginTop: '24px' }}>
        Cambiar contraseña
      </button>

    </div>
  );
}
