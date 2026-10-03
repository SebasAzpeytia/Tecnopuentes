import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavMonitor from '@/components/layout/BottomNavMonitor';
import { supabase } from '@/lib/supabaseClient';
import { useSesionStore } from '@/state/useSesionStore';

export default function PersonalizarIconos() {
  const navigate = useNavigate();
  const { asiloActivoId } = useSesionStore();
  const [juegoExpandido, setJuegoExpandido] = useState<string | null>('memorama');
  const [juegosData, setJuegosData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, [asiloActivoId]);

  const cargarDatos = async () => {
    if (!asiloActivoId) return;
    setLoading(true);

    // 1. Obtener juegos
    const { data: juegos } = await supabase.from('juegos').select('*').eq('activo', true);
    if (!juegos) return;

    // 2. Obtener elementos por defecto
    const { data: defaults } = await supabase.from('juego_elementos_default').select('*');

    // 3. Obtener personalizaciones actuales del asilo
    const { data: personalizados } = await supabase
      .from('elementos_personalizables')
      .select('*')
      .eq('asilo_id', asiloActivoId)
      .eq('tipo', 'emoji'); // Solo leemos emojis por ahora en esta fase

    // Mapa de iconos y colores (Mock de diseño visual ya que en DB solo está el nombre/slug)
    const estiloJuego: Record<string, any> = {
      'memorama': { color: 'var(--color-blue)', icono: 'fa-solid fa-brain' },
      'solitario': { color: 'var(--color-olive)', icono: 'fa-solid fa-clone' },
      'ajedrez': { color: 'var(--color-orange-dark)', icono: 'fa-solid fa-chess-pawn' },
      'dulces': { color: 'var(--color-peach)', icono: 'fa-solid fa-candy-cane' }
    };

    // Colores de preview para Emojis
    const bgColors = ['#e8eaf6', '#fbe9e7', '#f1f8e9', '#fff3e0', '#f3e5f5'];

    // Construir la estructura final
    const juegosArmados = juegos.map(j => {
      // Elementos base de este juego
      const baseItems = defaults?.filter(d => d.juego_id === j.id) || [];
      const persItems = personalizados?.filter(p => p.juego_id === j.id) || [];

      const items = baseItems.map((base, idx) => {
        const pers = persItems.find(p => p.clave === base.clave);
        return {
          id: base.id, // ID default
          clave: base.clave,
          nombre: base.nombre_visible,
          emoji: pers ? pers.valor : base.valor, // Sobrescribimos si hay personalizacion
          previewBg: bgColors[idx % bgColors.length]
        };
      });

      return {
        id: j.id,
        slug: j.slug,
        nombre: j.nombre,
        color: estiloJuego[j.slug]?.color || 'var(--color-gray)',
        icono: estiloJuego[j.slug]?.icono || 'fa-solid fa-gamepad',
        elementos: baseItems.length,
        items
      };
    });

    setJuegosData(juegosArmados);
    setLoading(false);
  };

  const toggleJuego = (id: string) => {
    if (juegoExpandido === id) setJuegoExpandido(null);
    else setJuegoExpandido(id);
  };

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
          Personalizar íconos
        </h1>
        <button
          onClick={() => navigate('/panel')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-blue)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-white)',
            cursor: 'pointer',
          }}
        >
          <i className="fa-solid fa-check"></i>
        </button>
      </div>

      {/* Buscador */}
      <div style={{ padding: '0 24px', marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
          <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray)' }}></i>
          <input
            type="text"
            placeholder="Buscar juego o elemento..."
            style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '999px', border: '1px solid var(--color-light-gray)', outline: 'none', fontSize: '14px', fontFamily: 'var(--font-body)', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* Accordion de Juegos */}
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--color-gray)' }}>
            <i className="fa-solid fa-circle-notch fa-spin fa-2x"></i>
          </div>
        )}

        {!loading && juegosData.map(j => (
          <div key={j.id} style={{ backgroundColor: 'var(--color-white)', borderRadius: '24px', border: '1px solid var(--color-light-gray)', overflow: 'hidden' }}>
            
            <div 
              onClick={() => toggleJuego(j.slug)}
              style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: j.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-white)', fontSize: '20px' }}>
                  <i className={j.icono}></i>
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-title)' }}>
                    {j.nombre}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-gray)' }}>
                    {j.elementos} elementos personalizables
                  </div>
                </div>
              </div>
              <i className={`fa-solid ${juegoExpandido === j.slug ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ color: 'var(--color-gray)' }}></i>
            </div>

            {/* Elementos Expandidos */}
            {juegoExpandido === j.slug && j.items.length > 0 && (
              <div style={{ padding: '0 20px 20px 20px' }}>
                <div style={{ borderTop: '1px solid var(--color-light-gray)', margin: '0 0 16px 0' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {j.items.map((item: any) => (
                    <div key={item.clave} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '40px', height: '60px', backgroundColor: item.previewBg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
                          {item.emoji}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
                          {item.nombre}
                        </span>
                      </div>
                      <button
                        onClick={() => navigate(`/panel/personalizar/editar?juego_id=${j.id}&juego_nombre=${j.nombre}&clave=${item.clave}&elemento=${item.nombre}&emoji=${item.emoji}`)}
                        style={{ padding: '8px 24px', borderRadius: '999px', border: '1px solid var(--color-blue)', backgroundColor: 'transparent', color: 'var(--color-blue)', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Editar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {juegoExpandido === j.slug && j.items.length === 0 && (
              <div style={{ padding: '0 20px 20px 20px', textAlign: 'center', color: 'var(--color-gray)', fontSize: '14px' }}>
                Aún no hay elementos editables para este juego.
              </div>
            )}

          </div>
        ))}

        {!loading && (
          <div style={{ textAlign: 'center', marginTop: '16px', marginBottom: '24px' }}>
            <p style={{ fontSize: '12px', color: 'var(--color-gray)' }}>
              Toca un juego para ver y editar todos sus íconos
            </p>
          </div>
        )}
      </div>

      <BottomNavMonitor />
    </div>
  );
}
