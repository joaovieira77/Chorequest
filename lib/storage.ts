import type { QuestState } from "./types";

const KEY = "chore-quest:v1";

export function loadState(): QuestState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (s?.version !== 1 || !Array.isArray(s.habits) || typeof s.totalXp !== "number") return null;
    return s as QuestState;
  } catch {
    return null;
  }
}

export function saveState(s: QuestState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* storage full or blocked: app keeps working in memory */
  }
}
