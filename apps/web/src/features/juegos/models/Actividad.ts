export interface Actividad {
  id: string;
  miembroId: string;
  juegoSlug: string;
  puntaje: number;
  duracionMinutos: number;
  fecha: Date;
}

export const ActividadFactory = {
  // Convierte un registro de DB a un objeto limpio del Frontend
  fromRow(row: any): Actividad {
    return {
      id: row.id,
      miembroId: row.miembro_id,
      // Si la DB mandó el join con la tabla de juegos, extraemos el slug. Si no, default.
      juegoSlug: row.juegos?.slug || 'desconocido',
      puntaje: row.puntaje_obtenido,
      duracionMinutos: Math.ceil((row.duracion_segundos || 0) / 60),
      fecha: new Date(row.creado_en)
    };
  },

  // Convierte listas completas
  fromRowList(rows: any[]): Actividad[] {
    return rows.map((row) => this.fromRow(row));
  }
};
