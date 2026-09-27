import { create } from 'zustand';
import type { RolAsilo, PermisosMonitor } from '@/lib/permisos';

// Estado global mínimo: quién es el usuario y en qué asilo/rol está
// operando ahora mismo. NO metas aquí estado de juegos (eso es XState,
// ver packages/game-engines) ni estado de formularios locales.
interface SesionState {
  usuarioId: string | null;
  asiloActivoId: string | null;
  rolActivo: RolAsilo | null;
  permisos: PermisosMonitor | null;
  setSesion: (data: Partial<SesionState>) => void;
  limpiarSesion: () => void;
}

export const useSesionStore = create<SesionState>((set) => ({
  usuarioId: null,
  asiloActivoId: null,
  rolActivo: null,
  permisos: null,
  setSesion: (data) => set((state) => ({ ...state, ...data })),
  limpiarSesion: () =>
    set({ usuarioId: null, asiloActivoId: null, rolActivo: null, permisos: null }),
}));
