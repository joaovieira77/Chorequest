"use client";
import { useEffect, useRef, useState } from "react";
import { levelInfo, XP_PER_LEVEL } from "@/lib/xp";

function useCountUp(target: number) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now(), a = from.current;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min((t - start) / 500, 1);
      const cur = Math.round(a + (target - a) * p);
      from.current = cur;
      setV(cur);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v;
}

export default function LevelCard({ totalXp, streak }: { totalXp: number; streak: number }) {
  const { level, into, nextLevelXp } = levelInfo(totalXp);
  const shownXp = useCountUp(totalXp);
  return (
    <section className="card hero">
      <div className="hero-row">
        <div>
          <div className="label">LEVEL</div>
          <div className="level" key={level}>{level}</div>
        </div>
        <div className="streak" title="Complete every quest to extend your streak">
          <span className="flame">🔥</span>
          <b>{streak}</b> DAY STREAK
        </div>
      </div>
      <div className="xp-line">
        <span>{shownXp} / {nextLevelXp} XP</span>
        <span className="muted">{into} / {XP_PER_LEVEL} to next level</span>
      </div>
      <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={XP_PER_LEVEL} aria-valuenow={into}>
        <div className="bar-fill" style={{ width: `${into}%` }} />
      </div>
    </section>
  );
}
