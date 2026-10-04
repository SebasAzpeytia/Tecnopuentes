import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useSesionStore } from '@/state/useSesionStore';
import ModalBase from '@/components/ui/ModalBase';
import { useMachine } from '@xstate/react';
import { solitarioMachine, Card } from '../../../../../../packages/game-engines/solitario/src/machine';

const VALUE_MAP: Record<number, string> = {
  1: 'A', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7',
  8: '8', 9: '9', 10: '10', 11: 'J', 12: 'Q', 13: 'K'
};

type Selection = 
  | { type: 'tableau', colIndex: number, cardIndex: number }
  | { type: 'waste' }
  | null;

export default function Solitario() {
  const navigate = useNavigate();
  const { asiloActivoId, usuarioId } = useSesionStore();

  const [state, send] = useMachine(solitarioMachine);
  const { stock, waste, foundations, tableau, score, elapsedSeconds } = state.context;

  const [emojis, setEmojis] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showSurrenderModal, setShowSurrenderModal] = useState(false);
  const [selection, setSelection] = useState<Selection>(null);

  // Inicializar juego cargando personalización
  useEffect(() => {
    async function init() {
      const { data: juego } = await supabase.from('juegos').select('id').eq('slug', 'solitario').single();
      if (!juego) return;

      const { data: defaults } = await supabase.from('juego_elementos_default').select('*').eq('juego_id', juego.id);
      
      let personalizados = [];
      if (asiloActivoId) {
        const { data: pers } = await supabase.from('elementos_personalizables')
          .select('*')
          .eq('juego_id', juego.id)
          .eq('asilo_id', asiloActivoId)
          .eq('tipo', 'emoji');
        if (pers) personalizados = pers;
      }

      const currentEmojis: Record<string, string> = {};
      if (defaults) {
        defaults.forEach(def => {
          const pers = personalizados.find((p: any) => p.clave === def.clave);
          currentEmojis[def.clave] = pers ? pers.valor : def.valor;
        });
      }
      
      setEmojis(currentEmojis);

      // Crear baraja
      const suits = ['picas', 'corazones', 'diamantes', 'treboles'];
      const deck: Card[] = [];
      for (const suit of suits) {
        for (let i = 1; i <= 13; i++) {
          deck.push({
            id: `${suit}-${i}`,
            suit,
            value: i,
            color: (suit === 'corazones' || suit === 'diamantes') ? 'rojo' : 'negro',
            isFlipped: true
          });
        }
      }
      send({ type: 'INICIAR', deck });
      setLoading(false);
    }
    init();
  }, [asiloActivoId, send]);

  // Reloj
  useEffect(() => {
    if (state.matches('jugando')) {
      const interval = setInterval(() => {
        send({ type: 'TICK' });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state.value, send]);

  // Finalizar juego en victoria o rendición
  useEffect(() => {
    if (state.matches('ganado') || state.matches('surrendered')) {
      guardarSesion();
    }
  }, [state.value]);

  const guardarSesion = async () => {
    if (!asiloActivoId || !usuarioId) return;
    const { data: juego } = await supabase.from('juegos').select('id').eq('slug', 'solitario').single();
    if (juego) {
      await supabase.from('sesiones_juego').insert({
        asilo_id: asiloActivoId,
        usuario_id: usuarioId,
        juego_id: juego.id,
        duracion_segundos: elapsedSeconds
      });
    }
  };

  const formatearTiempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderCard = (card: Card, isSelected: boolean = false, onClick?: () => void) => {
    if (card.isFlipped) {
      return (
        <div 
          onClick={onClick}
          style={{ width: '60px', height: '84px', backgroundColor: 'var(--color-blue)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', cursor: onClick ? 'pointer' : 'default', border: isSelected ? '2px solid var(--color-orange)' : 'none' }}
        >
          {emojis['reverso'] || '🌌'}
        </div>
      );
    }
    const color = card.color === 'rojo' ? '#ef4444' : '#171717';
    return (
      <div 
        onClick={onClick}
        style={{ width: '60px', height: '84px', backgroundColor: 'var(--color-white)', borderRadius: '8px', display: 'flex', flexDirection: 'column', padding: '4px 8px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', color, cursor: onClick ? 'pointer' : 'default', border: isSelected ? '2px solid var(--color-orange)' : '1px solid #e5e5e5' }}
      >
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{VALUE_MAP[card.value]}</div>
        <div style={{ fontSize: '24px', alignSelf: 'center', marginTop: 'auto', marginBottom: 'auto' }}>{emojis[card.suit]}</div>
      </div>
    );
  };

  // Logica de Clics
  const handleStockClick = () => {
    setSelection(null);
    if (stock.length > 0) {
      send({ type: 'DRAW' });
    } else {
      send({ type: 'RECYCLE_WASTE' });
    }
  };

  const handleWasteClick = () => {
    if (waste.length === 0) return;
    if (selection?.type === 'waste') {
      setSelection(null); // Deseleccionar
    } else {
      setSelection({ type: 'waste' });
    }
  };

  const handleFoundationClick = (fIndex: number) => {
    if (!selection) return;
    
    if (selection.type === 'waste') {
      send({ type: 'MOVE_WASTE_TO_FOUNDATION', toFoundation: fIndex });
    } else if (selection.type === 'tableau') {
      // Solo podemos mover a la fundación si es la última carta de la columna
      const col = tableau[selection.colIndex];
      if (selection.cardIndex === col.length - 1) {
        send({ type: 'MOVE_TABLEAU_TO_FOUNDATION', fromCol: selection.colIndex, toFoundation: fIndex });
      }
    }
    setSelection(null);
  };

  const handleTableauClick = (colIndex: number, cardIndex: number) => {
    const col = tableau[colIndex];
    const card = col[cardIndex];

    if (!selection) {
      // Seleccionar carta si está boca arriba
      if (card && !card.isFlipped) {
        setSelection({ type: 'tableau', colIndex, cardIndex });
      }
    } else {
      // Intentar mover
      if (selection.type === 'waste') {
        send({ type: 'MOVE_WASTE_TO_TABLEAU', toCol: colIndex });
      } else if (selection.type === 'tableau') {
        if (selection.colIndex !== colIndex) {
          send({ type: 'MOVE_TABLEAU_TO_TABLEAU', fromCol: selection.colIndex, toCol: colIndex, cardIndex: selection.cardIndex });
        }
      }
      setSelection(null);
    }
  };

  const handleEmptyTableauClick = (colIndex: number) => {
    if (!selection) return;
    if (selection.type === 'waste') {
      send({ type: 'MOVE_WASTE_TO_TABLEAU', toCol: colIndex });
    } else if (selection.type === 'tableau') {
      send({ type: 'MOVE_TABLEAU_TO_TABLEAU', fromCol: selection.colIndex, toCol: colIndex, cardIndex: selection.cardIndex });
    }
    setSelection(null);
  };

  if (loading) return <div style={{ padding: '24px', textAlign: 'center' }}>Cargando Solitario...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-olive)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'var(--color-white)', borderBottom: '1px solid var(--color-light-gray)' }}>
        <button 
          onClick={() => setShowSurrenderModal(true)}
          style={{ padding: '12px 16px', backgroundColor: '#ef4444', color: 'var(--color-white)', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', display: 'flex', gap: '8px', alignItems: 'center' }}
        >
          <i className="fa-solid fa-flag"></i> Rendirse
        </button>
        
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-text)', fontFamily: 'monospace' }}>
          {formatearTiempo(elapsedSeconds)}
        </div>

        <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--color-orange-dark)', display: 'flex', gap: '4px', alignItems: 'center' }}>
          <i className="fa-solid fa-star"></i> {score}
        </div>
      </div>

      {/* Tablero */}
      <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Top Row: Stock, Waste, and Foundations */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
          {/* Stock y Waste */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Stock */}
            <div 
              onClick={handleStockClick}
              style={{ width: '60px', height: '84px', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              {stock.length > 0 ? renderCard(stock[stock.length - 1]) : <i className="fa-solid fa-rotate-right" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '24px' }}></i>}
            </div>
            {/* Waste */}
            <div 
              style={{ width: '60px', height: '84px', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '8px' }}
            >
              {waste.length > 0 && renderCard(waste[waste.length - 1], selection?.type === 'waste', handleWasteClick)}
            </div>
          </div>

          {/* Foundations */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {foundations.map((fPile, fIdx) => (
              <div 
                key={fIdx} 
                onClick={() => handleFoundationClick(fIdx)}
                style={{ width: '60px', height: '84px', border: '2px dashed rgba(255,255,255,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {fPile.length > 0 ? renderCard(fPile[fPile.length - 1]) : <span style={{ color: 'rgba(255,255,255,0.3)' }}>A</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Tableau (Columnas) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', flex: 1 }}>
          {tableau.map((col, colIdx) => (
            <div 
              key={colIdx} 
              onClick={() => col.length === 0 ? handleEmptyTableauClick(colIdx) : undefined}
              style={{ width: '60px', minHeight: '84px', position: 'relative' }}
            >
              {col.length === 0 && (
                <div style={{ width: '100%', height: '84px', border: '2px dashed rgba(255,255,255,0.3)', borderRadius: '8px' }}></div>
              )}
              {col.map((card, cardIdx) => {
                const isSelected = selection?.type === 'tableau' && selection.colIndex === colIdx && selection.cardIndex <= cardIdx;
                return (
                  <div 
                    key={card.id} 
                    style={{ position: 'absolute', top: `${cardIdx * 24}px`, zIndex: cardIdx }}
                  >
                    {renderCard(card, isSelected, () => handleTableauClick(colIdx, cardIdx))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

      </div>

      {/* Modal Rendirse */}
      <ModalBase isOpen={showSurrenderModal} onClose={() => setShowSurrenderModal(false)}>
        <h2 style={{ fontSize: '24px', margin: '0 0 16px 0', fontFamily: 'var(--font-title)', color: 'var(--color-text)' }}>¿Te rindes?</h2>
        <p style={{ color: 'var(--color-gray)', fontSize: '16px', marginBottom: '24px' }}>
          Si te rindes, la partida terminará y perderás <strong>50 puntos</strong>.
        </p>
        <button 
          onClick={() => {
            send({ type: 'SURRENDER' });
            setShowSurrenderModal(false);
          }}
          style={{ width: '100%', padding: '16px', backgroundColor: '#ef4444', color: 'var(--color-white)', borderRadius: '999px', fontSize: '16px', fontWeight: 'bold', border: 'none', marginBottom: '12px' }}
        >
          Sí, me rindo
        </button>
        <button 
          onClick={() => setShowSurrenderModal(false)}
          style={{ width: '100%', padding: '16px', backgroundColor: 'var(--color-light-gray)', color: 'var(--color-text)', borderRadius: '999px', fontSize: '16px', fontWeight: 'bold', border: 'none' }}
        >
          No, seguir jugando
        </button>
      </ModalBase>

      {/* Modal Ganado */}
      <ModalBase isOpen={state.matches('ganado')} onClose={() => navigate(-1)}>
        <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: 'var(--color-white)', margin: '0 auto 24px auto', boxShadow: '0 8px 24px rgba(22, 163, 74, 0.3)' }}>
          <i className="fa-solid fa-trophy"></i>
        </div>
        <h2 style={{ fontSize: '24px', color: 'var(--color-text)', margin: '0 0 8px 0', fontFamily: 'var(--font-title)', textAlign: 'center' }}>
          ¡Ganaste!
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--color-gray)', margin: '0 0 32px 0', lineHeight: '1.5', textAlign: 'center' }}>
          Puntos finales: <strong>{score}</strong><br/>
          Tiempo: <strong>{formatearTiempo(elapsedSeconds)}</strong>
        </p>
        <button
          onClick={() => navigate(-1)}
          style={{ width: '100%', padding: '16px', backgroundColor: 'var(--color-blue)', color: 'var(--color-white)', border: 'none', borderRadius: '999px', fontSize: '18px', fontWeight: 700, cursor: 'pointer' }}
        >
          Salir
        </button>
      </ModalBase>

      {/* Modal Perdedor (Rendido) */}
      <ModalBase isOpen={state.matches('surrendered')} onClose={() => navigate(-1)}>
        <h2 style={{ fontSize: '24px', color: 'var(--color-text)', margin: '0 0 8px 0', fontFamily: 'var(--font-title)', textAlign: 'center' }}>
          Fin del juego
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--color-gray)', margin: '0 0 32px 0', lineHeight: '1.5', textAlign: 'center' }}>
          Te has rendido.<br/>
          Puntos: <strong>{score}</strong>
        </p>
        <button
          onClick={() => navigate(-1)}
          style={{ width: '100%', padding: '16px', backgroundColor: 'var(--color-blue)', color: 'var(--color-white)', border: 'none', borderRadius: '999px', fontSize: '18px', fontWeight: 700, cursor: 'pointer' }}
        >
          Salir
        </button>
      </ModalBase>
    </div>
  );
}
