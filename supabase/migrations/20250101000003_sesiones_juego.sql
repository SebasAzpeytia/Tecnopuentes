-- Tabla para registrar la actividad (sesiones de juego) de los residentes
CREATE TABLE public.sesiones_juego (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
    asilo_id UUID NOT NULL REFERENCES public.asilos(id) ON DELETE CASCADE,
    juego TEXT NOT NULL, -- Ej: 'memorama', 'solitario', 'trivia'
    duracion_segundos INTEGER NOT NULL,
    puntaje INTEGER DEFAULT 0, -- Opcional, por si queremos guardar puntos en el futuro
    fecha_inicio TIMESTAMPTZ NOT NULL DEFAULT now(),
    fecha_fin TIMESTAMPTZ NOT NULL DEFAULT now(),
    creado_en TIMESTAMPTZ DEFAULT now()
);

-- Activar RLS
ALTER TABLE public.sesiones_juego ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS

-- 1. Los residentes pueden VER sus propias sesiones de juego
CREATE POLICY "Los residentes pueden ver sus propias sesiones" 
ON public.sesiones_juego FOR SELECT 
USING ( auth.uid() = usuario_id );

-- 2. Los residentes pueden INSERTAR sus propias sesiones de juego
CREATE POLICY "Los residentes pueden registrar sus sesiones" 
ON public.sesiones_juego FOR INSERT 
WITH CHECK ( auth.uid() = usuario_id );

-- 3. Los administradores (anfitrion/monitor) pueden VER las sesiones de los miembros de su asilo
CREATE POLICY "Administradores pueden ver sesiones de su asilo" 
ON public.sesiones_juego FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.asilo_miembros
        WHERE asilo_miembros.asilo_id = sesiones_juego.asilo_id
        AND asilo_miembros.usuario_id = auth.uid()
        AND asilo_miembros.rol IN ('anfitrion', 'monitor')
    )
);
