-- 1. Insertar nuevos juegos en la tabla principal
insert into public.juegos (slug, nombre, activo) values 
  ('ajedrez', 'Ajedrez', true),
  ('dulces', 'Combina Dulces', true);

-- 2. Insertar elementos por defecto para Ajedrez
insert into public.juego_elementos_default (juego_id, clave, nombre_visible, valor) select id, 'rey', 'Rey', '♚' from public.juegos where slug = 'ajedrez';
insert into public.juego_elementos_default (juego_id, clave, nombre_visible, valor) select id, 'reina', 'Reina', '♛' from public.juegos where slug = 'ajedrez';
insert into public.juego_elementos_default (juego_id, clave, nombre_visible, valor) select id, 'alfil', 'Alfil', '♝' from public.juegos where slug = 'ajedrez';
insert into public.juego_elementos_default (juego_id, clave, nombre_visible, valor) select id, 'caballo', 'Caballo', '♞' from public.juegos where slug = 'ajedrez';
insert into public.juego_elementos_default (juego_id, clave, nombre_visible, valor) select id, 'torre', 'Torre', '♜' from public.juegos where slug = 'ajedrez';
insert into public.juego_elementos_default (juego_id, clave, nombre_visible, valor) select id, 'peon', 'Peón', '♟' from public.juegos where slug = 'ajedrez';

-- 3. Insertar elementos por defecto para Combina Dulces
insert into public.juego_elementos_default (juego_id, clave, nombre_visible, valor) select id, 'dulce_1', 'Caramelo', '🍬' from public.juegos where slug = 'dulces';
insert into public.juego_elementos_default (juego_id, clave, nombre_visible, valor) select id, 'dulce_2', 'Paleta', '🍭' from public.juegos where slug = 'dulces';
insert into public.juego_elementos_default (juego_id, clave, nombre_visible, valor) select id, 'dulce_3', 'Chocolate', '🍫' from public.juegos where slug = 'dulces';
insert into public.juego_elementos_default (juego_id, clave, nombre_visible, valor) select id, 'dulce_4', 'Dona', '🍩' from public.juegos where slug = 'dulces';
insert into public.juego_elementos_default (juego_id, clave, nombre_visible, valor) select id, 'dulce_5', 'Galleta', '🍪' from public.juegos where slug = 'dulces';
insert into public.juego_elementos_default (juego_id, clave, nombre_visible, valor) select id, 'dulce_6', 'Cupcake', '🧁' from public.juegos where slug = 'dulces';
