-- 1. Actualizar la tabla de juegos que ya existía en schema_inicial
ALTER TABLE public.juegos 
ADD COLUMN IF NOT EXISTS icono TEXT,
ADD COLUMN IF NOT EXISTS creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Asegurarnos de que el RLS esté activo
ALTER TABLE public.juegos ENABLE ROW LEVEL SECURITY;

-- Asegurar que la política exista
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'juegos' AND policyname = 'Cualquier usuario autenticado puede ver los juegos'
    ) THEN
        CREATE POLICY "Cualquier usuario autenticado puede ver los juegos"
            ON public.juegos FOR SELECT
            USING (auth.role() = 'authenticated');
    END IF;
END
$$;

-- Actualizar los juegos existentes con sus íconos
UPDATE public.juegos SET icono = 'fa-solid fa-border-all' WHERE slug = 'memorama';
UPDATE public.juegos SET icono = 'fa-solid fa-clone' WHERE slug = 'solitario';
INSERT INTO public.juegos (slug, nombre, icono) VALUES ('loteria', 'Lotería', 'fa-solid fa-table-cells') ON CONFLICT (slug) DO NOTHING;

-- 2. Eliminar la tabla vieja 'sesiones_juego' (que no estaba normalizada)
DROP TABLE IF EXISTS public.sesiones_juego CASCADE;


-- Historial de Actividad (Partidas jugadas)
CREATE TABLE public.actividad_juegos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    miembro_id UUID NOT NULL REFERENCES public.asilo_miembros(id) ON DELETE CASCADE,
    juego_id UUID NOT NULL REFERENCES public.juegos(id) ON DELETE CASCADE,
    puntaje_obtenido INTEGER NOT NULL DEFAULT 0,
    duracion_segundos INTEGER NOT NULL DEFAULT 0,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS para actividad
ALTER TABLE public.actividad_juegos ENABLE ROW LEVEL SECURITY;

-- Residentes pueden insertar su propia actividad
CREATE POLICY "Residentes insertan su propia actividad"
    ON public.actividad_juegos FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.asilo_miembros
            WHERE id = miembro_id AND usuario_id = auth.uid()
        )
    );

-- Todos en el asilo pueden ver la actividad (para dashboards de monitores y rankings de residentes)
CREATE POLICY "Miembros del asilo ven la actividad del asilo"
    ON public.actividad_juegos FOR SELECT
    USING (
        public.pertenece_al_asilo(
            (SELECT asilo_id FROM public.asilo_miembros WHERE id = miembro_id)
        )
    );


-- Estadísticas Globales del Miembro (Puntaje Total)
CREATE TABLE public.estadisticas_miembro (
    miembro_id UUID PRIMARY KEY REFERENCES public.asilo_miembros(id) ON DELETE CASCADE,
    puntos_totales INTEGER NOT NULL DEFAULT 0,
    racha_dias INTEGER NOT NULL DEFAULT 0,
    tiempo_total_jugado_segundos INTEGER NOT NULL DEFAULT 0,
    ultima_conexion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS para estadísticas
ALTER TABLE public.estadisticas_miembro ENABLE ROW LEVEL SECURITY;

-- Miembros del asilo pueden ver estadísticas
CREATE POLICY "Miembros del asilo ven las estadísticas"
    ON public.estadisticas_miembro FOR SELECT
    USING (
        public.pertenece_al_asilo(
            (SELECT asilo_id FROM public.asilo_miembros WHERE id = miembro_id)
        )
    );

-- Solo el sistema (triggers/functions) o el propio usuario actualiza su estadística
CREATE POLICY "Usuarios actualizan sus propias estadisticas"
    ON public.estadisticas_miembro FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.asilo_miembros
            WHERE id = miembro_id AND usuario_id = auth.uid()
        )
    );

-- Insertar estadísticas iniciales automáticamente al unirse un miembro
CREATE OR REPLACE FUNCTION public.inicializar_estadisticas()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.estadisticas_miembro (miembro_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_miembro_created
    AFTER INSERT ON public.asilo_miembros
    FOR EACH ROW
    EXECUTE FUNCTION public.inicializar_estadisticas();



