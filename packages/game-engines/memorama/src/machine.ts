import { setup, assign } from 'xstate';

// Máquina de estados PURA (sin UI) para Memorama. La UI en
// apps/web/src/components/games/memorama/ solo debe *consumir* esta
// máquina, nunca reimplementar su lógica.
//
// Por qué XState aquí y no useState: un adulto mayor puede tocar varias
// cartas rápido por temblor en las manos. Esta máquina IGNORA eventos
// FLIP que no sean válidos en el estado actual (ver CONTEXT.md sección 8
// del reporte de evaluación de Gemini), evitando que se desincronice
// el tablero.

interface CartaContext {
  cartas: { id: string; simboloId: string; volteada: boolean; emparejada: boolean }[];
  primeraSeleccionada: string | null;
  segundaSeleccionada: string | null;
  intentos: number;
}

export const memoramaMachine = setup({
  types: {} as {
    context: CartaContext;
    events:
      | { type: 'INICIAR'; cartas: CartaContext['cartas'] }
      | { type: 'FLIP'; cartaId: string }
      | { type: 'CONTINUAR' };
  },
}).createMachine({
  id: 'memorama',
  initial: 'inactivo',
  context: {
    cartas: [],
    primeraSeleccionada: null,
    segundaSeleccionada: null,
    intentos: 0,
  },
  states: {
    inactivo: {
      on: { INICIAR: { target: 'esperandoPrimeraCarta', actions: assign(({ event }) => ({ cartas: event.cartas })) } },
    },
    esperandoPrimeraCarta: {
      on: {
        // TODO: acción que voltea la carta y guarda primeraSeleccionada
        FLIP: { target: 'esperandoSegundaCarta' },
      },
    },
    esperandoSegundaCarta: {
      on: {
        // TODO: acción que voltea la segunda carta, compara símbolos,
        // y transiciona a 'evaluandoPar'. Cualquier otro FLIP mientras
        // tanto debe ser ignorado (no declarar esa transición aquí).
        FLIP: { target: 'evaluandoPar' },
      },
    },
    evaluandoPar: {
      // TODO: lógica de comparación (sync `always` o servicio con delay
      // para que el jugador alcance a ver la segunda carta antes de
      // voltearla de nuevo si no hace match).
      on: { CONTINUAR: [{ target: 'esperandoPrimeraCarta' }] },
    },
    completado: { type: 'final' },
  },
});
