import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useSesionStore } from '@/state/useSesionStore';

export default function MonitoresYPersonal() {
  const navigate = useNavigate();
  const asiloActivoId = useSesionStore(state => state.asiloActivoId);
  const currentUsuarioId = useSesionStore(state => state.usuarioId);
  const [personal, setPersonal] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, [asiloActivoId]);

  async function cargarDatos() {
    if (!asiloActivoId) return;
    setLoading(true);

    try {
      // 1. Cargar miembros activos (Monitores y Anfitriones)
      const { data: miembrosActivos, error: errMiembros } = await supabase
        .from('asilo_miembros')
        .select('*')
        .eq('asilo_id', asiloActivoId)
        .in('rol', ['monitor', 'anfitrion']);
      
      if (errMiembros) throw errMiembros;

      // 2. Cargar TODOS los códigos de invitación pendientes
      const { data: codigosPendientes, error: errCodigos } = await supabase
        .from('codigos_invitacion')
        .select('*')
        .eq('asilo_id', asiloActivoId)
        .eq('usado', false);
      
      if (errCodigos) throw errCodigos;

      // 3. Extraer los perfiles de los miembros activos y creadores de códigos
      let perfilesMapa: Record<string, string> = {};
      const userIds = new Set<string>();
      
      if (miembrosActivos) {
        miembrosActivos.forEach(m => userIds.add(m.usuario_id));
      }
      if (codigosPendientes) {
        codigosPendientes.forEach(c => userIds.add(c.creado_por));
      }

      if (userIds.size > 0) {
        const { data: perfilesData, error: errPerfiles } = await supabase
          .from('perfiles')
          .select('id, nombre_completo')
          .in('id', Array.from(userIds));
          
        if (!errPerfiles && perfilesData) {
          perfilesData.forEach(p => {
            perfilesMapa[p.id] = p.nombre_completo;
          });
        }
      }

      // 4. Unificar ambos en un solo formato
      const listaUnificada = [];

      // Procesar activos
      if (miembrosActivos) {
        for (const m of miembrosActivos) {
          const isAnfitrion = m.rol === 'anfitrion';
          listaUnificada.push({
            id: m.id,
            usuarioId: m.usuario_id,
            nombre: perfilesMapa[m.usuario_id] || 'Usuario sin nombre',
            estado: m.estado.charAt(0).toUpperCase() + m.estado.slice(1),
            color: isAnfitrion ? 'var(--color-blue)' : 'var(--color-olive)',
            rol: isAnfitrion ? 'Anfitrión' : 'Monitor',
            bgRol: isAnfitrion ? 'var(--color-blue)' : 'var(--color-orange-dark)',
            colorRol: 'var(--color-white)',
            desc: isAnfitrion ? 'Acceso total y propietario del asilo' : 'Acceso según los permisos asignados por el anfitrión',
            isPending: false
          });
        }
      }

      // Procesar invitaciones pendientes
      if (codigosPendientes) {
        for (const c of codigosPendientes) {
          const isResidente = c.rol_asignado === 'residente';
          const p = c.permisos_predefinidos || {};
          const isFullAdmin = p.ver_dashboard && p.gestionar_miembros && p.personalizacion && p.ver_reportes && p.moderar_chat;
          
          let rolTexto = isResidente ? 'Residente' : (isFullAdmin ? 'Administrador' : 'Personalizado');
          let expiraTexto = 'Sin límite';
          if (c.expira_en) {
            const diasFaltantes = Math.ceil((new Date(c.expira_en).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
            expiraTexto = diasFaltantes > 0 ? `${diasFaltantes} días` : 'Expirada';
          }

          const creadorNombre = perfilesMapa[c.creado_por] || 'Alguien';

          listaUnificada.push({
            id: c.id,
            nombre: `Código: ${c.codigo}`,
            estado: 'Pendiente',
            color: 'var(--color-gray)',
            rol: rolTexto,
            bgRol: 'var(--color-light-gray)',
            colorRol: 'var(--color-text)',
            desc: `Permisos: ${rolTexto} • Creado por: ${creadorNombre} • Vence en: ${expiraTexto}`,
            isPending: true
          });
        }
      }

      setPersonal(listaUnificada);
    } catch (err) {
      console.error('Error cargando personal:', err);
    } finally {
      setLoading(false);
    }
  }

  async function eliminarInvitacion(id: string) {
    if (!window.confirm('¿Seguro que deseas cancelar esta invitación? El código ya no servirá.')) return;
    
    const { error } = await supabase.from('codigos_invitacion').delete().eq('id', id);
    if (error) {
      alert('Hubo un error al eliminar el código.');
      console.error(error);
    } else {
      // Remover de la UI optimísticamente
      setPersonal(prev => prev.filter(p => p.id !== id));
    }
  }

  async function expulsarMiembro(id: string, nombre: string) {
    if (!window.confirm(`¿Seguro que deseas expulsar a ${nombre} del asilo? Perderá acceso inmediatamente.`)) return;
    
    const { error } = await supabase.from('asilo_miembros').delete().eq('id', id);
    if (error) {
      alert('Hubo un error al expulsar al miembro.');
      console.error(error);
    } else {
      setPersonal(prev => prev.filter(p => p.id !== id));
    }
  }

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button
          onClick={() => navigate('/panel')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '1px solid var(--color-blue)',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-blue)',
            cursor: 'pointer',
          }}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 style={{ fontSize: '20px', color: 'var(--color-text)', margin: 0, fontFamily: 'var(--font-title)' }}>
          Monitores y personal
        </h1>
        <button
          onClick={() => navigate('/panel/agregar-miembro')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-orange-dark)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-white)',
            fontSize: '20px',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(244, 92, 25, 0.3)'
          }}
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      <p style={{ fontSize: '14px', color: 'var(--color-gray)', lineHeight: '1.5', marginBottom: '24px' }}>
        Invita personal del asilo y define qué pueden hacer dentro de la app
      </p>

      <h2 style={{ fontSize: '16px', color: 'var(--color-text)', margin: '0 0 16px 0', fontFamily: 'var(--font-title)' }}>
        Personal activo ({personal.filter(p => !p.isPending).length})
      </h2>

      {loading ? (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--color-gray)' }}>
          <i className="fa-solid fa-circle-notch fa-spin fa-2x"></i>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto', marginBottom: '32px' }}>
          {personal.length === 0 && (
            <p style={{ color: 'var(--color-gray)', textAlign: 'center', fontSize: '14px', marginTop: '24px' }}>
              No hay monitores registrados aún.
            </p>
          )}

          {personal.map(p => (
            <div key={p.id} style={{ backgroundColor: 'var(--color-white)', borderRadius: '16px', padding: '16px', border: '1px solid var(--color-light-gray)', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: p.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-white)', fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-title)' }}>
                    {p.isPending ? <i className="fa-regular fa-clock"></i> : p.nombre.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)' }}>
                      {p.nombre}
                    </div>
                    <div style={{ fontSize: '12px', color: p.isPending ? 'var(--color-orange-dark)' : 'var(--color-olive)' }}>
                      {p.estado}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ backgroundColor: p.bgRol, color: p.colorRol || 'var(--color-white)', fontSize: '12px', fontWeight: 700, padding: '6px 12px', borderRadius: '999px' }}>
                    {p.rol}
                  </div>
                  
                  {p.isPending && (
                    <button
                      onClick={() => eliminarInvitacion(p.id)}
                      style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--color-red, #dc2626)', cursor: 'pointer', padding: '4px', fontSize: '16px' }}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  )}

                  {!p.isPending && p.usuarioId !== currentUsuarioId && (
                    <button
                      onClick={() => expulsarMiembro(p.id, p.nombre)}
                      style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--color-red, #dc2626)', cursor: 'pointer', padding: '4px', fontSize: '16px' }}
                    >
                      <i className="fa-solid fa-user-xmark"></i>
                    </button>
                  )}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-gray)', lineHeight: '1.4' }}>
                {p.desc}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sticky Button */}
      <div style={{ marginTop: 'auto' }}>
        <button
          onClick={() => navigate('/panel/agregar-miembro')}
          style={{ width: '100%', padding: '16px', backgroundColor: 'var(--color-orange-dark)', color: 'var(--color-white)', border: 'none', borderRadius: '999px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 10px rgba(244, 92, 25, 0.3)' }}
        >
          Invitar nuevo monitor
        </button>
      </div>

    </div>
  );
}
