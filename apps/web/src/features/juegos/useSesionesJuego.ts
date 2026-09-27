import { useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface RegistrarSesionInput {
  usuarioId: string;
  asiloId: string;
  juegoId: string;
  duracionSeg: number;
  puntaje?: number;
}

export function useSesionesJuego() {
  const registrarSesion = useCallback(async (input: RegistrarSesionInput) => {
    return supabase.from('sesiones_juego').insert({
      usuario_id: input.usuarioId,
      asilo_id: input.asiloId,
      juego_id: input.juegoId,
      duracion_seg: input.duracionSeg,
      puntaje: input.puntaje,
      ended_at: new Date().toISOString(),
    });
  }, []);

  // TODO: agregar useMiActividad() — query agregada de sesiones_juego
  // del usuario actual, agrupada por juego y por día (para la pantalla
  // "Mi Actividad").

  return { registrarSesion };
}
