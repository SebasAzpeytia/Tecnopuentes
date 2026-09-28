# CONTEXT.md — TecnoPuentes

> Este archivo existe para que cualquier persona (o IA asistente dentro de
> Antigravity) pueda retomar este proyecto sin perder contexto. Contiene
> la visión de producto, las decisiones ya tomadas (y por qué), el estado
> actual, y los siguientes pasos priorizados. Léelo completo antes de
> escribir código nuevo.

---

## 1. Qué es TecnoPuentes

App **PWA mobile-first** (no nativa — se instala desde el navegador vía
"Agregar a inicio", sin App Store/Play Store) dirigida a asilos de
adultos mayores. No es solo una app de juegos: es una herramienta de
**alfabetización digital disfrazada de entretenimiento**, que además le
da al asilo visibilidad sobre el bienestar y tiempo de pantalla de sus
residentes.

### Los tres roles (viven en el mismo código, misma app)

| Rol | Qué hace |
|---|---|
| **Residente** | Adulto mayor. Juega, ve su propia actividad, chatea con otros residentes de su asilo. |
| **Monitor** | Personal del asilo invitado por el Anfitrión, con **permisos granulares individuales** (no roles fijos): ver dashboard, gestionar miembros, personalización, ver reportes, moderar chat. |
| **Anfitrión** | Dueño/administrador del asilo. Ve estadísticas, gestiona miembros y monitores, genera reportes, personaliza visualmente la experiencia. |

Un mismo usuario puede tener **distinto rol en distinto asilo** — el
rol no es un atributo del usuario, es un atributo de su membresía a un
asilo específico (tabla `asilo_miembros`).

---

## 2. Decisiones de arquitectura ya tomadas (y por qué)

Estas decisiones vinieron de varias rondas de análisis — no las
reabras sin una razón fuerte, ya se evaluaron alternativas.

1. **PWA, no app nativa.** Se descartó React Native/Expo a propósito.
   Motivo: cero fricción de instalación para adultos mayores (sin App
   Store, sin cuenta de desarrollador de Apple), actualizaciones
   instantáneas para todos sin builds nativos.

2. **Un solo flujo de login universal** para los 3 roles: Bienvenida →
   Iniciar sesión / Crear cuenta → Unirse a un asilo → Ingresar código.
   (Hubo una versión anterior de "login gigante para adulto mayor" en
   una sola pantalla — se eliminó por duplicar lógica; los tamaños de
   botón grandes se mantienen *dentro* de la experiencia ya autenticada
   del residente, no en el login).

3. **El código de invitación lleva el rol embebido.** La pantalla
   "Ingresar código" nunca pregunta "¿eres residente o monitor?" — eso
   ya viene decidido por el Anfitrión al generar el código
   (`codigos_invitacion.rol_asignado`), junto con los permisos
   predefinidos si es un monitor (`permisos_predefinidos` jsonb).

4. **Supabase es el núcleo de datos, tiempo real y storage.**
   Se evaluó explícitamente Socket.IO + Redis para tiempo real y **se
   rechazó por redundante** — Supabase Realtime ya resuelve chat,
   presencia y estado de juego en vivo sin infraestructura propia.

5. **NestJS tiene alcance deliberadamente restringido.** Solo se usa
   para lo que NO debe pasar por el cliente: generación de reportes
   PDF/Excel, cron jobs de alertas de inactividad, y (si en el futuro
   se requiere) validación autoritativa de jugadas. El 80% de las
   operaciones (leer perfil, jugar, chatear) van directo del frontend
   a Supabase, protegidas por RLS.

6. **Personalización con 3 métodos intercambiables:** Emoji, Subir
   imagen, Dibujar (canvas). El resultado se guarda siempre como una
   referencia uniforme en `elementos_personalizables.valor` (el emoji
   en sí, o una URL de Supabase Storage), con `tipo` indicando cuál de
   los 3 métodos se usó. Este patrón debe funcionar igual para
   cualquier ícono de cualquier juego (ya se prototipó con Memorama y
   con una pieza de Ajedrez en los wireframes).

7. **v1 (alcance de esta primera versión):**
   - **Roles:** los 3 completos (Residente, Monitor, Anfitrión).
   - **Juegos:** solo **Memorama y Solitario** (los más simples). Ajedrez,
     Trivia, Damas chinas, Lotería y "Combina Dulces" quedan fuera del
     v1 — hay wireframes de Ajedrez y Combina Dulces pero NO se
     implementan todavía.
   - **Personalización:** incluida en v1, pero acotada a Memorama y
     Solitario únicamente.

