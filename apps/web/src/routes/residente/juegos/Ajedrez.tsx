import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useSesionStore } from '@/state/useSesionStore';
import GameLayout from '@/components/ui/GameLayout';
import ModalBase from '@/components/ui/ModalBase';

type Player = {
  miembro_id: string;
  nombre: string;
  usuario_id: string;
};

export default function AjedrezLobby() {
  const navigate = useNavigate();
  const { asiloActivoId, usuarioId } = useSesionStore();
  const [me, setMe] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [channel, setChannel] = useState<any>(null);
  const [incomingInvite, setIncomingInvite] = useState<{from_miembro_id: string, from_nombre: string} | null>(null);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [showSurrenderModal, setShowSurrenderModal] = useState(false);

  useEffect(() => {
    if (!asiloActivoId || !usuarioId) return;

    let lobbyChannel: any;

    const init = async () => {
      // 1. Obtener datos del jugador actual
      const { data: miembro } = await supabase
        .from('asilo_miembros')
        .select('id, nombre, usuario_id')
        .eq('usuario_id', usuarioId)
        .eq('asilo_id', asiloActivoId)
        .single();

      if (!miembro) return;
      setMe({ miembro_id: miembro.id, nombre: miembro.nombre, usuario_id: miembro.usuario_id });

      // 2. Conectar al canal de Presence
      console.log(`[LOBBY] Conectando al canal: ajedrez_lobby_${asiloActivoId} como ${miembro.nombre}`);
      lobbyChannel = supabase.channel(`ajedrez_lobby_${asiloActivoId}`, {
        config: {
          presence: {
            key: miembro.id,
          },
        },
      });

      lobbyChannel
        .on('presence', { event: 'sync' }, () => {
          const state = lobbyChannel.presenceState();
          console.log('[LOBBY] Presence Sync. Estado actual:', state);
          const onlinePlayers: Player[] = [];
          
          Object.keys(state).forEach((key) => {
            if (key !== miembro.id) { // No incluirme a mi mismo en la lista
              // Presence state is an array for each key
              if (state[key].length > 0) {
                onlinePlayers.push(state[key][0] as Player);
              }
            }
          });
          console.log(`[LOBBY] Jugadores online encontrados: ${onlinePlayers.length}`, onlinePlayers);
          setPlayers(onlinePlayers);
        })
        .on('broadcast', { event: 'invitation' }, ({ payload }: any) => {
          console.log('[LOBBY] Broadcast recibido (invitation):', payload);
          // Check if this invitation is for me
          if (payload.to_miembro_id === miembro.id) {
            console.log(`[LOBBY] ¡Invitación recibida de ${payload.from_nombre}!`);
            setIncomingInvite({
              from_miembro_id: payload.from_miembro_id,
              from_nombre: payload.from_nombre
            });
          }
        })
        .on('broadcast', { event: 'invitation_accepted' }, ({ payload }: any) => {
          console.log('[LOBBY] Broadcast recibido (invitation_accepted):', payload);
          // Check if the accepted invitation was sent by me
          if (payload.to_miembro_id === miembro.id) {
            console.log(`[LOBBY] Invitación aceptada. Navegando a partida: ${payload.partida_id}`);
            navigate(`/juegos/ajedrez/${payload.partida_id}`);
          }
        })
        .on('broadcast', { event: 'invitation_declined' }, ({ payload }: any) => {
          console.log('[LOBBY] Broadcast recibido (invitation_declined):', payload);
          if (payload.to_miembro_id === miembro.id) {
            setWaitingForResponse(false);
            alert(`${payload.from_nombre} no puede jugar en este momento.`);
          }
        })
        .subscribe(async (status: string) => {
          console.log(`[LOBBY] Estado de conexión al canal: ${status}`);
          if (status === 'SUBSCRIBED') {
            const trackStatus = await lobbyChannel.track({
              miembro_id: miembro.id,
              nombre: miembro.nombre,
              usuario_id: miembro.usuario_id
            });
            console.log(`[LOBBY] Track response:`, trackStatus);
          }
        });

      setChannel(lobbyChannel);
    };

    init();

    return () => {
      if (lobbyChannel) {
        supabase.removeChannel(lobbyChannel);
      }
    };
  }, [asiloActivoId, usuarioId, navigate]);

  const invitePlayer = (player: Player) => {
    if (!channel || !me) return;
    
    console.log(`[LOBBY] Enviando invitación a: ${player.nombre} (${player.miembro_id})`);
    setWaitingForResponse(true);
    
    channel.send({
      type: 'broadcast',
      event: 'invitation',
      payload: {
        from_miembro_id: me.miembro_id,
        from_nombre: me.nombre,
        to_miembro_id: player.miembro_id
      }
    });
  };

  const acceptInvite = async () => {
    if (!incomingInvite || !me || !channel) return;
    
    try {
      // Create the game in the DB
      const { data: partida, error } = await supabase
        .from('partidas_ajedrez')
        .insert({
          asilo_id: asiloActivoId,
          jugador_blancas: incomingInvite.from_miembro_id, // El que invita juega con blancas
          jugador_negras: me.miembro_id
        })
        .select()
        .single();
        
      if (error || !partida) throw error;
      
      // Notify the inviter that we accepted and give them the match ID
      channel.send({
        type: 'broadcast',
        event: 'invitation_accepted',
        payload: {
          from_miembro_id: me.miembro_id,
          to_miembro_id: incomingInvite.from_miembro_id,
          partida_id: partida.id
        }
      });
      
      // Navigate ourselves to the game
      navigate(`/juegos/ajedrez/${partida.id}`);
      
    } catch (err) {
      console.error('Error al crear partida:', err);
      alert('Hubo un error al crear la partida.');
    }
  };

  const declineInvite = () => {
    if (!incomingInvite || !me || !channel) return;
    
    channel.send({
      type: 'broadcast',
      event: 'invitation_declined',
      payload: {
        from_miembro_id: me.miembro_id,
        from_nombre: me.nombre,
        to_miembro_id: incomingInvite.from_miembro_id
      }
    });
    setIncomingInvite(null);
  };

  return (
    <GameLayout 
      onSurrender={() => setShowSurrenderModal(true)} 
      timeSeconds={0} 
      score={0} 
      backgroundColor="var(--color-navy)"
    >
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '32px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '96px',
            height: '96px',
            backgroundColor: 'var(--color-surface)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            color: 'var(--color-navy)',
            margin: '0 auto 16px auto',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <i className="fa-solid fa-chess-knight"></i>
          </div>
          <h1 style={{ fontSize: '32px', color: 'var(--color-text)', marginBottom: '8px', fontFamily: 'var(--font-title)' }}>
            Lobby de Ajedrez
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--color-gray)' }}>
            Selecciona a un compañero para jugar una partida.
          </p>
        </div>

        {waitingForResponse ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--color-surface)', borderRadius: '16px', width: '100%' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '32px', color: 'var(--color-navy)', marginBottom: '16px' }}></i>
            <h3 style={{ fontSize: '20px', color: 'var(--color-text)' }}>Esperando respuesta...</h3>
          </div>
        ) : (
          <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
            {players.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '16px' }}>
                <p style={{ fontSize: '18px', color: 'var(--color-gray)' }}>
                  Aún no hay nadie más en el lobby.<br/>
                  Espera aquí a que alguien más entre a Ajedrez.
                </p>
              </div>
            ) : (
              players.map(player => (
                <button
                  key={player.miembro_id}
                  onClick={() => invitePlayer(player)}
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                  }}
                >
                  <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'var(--color-background)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    color: 'var(--color-navy)',
                    marginBottom: '16px'
                  }}>
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <h3 style={{ fontSize: '20px', color: 'var(--color-text)', margin: '0 0 8px 0', fontFamily: 'var(--font-title)' }}>
                    {player.nombre}
                  </h3>
                  <span style={{ fontSize: '14px', color: 'var(--color-white)', backgroundColor: 'var(--color-green)', padding: '4px 12px', borderRadius: '999px', fontWeight: 'bold' }}>
                    Invitar a jugar
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal Recibir Invitación */}
      <ModalBase isOpen={!!incomingInvite} onClose={declineInvite}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-navy)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: 'var(--color-white)', margin: '0 auto 24px auto', boxShadow: '0 8px 24px rgba(30, 58, 138, 0.3)' }}>
            <i className="fa-solid fa-chess-knight"></i>
          </div>
          <h2 style={{ fontSize: '28px', color: 'var(--color-text)', marginBottom: '16px', fontFamily: 'var(--font-title)' }}>
            ¡Invitación de Ajedrez!
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--color-gray)', margin: '0 0 32px 0', lineHeight: '1.5' }}>
            <strong>{incomingInvite?.from_nombre}</strong> te está invitando a jugar una partida de ajedrez.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={acceptInvite}
              style={{ padding: '16px', backgroundColor: 'var(--color-green)', color: 'var(--color-white)', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(22, 163, 74, 0.2)' }}
            >
              Aceptar y jugar
            </button>
            <button
              onClick={declineInvite}
              style={{ padding: '16px', backgroundColor: 'transparent', color: 'var(--color-gray)', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Rechazar
            </button>
          </div>
        </div>
      </ModalBase>

      {/* Modal Rendirse (Salir del Lobby) */}
      <ModalBase isOpen={showSurrenderModal} onClose={() => setShowSurrenderModal(false)}>
        <div style={{ textAlign: 'center' }}>
          <i className="fa-solid fa-door-open" style={{ fontSize: '48px', color: 'var(--color-gray)', marginBottom: '16px' }}></i>
          <h2 style={{ fontSize: '24px', color: 'var(--color-text)', marginBottom: '16px', fontFamily: 'var(--font-title)' }}>¿Salir de Ajedrez?</h2>
          <p style={{ fontSize: '16px', color: 'var(--color-gray)', marginBottom: '32px' }}>
            Regresarás al menú principal.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => navigate('/home', { replace: true })}
              style={{ padding: '16px', backgroundColor: 'var(--color-red)', color: 'var(--color-white)', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Salir
            </button>
            <button
              onClick={() => setShowSurrenderModal(false)}
              style={{ padding: '16px', backgroundColor: 'transparent', color: 'var(--color-gray)', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Quedarme
            </button>
          </div>
        </div>
      </ModalBase>
    </GameLayout>
  );
}
