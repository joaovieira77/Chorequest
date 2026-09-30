export type Difficulty = "easy" | "medium" | "hard";

export interface Habit {
  id: string;
  name: string;
  difficulty: Difficulty;
  xp: number;
}

export interface QuestState {
  version: 1;
  habits: Habit[];
  totalXp: number; // level is derived from this; never decreases
  streak: number;
  lastStreakDate: string | null; // last day that counted toward the streak
  lastActiveDate: string; // local YYYY-MM-DD of last state update
  completedToday: string[]; // habit ids completed on lastActiveDate
  history: Record<string, string[]>; // date -> completed habit ids
}