8. **Manejo de estado de los juegos con XState**, pero en **cuarentena
   estricta**: solo dentro de los componentes de juego (Memorama,
   Solitario). Nunca para navegación ni estado global de sesión — para
   eso usar Zustand o estado nativo de React.

---

## 3. Identidad de marca

**Colores** (ya usados en los wireframes de Figma, replicar exacto):

| Token | Hex | Uso |
|---|---|---|
| `--color-blue` | `#1d459e` | Primario, botones principales |
| `--color-blue-light` | `#7fa8d8` | Fondos suaves, secundario |
| `--color-orange` | `#fe6832` | Secundario, CTAs |
| `--color-orange-dark` | `#f45c19` | Acentos, textos de énfasis |
| `--color-peach` | `#f4b183` | Decorativo |
| `--color-olive` | `#6f8f4f` | Uso raro/decorativo |
| `--color-bg` | `#fefdf7` | Fondo base de toda la app |
| `--color-text` | `#262626` | Texto principal |

**Tipografías:** Montserrat Bold/Semibold (títulos), Nunito (cuerpo).
Ya están declaradas como variables CSS en `apps/web/src/styles/tokens.css`.

**Logotipo:** "Tecno" (azul) + "Puentes" (naranja) apiladas.
**Isotipo:** dos figuras humanas conectadas por un puente de puntos.

---

## 4. Principios de diseño de UI (no negociables)

- **Modo Residente:** botones grandes (56–64px alto), tipografía
  grande, alto contraste, **una acción principal por pantalla**, todo
  ícono va acompañado de texto (nunca un ícono solo).
- **Modo Anfitrión/Monitor:** interfaz más densa (tarjetas de datos,
  tablas, listas) — es para uso administrativo, no necesita la misma
  accesibilidad extrema que el modo Residente.
- Todo se diseñó **mobile-first** sobre un marco de 402×874px
  (proporción iPhone), pero debe escalar razonablemente a tablet/desktop
  ya que Anfitriones/Monitores probablemente lo usen en escritorio para
  ver reportes y tablas.

---

## 5. Estado actual del proyecto (al momento de este scaffold)

### ✅ Ya resuelto
- Diseño completo de wireframes en Figma (archivo "Tecnopuentes").
- Esquema completo de base de datos con RLS (`supabase/migrations/...`).
- Configuración de Storage con políticas multi-tenant.
- Función RPC `canjear_codigo_invitacion` que resuelve toda la lógica de "unirse a un asilo".
- Stack tecnológico validado (React+Vite PWA / Supabase / NestJS acotado / Zustand).
- **[NUEVO]** Fase de Maquetación UI 100% completada. Se construyeron todas las pantallas en React para Residente, Monitor y Anfitrión, incluyendo sub-vistas (Ayuda, Notificaciones, etc.).
- **[NUEVO]** Enrutamiento inteligente y "Route Guards" implementados en `App.tsx` usando Zustand (`useSesionStore`) para proteger rutas por rol.

### ⚠️ Pendiente (Lógica de Datos y Motor de Juegos)
- Aunque la UI está completa, toda la información actual son datos "quemados" (mocks). Falta conectar Supabase para leer asilos reales, miembros, mensajes de chat y estadísticas.
- Falta la lógica de almacenamiento de personalización de juegos (`juegos_personalizacion`).
- Falta el desarrollo funcional de los minijuegos (Memorama, Solitario) con XState.

---

## 6. Esquema de base de datos (resumen — ver las migraciones SQL para el detalle completo)

| Tabla | Para qué |
|---|---|
| `perfiles` | Extiende `auth.users` con nombre y avatar |
| `asilos` | Cada residencia registrada |
| `asilo_miembros` | Usuario × Asilo × Rol (el corazón del sistema) |
| `permisos_monitor` | 5 toggles granulares, solo para rol monitor |
| `codigos_invitacion` | Código con rol y permisos embebidos |
| `juegos` | Catálogo (sembrado: memorama, solitario) |
| `elementos_personalizables` | Íconos editables por asilo y juego |
| `sesiones_juego` | Historial de partidas (alimenta stats y reportes) |
| `mensajes_chat` | Chat grupal por asilo (Realtime habilitado) |

