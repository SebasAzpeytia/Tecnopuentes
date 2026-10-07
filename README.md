# TecnoPuentes

App PWA (React + Vite) mobile-first para asilos: conecta Residentes,
Monitores/Personal y Anfitriones (dueños del asilo) alrededor de juegos
clásicos, chat grupal y personalización visual.

## Empezar

1. Lee **CONTEXT.md** primero — tiene todo el contexto de producto,
   las decisiones ya tomadas, y los próximos pasos priorizados.
2. Corre las migraciones en `supabase/migrations/` sobre tu proyecto
   de Supabase (SQL Editor o `supabase db push`).
3. Copia `apps/web/.env.example` a `apps/web/.env` y llena tus llaves
   de Supabase.
4. `npm install` en la raíz (workspaces), luego `npm run dev:web`.

## Estado Actual (Octubre 2026)

✅ **Fase 1 completada:**
- Interfaz (UI) construida para los tres roles.
- Esquema de Base de Datos y políticas de seguridad (RLS) listos.
- Reglas SEO y de semántica HTML definidas (`GEMINI.md`).
- Personalización de Juegos (Fase 1: Emojis) conectada a Supabase en tiempo real.
- **Motores de Juego implementados**: Solitario (con XState), Memorama y Ajedrez Multijugador (con Supabase Realtime). Todos cuentan con registro de actividad histórica.

⚠️ **Próximos pasos en desarrollo:**
- Conexión del chat grupal y la sección de "Mi Actividad".
- Subida de imágenes personalizadas a Supabase Storage (Fase 2 de Personalización).

## Estructura

```
apps/web/            PWA — React + Vite (Residente, Monitor, Anfitrión)
apps/api/             NestJS — SOLO reportes, invitaciones y cron jobs
packages/shared-types Tipos TS compartidos (reflejan el schema SQL)
packages/game-engines Máquinas XState de cada juego (memorama, solitario)
supabase/migrations   SQL versionado (tablas, RLS, storage, datos por defecto)
```
