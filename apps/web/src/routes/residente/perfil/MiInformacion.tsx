import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

export default function MiInformacion() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('José Ramírez');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [correo, setCorreo] = useState('jose@correo.com');
  const [inicial, setInicial] = useState('J');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        if (user.user_metadata?.nombre_completo) {
          const fullName = user.user_metadata.nombre_completo;
          setNombre(fullName);
          setInicial(fullName.charAt(0).toUpperCase());
        }
        if (user.email) {
          setCorreo(user.email);
        }

        // Obtener fecha de nacimiento de perfiles
        const { data: perfil } = await supabase.from('perfiles').select('fecha_nacimiento').eq('id', user.id).single();
        if (perfil?.fecha_nacimiento) {
          setFechaNacimiento(perfil.fecha_nacimiento);
        }
      }
    });
  }, []);

  const guardarCambios = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('perfiles').update({ fecha_nacimiento: fechaNacimiento || null }).eq('id', user.id);
      // Opcionalmente actualizar metadata si cambia nombre
      if (nombre) {
        await supabase.auth.updateUser({ data: { nombre_completo: nombre } });
        setInicial(nombre.charAt(0).toUpperCase());
      }
      alert('Información actualizada correctamente');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', padding: '24px', fontFamily: 'var(--font-body)', boxSizing: 'border-box' }}>
      
      {/* Header con botón regresar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--color-blue)', backgroundColor: 'transparent', color: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 style={{ fontSize: '20px', color: 'var(--color-text)', margin: 0, fontFamily: 'var(--font-title)' }}>
          Mi información
        </h1>
      </div>

      {/* Avatar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-white)', fontSize: '32px', fontWeight: 'bold', fontFamily: 'var(--font-title)', marginBottom: '16px' }}>
          {inicial}
        </div>
        <button style={{ backgroundColor: 'transparent', border: '1px solid var(--color-blue)', borderRadius: '999px', padding: '8px 16px', color: 'var(--color-blue)', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-solid fa-camera"></i>
          Cambiar foto
        </button>
      </div>

      {/* Formulario */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>Nombre completo</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--color-light-gray)', outline: 'none', fontSize: '14px', fontFamily: 'var(--font-body)', color: 'var(--color-gray)' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>Fecha de nacimiento</label>
          <input
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--color-light-gray)', outline: 'none', fontSize: '14px', fontFamily: 'var(--font-body)', color: 'var(--color-gray)' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>Correo o teléfono</label>
          <input
            type="text"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--color-light-gray)', outline: 'none', fontSize: '14px', fontFamily: 'var(--font-body)', color: 'var(--color-gray)' }}
          />
        </div>
      </div>

      <button 
        onClick={guardarCambios}
        disabled={loading}
        style={{ width: '100%', padding: '16px', backgroundColor: 'var(--color-orange-dark)', color: 'var(--color-white)', border: 'none', borderRadius: '999px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 10px rgba(244, 92, 25, 0.3)', opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Guardando...' : 'Guardar cambios'}
      </button>

    </div>
  );
}
