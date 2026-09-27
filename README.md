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

## Estructura

```
apps/web/            PWA — React + Vite (Residente, Monitor, Anfitrión)
apps/api/             NestJS — SOLO reportes, invitaciones y cron jobs
packages/shared-types Tipos TS compartidos (reflejan el schema SQL)
packages/game-engines Máquinas XState de cada juego (memorama, solitario)
supabase/migrations   SQL versionado (tablas, RLS, storage)
```
