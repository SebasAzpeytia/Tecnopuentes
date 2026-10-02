import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavMonitor from '@/components/layout/BottomNavMonitor';
import { supabase } from '@/lib/supabaseClient';
import { useSesionStore } from '@/state/useSesionStore';
import ModalBase from '@/components/ui/ModalBase';
import ModalConfirmacion from '@/components/ui/ModalConfirmacion';

export default function Miembros() {
  const navigate = useNavigate();
  const asiloActivoId = useSesionStore(state => state.asiloActivoId);
  const currentUsuarioId = useSesionStore(state => state.usuarioId);

  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [mostrarModalExpulsar, setMostrarModalExpulsar] = useState(false);
  const [miembroAExpulsar, setMiembroAExpulsar] = useState<any>(null);
  const [mostrarModalEliminarInv, setMostrarModalEliminarInv] = useState(false);
  const [invitacionAEliminar, setInvitacionAEliminar] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [miembrosDB, setMiembrosDB] = useState<any[]>([]);

  useEffect(() => {
    cargarDatos();
  }, [asiloActivoId]);

  async function cargarDatos() {
    if (!asiloActivoId) return;
    setLoading(true);

    try {
      // 1. Miembros activos (todos los roles)
      const { data: miembrosActivos, error: errMiembros } = await supabase
        .from('asilo_miembros')
        .select('*')
        .eq('asilo_id', asiloActivoId);
      
      if (errMiembros) throw errMiembros;

      // 2. Invitaciones pendientes
      const { data: codigosPendientes, error: errCodigos } = await supabase
        .from('codigos_invitacion')
        .select('*')
        .eq('asilo_id', asiloActivoId)
        .eq('usado', false);
      
      if (errCodigos) throw errCodigos;

      // 3. Perfiles
      let perfilesMapa: Record<string, string> = {};
      const userIds = new Set<string>();
      if (miembrosActivos) miembrosActivos.forEach(m => userIds.add(m.usuario_id));
      if (codigosPendientes) codigosPendientes.forEach(c => userIds.add(c.creado_por));

      if (userIds.size > 0) {
        const { data: perfilesData, error: errPerfiles } = await supabase
          .from('perfiles')
          .select('id, nombre_completo')
          .in('id', Array.from(userIds));
          
        if (!errPerfiles && perfilesData) {
          perfilesData.forEach(p => { perfilesMapa[p.id] = p.nombre_completo; });
        }
      }

      // 4. Mapear a formato UI
      const listaUnificada = [];

      if (miembrosActivos) {
        for (const m of miembrosActivos) {
          const isResidente = m.rol === 'residente';
          const isAnfitrion = m.rol === 'anfitrion';
          listaUnificada.push({
            id: m.id,
            dbId: m.id,
            usuarioId: m.usuario_id,
            nombre: perfilesMapa[m.usuario_id] || 'Usuario sin nombre',
            estado: 'Activo',
            color: isResidente ? 'var(--color-blue)' : (isAnfitrion ? 'var(--color-orange-dark)' : 'var(--color-olive)'),
            rol: isResidente ? 'Residente' : (isAnfitrion ? 'Anfitrión' : 'Monitor'),
            bgRol: isResidente ? 'var(--color-blue)' : (isAnfitrion ? 'var(--color-orange-dark)' : 'var(--color-olive)'),
            colorRol: 'var(--color-white)',
            desc: isResidente ? 'Miembro residente del asilo.' : (isAnfitrion ? 'Acceso total y propietario del asilo' : 'Acceso según permisos asignados'),
            tipo: isResidente ? 'Residente' : (isAnfitrion ? 'Anfitrión' : 'Monitor'),
            isPending: false,
            rolDb: m.rol
          });
        }
      }

      if (codigosPendientes) {
        for (const c of codigosPendientes) {
          let expiraTexto = 'Sin límite';
          if (c.expira_en) {
            const diasFaltantes = Math.ceil((new Date(c.expira_en).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
            expiraTexto = diasFaltantes > 0 ? `${diasFaltantes}d` : 'Exp';
          }
          listaUnificada.push({
            id: c.id,
            dbId: c.id,
            nombre: `Código: ${c.codigo}`,
            estado: 'Pendiente',
            color: 'var(--color-gray)',
            rol: c.rol_asignado === 'residente' ? 'Residente' : 'Monitor',
            bgRol: 'var(--color-light-gray)',
            colorRol: 'var(--color-text)',
            creadorNombre: perfilesMapa[c.creado_por] || 'Alguien',
            expiraTexto: expiraTexto,
            tipo: 'Pendiente',
            isPending: true,
            rolDb: 'pendiente'
          });
        }
      }

      setMiembrosDB(listaUnificada);
    } catch (err) {
      console.error('Error cargando miembros:', err);
    } finally {
      setLoading(false);
    }
  }

  const abrirModal = (miembro: any) => {
    setMiembroAExpulsar(miembro);
    setMostrarModalExpulsar(true);
  };

  const confirmarEliminarPendiente = (id: string) => {
    setInvitacionAEliminar(id);
    setMostrarModalEliminarInv(true);
  };

  const ejecutarEliminarPendiente = async () => {
    if (!invitacionAEliminar) return;
    const { error } = await supabase.from('codigos_invitacion').delete().eq('id', invitacionAEliminar);
    if (!error) {
      setMiembrosDB(prev => prev.filter(m => m.id !== invitacionAEliminar));
      setMostrarModalEliminarInv(false);
    }
  };

  const ejecutarExpulsion = async () => {
    if (!miembroAExpulsar) return;
    const { error } = await supabase.from('asilo_miembros').delete().eq('id', miembroAExpulsar.dbId);
    if (!error) {
      setMiembrosDB(prev => prev.filter(m => m.id !== miembroAExpulsar.id));
      setMostrarModalExpulsar(false);
    } else {
      alert('Error al expulsar');
    }
  };

  // Filtrado y búsqueda
  let filtrados = miembrosDB;
  if (filtroActivo === 'Residentes') filtrados = filtrados.filter(m => m.tipo === 'Residente');
  if (filtroActivo === 'Monitores') filtrados = filtrados.filter(m => m.tipo === 'Monitor' || m.tipo === 'Anfitrión');
  if (filtroActivo === 'Pendientes') filtrados = filtrados.filter(m => m.tipo === 'Pendiente');
  
  if (busqueda) {
    filtrados = filtrados.filter(m => m.nombre.toLowerCase().includes(busqueda.toLowerCase()));
  }

  // Contadores
  const contadores = {
    Todos: miembrosDB.length,
    Residentes: miembrosDB.filter(m => m.tipo === 'Residente').length,
    Monitores: miembrosDB.filter(m => m.tipo === 'Monitor' || m.tipo === 'Anfitrión').length,
    Pendientes: miembrosDB.filter(m => m.tipo === 'Pendiente').length
  };

  const filtros = [
    { label: `Todos ${contadores.Todos}`, value: 'Todos' },
    { label: `Residentes ${contadores.Residentes}`, value: 'Residentes' },
    { label: `Monitores ${contadores.Monitores}`, value: 'Monitores' },
    { label: `Pendientes ${contadores.Pendientes}`, value: 'Pendientes' },
  ];

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        fontFamily: 'var(--font-body)',
        boxSizing: 'border-box',
        paddingBottom: '100px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px 24px 24px 24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', color: 'var(--color-text)', margin: '0 0 4px 0', fontFamily: 'var(--font-title)' }}>
            Miembros
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-gray)', margin: 0 }}>
            Centro de control del asilo
          </p>
        </div>
        <button
          onClick={() => navigate('/panel/agregar-miembro')}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-orange-dark)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-white)',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(244, 92, 25, 0.3)',
          }}
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      {/* Buscador */}
      <div style={{ padding: '0 24px', marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
          <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray)' }}></i>
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '999px', border: '1px solid var(--color-light-gray)', outline: 'none', fontSize: '14px', fontFamily: 'var(--font-body)', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '8px', padding: '0 24px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', marginBottom: '24px' }}>
        {filtros.map(f => (
          <button
            key={f.value}
            onClick={() => setFiltroActivo(f.value)}
            style={{
              padding: '8px 16px',
              borderRadius: '999px',
              border: filtroActivo === f.value ? 'none' : '1px solid var(--color-light-gray)',
              backgroundColor: filtroActivo === f.value ? 'var(--color-blue)' : 'var(--color-white)',
              color: filtroActivo === f.value ? 'var(--color-white)' : 'var(--color-gray)',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--color-gray)' }}>
          <i className="fa-solid fa-circle-notch fa-spin fa-2x"></i>
        </div>
      ) : (
        <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
          {filtrados.length === 0 && (
            <p style={{ color: 'var(--color-gray)', textAlign: 'center', fontSize: '14px', marginTop: '24px' }}>
              No se encontraron resultados.
            </p>
          )}
          {filtrados.map(m => (
            <div key={m.id} style={{ backgroundColor: 'var(--color-white)', borderRadius: '16px', padding: '16px', border: '1px solid var(--color-light-gray)', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: m.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-white)', fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-title)' }}>
                    {m.isPending ? <i className="fa-regular fa-clock"></i> : m.nombre.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', marginBottom: m.isPending ? '4px' : '0' }}>
                      {m.nombre}
                    </div>
                    {m.isPending && m.expiraTexto && (
                      <div style={{ fontSize: '12px', color: 'var(--color-green, #16a34a)', fontWeight: 700, marginBottom: '2px' }}>
                        Vence en: {m.expiraTexto}
                      </div>
                    )}
                    <div style={{ fontSize: '12px', color: m.isPending ? 'var(--color-orange-dark)' : 'var(--color-olive)' }}>
                      {m.estado}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ backgroundColor: m.bgRol, color: m.colorRol || 'var(--color-white)', fontSize: '12px', fontWeight: 700, padding: '6px 12px', borderRadius: '999px' }}>
                    {m.rol}
                  </div>
                  
                  {m.isPending ? (
                    <button 
                      onClick={() => confirmarEliminarPendiente(m.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--color-red, #dc2626)', cursor: 'pointer', fontSize: '18px', padding: '4px' }}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  ) : (
                    m.usuarioId !== currentUsuarioId && (
                      <button 
                        onClick={() => abrirModal(m)}
                        style={{ background: 'none', border: 'none', color: 'var(--color-gray)', cursor: 'pointer', fontSize: '18px', padding: '4px' }}
                      >
                        <i className="fa-solid fa-ellipsis"></i>
                      </button>
                    )
                  )}
                </div>
              </div>
              {m.isPending ? (
                <div style={{ fontSize: '12px', color: 'var(--color-gray)', lineHeight: '1.4' }}>
                  Creado por: {m.creadorNombre}
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--color-gray)', lineHeight: '1.4' }}>
                  {m.desc}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <BottomNavMonitor />

      <ModalConfirmacion
        isOpen={mostrarModalEliminarInv}
        onClose={() => setMostrarModalEliminarInv(false)}
        onConfirm={ejecutarEliminarPendiente}
        titulo="¿Cancelar Invitación?"
        mensaje="Este código quedará invalidado y ya nadie podrá unirse con él."
      />

      <ModalBase isOpen={mostrarModalExpulsar} onClose={() => setMostrarModalExpulsar(false)}>
        {miembroAExpulsar && (
          <>
            <div style={{ width: '64px', height: '64px', backgroundColor: miembroAExpulsar.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, color: 'var(--color-white)', fontFamily: 'var(--font-title)', marginBottom: '24px' }}>
              {miembroAExpulsar.nombre.charAt(0)}
            </div>
            <h2 style={{ fontSize: '20px', color: 'var(--color-text)', margin: '0 0 8px 0', fontFamily: 'var(--font-title)' }}>
              ¿Expulsar a {miembroAExpulsar.nombre}?
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-gray)', margin: '0 0 32px 0', lineHeight: '1.5' }}>
              Perderá el acceso al asilo y al chat. Su historial de juego se conserva.
            </p>
            <button
              onClick={ejecutarExpulsion}
              style={{ width: '100%', padding: '16px', backgroundColor: 'var(--color-orange-dark)', color: 'var(--color-white)', border: 'none', borderRadius: '999px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', marginBottom: '16px' }}
            >
              Sí, expulsar
            </button>
            <button
              onClick={() => setMostrarModalExpulsar(false)}
              style={{ width: '100%', padding: '16px', backgroundColor: 'transparent', border: '2px solid var(--color-blue)', color: 'var(--color-blue)', borderRadius: '999px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', marginBottom: '16px' }}
            >
              Cancelar
            </button>
          </>
        )}
      </ModalBase>
    </div>
  );
}
