import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

// TODO: este hook debe:
// 1. Cargar el historial reciente de mensajes_chat del asilo activo.
// 2. Suscribirse a Supabase Realtime (postgres_changes) para nuevos
//    mensajes de ese mismo asilo_id.
// 3. Exponer una función enviarMensaje().
// Referencia: https://supabase.com/docs/guides/realtime/postgres-changes

export function useChat(asiloId: string) {
  const enviarMensaje = useCallback(
    async (usuarioId: string, contenido: string) => {
      return supabase.from('mensajes_chat').insert({
        asilo_id: asiloId,
        usuario_id: usuarioId,
        contenido,
      });
    },
    [asiloId]
  );

  useEffect(() => {
    // TODO: implementar la suscripción de Realtime aquí y limpiar en el
    // return (unsubscribe) cuando el componente se desmonte.
  }, [asiloId]);

  return { enviarMensaje };
}
