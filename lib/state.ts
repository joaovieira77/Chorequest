import { applyStreak, rollover } from "./streak";
import { XP_BY_DIFFICULTY } from "./xp";
import type { Difficulty, QuestState } from "./types";

export type Action =
  | { type: "hydrate"; saved: QuestState | null; today: string }
  | { type: "tick"; today: string }
  | { type: "complete"; id: string; today: string }
  | { type: "add"; name: string; difficulty: Difficulty; today: string }
  | { type: "delete"; id: string; today: string };

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `h_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const createState = (today: string): QuestState => ({
  version: 1, habits: [], totalXp: 0, streak: 0, lastStreakDate: null,
  lastActiveDate: today, completedToday: [], history: {},
});

export function reducer(state: QuestState | null, a: Action): QuestState | null {
  if (a.type === "hydrate") return rollover(a.saved ?? createState(a.today), a.today);
  if (!state) return state;
  const s = rollover(state, a.today); // every action first checks for a new day

  switch (a.type) {
    case "tick":
      return s;
    case "complete": {
      const habit = s.habits.find((h) => h.id === a.id);
      if (!habit || s.completedToday.includes(habit.id)) return s; // no double XP
      return applyStreak(
        { ...s, totalXp: s.totalXp + habit.xp, completedToday: [...s.completedToday, habit.id] },
        a.today
      );
    }
    case "add": {
      const name = a.name.trim().slice(0, 40);
      if (!name || !(a.difficulty in XP_BY_DIFFICULTY)) return s;
      const habit = { id: newId(), name, difficulty: a.difficulty, xp: XP_BY_DIFFICULTY[a.difficulty] };
      return { ...s, habits: [...s.habits, habit] };
    }
    case "delete":
      // XP is untouched; streak is re-evaluated against the remaining active habits
      return applyStreak(
        { ...s, habits: s.habits.filter((h) => h.id !== a.id), completedToday: s.completedToday.filter((i) => i !== a.id) },
        a.today
      );
  }
}
