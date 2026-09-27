import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function CrearCuenta() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '24px',
        boxSizing: 'border-box',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      {/* Header: Botón regresar y Título */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '20px', marginBottom: '8px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '1px solid var(--color-blue)',
            backgroundColor: 'transparent',
            color: 'var(--color-blue)',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          ←
        </button>
        <h1 style={{ fontSize: '24px', margin: 0, color: 'var(--color-text)' }}>
          Crear cuenta
        </h1>
      </div>

      <p style={{ fontSize: '14px', color: 'var(--color-gray)', marginBottom: '32px', marginLeft: '56px' }}>
        Únete a TecnoPuentes en pocos pasos
      </p>

      {/* Formulario */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
        <Input 
          type="text" 
          placeholder="Nombre completo" 
        />
        <Input 
          type="email" 
          placeholder="Correo electrónico o teléfono" 
        />
        <Input 
          type="password" 
          placeholder="Contraseña" 
        />
        <Input 
          type="password" 
          placeholder="Confirmar contraseña" 
        />

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '4px' }}>
          <input 
            type="checkbox" 
            style={{ 
              width: '18px', 
              height: '18px', 
              accentColor: 'var(--color-blue)',
              cursor: 'pointer'
            }} 
          />
          <span style={{ fontSize: '12px', color: 'var(--color-gray)', fontWeight: 600 }}>
            Acepto los términos y condiciones
          </span>
        </label>

        <Button
          variante="secundario" /* El naranja según el diseño */
          style={{ width: '100%', marginTop: '8px' }}
          onClick={() => {
            // TODO: Integrar lógica de crear cuenta
          }}
        >
          Crear cuenta
        </Button>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', paddingBottom: '20px', marginTop: '40px' }}>
        <span style={{ color: 'var(--color-gray)', fontSize: '12px', marginRight: '4px' }}>
          ¿Ya tienes cuenta?
        </span>
        <button
          onClick={() => navigate('/iniciar-sesion')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-blue)',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer',
            padding: 0,
            fontFamily: 'var(--font-title)',
          }}
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}
