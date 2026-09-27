import { useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useAsilo() {
  // Resuelve toda la pantalla 18 (Ingresar código) en una sola llamada RPC.
  const canjearCodigo = useCallback(async (codigo: string) => {
    return supabase.rpc('canjear_codigo_invitacion', { p_codigo: codigo });
  }, []);

  const crearAsilo = useCallback(async (nombre: string, direccion?: string) => {
    // TODO: al crear, insertar también una fila en asilo_miembros con
    // rol='anfitrion' para el usuario actual (puede hacerse en un
    // trigger SQL o aquí en dos pasos).
    return supabase.from('asilos').insert({ nombre, direccion }).select().single();
  }, []);

  return { canjearCodigo, crearAsilo };
}
