import { setup, assign } from 'xstate';

export interface Card {
  id: string;
  suit: string;
  value: number;
  color: 'rojo' | 'negro';
  isFlipped: boolean;
}

export interface SolitarioContext {
  stock: Card[];
  waste: Card[];
  foundations: Card[][]; // 4 arrays, one for each suit
  tableau: Card[][]; // 7 arrays
  score: number;
  startTime: number | null;
  elapsedSeconds: number;
}

export type SolitarioEvent =
  | { type: 'INICIAR'; deck: Card[] }
  | { type: 'DRAW' }
  | { type: 'RECYCLE_WASTE' }
  | { type: 'MOVE_TABLEAU_TO_FOUNDATION'; fromCol: number; toFoundation: number }
  | { type: 'MOVE_WASTE_TO_FOUNDATION'; toFoundation: number }
  | { type: 'MOVE_TABLEAU_TO_TABLEAU'; fromCol: number; toCol: number; cardIndex: number }
  | { type: 'MOVE_WASTE_TO_TABLEAU'; toCol: number }
  | { type: 'MOVE_FOUNDATION_TO_TABLEAU'; fromFoundation: number; toCol: number }
  | { type: 'TICK' }
  | { type: 'SURRENDER' };

export const solitarioMachine = setup({
  types: {} as {
    context: SolitarioContext;
    events: SolitarioEvent;
  },
  actions: {
    initGame: assign(({ event }) => {
      if (event.type !== 'INICIAR') return {};
      const deck = [...event.deck];
      // Shuffle deck
      deck.sort(() => Math.random() - 0.5);

      const tableau: Card[][] = Array.from({ length: 7 }, () => []);
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j <= i; j++) {
          const card = deck.pop()!;
          if (j === i) card.isFlipped = false; // Top card face up
          else card.isFlipped = true; // Others face down
          tableau[i].push(card);
        }
      }

      return {
        stock: deck,
        waste: [],
        foundations: [[], [], [], []],
        tableau,
        score: 0,
        startTime: Date.now(),
        elapsedSeconds: 0
      };
    }),
    drawCard: assign(({ context }) => {
      const stock = [...context.stock];
      const waste = [...context.waste];
      const card = stock.pop();
      if (card) {
        card.isFlipped = false;
        waste.push(card);
      }
      return { stock, waste };
    }),
    recycleWaste: assign(({ context }) => {
      const stock = [...context.waste].reverse().map(c => ({ ...c, isFlipped: true }));
      return { stock, waste: [] };
    }),
    moveTableauToFoundation: assign(({ context, event }) => {
      if (event.type !== 'MOVE_TABLEAU_TO_FOUNDATION') return {};
      const tableau = [...context.tableau];
      const foundations = [...context.foundations];
      const sourceCol = [...tableau[event.fromCol]];
      const targetFound = [...foundations[event.toFoundation]];
      
      const card = sourceCol[sourceCol.length - 1];
      if (!card) return {};

      // Validación
      const topFound = targetFound[targetFound.length - 1];
      const isValid = topFound 
        ? (card.suit === topFound.suit && card.value === topFound.value + 1)
        : (card.value === 1);

      if (isValid) {
        targetFound.push(sourceCol.pop()!);
        // Flip new top card if needed
        if (sourceCol.length > 0 && sourceCol[sourceCol.length - 1].isFlipped) {
          sourceCol[sourceCol.length - 1].isFlipped = false;
        }
        tableau[event.fromCol] = sourceCol;
        foundations[event.toFoundation] = targetFound;
        return { tableau, foundations, score: context.score + 10 };
      }
      return {};
    }),
    moveWasteToFoundation: assign(({ context, event }) => {
      if (event.type !== 'MOVE_WASTE_TO_FOUNDATION') return {};
      const waste = [...context.waste];
      const foundations = [...context.foundations];
      const targetFound = [...foundations[event.toFoundation]];
      
      const card = waste[waste.length - 1];
      if (!card) return {};

      const topFound = targetFound[targetFound.length - 1];
      const isValid = topFound 
        ? (card.suit === topFound.suit && card.value === topFound.value + 1)
        : (card.value === 1);

      if (isValid) {
        targetFound.push(waste.pop()!);
        foundations[event.toFoundation] = targetFound;
        return { waste, foundations, score: context.score + 10 };
      }
      return {};
    }),
    moveTableauToTableau: assign(({ context, event }) => {
      if (event.type !== 'MOVE_TABLEAU_TO_TABLEAU') return {};
      const tableau = [...context.tableau];
      const sourceCol = [...tableau[event.fromCol]];
      const targetCol = [...tableau[event.toCol]];
      
      const cardsToMove = sourceCol.slice(event.cardIndex);
      const movingCard = cardsToMove[0];
      if (!movingCard || movingCard.isFlipped) return {};

      const targetTop = targetCol[targetCol.length - 1];
      const isValid = targetTop
        ? (movingCard.color !== targetTop.color && movingCard.value === targetTop.value - 1)
        : (movingCard.value === 13); // King to empty column

      if (isValid) {
        sourceCol.splice(event.cardIndex, cardsToMove.length);
        targetCol.push(...cardsToMove);
        if (sourceCol.length > 0 && sourceCol[sourceCol.length - 1].isFlipped) {
          sourceCol[sourceCol.length - 1].isFlipped = false;
        }
        tableau[event.fromCol] = sourceCol;
        tableau[event.toCol] = targetCol;
        return { tableau };
      }
      return {};
    }),
    moveWasteToTableau: assign(({ context, event }) => {
      if (event.type !== 'MOVE_WASTE_TO_TABLEAU') return {};
      const waste = [...context.waste];
      const tableau = [...context.tableau];
      const targetCol = [...tableau[event.toCol]];
      
      const card = waste[waste.length - 1];
      if (!card) return {};

      const targetTop = targetCol[targetCol.length - 1];
      const isValid = targetTop
        ? (card.color !== targetTop.color && card.value === targetTop.value - 1)
        : (card.value === 13);

      if (isValid) {
        targetCol.push(waste.pop()!);
        tableau[event.toCol] = targetCol;
        return { waste, tableau, score: context.score + 5 };
      }
      return {};
    }),
    tickTime: assign(({ context }) => {
      if (!context.startTime) return {};
      return { elapsedSeconds: Math.floor((Date.now() - context.startTime) / 1000) };
    }),
    surrender: assign(({ context }) => {
      return { score: context.score - 50 };
    })
  },
  guards: {
    hasWon: ({ context }) => {
      return context.foundations.every(f => f.length === 13);
    }
  }
}).createMachine({
  id: 'solitario',
  initial: 'inactivo',
  context: {
    stock: [],
    waste: [],
    foundations: [[], [], [], []],
    tableau: [[], [], [], [], [], [], []],
    score: 0,
    startTime: null,
    elapsedSeconds: 0
  },
  states: {
    inactivo: { 
      on: { 
        INICIAR: {
          target: 'jugando',
          actions: 'initGame'
        }
      } 
    },
    jugando: {
      always: {
        target: 'ganado',
        guard: 'hasWon'
      },
      on: {
        DRAW: { actions: 'drawCard' },
        RECYCLE_WASTE: { actions: 'recycleWaste' },
        MOVE_TABLEAU_TO_FOUNDATION: { actions: 'moveTableauToFoundation' },
        MOVE_WASTE_TO_FOUNDATION: { actions: 'moveWasteToFoundation' },
        MOVE_TABLEAU_TO_TABLEAU: { actions: 'moveTableauToTableau' },
        MOVE_WASTE_TO_TABLEAU: { actions: 'moveWasteToTableau' },
        TICK: { actions: 'tickTime' },
        SURRENDER: {
          target: 'surrendered',
          actions: 'surrender'
        }
      }
    },
    surrendered: { type: 'final' },
    ganado: { type: 'final' },
  },
});
