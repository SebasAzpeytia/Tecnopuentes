-- =====================================================================
-- TECNOPUENTES — CONFIGURACIÓN DE STORAGE (v1)
-- =====================================================================
-- Requiere haber corrido antes: 001_schema_inicial_tecnopuentes.sql
-- (usa las funciones pertenece_al_asilo, rol_en_asilo y tiene_permiso).
--
-- Convención de rutas (importante para el frontend al subir archivos):
--
--   Bucket "personalizacion":
--     {asilo_id}/{juego_slug}/{clave}.png
--     ej: 8f1e.../memorama/simbolo_1.png
--
--   Bucket "avatares":
--     {usuario_id}/avatar.png
--     ej: 3ac2.../avatar.png
--
-- Guarda esa URL resultante en la columna correspondiente
-- (elementos_personalizables.valor o perfiles.avatar_url).
-- =====================================================================


-- =====================================================================
-- 1. CREACIÓN DE BUCKETS
-- =====================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'personalizacion',
  'personalizacion',
  false, -- NO público: solo miembros del propio asilo pueden ver estas imágenes
  5242880, -- 5 MB, igual al límite mostrado en el wireframe de "Subir imagen"
  array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatares',
  'avatares',
  false,
  2097152, -- 2 MB, suficiente para una foto de perfil
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;


-- =====================================================================
-- 2. POLÍTICAS — bucket "personalizacion"
-- Ruta esperada: {asilo_id}/{juego_slug}/{clave}.png
-- storage.foldername(name) devuelve un array de las carpetas de la ruta,
-- así que foldername(name)[1] es el asilo_id.
-- =====================================================================

create policy "Miembros del asilo pueden ver su personalización"
  on storage.objects for select
  using (
    bucket_id = 'personalizacion'
    and public.pertenece_al_asilo((storage.foldername(name))[1]::uuid)
  );

create policy "Anfitrión o monitor con permiso puede subir personalización"
  on storage.objects for insert
  with check (
    bucket_id = 'personalizacion'
    and (
      public.rol_en_asilo((storage.foldername(name))[1]::uuid) = 'anfitrion'
      or public.tiene_permiso((storage.foldername(name))[1]::uuid, 'personalizacion')
    )
  );

create policy "Anfitrión o monitor con permiso puede reemplazar personalización"
  on storage.objects for update
  using (
    bucket_id = 'personalizacion'
    and (
      public.rol_en_asilo((storage.foldername(name))[1]::uuid) = 'anfitrion'
      or public.tiene_permiso((storage.foldername(name))[1]::uuid, 'personalizacion')
    )
  );

create policy "Anfitrión o monitor con permiso puede borrar personalización"
  on storage.objects for delete
  using (
    bucket_id = 'personalizacion'
    and (
      public.rol_en_asilo((storage.foldername(name))[1]::uuid) = 'anfitrion'
      or public.tiene_permiso((storage.foldername(name))[1]::uuid, 'personalizacion')
    )
  );


-- =====================================================================
-- 3. POLÍTICAS — bucket "avatares"
-- Ruta esperada: {usuario_id}/avatar.png
-- Regla: cualquier miembro autenticado puede VER avatares (para mostrarlos
-- en el chat, la lista de miembros, etc.), pero solo el dueño puede
-- subir/editar/borrar el suyo.
-- =====================================================================

create policy "Cualquier autenticado puede ver avatares"
  on storage.objects for select
  using (
    bucket_id = 'avatares'
    and auth.role() = 'authenticated'
  );

create policy "El usuario solo sube su propio avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatares'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "El usuario solo reemplaza su propio avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatares'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "El usuario solo borra su propio avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatares'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- =====================================================================
-- FIN DE LA CONFIGURACIÓN DE STORAGE
-- =====================================================================
