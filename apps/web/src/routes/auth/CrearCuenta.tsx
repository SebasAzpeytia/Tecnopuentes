import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/features/auth/useAuth';

export default function CrearCuenta() {
  const navigate = useNavigate();
  const { crearCuenta } = useAuth();

  const [nombre, setNombre] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [aceptoTerminos, setAceptoTerminos] = useState(false);
  
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nombre || !email || !password || !confirmPassword || !fechaNacimiento) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!aceptoTerminos) {
      setError('Debes aceptar los términos y condiciones.');
      return;
    }

    setCargando(true);
    const { data, error: authError } = await crearCuenta(email, password, nombre);
    setCargando(false);

    if (authError) {
      setError(authError.message || 'Ocurrió un error al crear la cuenta.');
      return;
    }

    // Supabase tiene activa por defecto la protección "Evitar enumeración de correos".
    // Esto hace que si intentas registrar un correo que YA EXISTE, Supabase finge que tuvo éxito
    // (no devuelve error), pero devuelve un usuario sin "identidades".
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      setError('Este correo electrónico ya está registrado. Intenta iniciar sesión.');
      return;
    }

    // Actualizar la fecha de nacimiento en el perfil
    if (data.user) {
      const { supabase } = await import('@/lib/supabaseClient');
      await supabase.from('perfiles').update({ fecha_nacimiento: fechaNacimiento }).eq('id', data.user.id);
    }

    // Si llegamos aquí, la cuenta SÍ se creó de verdad.
    // Si Supabase requiere confirmación de correo, la sesión será null al inicio.
    if (!data.session) {
      alert('¡Cuenta creada! Por favor revisa tu correo electrónico para confirmarla antes de iniciar sesión.');
      navigate('/iniciar-sesion');
    } else {
      // Como desactivaste la confirmación de correos, la sesión ya viene activa.
      // App.tsx detectará la sesión automáticamente y nos mandará al flujo de UnirseAsilo.
      // (No necesitamos hacer nada más aquí).
    }
  };

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
          type="button"
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
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
        <Input 
          type="text" 
          placeholder="Nombre completo" 
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '12px', color: 'var(--color-gray)', marginLeft: '12px', fontWeight: 600 }}>Fecha de nacimiento</label>
          <Input 
            type="date" 
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
          />
        </div>
        <Input 
          type="email" 
          placeholder="Correo electrónico o teléfono" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input 
          type="password" 
          placeholder="Contraseña" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input 
          type="password" 
          placeholder="Confirmar contraseña" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '4px' }}>
          <input 
            type="checkbox" 
            checked={aceptoTerminos}
            onChange={(e) => setAceptoTerminos(e.target.checked)}
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

        {error && (
          <p style={{ color: 'var(--color-orange-dark)', fontSize: '14px', margin: 0, fontWeight: 600 }}>
            {error}
          </p>
        )}

        <Button
          type="submit"
          variante="secundario"
          style={{ width: '100%', marginTop: '8px' }}
          disabled={cargando}
        >
          {cargando ? 'Cargando...' : 'Crear cuenta'}
        </Button>
      </form>

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
