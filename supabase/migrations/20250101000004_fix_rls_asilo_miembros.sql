-- MIGRATION: Fix RLS on asilo_miembros
-- Permite que los usuarios puedan ver sus propias membresías, independientemente de su estado o de que pertenezcan o no a un asilo.

CREATE POLICY "Un usuario puede ver sus propias membresias"
  ON public.asilo_miembros FOR SELECT
  USING (usuario_id = auth.uid());
