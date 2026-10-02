import { supabase } from '@/lib/supabaseClient';
import { ActividadFactory, Actividad } from '../models/Actividad';

export async function obtenerHistorialResidente(miembroId: string): Promise<Actividad[]> {
  const { data, error } = await supabase
    .from('actividad_juegos')
    .select('*, juegos(slug)')
    .eq('miembro_id', miembroId)
    .order('creado_en', { ascending: false });

  if (error) {
    console.error('Error al obtener el historial:', error.message);
    throw error;
  }
  
  // Aquí devolvemos la data hidratada y lista para React
  return ActividadFactory.fromRowList(data || []);
}
