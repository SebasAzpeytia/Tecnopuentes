create table public.juego_elementos_default (
  id uuid primary key default gen_random_uuid(),
  juego_id uuid not null references public.juegos(id) on delete cascade,
  clave text not null,
  nombre_visible text not null,
  tipo public.tipo_personalizacion not null default 'emoji',
  valor text not null,
  unique (juego_id, clave)
);

alter table public.juego_elementos_default enable row level security;
create policy "Defaults son publicos" on public.juego_elementos_default for select using (true);

-- Insertar emojis por defecto para Memorama
insert into public.juego_elementos_default (juego_id, clave, nombre_visible, valor) select id, 'par_1', 'Par 1', '🐶' from public.juegos where slug = 'memorama';
insert into public.juego_elementos_default (juego_id, clave, nombre_visible, valor) select id, 'par_2', 'Par 2', '🐱' from public.juegos where slug = 'memorama';
insert into public.juego_elementos_default (juego_id, clave, nombre_visible, valor) select id, 'par_3', 'Par 3', '🐭' from public.juegos where slug = 'memorama';
insert into public.juego_elementos_default (juego_id, clave, nombre_visible, valor) select id, 'par_4', 'Par 4', '🐹' from public.juegos where slug = 'memorama';
insert into public.juego_elementos_default (juego_id, clave, nombre_visible, valor) select id, 'par_5', 'Par 5', '🐰' from public.juegos where slug = 'memorama';
insert into public.juego_elementos_default (juego_id, clave, nombre_visible, valor) select id, 'par_6', 'Par 6', '🦊' from public.juegos where slug = 'memorama';
insert into public.juego_elementos_default (juego_id, clave, nombre_visible, valor) select id, 'par_7', 'Par 7', '🐻' from public.juegos where slug = 'memorama';
insert into public.juego_elementos_default (juego_id, clave, nombre_visible, valor) select id, 'par_8', 'Par 8', '🐼' from public.juegos where slug = 'memorama';
