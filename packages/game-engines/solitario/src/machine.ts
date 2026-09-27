import { setup } from 'xstate';

// TODO: modelar el solitario simplificado ya diseñado en la Pantalla 04
// (mazo, descarte, 4 fundaciones, 5 columnas). Sugerencia de estados:
// 'jugando' (estado principal con contexto de las pilas) -> 'ganado'.
// La validación de "¿puedo mover esta carta aquí?" debe ser una función
// pura separada (ej. src/reglas.ts) para poder testearla sin la máquina.

export const solitarioMachine = setup({
  types: {} as {
    context: Record<string, unknown>;
    events: { type: 'INICIAR' };
  },
}).createMachine({
  id: 'solitario',
  initial: 'inactivo',
  context: {},
  states: {
    inactivo: { on: { INICIAR: 'jugando' } },
    jugando: {},
    ganado: { type: 'final' },
  },
});
