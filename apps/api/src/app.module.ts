import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ReportesModule } from './modules/reportes/reportes.module';
import { InvitacionesModule } from './modules/invitaciones/invitaciones.module';
import { AlertasModule } from './modules/alertas/alertas.module';

@Module({
  imports: [
    ScheduleModule.forRoot(), // necesario para los cron jobs de AlertasModule
    ReportesModule,
    InvitacionesModule,
    AlertasModule,
  ],
})
export class AppModule {}
