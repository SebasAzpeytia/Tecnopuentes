import { Module } from '@nestjs/common';

// TODO: ReportesController con endpoints como:
//   POST /reportes/actividad-general?asiloId=...&desde=...&hasta=...
//   POST /reportes/individual?usuarioId=...
// ReportesService debe: consultar Supabase con la Service Role Key
// (saltando RLS deliberadamente porque este endpoint SÍ está autorizado
// a ver todo el asilo), agregar los datos, y generar el PDF/Excel
// (ej. con pdfkit o exceljs) devolviendo el archivo.

@Module({})
export class ReportesModule {}
