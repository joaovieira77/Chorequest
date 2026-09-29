"use client";

import { useEffect, useState } from "react";
import { DEFAULT_STATE, KEY, loadState, today } from "./lib";
import type { GameState } from "./types";

export default function Home() {
  const [S, setS] = useState<GameState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState("");
  const [name, setName] = useState("");
  const [diff, setDiff] = useState("25");

  // Load after mount so server and client HTML match.
  useEffect(() => {
    setS(loadState());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(S));
    } catch {}
  }, [S, loaded]);

  function say(m: string) {
    setToast(m);
    setTimeout(() => setToast(""), 2000);
  }

  function toggle(id: number) {
    const c = S.chores.find((k) => k.id === id);
    if (!c) return;
    const chores = S.chores.map((k) => (k.id === id ? { ...k, d: !k.d } : k));
    const n: GameState = { ...S, chores };
    const all = chores.length > 0 && chores.every((k) => k.d);
    let msg = "";
    if (!c.d) {
      n.xp = S.xp + c.x;
      msg = `+${c.x} XP!`;
      if (Math.floor(n.xp / 100) > Math.floor(S.xp / 100))
        msg = `🎉 LEVEL UP! Level ${Math.floor(n.xp / 100) + 1}`;
      if (all && S.lastFull !== today()) {
        n.prevFull = S.lastFull;
        n.lastFull = today();
        n.streak = S.streak + 1;
        msg = `🔥 All done! ${n.streak}-day streak`;
      }
    } else {
      n.xp = Math.max(0, S.xp - c.x);
      if (S.lastFull === today()) {
        n.lastFull = S.prevFull;
        n.streak = Math.max(0, S.streak - 1);
      }
    }
    setS(n);
    if (msg) say(msg);
  }

  function add() {
    const v = name.trim();
    if (!v) return;
    setS({ ...S, chores: [...S.chores, { id: Date.now(), n: v, x: Number(diff), d: false }] });
    setName("");
  }

  const del = (id: number) => setS({ ...S, chores: S.chores.filter((k) => k.id !== id) });
  const reset = () => {
    if (confirm("Reset all XP, streak and habits?")) setS({ ...DEFAULT_STATE, day: today() });
  };

  const cur = S.xp % 100;
  const doneN = S.chores.filter((k) => k.d).length;

  return (
    <main>
      <div id="toast" className={toast ? "show" : ""}>{toast}</div>
      <h1>⚔️ Chore Quest</h1>

      <div className="card">
        <div className="lvl"><span>Level</span><b>{Math.floor(S.xp / 100) + 1}</b></div>
        <div className="bar"><div className="fill" style={{ width: `${cur}%` }} /></div>
        <div className="muted">{cur} / 100 XP to next level · 🔥 {S.streak} day streak</div>
        <div className="muted">
          Today: {doneN} / {S.chores.length} habits (finish all to keep your streak)
        </div>
      </div>

      <div className="card">
        <div className="add">
          <input
            value={name}
            placeholder="New daily habit (e.g. Read 10 min)"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
          <select value={diff} onChange={(e) => setDiff(e.target.value)}>
            <option value="10">Easy · 10 XP</option>
            <option value="25">Medium · 25 XP</option>
            <option value="50">Hard · 50 XP</option>
          </select>
          <button className="primary" onClick={add}>Add</button>
        </div>
      </div>

      <div className="card">
        {S.chores.length === 0 && <div className="muted">No habits yet. Add your first one above!</div>}
        {S.chores.map((c) => (
          <div key={c.id} className={`chore${c.d ? " done" : ""}`}>
            <button className="chk" onClick={() => toggle(c.id)}>{c.d ? "✓" : ""}</button>
            <span className="n">{c.n}</span>
            <span className="xp">+{c.x} XP</span>
            <button className="x" onClick={() => del(c.id)}>✕</button>
          </div>
        ))}
      </div>

      <button className="x" onClick={reset}>Reset progress</button>
    </main>
  );
}
