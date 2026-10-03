-- Add fecha_nacimiento to perfiles
alter table public.perfiles add column fecha_nacimiento date;

-- Remove edad from asilo_miembros
alter table public.asilo_miembros drop column edad;
