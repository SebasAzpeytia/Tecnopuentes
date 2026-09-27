-- =====================================================================
-- TECNOPUENTES — MIGRACIÓN INICIAL (v1)
-- =====================================================================
-- Alcance de esta versión: 3 roles (residente, monitor, anfitrión),
-- 2 juegos (memorama, solitario), personalización de íconos,
-- chat grupal por asilo, sesiones de juego y sistema de invitación
-- con rol embebido en el código.
--
-- Cómo usar: pega este archivo en el SQL Editor de Supabase,
-- o guárdalo como supabase/migrations/001_schema_inicial.sql
-- y corre `supabase db push`.
-- =====================================================================


-- =====================================================================
-- 0. EXTENSIONES
-- =====================================================================
create extension if not exists "pgcrypto"; -- para gen_random_uuid()


-- =====================================================================
-- 1. TABLA: perfiles
-- Extiende auth.users con datos propios de la app (Supabase Auth ya
-- maneja email/password/social login en el esquema `auth`).
-- =====================================================================
create table public.perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre_completo text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.perfiles is 'Datos de perfil de cualquier usuario, sin importar su rol.';

-- Trigger: crear automáticamente un perfil cuando alguien se registra
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfiles (id, nombre_completo)
  values (new.id, coalesce(new.raw_user_meta_data->>'nombre_completo', 'Usuario'));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- =====================================================================
-- 2. TABLA: asilos
-- =====================================================================
create table public.asilos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  direccion text,
  creado_por uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.asilos is 'Cada residencia/asilo registrado en la plataforma (multi-tenant).';


-- =====================================================================
-- 3. TABLA: asilo_miembros
-- El corazón del sistema de roles. Une usuarios <-> asilos <-> rol.
-- =====================================================================
create type public.rol_asilo as enum ('residente', 'monitor', 'anfitrion');
create type public.estado_membresia as enum ('activo', 'pendiente', 'suspendido');

create table public.asilo_miembros (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  asilo_id uuid not null references public.asilos(id) on delete cascade,
  rol public.rol_asilo not null,
  estado public.estado_membresia not null default 'activo',
  edad int, -- relevante sobre todo para residentes; opcional para otros roles
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (usuario_id, asilo_id) -- un usuario no puede tener 2 roles en el mismo asilo
);

comment on table public.asilo_miembros is 'Tabla puente multi-tenant: define con qué rol pertenece cada usuario a cada asilo.';

create index idx_asilo_miembros_asilo on public.asilo_miembros(asilo_id);
create index idx_asilo_miembros_usuario on public.asilo_miembros(usuario_id);


-- =====================================================================
-- 4. TABLA: permisos_monitor
-- Solo aplica a filas de asilo_miembros con rol = 'monitor'.
-- El anfitrión define estos permisos al invitar o editar a un monitor.
-- =====================================================================
create table public.permisos_monitor (
  asilo_miembro_id uuid primary key references public.asilo_miembros(id) on delete cascade,
  ver_dashboard boolean not null default true,
  gestionar_miembros boolean not null default false,
  personalizacion boolean not null default false,
  ver_reportes boolean not null default false,
  moderar_chat boolean not null default false,
  updated_at timestamptz not null default now()
);

comment on table public.permisos_monitor is 'Permisos granulares individuales para monitores/personal invitado.';

-- Validación: solo se puede insertar un permiso si la fila referenciada es un monitor
create or replace function public.validar_rol_monitor()
returns trigger
language plpgsql
as $$
begin
  if not exists (
    select 1 from public.asilo_miembros
    where id = new.asilo_miembro_id and rol = 'monitor'
  ) then
    raise exception 'Solo se pueden asignar permisos a miembros con rol monitor';
  end if;
  return new;
end;
$$;

create trigger trg_validar_rol_monitor
  before insert or update on public.permisos_monitor
  for each row execute procedure public.validar_rol_monitor();


