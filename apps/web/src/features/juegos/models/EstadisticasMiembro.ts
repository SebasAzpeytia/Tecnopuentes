export interface EstadisticasMiembro {
  miembroId: string;
  puntosTotales: number;
  rachaDias: number;
  tiempoTotalJugadoMinutos: number;
  ultimaConexion: Date;
}

export const EstadisticasFactory = {
  fromRow(row: any): EstadisticasMiembro {
    return {
      miembroId: row.miembro_id,
      puntosTotales: row.puntos_totales || 0,
      rachaDias: row.racha_dias || 0,
      tiempoTotalJugadoMinutos: Math.ceil((row.tiempo_total_jugado_segundos || 0) / 60),
      ultimaConexion: new Date(row.ultima_conexion)
    };
  }
};
