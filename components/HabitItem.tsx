"use client";
import { useState } from "react";
import type { Habit } from "@/lib/types";

export default function HabitItem({ habit, done, onComplete, onDelete }: {
  habit: Habit; done: boolean; onComplete: () => void; onDelete: () => void;
}) {
  const [pop, setPop] = useState(false);
  const click = () => {
    if (done) return; // completed quests can't be re-claimed
    onComplete();
    setPop(true);
    setTimeout(() => setPop(false), 900);
  };
  return (
    <li className={`habit ${done ? "done" : ""}`}>
      <button className="check" onClick={click} disabled={done} aria-pressed={done}
        aria-label={done ? `${habit.name} completed` : `Complete ${habit.name}`}>
        <span className="tick">✓</span>
      </button>
      <div className="habit-main">
        <span className="habit-name">{habit.name}</span>
        <span className={`tag ${habit.difficulty}`}>{habit.difficulty}</span>
      </div>
      <span className="reward">+{habit.xp} XP{pop && <i className="float">+{habit.xp}</i>}</span>
      <button className="del" aria-label={`Delete ${habit.name}`}
        onClick={() => window.confirm(`Delete "${habit.name}"? Earned XP is kept.`) && onDelete()}>✕</button>
    </li>
  );
}
