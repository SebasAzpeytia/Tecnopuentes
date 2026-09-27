import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function IniciarSesion() {
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
          Iniciar sesión
        </h1>
      </div>

      <p style={{ fontSize: '14px', color: 'var(--color-gray)', marginBottom: '32px', marginLeft: '56px' }}>
        Ingresa tus datos para continuar
      </p>

      {/* Formulario */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
        <Input 
          type="email" 
          placeholder="Correo electrónico o teléfono" 
        />
        <Input 
          type="password" 
          placeholder="Contraseña" 
        />

        <div style={{ textAlign: 'right', marginTop: '-8px' }}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Navegar a pantalla de recuperar contraseña
            }}
            style={{
              color: 'var(--color-blue)',
              fontSize: '12px',
              fontWeight: 600,
              textDecoration: 'none',
              fontFamily: 'var(--font-title)',
            }}
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <Button
          variante="primario"
          style={{ width: '100%', marginTop: '16px' }}
          onClick={() => {
            // TODO: Integrar lógica de useAuth aquí
          }}
        >
          Entrar
        </Button>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', paddingBottom: '20px', marginTop: '40px' }}>
        <span style={{ color: 'var(--color-gray)', fontSize: '12px', marginRight: '4px' }}>
          ¿No tienes cuenta?
        </span>
        <button
          onClick={() => navigate('/crear-cuenta')}
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
          Crear cuenta
        </button>
      </div>
    </div>
  );
}