**Patrón de RLS repetido en casi todas las tablas:** filtrar por
`asilo_id` perteneciente al usuario autenticado, usando las funciones
auxiliares `pertenece_al_asilo()`, `rol_en_asilo()` y `tiene_permiso()`
definidas en la migración 001 — reutilízalas, no reescribas la lógica.

**Storage:** 2 buckets privados, `personalizacion` y `avatares`, con
convención de rutas `{asilo_id}/{juego_slug}/{clave}.png` y
`{usuario_id}/avatar.png` respectivamente (ver migración 002).

---

## 7. Qué contiene este scaffold

```
apps/web/          PWA — React + Vite + TypeScript
  src/routes/auth/        Bienvenida, IniciarSesion, CrearCuenta, UnirseAsilo, IngresarCodigo
  src/routes/residente/   Home, Actividad, Chat, Perfil
  src/routes/anfitrion/   Panel, Reportes, Miembros, Personalizar
  src/routes/monitor/     (reutiliza componentes de anfitrion/, condicionado por permisos)
  src/components/ui/      Botones, inputs, cards — usar tokens.css, NO colores hardcodeados
  src/components/games/   memorama/ y solitario/ (aquí van las máquinas XState + UI de tablero)
  src/components/personalizacion/  Tabs reutilizables Emoji/Imagen/Dibujar
  src/features/*/         Hooks + queries a Supabase, organizados por dominio
  src/lib/supabaseClient.ts   Cliente único de Supabase (usar variables de entorno)
  src/lib/permisos.ts     Helpers para chequear permisos en el cliente (RBAC de UI)
  src/state/              Zustand — sesión activa, asilo activo
  src/styles/tokens.css   Variables CSS de marca (colores, tipografías)

apps/api/           NestJS — SOLO 3 módulos con alcance limitado
  src/modules/reportes/       Generación de PDF/Excel
  src/modules/invitaciones/   Lógica de invitación que requiera privilegios de servicio
  src/modules/alertas/        Cron jobs de inactividad prolongada

packages/shared-types/    Interfaces TS que reflejan el schema SQL exacto
packages/game-engines/    Máquinas XState puras (sin UI) de memorama y solitario

supabase/migrations/      Los 2 archivos SQL ya generados (schema + storage)
```

Todos los archivos de código en este scaffold son **stubs con
comentarios `// TODO`** indicando qué implementar — no hay lógica de
negocio real todavía, a propósito, para que la próxima sesión de
desarrollo (tú, o una IA en Antigravity) decida los detalles de
implementación con el contexto completo de este documento.

---

## 8. Próximos pasos recomendados (en orden)

1. **Terminar el Flujo de Unión (Códigos):**
   Asegurar que un Residente nuevo pueda usar un código real y entrar a un Asilo real en la base de datos (Supabase).
2. **Conectar la Base de Datos al Home del Residente:**
   Lograr que la aplicación sepa *quién* es el usuario y lea el nombre real del asilo para mostrarlo en pantalla.
3. **Preparar la Personalización (Base de datos):**
   Conectar la lógica de `juegos_personalizacion` para poder leer emojis/imágenes customizados antes de que arranque el juego.
4. **Implementar el loop central de Juegos:**
   Desarrollar el motor XState para Memorama, jugar, y guardar `sesiones_juego` al terminar.
5. **Mi Actividad + Chat grupal** (probar Supabase Realtime con `mensajes_chat`) + Mi Perfil.
6. **Panel del Anfitrión** — reemplazar los mocks por la lista real de miembros (query a `asilo_miembros`).
7. Recién después: Invitar Monitor, permisos granulares, reportes.

No implementes Ajedrez, Trivia, Damas chinas, Lotería ni "Combina
Dulces" todavía — están fuera del alcance del v1 aunque existan
wireframes.

---

## 9. Convenciones de código a mantener

- **Nunca hardcodear colores/fuentes** — usar las variables de
  `styles/tokens.css`.
- **Nunca hacer bypass de RLS desde el frontend** — si una operación
  necesita saltarse RLS (ej. reportes agregados de todo un asilo con
  llave de servicio), esa lógica va en `apps/api`, no en `apps/web`.
- **Las máquinas XState de juegos son puras** (sin importar React) —
  viven en `packages/game-engines`, y los componentes en
  `apps/web/src/components/games/` solo las consumen.
- **Todo texto visible al Residente debe ir acompañado de ícono**, y
  toda acción destructiva (expulsar miembro, borrar mensaje) debe pedir
  confirmación explícita.
