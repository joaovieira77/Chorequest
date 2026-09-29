import type { GameState } from "./types";

export const KEY = "choreQuest3";
export const today = () => new Date().toDateString();
export const yesterday = () => {
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return y.toDateString();
};

export const DEFAULT_STATE: GameState = {
  xp: 0, streak: 0, lastFull: "", prevFull: "", day: "",
  chores: [
    { id: 1, n: "Make the bed", x: 10, d: false },
    { id: 2, n: "Brush teeth (morning)", x: 10, d: false },
    { id: 3, n: "Exercise", x: 50, d: false },
    { id: 4, n: "Brush teeth (night)", x: 10, d: false },
  ],
};

/** Load saved state and apply the daily reset if it's a new day. */
export function loadState(): GameState {
  let s = DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) s = JSON.parse(raw) as GameState;
  } catch {}
  if (s.day !== today()) {
    s = { ...s, day: today(), chores: s.chores.map((c) => ({ ...c, d: false })) };
    if (s.lastFull !== yesterday() && s.lastFull !== today()) s.streak = 0;
  }
  return s;
}
