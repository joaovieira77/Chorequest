import type { Difficulty } from "./types";

export const XP_BY_DIFFICULTY: Record<Difficulty, number> = { easy: 10, medium: 25, hard: 50 };
export const XP_PER_LEVEL = 100;

export function levelInfo(totalXp: number) {
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  return {
    level,
    into: totalXp % XP_PER_LEVEL, // XP earned toward next level
    nextLevelXp: level * XP_PER_LEVEL,
  };
}
