-- Insertar emojis por defecto para Solitario
insert into public.juego_elementos_default (juego_id, clave, nombre_visible, valor) select id, 'picas', 'Picas', '♠️' from public.juegos where slug = 'solitario';
insert into public.juego_elementos_default (juego_id, clave, nombre_visible, valor) select id, 'corazones', 'Corazones', '❤️' from public.juegos where slug = 'solitario';
insert into public.juego_elementos_default (juego_id, clave, nombre_visible, valor) select id, 'diamantes', 'Diamantes', '♦️' from public.juegos where slug = 'solitario';
insert into public.juego_elementos_default (juego_id, clave, nombre_visible, valor) select id, 'treboles', 'Tréboles', '♣️' from public.juegos where slug = 'solitario';
insert into public.juego_elementos_default (juego_id, clave, nombre_visible, valor) select id, 'reverso', 'Reverso de carta', '🌌' from public.juegos where slug = 'solitario';
