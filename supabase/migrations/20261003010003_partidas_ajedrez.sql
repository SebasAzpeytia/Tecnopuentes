-- Crear tabla de partidas de ajedrez
CREATE TABLE public.partidas_ajedrez (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asilo_id UUID NOT NULL REFERENCES public.asilos(id) ON DELETE CASCADE,
    jugador_blancas UUID NOT NULL REFERENCES public.asilo_miembros(id) ON DELETE CASCADE,
    jugador_negras UUID REFERENCES public.asilo_miembros(id) ON DELETE SET NULL,
    estado TEXT NOT NULL DEFAULT 'esperando', -- esperando, en_curso, finalizada, abandonada
    fen TEXT NOT NULL DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', -- Estado inicial
    turno TEXT NOT NULL DEFAULT 'w',
    ganador_id UUID REFERENCES public.asilo_miembros(id) ON DELETE SET NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.partidas_ajedrez ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
-- Miembros del asilo pueden ver las partidas de su asilo
CREATE POLICY "Miembros del asilo ven partidas de su asilo"
    ON public.partidas_ajedrez FOR SELECT
    USING (
        public.pertenece_al_asilo(asilo_id)
    );

-- Residentes pueden crear partidas (el que invita)
CREATE POLICY "Residentes crean partidas en su asilo"
    ON public.partidas_ajedrez FOR INSERT
    WITH CHECK (
        public.pertenece_al_asilo(asilo_id) AND
        EXISTS (
            SELECT 1 FROM public.asilo_miembros
            WHERE id = jugador_blancas AND usuario_id = auth.uid()
        )
    );

-- Residentes que están en la partida pueden actualizarla (movimientos)
CREATE POLICY "Jugadores actualizan sus partidas"
    ON public.partidas_ajedrez FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.asilo_miembros
            WHERE (id = jugador_blancas OR id = jugador_negras) AND usuario_id = auth.uid()
        )
    );

-- Configurar realtime para la tabla
alter publication supabase_realtime add table public.partidas_ajedrez;
