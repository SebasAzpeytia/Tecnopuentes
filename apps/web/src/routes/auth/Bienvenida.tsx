import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export default function Bienvenida() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        padding: '40px 24px',
        boxSizing: 'border-box',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      {/* Contenedor central (Logo + Ilustración) que ocupa el espacio disponible */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '48px', // Separación fija entre el logo y la imagen
        }}
      >
        {/* Sección Logo */}
        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '36px',
              lineHeight: '1.1',
              margin: 0,
            }}
          >
            <span style={{ color: 'var(--color-blue)', display: 'block' }}>
              Tecno
            </span>
            <span style={{ color: 'var(--color-orange)', display: 'block' }}>
              Puentes
            </span>
          </h1>
        </div>

        {/* Sección Ilustración Central */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          {/* Contenedor tipo píldora (placeholder para la ilustración del puente) */}
          <div
            style={{
              width: '100px',
              height: '180px',
              backgroundColor: '#E8ECF4',
              borderRadius: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#2b3956',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
              }}
            >
              <i className="fa-solid fa-bridge-water" style={{ fontSize: '40px', color: 'var(--color-peach)' }}></i>
            </div>
          </div>

          <p
            style={{
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: '1.4',
              margin: 0,
              maxWidth: '220px',
              color: 'var(--color-text)',
            }}
          >
            Conectando generaciones a través de la tecnología
          </p>
        </div>
      </div>

      {/* Sección Botones (Anclados al fondo) */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          paddingBottom: '20px',
        }}
      >
        <Button
          variante="primario"
          style={{ width: '100%' }}
          onClick={() => navigate('/iniciar-sesion')}
        >
          Iniciar sesión
        </Button>
        <Button
          variante="contorno"
          style={{ width: '100%' }}
          onClick={() => navigate('/crear-cuenta')}
        >
          Crear cuenta
        </Button>
      </div>
    </div>
  );
}
