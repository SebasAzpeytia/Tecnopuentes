import { Module } from '@nestjs/common';

// La mayoría de la lógica de invitación YA vive en Supabase
// (tabla codigos_invitacion + función RPC canjear_codigo_invitacion).
// Este módulo solo es necesario si aparece un caso que requiera
// privilegios de servicio, por ejemplo: enviar el código por SMS/email
// usando un proveedor externo (Twilio, Resend, etc.) al momento de
// generarlo desde la Pantalla 13.

@Module({})
export class InvitacionesModule {}
