"use client";
import { useEffect, useState } from "react";
import type { Difficulty } from "@/lib/types";
import { XP_BY_DIFFICULTY } from "@/lib/xp";

const LEVELS: Difficulty[] = ["easy", "medium", "hard"];

export default function AddHabitModal({ existing, onAdd, onClose }: {
  existing: string[]; onAdd: (name: string, d: Difficulty) => void; onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [error, setError] = useState("");

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const submit = () => {
    const n = name.trim();
    if (!n) return setError("Give your quest a name.");
    if (existing.some((e) => e.toLowerCase() === n.toLowerCase())) return setError("You already have that quest.");
    onAdd(n, difficulty);
    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="card modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h2>New quest</h2>
        <input autoFocus maxLength={40} placeholder="e.g. Drink water" value={name}
          onChange={(e) => { setName(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && submit()} />
        {error && <p className="error">{error}</p>}
        <div className="diffs">
          {LEVELS.map((d) => (
            <button key={d} className={`diff ${d} ${difficulty === d ? "on" : ""}`} onClick={() => setDifficulty(d)}>
              <b>{d}</b><span>{XP_BY_DIFFICULTY[d]} XP</span>
            </button>
          ))}
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={submit}>Add quest</button>
        </div>
      </div>
    </div>
  );
}
