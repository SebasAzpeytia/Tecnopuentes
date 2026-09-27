// Referencia: Pantallas 08 (Emoji), 09 (Subir imagen), 10 (Dibujar), y
// 20 (ejemplo con pieza de Ajedrez) — el mismo componente debe servir
// para CUALQUIER elemento personalizable de CUALQUIER juego, recibiendo
// el elemento como prop en vez de tener el contexto hardcodeado.

export type MetodoPersonalizacion = 'emoji' | 'imagen' | 'dibujo';

interface Props {
  asiloId: string;
  juegoSlug: string;
  clave: string; // ej. 'simbolo_1'
  valorActual: string;
  tipoActual: MetodoPersonalizacion;
  onGuardado: (nuevoValor: string, tipo: MetodoPersonalizacion) => void;
}

export function PersonalizacionTabs(_props: Props) {
  // TODO:
  // - Tab "Emoji": grid de selección + buscador (ver Pantalla 08).
  // - Tab "Subir imagen": input file + drag&drop, subir a Storage
  //   bucket 'personalizacion' en la ruta {asiloId}/{juegoSlug}/{clave}.png
  // - Tab "Dibujar": <canvas> con color/grosor/deshacer/borrar,
  //   exportar a PNG (canvas.toDataURL) y subir igual que "imagen".
  return <div>{/* TODO */}</div>;
}
