-- Catálogo de Juegos
CREATE TABLE public.juegos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    icono TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS para juegos
ALTER TABLE public.juegos ENABLE ROW LEVEL SECURITY;

-- Todos pueden ver los juegos
CREATE POLICY "Cualquier usuario autenticado puede ver los juegos"
    ON public.juegos FOR SELECT
    USING (auth.role() = 'authenticated');


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


-- Insertar juegos base
INSERT INTO public.juegos (slug, nombre, icono) VALUES
('memorama', 'Memorama', 'fa-solid fa-border-all'),
('solitario', 'Solitario', 'fa-solid fa-clone'),
('loteria', 'Lotería', 'fa-solid fa-table-cells');
