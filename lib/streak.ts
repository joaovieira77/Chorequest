import { previousDay } from "./dates";
import type { Habit, QuestState } from "./types";

/** True only if there is at least one active habit and every active habit is done. */
export const allDone = (habits: Habit[], done: string[]) =>
  habits.length > 0 && habits.every((h) => done.includes(h.id));

/**
 * Called whenever we learn the current date. If a new day has begun:
 * archive yesterday, uncheck everything, keep XP, and break the streak
 * unless yesterday was the last day that counted. Handles multi-day gaps.
 */
export function rollover(s: QuestState, today: string): QuestState {
  if (today <= s.lastActiveDate) return s; // same day (or clock moved back): no-op
  return {
    ...s,
    history: { ...s.history, [s.lastActiveDate]: s.completedToday },
    completedToday: [],
    streak: s.lastStreakDate === previousDay(today) ? s.streak : 0,
    lastActiveDate: today,
  };
}

/** Award today's streak point once, when all currently active habits are complete. */
export function applyStreak(s: QuestState, today: string): QuestState {
  if (s.lastStreakDate === today || !allDone(s.habits, s.completedToday)) return s;
  return { ...s, streak: s.streak + 1, lastStreakDate: today };
}
