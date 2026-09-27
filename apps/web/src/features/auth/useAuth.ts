import { useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

// TODO: envolver esto en un Context/Provider si se necesita el usuario
// actual en muchos componentes. Por ahora, funciones puras reutilizables.

export function useAuth() {
  const iniciarSesion = useCallback(async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  }, []);

  const crearCuenta = useCallback(
    async (email: string, password: string, nombreCompleto: string) => {
      return supabase.auth.signUp({
        email,
        password,
        options: { data: { nombre_completo: nombreCompleto } },
      });
    },
    []
  );

  const cerrarSesion = useCallback(async () => {
    return supabase.auth.signOut();
  }, []);

  // TODO: implementar iniciarSesionConGoogle / iniciarSesionConApple
  // usando supabase.auth.signInWithOAuth({ provider: 'google' | 'apple' }).

  return { iniciarSesion, crearCuenta, cerrarSesion };
}
