// Estas interfaces reflejan EXACTAMENTE el esquema de
// supabase/migrations/001_schema_inicial_tecnopuentes.sql.
// Si cambias una columna en el SQL, actualiza este archivo también.

export type RolAsilo = 'residente' | 'monitor' | 'anfitrion';
export type EstadoMembresia = 'activo' | 'pendiente' | 'suspendido';
export type TipoPersonalizacion = 'emoji' | 'imagen' | 'dibujo';

export interface Perfil {
  id: string;
  nombre_completo: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Asilo {
  id: string;
  nombre: string;
  direccion: string | null;
  creado_por: string;
  created_at: string;
  updated_at: string;
}

export interface AsiloMiembro {
  id: string;
  usuario_id: string;
  asilo_id: string;
  rol: RolAsilo;
  estado: EstadoMembresia;
  edad: number | null;
  created_at: string;
  updated_at: string;
}

export interface PermisosMonitor {
  asilo_miembro_id: string;
  ver_dashboard: boolean;
  gestionar_miembros: boolean;
  personalizacion: boolean;
  ver_reportes: boolean;
  moderar_chat: boolean;
  updated_at: string;
}

export interface CodigoInvitacion {
  id: string;
  codigo: string;
  asilo_id: string;
  rol_asignado: RolAsilo;
  permisos_predefinidos: Partial<
    Pick<
      PermisosMonitor,
      'ver_dashboard' | 'gestionar_miembros' | 'personalizacion' | 'ver_reportes' | 'moderar_chat'
    >
  > | null;
  creado_por: string;
  usado_por: string | null;
  usado: boolean;
  expira_en: string | null;
  created_at: string;
}

export interface Juego {
  id: string;
  slug: 'memorama' | 'solitario'; // ampliar cuando se agreguen más juegos en v2
  nombre: string;
  activo: boolean;
}

export interface ElementoPersonalizable {
  id: string;
  asilo_id: string;
  juego_id: string;
  clave: string;
  nombre_visible: string;
  tipo: TipoPersonalizacion;
  valor: string; // emoji unicode, o URL de Storage
  updated_by: string | null;
  updated_at: string;
}

export interface SesionJuego {
  id: string;
  usuario_id: string;
  asilo_id: string;
  juego_id: string;
  duracion_seg: number;
  puntaje: number | null;
  completado: boolean;
  started_at: string;
  ended_at: string | null;
}

export interface MensajeChat {
  id: string;
  asilo_id: string;
  usuario_id: string;
  contenido: string;
  created_at: string;
}
