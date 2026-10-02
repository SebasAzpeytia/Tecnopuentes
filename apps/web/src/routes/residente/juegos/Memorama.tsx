import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useSesionStore } from '@/state/useSesionStore';
import ModalBase from '@/components/ui/ModalBase';

const EMOJIS = ['🐶', '🚗', '🍎', '🌻', '🎸', '⚽'];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function Memorama() {
  const navigate = useNavigate();
  const { asiloActivoId, usuarioId } = useSesionStore();

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [juegoId, setJuegoId] = useState<string | null>(null);
  
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [duracion, setDuracion] = useState(0);

  // Obtener ID del juego y mezclar cartas
  useEffect(() => {
    async function init() {
      const { data } = await supabase.from('juegos').select('id').eq('slug', 'memorama').single();
      if (data) setJuegoId(data.id);
      iniciarJuego();
    }
    init();
  }, []);

  const iniciarJuego = () => {
    const deck = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, idx) => ({
        id: idx,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(deck);
    setFlippedIndices([]);
    setMatches(0);
    setShowModal(false);
    setStartTime(Date.now());
  };

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2) return; // Esperando animación
    if (cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      verificarPar(newFlipped[0], newFlipped[1]);
    }
  };

  const verificarPar = (idx1: number, idx2: number) => {
    if (cards[idx1].emoji === cards[idx2].emoji) {
      // Match!
      setTimeout(() => {
        const newCards = [...cards];
        newCards[idx1].isMatched = true;
        newCards[idx2].isMatched = true;
        setCards(newCards);
        setFlippedIndices([]);
        
        const nuevosAciertos = matches + 1;
        setMatches(nuevosAciertos);
        
        if (nuevosAciertos === EMOJIS.length) {
          finalizarJuego();
        }
      }, 500);
    } else {
      // No match
      setTimeout(() => {
        const newCards = [...cards];
        newCards[idx1].isFlipped = false;
        newCards[idx2].isFlipped = false;
        setCards(newCards);
        setFlippedIndices([]);
      }, 1000);
    }
  };

  const finalizarJuego = async () => {
    if (!startTime || !asiloActivoId || !usuarioId || !juegoId) return;
    
    const end = Date.now();
    const duracionSegundos = Math.floor((end - startTime) / 1000);
    setDuracion(duracionSegundos);
    setShowModal(true);

    // Guardar en la DB
    await supabase.from('sesiones_juego').insert({
      asilo_id: asiloActivoId,
      usuario_id: usuarioId,
      juego_id: juegoId,
      duracion_segundos: duracionSegundos
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header simple */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '24px', gap: '16px', backgroundColor: 'var(--color-white)', borderBottom: '1px solid var(--color-light-gray)' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', backgroundColor: 'var(--color-light-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '16px', color: 'var(--color-text)' }}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 style={{ margin: 0, fontSize: '24px', fontFamily: 'var(--font-title)', color: 'var(--color-text)' }}>
          Memorama
        </h1>
      </div>

      {/* Grid de Juego */}
      <div style={{ flex: 1, padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', width: '100%', maxWidth: '400px' }}>
          {cards.map((card, idx) => (
            <div 
              key={card.id}
              onClick={() => handleCardClick(idx)}
              style={{
                aspectRatio: '1',
                backgroundColor: card.isFlipped || card.isMatched ? 'var(--color-white)' : 'var(--color-blue)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                cursor: 'pointer',
                boxShadow: card.isFlipped || card.isMatched ? '0 4px 12px rgba(0,0,0,0.1)' : '0 4px 12px rgba(27, 85, 238, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: card.isFlipped || card.isMatched ? 'rotateY(0)' : 'rotateY(180deg)',
                border: card.isMatched ? '4px solid var(--color-green)' : 'none',
                opacity: card.isMatched ? 0.7 : 1
              }}
            >
              <span style={{ transform: card.isFlipped || card.isMatched ? 'rotateY(0)' : 'rotateY(180deg)', opacity: card.isFlipped || card.isMatched ? 1 : 0, transition: 'opacity 0.2s' }}>
                {card.emoji}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Victoria */}
      <ModalBase isOpen={showModal} onClose={() => {}}>
        <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: 'var(--color-white)', marginBottom: '24px', boxShadow: '0 8px 24px rgba(22, 163, 74, 0.3)' }}>
          <i className="fa-solid fa-star"></i>
        </div>
        <h2 style={{ fontSize: '24px', color: 'var(--color-text)', margin: '0 0 8px 0', fontFamily: 'var(--font-title)' }}>
          ¡Felicidades!
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--color-gray)', margin: '0 0 32px 0', lineHeight: '1.5' }}>
          Completaste el memorama en <strong>{duracion} segundos</strong>. ¡Tu memoria es excelente!
        </p>
        
        <button
          onClick={iniciarJuego}
          style={{ width: '100%', padding: '16px', backgroundColor: 'var(--color-blue)', color: 'var(--color-white)', border: 'none', borderRadius: '999px', fontSize: '18px', fontWeight: 700, cursor: 'pointer', marginBottom: '16px', boxShadow: '0 4px 12px rgba(27, 85, 238, 0.3)' }}
        >
          Volver a jugar
        </button>
        
        <button
          onClick={() => navigate(-1)}
          style={{ width: '100%', padding: '16px', backgroundColor: 'transparent', border: '2px solid var(--color-light-gray)', color: 'var(--color-gray)', borderRadius: '999px', fontSize: '18px', fontWeight: 700, cursor: 'pointer' }}
        >
          Salir
        </button>
      </ModalBase>
    </div>
  );
}
