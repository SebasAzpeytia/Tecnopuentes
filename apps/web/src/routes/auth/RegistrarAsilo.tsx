import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabaseClient';
import { useSesionStore } from '@/state/useSesionStore';

export default function RegistrarAsilo() {
  const navigate = useNavigate();
  const { usuarioId, setSesion } = useSesionStore();

  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nombre.trim() || !direccion.trim()) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (!usuarioId) {
      setError('No hay un usuario activo. Por favor, inicia sesión nuevamente.');
      return;
    }

    setCargando(true);

    try {
      // 1. Crear el asilo
      const { data: asilo, error: asiloError } = await supabase
        .from('asilos')
        .insert({
          nombre,
          direccion,
          creado_por: usuarioId,
        })
        .select()
        .single();

      if (asiloError) throw asiloError;

      // 2. Vincular al creador como Anfitrión
      const { error: miembroError } = await supabase
        .from('asilo_miembros')
        .insert({
          usuario_id: usuarioId,
          asilo_id: asilo.id,
          rol: 'anfitrion',
          estado: 'activo'
        });

      if (miembroError) throw miembroError;

      // 3. Actualizar estado global
      setSesion({ asiloActivoId: asilo.id, rolActivo: 'anfitrion' });

      // 4. Redirigir al panel
      navigate('/panel');
    } catch (err: any) {
      console.error('Error al registrar asilo:', err);
      setError(err.message || 'Ocurrió un error al registrar el asilo.');
    } finally {
      setCargando(false);
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
      {/* Header */}
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
          Registrar mi asilo
        </h1>
      </div>

      <p style={{ fontSize: '14px', color: 'var(--color-gray)', marginBottom: '32px', marginLeft: '56px' }}>
        Crea el espacio de tu residencia para invitar a residentes y personal
      </p>

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
            Nombre del asilo
          </label>
          <Input 
            type="text" 
            placeholder="Ej. Asilo Los Álamos" 
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
            Dirección
          </label>
          <Input 
            type="text" 
            placeholder="Calle, número, colonia, ciudad" 
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>

        {error && (
          <p style={{ color: 'var(--color-orange-dark)', fontSize: '14px', margin: 0, fontWeight: 600 }}>
            {error}
          </p>
        )}

        {/* Tarjeta Informativa "Serás el Anfitrión" */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            backgroundColor: '#eef2f6',
            borderRadius: '16px',
            padding: '20px',
            marginTop: '8px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              minWidth: '40px',
              backgroundColor: '#3b0764',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '20px' }}>👑</span>
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--color-text)' }}>
              Serás el Anfitrión
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-gray)', lineHeight: '1.4' }}>
              Podrás ver estadísticas, invitar residentes y monitores con un código, y personalizar los juegos de tu asilo.
            </p>
          </div>
        </div>

        <div style={{ flex: 1 }}></div>

        <Button 
          type="submit" 
          variante="secundario" 
          style={{ width: '100%' }}
          disabled={cargando}
        >
          {cargando ? 'Registrando...' : 'Registrar mi asilo'}
        </Button>
      </form>

      <div style={{ textAlign: 'center', paddingBottom: '20px', marginTop: '24px' }}>
        <span style={{ color: 'var(--color-gray)', fontSize: '12px', marginRight: '4px' }}>
          ¿Tienes un código?
        </span>
        <button
          onClick={() => navigate('/unirse-asilo')}
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
          Unirme a un asilo
        </button>
      </div>
    </div>
  );
}