-- =====================================================================
-- 5. TABLA: codigos_invitacion
-- El código lleva el rol embebido: la pantalla de "ingresar código"
-- nunca necesita preguntar si el usuario es residente o monitor.
-- =====================================================================
create table public.codigos_invitacion (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique, -- ej. "A7X92K"
  asilo_id uuid not null references public.asilos(id) on delete cascade,
  rol_asignado public.rol_asilo not null,
  permisos_predefinidos jsonb, -- si rol_asignado = 'monitor', permisos a aplicar al aceptar
  creado_por uuid not null references auth.users(id),
  usado_por uuid references auth.users(id),
  usado boolean not null default false,
  expira_en timestamptz,
  created_at timestamptz not null default now()
);

comment on table public.codigos_invitacion is 'Códigos de invitación; el rol y permisos ya vienen definidos por el anfitrión al generarlo.';

create index idx_codigos_invitacion_codigo on public.codigos_invitacion(codigo);


-- =====================================================================
-- 6. TABLA: juegos (catálogo)
-- =====================================================================
create table public.juegos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, -- 'memorama', 'solitario'
  nombre text not null,
  activo boolean not null default true
);

insert into public.juegos (slug, nombre) values
  ('memorama', 'Memorama'),
  ('solitario', 'Solitario');


-- =====================================================================
-- 7. TABLA: elementos_personalizables
-- Íconos/símbolos editables por asilo, para cada juego.
-- =====================================================================
create type public.tipo_personalizacion as enum ('emoji', 'imagen', 'dibujo');

create table public.elementos_personalizables (
  id uuid primary key default gen_random_uuid(),
  asilo_id uuid not null references public.asilos(id) on delete cascade,
  juego_id uuid not null references public.juegos(id) on delete cascade,
  clave text not null, -- ej. 'simbolo_1', 'carta_reverso'
  nombre_visible text not null, -- ej. 'Símbolo 1'
  tipo public.tipo_personalizacion not null default 'emoji',
  valor text not null, -- emoji unicode, URL de Storage, o URL del dibujo exportado
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now(),
  unique (asilo_id, juego_id, clave)
);

comment on table public.elementos_personalizables is 'Personalización visual por asilo: cada ícono editable de cada juego.';


