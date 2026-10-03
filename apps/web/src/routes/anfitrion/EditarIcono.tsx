import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useSesionStore } from '@/state/useSesionStore';

export default function EditarIcono() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { asiloActivoId } = useSesionStore();
  
  const juegoId = searchParams.get('juego_id') || '';
  const clave = searchParams.get('clave') || '';
  const juegoNombre = searchParams.get('juego_nombre') || 'Juego';
  const elemento = searchParams.get('elemento') || 'Elemento';
  const emojiOriginal = searchParams.get('emoji') || '⭐';

  const [modo, setModo] = useState<'Emoji' | 'Subir imagen' | 'Dibujar'>('Emoji');
  const [emojiSeleccionado, setEmojiSeleccionado] = useState(emojiOriginal);
  const [loading, setLoading] = useState(false);

  const emojisGrid = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑',
    '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉'
  ];

  const guardarCambios = async () => {
    if (!asiloActivoId || !juegoId || !clave) return;
    setLoading(true);

    const { error } = await supabase
      .from('elementos_personalizables')
      .upsert({
        asilo_id: asiloActivoId,
        juego_id: juegoId,
        clave,
        nombre_visible: elemento,
        tipo: 'emoji',
        valor: emojiSeleccionado
      }, { onConflict: 'asilo_id, juego_id, clave' });

    setLoading(false);
    if (!error) {
      navigate(-1);
    } else {
      alert('Error guardando personalización');
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--color-blue)', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-blue)', cursor: 'pointer' }}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 style={{ fontSize: '20px', color: 'var(--color-text)', margin: 0, fontFamily: 'var(--font-title)' }}>
          Editar ícono
        </h1>
        <button
          onClick={() => navigate(-1)}
          style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-blue)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-white)', cursor: 'pointer' }}
        >
          <i className="fa-solid fa-check"></i>
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <p style={{ fontSize: '12px', color: 'var(--color-gray)', margin: '0 0 16px 0' }}>
          {juegoNombre} • {elemento}
        </p>

        {/* Preview actual */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '60px', height: '90px', borderRadius: '16px', border: '3px solid var(--color-orange-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', backgroundColor: 'var(--color-white)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            {modo === 'Emoji' ? emojiSeleccionado : emojiOriginal}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '4px' }}>
        {['Emoji', 'Subir imagen', 'Dibujar'].map((opt) => (
          <button
            key={opt}
            onClick={() => setModo(opt as any)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '999px',
              border: modo === opt ? 'none' : '1px solid var(--color-light-gray)',
              backgroundColor: modo === opt ? 'var(--color-blue)' : 'var(--color-white)',
              color: modo === opt ? 'var(--color-white)' : 'var(--color-gray)',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Contenido dinámico según el modo */}
      {modo === 'Emoji' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray)' }}></i>
            <input
              type="text"
              placeholder="Buscar emoji (ej. corona, rey...)"
              style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '999px', border: '1px solid var(--color-light-gray)', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', overflowY: 'auto', marginBottom: '24px' }}>
            {emojisGrid.map((em, idx) => (
              <button
                key={idx}
                onClick={() => setEmojiSeleccionado(em)}
                style={{
                  height: '80px',
                  borderRadius: '16px',
                  border: emojiSeleccionado === em ? '2px solid var(--color-blue)' : '1px solid var(--color-light-gray)',
                  backgroundColor: emojiSeleccionado === em ? '#e8eaf6' : 'var(--color-white)',
                  fontSize: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {em}
              </button>
            ))}
          </div>



          <button 
            onClick={guardarCambios}
            disabled={loading}
            style={{ width: '100%', padding: '16px', backgroundColor: 'var(--color-orange-dark)', color: 'var(--color-white)', border: 'none', borderRadius: '999px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 10px rgba(244, 92, 25, 0.3)', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      )}

      {modo === 'Dibujar' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          {/* Canvas falso */}
          <div style={{ flex: 1, backgroundColor: 'var(--color-white)', borderRadius: '24px', border: '1px solid var(--color-light-gray)', marginBottom: '24px', minHeight: '200px' }}>
            {/* Aquí iría un canvas real HTML5 en el futuro */}
          </div>

          {/* Herramientas de dibujo */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#262626' }}></div>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-blue)', border: '2px solid var(--color-text)' }}></div>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-orange-dark)' }}></div>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-olive)' }}></div>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-peach)' }}></div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-white)', border: '1px solid var(--color-light-gray)', color: 'var(--color-blue)', cursor: 'pointer' }}>
                <i className="fa-solid fa-rotate-left"></i>
              </button>
              <button style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-white)', border: '1px solid var(--color-light-gray)', color: 'var(--color-gray)', cursor: 'pointer' }}>
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-gray)' }}>Grosor:</span>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '8px', height: '16px', borderRadius: '999px', border: '1px solid var(--color-text)' }}></div>
              <div style={{ width: '12px', height: '16px', borderRadius: '999px', border: '1px solid var(--color-text)' }}></div>
              <div style={{ width: '16px', height: '16px', borderRadius: '999px', border: '2px solid var(--color-text)', backgroundColor: 'rgba(0,0,0,0.1)' }}></div>
            </div>
          </div>

          <button onClick={() => alert('Próximamente')} style={{ width: '100%', padding: '16px', backgroundColor: 'var(--color-orange-dark)', color: 'var(--color-white)', border: 'none', borderRadius: '999px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 10px rgba(244, 92, 25, 0.3)' }}>
            Guardar dibujo
          </button>
        </div>
      )}

      {modo === 'Subir imagen' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <i className="fa-solid fa-image" style={{ fontSize: '48px', color: 'var(--color-light-gray)', marginBottom: '16px' }}></i>
          <p style={{ color: 'var(--color-gray)', textAlign: 'center' }}>Selecciona una imagen de tu galería para usar como ícono.</p>
          <button onClick={() => alert('Próximamente')} style={{ marginTop: '24px', padding: '16px 32px', backgroundColor: 'var(--color-blue)', color: 'var(--color-white)', border: 'none', borderRadius: '999px', fontWeight: 700, cursor: 'pointer' }}>
            Seleccionar archivo
          </button>
        </div>
      )}

    </div>
  );
}
