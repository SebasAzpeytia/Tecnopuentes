import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useSesionStore } from '@/state/useSesionStore';
import GameLayout from '@/components/ui/GameLayout';
import ModalBase from '@/components/ui/ModalBase';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

export default function AjedrezJuego() {
  const { partidaId } = useParams();
  const navigate = useNavigate();
  const { asiloActivoId, usuarioId } = useSesionStore();
  
  const [game] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [miColor, setMiColor] = useState<'white' | 'black' | null>(null);
  const [miembroId, setMiembroId] = useState<string | null>(null);
  const [oponenteNombre, setOponenteNombre] = useState<string>('Oponente');
  
  const [loading, setLoading] = useState(true);
  const [showSurrenderModal, setShowSurrenderModal] = useState(false);
  const [gameStatus, setGameStatus] = useState<'en_curso' | 'ganado' | 'perdido' | 'abandonado' | 'esperando'>('esperando');
  const [startTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Reloj
  useEffect(() => {
    if (gameStatus === 'en_curso') {
      const interval = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStatus, startTime]);

  useEffect(() => {
    if (!partidaId || !usuarioId || !asiloActivoId) return;

    let subscription: any;

    const init = async () => {
      // 1. Obtener mi miembro_id
      const { data: miembro } = await supabase
        .from('asilo_miembros')
        .select('id')
        .eq('usuario_id', usuarioId)
        .eq('asilo_id', asiloActivoId)
        .single();

      if (!miembro) return;
      setMiembroId(miembro.id);

      // 2. Obtener datos de la partida
      const { data: partida } = await supabase
        .from('partidas_ajedrez')
        .select('*, blancas:asilo_miembros!jugador_blancas(nombre), negras:asilo_miembros!jugador_negras(nombre)')
        .eq('id', partidaId)
        .single();

      if (!partida) {
        alert('Partida no encontrada');
        navigate('/juegos/ajedrez');
        return;
      }

      // Determinar mi color y el nombre del oponente
      if (partida.jugador_blancas === miembro.id) {
        setMiColor('white');
        setOponenteNombre(partida.negras?.nombre || 'Oponente');
      } else if (partida.jugador_negras === miembro.id) {
        setMiColor('black');
        setOponenteNombre(partida.blancas?.nombre || 'Oponente');
      } else {
        alert('No eres parte de esta partida');
        navigate('/juegos/ajedrez');
        return;
      }

      // Sincronizar estado inicial
      game.load(partida.fen);
      setFen(partida.fen);
      
      if (partida.estado === 'esperando') {
        // Si somos las negras, significa que ya entramos y la partida debe empezar
        if (partida.jugador_negras === miembro.id) {
          console.log('[JUEGO] Segundo jugador (negras) entró. Iniciando partida...');
          await supabase.from('partidas_ajedrez').update({ estado: 'en_curso' }).eq('id', partidaId);
          setGameStatus('en_curso');
        } else {
          console.log('[JUEGO] Primer jugador (blancas) entró. Esperando al oponente...');
          setGameStatus('esperando'); // Esperando que entren las negras
        }
      } else {
        verificarFinJuego(partida.estado, partida.ganador_id, miembro.id);
      }

      setLoading(false);

      // 3. Suscribirse a cambios
      console.log(`[JUEGO] Suscribiéndose a Postgres Changes en partidas_ajedrez, id=${partidaId}`);
      subscription = supabase
        .channel(`partida_${partidaId}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'partidas_ajedrez', filter: `id=eq.${partidaId}` },
          (payload) => {
            console.log('[JUEGO] Cambio recibido en la BD:', payload.new);
            const nuevaPartida = payload.new;
            
            // Si el fen cambió (el oponente movió)
            if (nuevaPartida.fen !== game.fen()) {
              console.log('[JUEGO] FEN es diferente, actualizando tablero local...');
              game.load(nuevaPartida.fen);
              setFen(nuevaPartida.fen);
            }

            verificarFinJuego(nuevaPartida.estado, nuevaPartida.ganador_id, miembro.id);
          }
        )
        .subscribe((status) => {
          console.log(`[JUEGO] Estado de conexión al canal de la partida: ${status}`);
        });
    };

    init();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [partidaId, usuarioId, asiloActivoId]);

  const verificarFinJuego = (estadoBD: string, ganadorId: string | null, miId: string) => {
    if (estadoBD === 'en_curso') {
      setGameStatus('en_curso');
    } else if (estadoBD === 'finalizada' || estadoBD === 'abandonada') {
      if (ganadorId === miId) {
        setGameStatus('ganado');
      } else {
        setGameStatus(estadoBD === 'abandonada' ? 'abandonado' : 'perdido');
      }
    }
  };

  const onDrop = (args: any): boolean => {
    const { sourceSquare, targetSquare, piece } = args;
    if (gameStatus !== 'en_curso' || !miColor || !targetSquare) return false;
    
    // Validar si es mi turno
    if ((game.turn() === 'w' && miColor !== 'white') || (game.turn() === 'b' && miColor !== 'black')) {
      return false;
    }

    try {
      // Intentar hacer el movimiento localmente
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: piece[1]?.toLowerCase() ?? 'q', // Siempre promueve a reina para simplicidad
      });

      if (move === null) return false;

      // Movimiento válido localmente
      setFen(game.fen());

      // Revisar si hay jaque mate / fin de juego
      let nuevoEstado = 'en_curso';
      let ganadorId = null;

      if (game.isGameOver()) {
        nuevoEstado = 'finalizada';
        if (game.isCheckmate()) {
          ganadorId = miembroId; // Yo gané
        }
      }

      console.log('[JUEGO] Movimiento detectado en UI, actualizando DB:', { fen: game.fen(), turno: game.turn(), estado: nuevoEstado });

      // Actualizar DB (async en background)
      supabase.from('partidas_ajedrez').update({
        fen: game.fen(),
        turno: game.turn(),
        estado: nuevoEstado,
        ganador_id: ganadorId
      }).eq('id', partidaId).then(() => {
        if (nuevoEstado === 'finalizada') {
          registrarResultados(nuevoEstado, ganadorId);
        }
      });

      return true;
    } catch (e) {
      return false;
    }
  };

  const registrarResultados = async (estadoFinal: string, ganadorId: string | null) => {
    if (!miembroId || !asiloActivoId) return;

    // Solo el ganador (o el perdedor si el otro abandonó) registra los puntos para evitar duplicidad de lógica.
    // Pero en realidad cada cliente puede registrar su propio resultado para evitar problemas.
    
    // Mi puntaje: 100 si gano, 0 si empato/pierdo
    let puntos = 0;
    if (ganadorId === miembroId) {
      puntos = 100;
    }

    // Castigo si abandoné
    if (estadoFinal === 'abandonada' && ganadorId !== miembroId) {
      const { data: acts } = await supabase.from('actividad_juegos')
        .select('puntaje_obtenido')
        .eq('miembro_id', miembroId);
      const rawTotal = acts?.reduce((sum, r) => sum + (r.puntaje_obtenido || 0), 0) || 0;
      const totalScore = Math.max(0, rawTotal);
      puntos = Math.max(-50, -totalScore); // Pierde hasta 50 por abandonar
    }

    // Insertar en actividad
    const { data: juego } = await supabase.from('juegos').select('id').eq('slug', 'ajedrez').single();
    if (juego) {
      await supabase.from('actividad_juegos').insert({
        miembro_id: miembroId,
        juego_id: juego.id,
        duracion_segundos: elapsedSeconds,
        puntaje_obtenido: puntos
      });
    }
  };

  const handleSurrender = async () => {
    setShowSurrenderModal(false);
    
    if (gameStatus === 'en_curso' && miembroId) {
      // Si nos rendimos, el oponente es el ganador
      // Obtenemos al oponente de la BD primero
      const { data: partida } = await supabase.from('partidas_ajedrez').select('jugador_blancas, jugador_negras').eq('id', partidaId).single();
      const oponenteId = partida?.jugador_blancas === miembroId ? partida.jugador_negras : partida?.jugador_blancas;

      await supabase.from('partidas_ajedrez').update({
        estado: 'abandonada',
        ganador_id: oponenteId
      }).eq('id', partidaId);

      await registrarResultados('abandonada', oponenteId);
    }

    navigate('/juegos/ajedrez', { replace: true });
  };

  const getTurnMessage = () => {
    if (gameStatus === 'esperando') return `Esperando a ${oponenteNombre}...`;
    if (gameStatus === 'ganado') return '¡Has ganado la partida!';
    if (gameStatus === 'perdido') return 'Has perdido la partida.';
    if (gameStatus === 'abandonado') return `${oponenteNombre} abandonó la partida.`;
    
    // en_curso
    if ((game.turn() === 'w' && miColor === 'white') || (game.turn() === 'b' && miColor === 'black')) {
      return '¡Es tu turno!';
    } else {
      return `Turno de ${oponenteNombre}`;
    }
  };

  return (
    <GameLayout 
      onSurrender={() => setShowSurrenderModal(true)} 
      timeSeconds={elapsedSeconds} 
      score={miColor === 'white' ? 'Blancas' : (miColor === 'black' ? 'Negras' : '')} 
      backgroundColor="var(--color-navy)"
    >
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', marginTop: '60px' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '48px', color: 'var(--color-white)' }}></i>
          </div>
        ) : (
          <>
            <div style={{ 
              backgroundColor: 'var(--color-surface)', 
              padding: '16px 32px', 
              borderRadius: '999px',
              marginBottom: '24px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ 
                width: '16px', 
                height: '16px', 
                backgroundColor: ((game.turn() === 'w' && miColor === 'white') || (game.turn() === 'b' && miColor === 'black')) ? 'var(--color-green)' : 'var(--color-gray)', 
                borderRadius: '50%' 
              }} />
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-text)' }}>
                {getTurnMessage()}
              </span>
            </div>

            <div style={{ 
              width: '100%', 
              maxWidth: '500px',
              aspectRatio: '1',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <Chessboard 
                options={{
                  position: fen,
                  onPieceDrop: onDrop,
                  boardOrientation: miColor || 'white',
                  darkSquareStyle: { backgroundColor: '#1e3a8a' }, // var(--color-navy)
                  lightSquareStyle: { backgroundColor: '#e2e8f0' } // var(--color-surface)
                }}
              />
            </div>
            
            <div style={{ marginTop: '24px', fontSize: '18px', color: 'rgba(255,255,255,0.8)' }}>
              Estás jugando contra: <strong>{oponenteNombre}</strong>
            </div>
          </>
        )}

      </div>

      {/* Modal Rendirse */}
      <ModalBase isOpen={showSurrenderModal} onClose={() => setShowSurrenderModal(false)}>
        <div style={{ textAlign: 'center' }}>
          <i className="fa-solid fa-flag" style={{ fontSize: '48px', color: 'var(--color-gray)', marginBottom: '16px' }}></i>
          <h2 style={{ fontSize: '24px', color: 'var(--color-text)', marginBottom: '16px', fontFamily: 'var(--font-title)' }}>¿Te rindes?</h2>
          <p style={{ fontSize: '16px', color: 'var(--color-gray)', marginBottom: '32px' }}>
            Si sales ahora, perderás la partida y 50 puntos globales.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleSurrender}
              style={{ padding: '16px', backgroundColor: 'var(--color-red)', color: 'var(--color-white)', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Sí, rendirme
            </button>
            <button
              onClick={() => setShowSurrenderModal(false)}
              style={{ padding: '16px', backgroundColor: 'transparent', color: 'var(--color-gray)', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Seguir jugando
            </button>
          </div>
        </div>
      </ModalBase>

      {/* Modal Fin de Juego */}
      <ModalBase isOpen={gameStatus === 'ganado' || gameStatus === 'perdido' || gameStatus === 'abandonado'} onClose={() => navigate('/juegos/ajedrez', { replace: true })}>
        <div style={{ textAlign: 'center' }}>
          {gameStatus === 'ganado' ? (
            <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: 'var(--color-white)', margin: '0 auto 24px auto', boxShadow: '0 8px 24px rgba(22, 163, 74, 0.3)' }}>
              <i className="fa-solid fa-trophy"></i>
            </div>
          ) : (
            <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-gray)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: 'var(--color-white)', margin: '0 auto 24px auto' }}>
              <i className="fa-solid fa-xmark"></i>
            </div>
          )}
          
          <h2 style={{ fontSize: '28px', color: 'var(--color-text)', marginBottom: '16px', fontFamily: 'var(--font-title)' }}>
            {gameStatus === 'ganado' ? '¡Ganaste!' : (gameStatus === 'abandonado' ? 'Oponente abandonó' : 'Has perdido')}
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--color-gray)', margin: '0 0 32px 0', lineHeight: '1.5', textAlign: 'center' }}>
            {gameStatus === 'ganado' ? '¡Excelente partida! Has sumado 100 puntos.' : 
             (gameStatus === 'abandonado' ? `¡Ganaste por abandono! Has sumado 100 puntos.` : 'Buena suerte para la próxima.')}
          </p>
          <button
            onClick={() => navigate('/home', { replace: true })}
            style={{ padding: '16px', backgroundColor: 'var(--color-navy)', color: 'var(--color-white)', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', width: '100%', boxShadow: '0 4px 6px rgba(30, 58, 138, 0.2)' }}
          >
            Regresar al menú
          </button>
        </div>
      </ModalBase>
    </GameLayout>
  );
}
