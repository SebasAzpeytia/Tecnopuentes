import { Module } from '@nestjs/common';

// TODO: un @Cron (de @nestjs/schedule) que corra, ej., una vez al día:
// 1. Consultar sesiones_juego agrupado por usuario_id con Service Role Key.
// 2. Detectar residentes sin actividad en los últimos N días
//    (ver el banner de alerta ya diseñado en la Pantalla 07 del Panel
//    del Anfitrión: "3 residentes sin actividad hace más de 5 días").
// 3. Insertar una notificación o alerta en una tabla nueva
//    (ej. `alertas`, todavía no existe en el schema — agregarla en una
//    migración 003 cuando se implemente esto).

@Module({})
export class AlertasModule {}
