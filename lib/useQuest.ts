"use client";
import { useEffect, useMemo, useReducer } from "react";
import { dateKey } from "./dates";
import { reducer } from "./state";
import { loadState, saveState } from "./storage";
import type { Difficulty } from "./types";

export function useQuest() {
  const [state, dispatch] = useReducer(reducer, null);

  useEffect(() => {
    dispatch({ type: "hydrate", saved: loadState(), today: dateKey() });
    // Catch midnight rollover while the tab stays open / when it regains focus
    const tick = () => dispatch({ type: "tick", today: dateKey() });
    const timer = setInterval(tick, 30_000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, []);

  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  const actions = useMemo(
    () => ({
      complete: (id: string) => dispatch({ type: "complete", id, today: dateKey() }),
      add: (name: string, difficulty: Difficulty) => dispatch({ type: "add", name, difficulty, today: dateKey() }),
      remove: (id: string) => dispatch({ type: "delete", id, today: dateKey() }),
    }),
    []
  );

  return { state, ...actions };
}