-- =====================================================================
-- 8. TABLA: sesiones_juego
-- Historial de partidas — alimenta "Mi Actividad" y "Reportes".
-- =====================================================================
create table public.sesiones_juego (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  asilo_id uuid not null references public.asilos(id) on delete cascade,
  juego_id uuid not null references public.juegos(id),
  duracion_seg int not null default 0,
  puntaje int,
  completado boolean not null default true,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

comment on table public.sesiones_juego is 'Cada partida jugada; base para estadísticas de tiempo de juego y juego favorito.';

create index idx_sesiones_usuario on public.sesiones_juego(usuario_id);
create index idx_sesiones_asilo on public.sesiones_juego(asilo_id);
create index idx_sesiones_juego_id on public.sesiones_juego(juego_id);


-- =====================================================================
-- 9. TABLA: mensajes_chat
-- Chat grupal por asilo (Supabase Realtime se suscribe a esta tabla).
-- =====================================================================
create table public.mensajes_chat (
  id uuid primary key default gen_random_uuid(),
  asilo_id uuid not null references public.asilos(id) on delete cascade,
  usuario_id uuid not null references auth.users(id) on delete cascade,
  contenido text not null,
  created_at timestamptz not null default now()
);

comment on table public.mensajes_chat is 'Mensajes del chat grupal moderado, uno por asilo.';

create index idx_mensajes_asilo on public.mensajes_chat(asilo_id, created_at desc);

-- Habilitar esta tabla para Supabase Realtime (Broadcast vía postgres_changes)
alter publication supabase_realtime add table public.mensajes_chat;


-- =====================================================================
-- 10. FUNCIONES AUXILIARES PARA RLS
-- Se usan dentro de las políticas para no repetir subconsultas.
-- =====================================================================

-- ¿El usuario autenticado pertenece (activo) a este asilo?
create or replace function public.pertenece_al_asilo(p_asilo_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.asilo_miembros
    where usuario_id = auth.uid()
      and asilo_id = p_asilo_id
      and estado = 'activo'
  );
$$;

-- ¿Cuál es el rol del usuario autenticado en este asilo?
create or replace function public.rol_en_asilo(p_asilo_id uuid)
returns public.rol_asilo
language sql
security definer
stable
as $$
  select rol from public.asilo_miembros
  where usuario_id = auth.uid()
    and asilo_id = p_asilo_id
    and estado = 'activo'
  limit 1;
$$;

-- ¿El usuario autenticado tiene un permiso específico en este asilo?
-- (los anfitriones siempre tienen todos los permisos implícitamente)
create or replace function public.tiene_permiso(p_asilo_id uuid, p_permiso text)
returns boolean
language plpgsql
security definer
stable
as $$
declare
  v_rol public.rol_asilo;
  v_tiene boolean;
begin
  select rol into v_rol from public.asilo_miembros
    where usuario_id = auth.uid() and asilo_id = p_asilo_id and estado = 'activo';

  if v_rol = 'anfitrion' then
    return true;
  end if;

  if v_rol is null or v_rol = 'residente' then
    return false;
  end if;

  execute format(
    'select %I from public.permisos_monitor pm
       join public.asilo_miembros am on am.id = pm.asilo_miembro_id
     where am.usuario_id = $1 and am.asilo_id = $2',
    p_permiso
  ) into v_tiene using auth.uid(), p_asilo_id;

  return coalesce(v_tiene, false);
end;
$$;


-- =====================================================================
-- 11. ROW LEVEL SECURITY (RLS)
-- =====================================================================

alter table public.perfiles enable row level security;
alter table public.asilos enable row level security;
alter table public.asilo_miembros enable row level security;
alter table public.permisos_monitor enable row level security;
alter table public.codigos_invitacion enable row level security;
alter table public.juegos enable row level security;
alter table public.elementos_personalizables enable row level security;
alter table public.sesiones_juego enable row level security;
alter table public.mensajes_chat enable row level security;

-- ---------- perfiles ----------
create policy "Cualquiera autenticado puede leer perfiles básicos"
  on public.perfiles for select
  using (auth.role() = 'authenticated');

create policy "El usuario solo edita su propio perfil"
  on public.perfiles for update
  using (id = auth.uid());

-- ---------- asilos ----------
create policy "Miembros del asilo pueden ver su asilo"
  on public.asilos for select
  using (public.pertenece_al_asilo(id));

create policy "Cualquier usuario autenticado puede crear un asilo (se vuelve anfitrión)"
  on public.asilos for insert
  with check (auth.uid() = creado_por);

create policy "Solo el anfitrión edita los datos del asilo"
  on public.asilos for update
  using (public.rol_en_asilo(id) = 'anfitrion');

-- ---------- asilo_miembros ----------
create policy "Miembros del asilo pueden ver la lista de miembros"
  on public.asilo_miembros for select
  using (public.pertenece_al_asilo(asilo_id));

create policy "Un usuario puede insertarse a sí mismo (al aceptar un código o crear asilo)"
  on public.asilo_miembros for insert
  with check (usuario_id = auth.uid());

create policy "Anfitrión o monitor con permiso puede gestionar miembros"
  on public.asilo_miembros for update
  using (
    public.rol_en_asilo(asilo_id) = 'anfitrion'
    or public.tiene_permiso(asilo_id, 'gestionar_miembros')
  );

create policy "Anfitrión o monitor con permiso puede expulsar miembros"
  on public.asilo_miembros for delete
  using (
    public.rol_en_asilo(asilo_id) = 'anfitrion'
    or public.tiene_permiso(asilo_id, 'gestionar_miembros')
  );

-- ---------- permisos_monitor ----------
create policy "Ver permisos si eres el propio monitor o el anfitrión del asilo"
  on public.permisos_monitor for select
  using (
    exists (
      select 1 from public.asilo_miembros am
      where am.id = asilo_miembro_id
        and (am.usuario_id = auth.uid() or public.rol_en_asilo(am.asilo_id) = 'anfitrion')
    )
  );

create policy "Solo el anfitrión define permisos de sus monitores"
  on public.permisos_monitor for all
  using (
    exists (
      select 1 from public.asilo_miembros am
      where am.id = asilo_miembro_id
        and public.rol_en_asilo(am.asilo_id) = 'anfitrion'
    )
  );

-- ---------- codigos_invitacion ----------
create policy "Anfitrión o monitor con permiso puede ver/crear códigos de su asilo"
  on public.codigos_invitacion for all
  using (
    public.rol_en_asilo(asilo_id) = 'anfitrion'
    or public.tiene_permiso(asilo_id, 'gestionar_miembros')
  );

create policy "Cualquier autenticado puede leer un código puntual para canjearlo"
  on public.codigos_invitacion for select
  using (auth.role() = 'authenticated' and usado = false);

-- ---------- juegos ----------
create policy "El catálogo de juegos es público para autenticados"
  on public.juegos for select
  using (auth.role() = 'authenticated');

-- ---------- elementos_personalizables ----------
create policy "Miembros del asilo ven la personalización de su asilo"
  on public.elementos_personalizables for select
  using (public.pertenece_al_asilo(asilo_id));

create policy "Anfitrión o monitor con permiso puede personalizar"
  on public.elementos_personalizables for all
  using (
    public.rol_en_asilo(asilo_id) = 'anfitrion'
    or public.tiene_permiso(asilo_id, 'personalizacion')
  );

-- ---------- sesiones_juego ----------
create policy "El residente ve y crea sus propias sesiones"
  on public.sesiones_juego for select
  using (usuario_id = auth.uid());

create policy "El residente inserta sus propias sesiones"
  on public.sesiones_juego for insert
  with check (usuario_id = auth.uid());

create policy "Anfitrión o monitor con permiso ve todas las sesiones del asilo"
  on public.sesiones_juego for select
  using (
    public.rol_en_asilo(asilo_id) = 'anfitrion'
    or public.tiene_permiso(asilo_id, 'ver_dashboard')
    or public.tiene_permiso(asilo_id, 'ver_reportes')
  );

-- ---------- mensajes_chat ----------
create policy "Miembros del asilo leen los mensajes de su asilo"
  on public.mensajes_chat for select
  using (public.pertenece_al_asilo(asilo_id));

create policy "Miembros del asilo pueden enviar mensajes"
  on public.mensajes_chat for insert
  with check (public.pertenece_al_asilo(asilo_id) and usuario_id = auth.uid());

create policy "Anfitrión o monitor con permiso puede moderar (borrar) mensajes"
  on public.mensajes_chat for delete
  using (
    public.rol_en_asilo(asilo_id) = 'anfitrion'
    or public.tiene_permiso(asilo_id, 'moderar_chat')
  );


-- =====================================================================
-- 12. FUNCIÓN: canjear código de invitación
-- Encapsula la lógica de la Pantalla 18 ("Ingresar código de asilo")
-- en una sola llamada segura (RPC) desde el frontend.
-- =====================================================================
create or replace function public.canjear_codigo_invitacion(p_codigo text)
returns public.asilo_miembros
language plpgsql
security definer
as $$
declare
  v_codigo public.codigos_invitacion;
  v_membresia public.asilo_miembros;
begin
  select * into v_codigo from public.codigos_invitacion
    where codigo = p_codigo and usado = false
      and (expira_en is null or expira_en > now())
    for update;

  if not found then
    raise exception 'Código inválido o expirado';
  end if;

  insert into public.asilo_miembros (usuario_id, asilo_id, rol)
  values (auth.uid(), v_codigo.asilo_id, v_codigo.rol_asignado)
  returning * into v_membresia;

  if v_codigo.rol_asignado = 'monitor' then
    insert into public.permisos_monitor (
      asilo_miembro_id, ver_dashboard, gestionar_miembros,
      personalizacion, ver_reportes, moderar_chat
    )
    select
      v_membresia.id,
      coalesce((v_codigo.permisos_predefinidos->>'ver_dashboard')::boolean, true),
      coalesce((v_codigo.permisos_predefinidos->>'gestionar_miembros')::boolean, false),
      coalesce((v_codigo.permisos_predefinidos->>'personalizacion')::boolean, false),
      coalesce((v_codigo.permisos_predefinidos->>'ver_reportes')::boolean, false),
      coalesce((v_codigo.permisos_predefinidos->>'moderar_chat')::boolean, false);
  end if;

  update public.codigos_invitacion
    set usado = true, usado_por = auth.uid()
    where id = v_codigo.id;

  return v_membresia;
end;
$$;

-- =====================================================================
-- FIN DE LA MIGRACIÓN INICIAL
-- =====================================================================
