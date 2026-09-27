import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// IMPORTANTE (ver CONTEXT.md sección 2, decisión 5): este backend NO es
// un proxy general de la base de datos. Solo debe exponer endpoints
// para lo que NO puede/debe pasar por el cliente:
//   - Generación de reportes PDF/Excel (módulo reportes/)
//   - Operaciones que requieran saltar RLS con la Service Role Key
//     (módulo invitaciones/, si aplica)
//   - Cron jobs de alertas de inactividad (módulo alertas/)
// El 80% de las operaciones del día a día van directo de la PWA a
// Supabase — no dupliques esa lógica aquí.

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // TODO: restringir origen en producción
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
