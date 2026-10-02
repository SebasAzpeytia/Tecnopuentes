import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useSesionStore } from '@/state/useSesionStore';

function generarCodigoAleatorio() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let resultado = '';
  for (let i = 0; i < 6; i++) {
    resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return resultado;
}

export default function AgregarMiembro() {
  const navigate = useNavigate();
  const asiloActivoId = useSesionStore(state => state.asiloActivoId);
  
  const [rol, setRol] = useState<'Residente' | 'Monitor'>('Residente');
  const [nivelAcceso, setNivelAcceso] = useState<'Admin' | 'Personalizado'>('Admin');
  const [permisos, setPermisos] = useState({
    ver_dashboard: true,
    gestionar_miembros: true,
    personalizacion: false,
    ver_reportes: false,
    moderar_chat: false,
  });

  const [codigoData, setCodigoData] = useState<{ id: string; codigo: string } | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [expiracion, setExpiracion] = useState('7'); // '1', '7', '30', 'never'
  const isFirstMount = useRef(true);

  const togglePermiso = (key: keyof typeof permisos) => {
    if (nivelAcceso === 'Admin') return; // Bloquear si es admin
    setPermisos(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // 1. Efecto de actualización (cuando cambian los permisos/rol)
  useEffect(() => {
    // Evitamos actualizar en el primer render (cuando apenas se está creando)
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    async function actualizarCodigo() {
      if (!codigoData) return;

      const permisosAEnviar = rol === 'Monitor' 
        ? (nivelAcceso === 'Admin' 
            ? { ver_dashboard: true, gestionar_miembros: true, personalizacion: true, ver_reportes: true, moderar_chat: true } 
            : permisos)
        : null;

      let fechaExpiracion = null;
      if (expiracion !== 'never') {
        fechaExpiracion = new Date();
        fechaExpiracion.setDate(fechaExpiracion.getDate() + parseInt(expiracion));
      }

      const { error } = await supabase.from('codigos_invitacion')
        .update({
          rol_asignado: rol.toLowerCase(),
          permisos_predefinidos: permisosAEnviar,
          expira_en: fechaExpiracion ? fechaExpiracion.toISOString() : null,
        })
        .eq('id', codigoData.id);

      if (error) {
        console.error('Error al actualizar código:', error);
      }
    }

    // Usar un debounce ligero para no saturar si pican rápido los switches
    const timer = setTimeout(() => actualizarCodigo(), 300);
    return () => clearTimeout(timer);
  }, [rol, nivelAcceso, permisos, expiracion, codigoData]);

  async function generarCodigo() {
    if (!asiloActivoId) return;
    
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const nuevoCodigo = generarCodigoAleatorio();
    
    let fechaExpiracion = null;
    if (expiracion !== 'never') {
      fechaExpiracion = new Date();
      fechaExpiracion.setDate(fechaExpiracion.getDate() + parseInt(expiracion));
    }

    const permisosAEnviar = rol === 'Monitor' 
      ? (nivelAcceso === 'Admin' 
          ? { ver_dashboard: true, gestionar_miembros: true, personalizacion: true, ver_reportes: true, moderar_chat: true } 
          : permisos)
      : null;

    const { data, error } = await supabase.from('codigos_invitacion').insert({
      codigo: nuevoCodigo,
      asilo_id: asiloActivoId,
      rol_asignado: rol.toLowerCase(),
      permisos_predefinidos: permisosAEnviar,
      creado_por: userData.user.id,
      expira_en: fechaExpiracion ? fechaExpiracion.toISOString() : null,
    }).select().single();

    if (error) {
      console.error('Error al generar código:', error);
    } else if (data) {
      setCodigoData({ id: data.id, codigo: data.codigo });
    }
  }

  const copiarAlPortapapeles = async () => {
    if (!codigoData) return;
    try {
      await navigator.clipboard.writeText(codigoData.codigo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error('Error al copiar: ', err);
    }
  };

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

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '32px' }}>
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
              backgroundColor: rol === 'Residente' ? 'var(--color-white)' : 'transparent',
              color: rol === 'Residente' ? 'var(--color-blue)' : 'var(--color-gray)',
              borderRight: '1px solid var(--color-light-gray)',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              borderRadius: rol === 'Residente' ? '999px' : '0',
              boxShadow: rol === 'Residente' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s',
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
              backgroundColor: rol === 'Monitor' ? 'var(--color-blue)' : 'transparent',
              color: rol === 'Monitor' ? 'var(--color-white)' : 'var(--color-gray)',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              borderRadius: rol === 'Monitor' ? '999px' : '0',
              boxShadow: rol === 'Monitor' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            Monitor / Personal
          </button>
        </div>

        {/* Configuración de Permisos (Solo para Monitor) */}
        {rol === 'Monitor' && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', color: 'var(--color-text)', margin: '0 0 12px 0', fontFamily: 'var(--font-title)' }}>
              Nivel de acceso
            </h2>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <div 
                onClick={() => setNivelAcceso('Admin')}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', borderRadius: '16px', border: nivelAcceso === 'Admin' ? '2px solid var(--color-blue)' : '1px solid var(--color-light-gray)', backgroundColor: 'var(--color-white)', cursor: 'pointer', opacity: nivelAcceso === 'Admin' ? 1 : 0.6 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: nivelAcceso === 'Admin' ? '5px solid var(--color-blue)' : '2px solid var(--color-gray)', boxSizing: 'border-box' }}></div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>Administrador</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-gray)', marginLeft: '24px' }}>
                  Acceso completo
                </div>
              </div>

              <div 
                onClick={() => setNivelAcceso('Personalizado')}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', borderRadius: '16px', border: nivelAcceso === 'Personalizado' ? '2px solid var(--color-blue)' : '1px solid var(--color-light-gray)', backgroundColor: 'var(--color-white)', cursor: 'pointer', boxShadow: nivelAcceso === 'Personalizado' ? '0 0 0 4px rgba(29, 69, 158, 0.1)' : 'none', opacity: nivelAcceso === 'Personalizado' ? 1 : 0.6 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: nivelAcceso === 'Personalizado' ? '5px solid var(--color-blue)' : '2px solid var(--color-gray)', boxSizing: 'border-box' }}></div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>Personalizado</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-gray)', marginLeft: '24px' }}>
                  A tu medida
                </div>
              </div>
            </div>

            <h2 style={{ fontSize: '16px', color: 'var(--color-text)', margin: '0 0 16px 0', fontFamily: 'var(--font-title)' }}>
              Permisos
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderRadius: '16px', padding: '16px', opacity: nivelAcceso === 'Admin' ? 0.5 : 1, pointerEvents: nivelAcceso === 'Admin' ? 'none' : 'auto', transition: 'all 0.3s' }}>
              {[
                { key: 'ver_dashboard', label: 'Ver dashboard', desc: 'Estadísticas y miembros' },
                { key: 'gestionar_miembros', label: 'Gestionar miembros', desc: 'Agregar o expulsar' },
                { key: 'personalizacion', label: 'Personalización', desc: 'Editar imágenes y símbolos' },
                { key: 'ver_reportes', label: 'Reportes', desc: 'Ver y generar reportes' },
                { key: 'moderar_chat', label: 'Moderar chat', desc: 'Ver y borrar mensajes' },
              ].map(p => (
                <div key={p.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>
                      {p.label}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-gray)' }}>
                      {p.desc}
                    </div>
                  </div>
                  <div 
                    onClick={() => togglePermiso(p.key as any)}
                    style={{
                      width: '44px',
                      height: '24px',
                      borderRadius: '999px',
                      backgroundColor: permisos[p.key as keyof typeof permisos] ? 'var(--color-blue)' : 'var(--color-light-gray)',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      flexShrink: 0
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-white)',
                      position: 'absolute',
                      top: '2px',
                      left: permisos[p.key as keyof typeof permisos] ? '22px' : '2px',
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mensaje descriptivo para Residente */}
        {rol === 'Residente' && (
          <p style={{ fontSize: '14px', color: 'var(--color-gray)', lineHeight: '1.5', marginBottom: '24px' }}>
            Comparte este código. La persona lo escribe al unirse y entra a tu asilo como residente.
          </p>
        )}

        {/* Caja del Código */}
        <div style={{ border: '2px dashed var(--color-blue-light)', borderRadius: '24px', padding: '24px', textAlign: 'center', backgroundColor: 'var(--color-white)', transition: 'all 0.3s' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-gray)', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
            Código de invitación
          </p>
          
          {codigoData ? (
            <h2 style={{ fontSize: '40px', color: 'var(--color-blue)', fontFamily: 'var(--font-title)', letterSpacing: '4px', margin: '0 0 12px 0' }}>
              {codigoData.codigo}
            </h2>
          ) : (
            <p style={{ fontSize: '14px', color: 'var(--color-gray)', margin: '20px 0' }}>
              Configura las opciones y presiona "Generar invitación".
            </p>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-gray)' }}>Validez:</span>
            <select 
              value={expiracion} 
              onChange={(e) => setExpiracion(e.target.value)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--color-blue)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                outline: 'none',
                padding: '2px'
              }}
            >
              <option value="1">1 día</option>
              <option value="7">7 días</option>
              <option value="30">30 días</option>
              <option value="never">Sin fecha límite</option>
            </select>
            <span style={{ fontSize: '12px', color: 'var(--color-gray)' }}>• Un solo uso</span>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexShrink: 0 }}>
        {!codigoData ? (
          <button 
            onClick={generarCodigo}
            style={{ flex: 1, padding: '16px', backgroundColor: 'var(--color-blue)', color: 'var(--color-white)', border: 'none', borderRadius: '999px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 10px rgba(29, 69, 158, 0.3)', transition: 'all 0.3s' }}
          >
            Generar invitación
          </button>
        ) : (
          <>
            <button 
              onClick={copiarAlPortapapeles}
              style={{ flex: 1, padding: '16px', backgroundColor: copiado ? 'var(--color-green)' : 'var(--color-blue)', color: 'var(--color-white)', border: 'none', borderRadius: '999px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 10px rgba(29, 69, 158, 0.3)', transition: 'all 0.3s' }}
            >
              {copiado ? (
                <><i className="fa-solid fa-check"></i> ¡Copiado!</>
              ) : (
                'Copiar código'
              )}
            </button>
            <button 
              style={{ flex: 1, padding: '16px', backgroundColor: 'var(--color-white)', border: '2px solid var(--color-orange-dark)', color: 'var(--color-orange-dark)', borderRadius: '999px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
            >
              Compartir
            </button>
          </>
        )}
      </div>
    </div>
  );
}
