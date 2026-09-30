"use client";
import { useEffect, useRef, useState } from "react";
import { useQuest } from "@/lib/useQuest";
import { levelInfo } from "@/lib/xp";
import { allDone } from "@/lib/streak";
import LevelCard from "./LevelCard";
import HabitItem from "./HabitItem";
import AddHabitModal from "./AddHabitModal";

export default function Dashboard() {
  const { state, complete, add, remove } = useQuest();
  const [modal, setModal] = useState(false);
  const [banner, setBanner] = useState("");
  const [confetti, setConfetti] = useState(false);
  const prev = useRef<{ level: number; done: boolean } | null>(null);
  const timers = useRef<number[]>([]);

  // Celebrations: compare with the previous render (skipped on first hydrate)
  useEffect(() => {
    if (!state) return;
    const level = levelInfo(state.totalXp).level;
    const done = allDone(state.habits, state.completedToday);
    const p = prev.current;
    prev.current = { level, done };
    if (!p) return;
    const msgs: string[] = [];
    if (level > p.level) msgs.push(`⬆️ Level up! You're level ${level}`);
    if (done && !p.done) msgs.push(state.streak > 0 ? `🔥 ${state.streak} day streak!` : "🎉 All quests complete!");
    if (!msgs.length) return;
    setBanner(msgs.join("  ·  "));
    if (done && !p.done) setConfetti(true);
    timers.current.push(window.setTimeout(() => setBanner(""), 3000), window.setTimeout(() => setConfetti(false), 1800));
  }, [state]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  if (!state) return <main className="wrap"><p className="muted">Loading quest board…</p></main>;

  const total = state.habits.length;
  const doneCount = state.habits.filter((h) => state.completedToday.includes(h.id)).length;

  return (
    <main className="wrap">
      <h1 className="brand">⚔️ Chore Quest</h1>
      {banner && <div className="banner" role="status">{banner}</div>}
      {confetti && (
        <div className="confetti" aria-hidden>
          {Array.from({ length: 36 }, (_, i) => (
            <span key={i} style={{ left: `${(i * 29) % 100}%`, animationDelay: `${(i % 6) * 60}ms`,
              background: ["#facc15", "#fb7185", "#34d399", "#60a5fa", "#c084fc"][i % 5] }} />
          ))}
        </div>
      )}

      <LevelCard totalXp={state.totalXp} streak={state.streak} />

      <section className="card">
        <div className="section-head">
          <h2>Today&apos;s Quests</h2>
          <button className="btn" onClick={() => setModal(true)}>＋ Add Habit</button>
        </div>

        {total === 0 ? (
          <div className="empty">
            <div className="empty-icon">🗺️</div>
            <h3>Your quest board is empty.</h3>
            <p className="muted">Add your first daily quest and start earning XP.</p>
            <button className="btn" onClick={() => setModal(true)}>＋ Add Habit</button>
          </div>
        ) : (
          <>
            <ul className="habits">
              {state.habits.map((h) => (
                <HabitItem key={h.id} habit={h} done={state.completedToday.includes(h.id)}
                  onComplete={() => complete(h.id)} onDelete={() => remove(h.id)} />
              ))}
            </ul>
            <div className="daily">
              <div className="bar small"><div className="bar-fill green" style={{ width: `${(doneCount / total) * 100}%` }} /></div>
              <span>{doneCount} / {total} completed</span>
            </div>
          </>
        )}
      </section>

      {modal && <AddHabitModal existing={state.habits.map((h) => h.name)} onAdd={add} onClose={() => setModal(false)} />}
    </main>
  );
}
