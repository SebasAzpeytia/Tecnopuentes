import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavMonitor from '@/components/layout/BottomNavMonitor';
import { useSesionStore } from '@/state/useSesionStore';
import { supabase } from '@/lib/supabaseClient';

export default function Panel() {
  const navigate = useNavigate();
  const { rolActivo, asiloActivoId } = useSesionStore();
  const [nombreAsilo, setNombreAsilo] = useState('Asilo Los Álamos'); // Mock V1
  
  const [residentesDB, setResidentesDB] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarResidentes();
  }, [asiloActivoId]);

  async function cargarResidentes() {
    if (!asiloActivoId) return;
    setLoading(true);

    const { data: miembrosActivos, error } = await supabase
      .from('asilo_miembros')
      .select('usuario_id')
      .eq('asilo_id', asiloActivoId)
      .eq('rol', 'residente');

    if (error || !miembrosActivos || miembrosActivos.length === 0) {
      setResidentesDB([]);
      setLoading(false);
      return;
    }

    const usuarioIds = miembrosActivos.map((m: any) => m.usuario_id);

    const { data: perfiles } = await supabase
      .from('perfiles')
      .select('id, nombre_completo, avatar_url, fecha_nacimiento')
      .in('id', usuarioIds);

    const perfilesMapa: Record<string, { nombre: string, fechaNacimiento: string | null }> = {};
    if (perfiles) {
      perfiles.forEach((p: any) => {
        perfilesMapa[p.id] = { nombre: p.nombre_completo, fechaNacimiento: p.fecha_nacimiento };
      });
    }

    // Obtener estadísticas de juegos
    const { data: sesiones } = await supabase
      .from('sesiones_juego')
      .select('usuario_id, juego_id, duracion_segundos')
      .eq('asilo_id', asiloActivoId)
      .in('usuario_id', usuarioIds);

    const { data: juegos } = await supabase.from('juegos').select('id, nombre');
    const juegosMap: Record<string, string> = {};
    juegos?.forEach(j => juegosMap[j.id] = j.nombre);

    const statsMapa: Record<string, { totalSegundos: number, favCounts: Record<string, number> }> = {};
    usuarioIds.forEach((id: string) => statsMapa[id] = { totalSegundos: 0, favCounts: {} });

    sesiones?.forEach(s => {
      statsMapa[s.usuario_id].totalSegundos += s.duracion_segundos || 0;
      statsMapa[s.usuario_id].favCounts[s.juego_id] = (statsMapa[s.usuario_id].favCounts[s.juego_id] || 0) + 1;
    });

    const paleta = ['var(--color-orange)', 'var(--color-blue)', 'var(--color-olive)', 'var(--color-blue-light)', 'var(--color-peach)'];

    const lista = miembrosActivos.map((m, index) => {
      const perfil = perfilesMapa[m.usuario_id] || { nombre: 'Residente', fechaNacimiento: null };
      
      let edadCalculada = '?';
      if (perfil.fechaNacimiento) {
        const diffMs = Date.now() - new Date(perfil.fechaNacimiento).getTime();
        const ageDt = new Date(diffMs); 
        edadCalculada = Math.abs(ageDt.getUTCFullYear() - 1970).toString();
      }

      // Calcular estadísticas para este usuario
      const stat = statsMapa[m.usuario_id];
      let favId = null;
      let maxCount = 0;
      for (const [gId, count] of Object.entries(stat.favCounts)) {
        if (count > maxCount) {
          maxCount = count;
          favId = gId;
        }
      }
      
      const favoritoStr = favId ? juegosMap[favId] : 'Ninguno';
      
      // Formatear tiempo
      let tiempoStr = '0 h';
      if (stat.totalSegundos > 0) {
        const horas = (stat.totalSegundos / 3600).toFixed(1);
        if (horas === '0.0') {
          const mins = Math.ceil(stat.totalSegundos / 60);
          tiempoStr = `${mins} min`;
        } else {
          tiempoStr = `${horas} h`;
        }
      }

      return {
        id: m.usuario_id,
        nombre: perfil.nombre,
        edad: edadCalculada,
        favorito: favoritoStr,
        tiempo: tiempoStr,
        color: paleta[index % paleta.length],
        totalSegundos: stat.totalSegundos // Para ordenamiento posterior si se requiere
      };
    });

    // Ordenar de mayor a menor tiempo de juego por defecto
    lista.sort((a, b) => b.totalSegundos - a.totalSegundos);

    setResidentesDB(lista);
    setLoading(false);
  }

  const resumen = [
    { valor: '28', etiqueta: 'Residentes activos', color: 'var(--color-blue)', bg: '#e8f0fe', border: 'var(--color-blue-light)' },
    { valor: '1.4h', etiqueta: 'Tiempo prom. / día', color: 'var(--color-orange-dark)', bg: '#fff0e6', border: 'var(--color-peach)' },
    { valor: 'Lotería', etiqueta: 'Juego más jugado', color: 'var(--color-olive)', bg: '#f1f8e9', border: '#c5e1a5' },
  ];



  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        fontFamily: 'var(--font-body)',
        boxSizing: 'border-box',
        paddingBottom: '100px', // Espacio para BottomNav
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px 24px 24px 24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', color: 'var(--color-text)', margin: '0 0 4px 0', fontFamily: 'var(--font-title)' }}>
            Panel del Asilo
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-gray)', margin: 0 }}>
            {nombreAsilo}
          </p>
        </div>
        {rolActivo === 'anfitrion' && (
          <button
            onClick={() => navigate('/panel/miembros')}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-blue-light)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-white)',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <i className="fa-solid fa-gear" style={{ fontSize: '18px' }}></i>
          </button>
        )}
      </div>

      {/* Tarjetas de Resumen (Scroll Horizontal) */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '12px', 
          padding: '0 24px', 
          overflowX: 'auto', 
          paddingBottom: '8px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          marginBottom: '24px',
        }}
      >
        {resumen.map((item, i) => (
          <div
            key={i}
            style={{
              minWidth: '110px',
              backgroundColor: item.bg,
              border: `1px solid ${item.border}`,
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
            }}
          >
            <span style={{ fontSize: '24px', fontWeight: 800, color: item.color, fontFamily: 'var(--font-title)', marginBottom: '4px' }}>
              {item.valor}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-gray)', lineHeight: '1.2' }}>
              {item.etiqueta}
            </span>
          </div>
        ))}
      </div>

      {/* Alerta de inactividad */}
      <div style={{ padding: '0 24px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: '#fff3e0', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>⚠️</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-orange-dark)' }}>
            3 residentes sin actividad hace más de 5 días
          </span>
        </div>
      </div>

      {/* Lista de Miembros */}
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', color: 'var(--color-text)', margin: 0, fontFamily: 'var(--font-title)' }}>
            Miembros
          </h2>
          <button style={{ background: 'none', border: 'none', color: 'var(--color-blue)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            Tiempo de juego ↓
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '24px', color: 'var(--color-gray)' }}>
              <i className="fa-solid fa-circle-notch fa-spin fa-2x"></i>
            </div>
          ) : residentesDB.length === 0 ? (
            <p style={{ color: 'var(--color-gray)', textAlign: 'center', fontSize: '14px' }}>
              No hay residentes registrados aún.
            </p>
          ) : (
            residentesDB.map((m) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: m.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-white)', fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-title)' }}>
                    {m.nombre.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)' }}>
                      {m.nombre}, {m.edad}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-gray)' }}>
                      Favorito: {m.favorito}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-blue)', fontFamily: 'var(--font-title)' }}>
                  {m.tiempo}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNavMonitor />
    </div>
  );
}
