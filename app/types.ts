export type Chore = { id: number; n: string; x: number; d: boolean };

export type GameState = {
  xp: number;
  streak: number;
  lastFull: string; // last day ALL habits were completed
  prevFull: string; // previous value, used to undo a streak credit
  day: string; // last day the app was opened
  chores: Chore[];
};
