"use client";

import { useCallback, useEffect, useState } from "react";
import type { GameMode, WordSetKey } from "../types";

const STORAGE_KEY = "tinuska-anglictina-game-hiscores-v1";

type Store = Partial<Record<GameMode, Record<string, number>>>;

function readStore(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const p: unknown = JSON.parse(raw);
    if (typeof p !== "object" || p === null) return {};
    return p as Store;
  } catch {
    return {};
  }
}

function writeStore(s: Store) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* quota */
  }
}

function keyForSet(setKey: WordSetKey): string {
  return setKey;
}

export function useGameHighScores() {
  const [store, setStore] = useState<Store>({});

  useEffect(() => {
    setStore(readStore());
  }, []);

  const getHighScore = useCallback(
    (mode: GameMode, setKey: WordSetKey): number => {
      const k = keyForSet(setKey);
      return store[mode]?.[k] ?? 0;
    },
    [store],
  );

  const saveIfBetter = useCallback(
    (mode: GameMode, setKey: WordSetKey, score: number) => {
      const k = keyForSet(setKey);
      setStore((prev) => {
        const next = { ...prev };
        const curMode = { ...(next[mode] ?? {}) };
        const prevScore = curMode[k] ?? 0;
        if (score > prevScore) {
          curMode[k] = score;
          next[mode] = curMode;
          writeStore(next);
          return next;
        }
        return prev;
      });
    },
    [],
  );

  return { getHighScore, saveIfBetter };
}
