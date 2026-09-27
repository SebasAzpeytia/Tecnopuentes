// Refleja la lógica de la función SQL `tiene_permiso` (ver migración 001).
// Esto es SOLO para decidir qué mostrar en la UI — la seguridad real
// vive en las políticas RLS de Supabase, nunca confíes solo en esto.

export type RolAsilo = 'residente' | 'monitor' | 'anfitrion';

export interface PermisosMonitor {
  ver_dashboard: boolean;
  gestionar_miembros: boolean;
  personalizacion: boolean;
  ver_reportes: boolean;
  moderar_chat: boolean;
}

export function tienePermiso(
  rol: RolAsilo,
  permisos: PermisosMonitor | null,
  permiso: keyof PermisosMonitor
): boolean {
  if (rol === 'anfitrion') return true;
  if (rol === 'residente' || !permisos) return false;
  return Boolean(permisos[permiso]);
}
