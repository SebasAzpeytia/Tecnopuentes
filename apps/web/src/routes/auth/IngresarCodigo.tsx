import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabaseClient';
import { useSesionStore } from '@/state/useSesionStore';

export default function IngresarCodigo() {
  const navigate = useNavigate();
  const { setSesion } = useSesionStore();
  
  // Estado para los 6 caracteres del código
  const [codigo, setCodigo] = useState(['', '', '', '', '', '']);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Lógica de diseño para inputs tipo OTP
  const handleChange = (index: number, value: string) => {
    // Solo permitir letras y números, y pasarlo a mayúsculas
    const val = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-1);
    const nuevoCodigo = [...codigo];
    nuevoCodigo[index] = val;
    setCodigo(nuevoCodigo);

    // Auto-avanzar al siguiente input si se escribió algo
    if (val && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Regresar al input anterior si presiona retroceso y está vacío
    if (e.key === 'Backspace' && !codigo[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const codigoCompleto = codigo.join('');
    if (codigoCompleto.length !== 6) {
      setError('Por favor, ingresa los 6 caracteres del código.');
      return;
    }

    setCargando(true);
    try {
      // Llamamos a la función segura en la base de datos
      const { data, error: rpcError } = await supabase.rpc('canjear_codigo_invitacion', {
        p_codigo: codigoCompleto,
      });

      if (rpcError) throw rpcError;

      // Si fue exitoso, la función nos devuelve la membresía creada
      const membresia = data as any; 
      
      // Actualizamos la sesión global
      setSesion({
        asiloActivoId: membresia.asilo_id,
        rolActivo: membresia.rol,
      });

      // Redirigir según el rol
      if (membresia.rol === 'residente') {
        navigate('/home');
      } else {
        navigate('/panel');
      }
    } catch (err: any) {
      console.error('Error al canjear código:', err);
      // Extraemos un mensaje amigable
      if (err.message && err.message.includes('inválido')) {
        setError('El código es inválido o ya expiró. Verifica con tu asilo.');
      } else if (err.message && err.message.includes('unique constraint')) {
        setError('Ya perteneces a este asilo.');
      } else {
        setError('Ocurrió un error al canjear el código. Intenta de nuevo.');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '24px',
        boxSizing: 'border-box',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      {/* Botón de regresar opcional si lo necesitan, pero el wireframe no lo muestra. 
          Lo pondremos arriba a la izquierda para poder salir de aquí */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/unirse-asilo')}
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
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {/* Ícono de Llave tipo píldora */}
        <div
          style={{
            width: '60px',
            height: '140px',
            backgroundColor: '#eef2f6',
            borderRadius: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '32px',
          }}
        >
          <span style={{ fontSize: '32px' }}>🔑</span>
        </div>

        <h1
          style={{
            fontSize: '24px',
            color: 'var(--color-text)',
            marginBottom: '12px',
            textAlign: 'center',
          }}
        >
          Ingresa el código de tu asilo
        </h1>
        
        <p
          style={{
            fontSize: '14px',
            color: 'var(--color-gray)',
            textAlign: 'center',
            maxWidth: '280px',
            marginBottom: '40px',
          }}
        >
          Pide este código a tu asilo, cuidador o administrador
        </p>

        {/* Inputs del Código */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '60px' }}>
            {codigo.map((char, idx) => (
              <input
                key={idx}
                ref={(el) => (inputsRef.current[idx] = el)}
                type="text"
                value={char}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                style={{
                  width: '40px',
                  height: '56px',
                  borderRadius: '12px',
                  border: char ? '2px solid var(--color-blue)' : '2px solid var(--color-light-gray)',
                  backgroundColor: 'transparent',
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  fontFamily: 'var(--font-title)',
                  color: 'var(--color-text)',
                  outline: 'none',
                  textTransform: 'uppercase'
                }}
              />
            ))}
          </div>

          {error && (
            <p style={{ color: 'var(--color-orange-dark)', fontSize: '14px', margin: '0 0 16px 0', fontWeight: 600 }}>
              {error}
            </p>
          )}

          <Button 
            type="submit" 
            variante="primario" 
            style={{ width: '100%', marginBottom: '16px' }}
            disabled={cargando}
          >
            {cargando ? 'Validando...' : 'Unirme al asilo'}
          </Button>

          <p style={{ fontSize: '12px', color: 'var(--color-gray)', textAlign: 'center', margin: 0 }}>
            ¿No tienes un código? Contacta a tu asilo
          </p>
        </form>
      </div>
    </div>
  );
}
