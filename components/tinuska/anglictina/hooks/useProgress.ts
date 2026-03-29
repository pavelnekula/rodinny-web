"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { TOTAL_VOCABULARY_COUNT, VOCABULARY_WORDS } from "../VocabularyData";

const STORAGE_KEY = "tinuska-anglictina-progress-v1";

const STAR_THRESHOLD = 3;

function readStore(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === "number" && v >= 0 && Number.isFinite(v)) {
        out[k] = Math.floor(v);
      }
    }
    return out;
  } catch {
    return {};
  }
}

function writeStore(words: Record<string, number>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  } catch {
    /* ignore quota */
  }
}

export function useProgress() {
  const [words, setWords] = useState<Record<string, number>>({});

  useEffect(() => {
    setWords(readStore());
  }, []);

  const recordCorrect = useCallback(
    (wordId: string, delta = 1) => {
      setWords((prev) => {
        const next = {
          ...prev,
          [wordId]: (prev[wordId] ?? 0) + delta,
        };
        writeStore(next);
        return next;
      });
    },
    [],
  );

  const getCorrectCount = useCallback(
    (wordId: string) => words[wordId] ?? 0,
    [words],
  );

  const hasStar = useCallback(
    (wordId: string) => getCorrectCount(wordId) >= STAR_THRESHOLD,
    [getCorrectCount],
  );

  const masteredCount = useMemo(() => {
    let n = 0;
    for (const w of VOCABULARY_WORDS) {
      if ((words[w.id] ?? 0) >= STAR_THRESHOLD) n += 1;
    }
    return n;
  }, [words]);

  const categoryMasteredCount = useCallback(
    (categoryId: (typeof VOCABULARY_WORDS)[number]["categoryId"]) => {
      let n = 0;
      for (const w of VOCABULARY_WORDS) {
        if (w.categoryId !== categoryId) continue;
        if ((words[w.id] ?? 0) >= STAR_THRESHOLD) n += 1;
      }
      return n;
    },
    [words],
  );

  const categoryTotal = useCallback(
    (categoryId: (typeof VOCABULARY_WORDS)[number]["categoryId"]) =>
      VOCABULARY_WORDS.filter((w) => w.categoryId === categoryId).length,
    [],
  );

  return {
    getCorrectCount,
    hasStar,
    recordCorrect,
    masteredCount,
    categoryMasteredCount,
    categoryTotal,
    totalWords: TOTAL_VOCABULARY_COUNT,
    starThreshold: STAR_THRESHOLD,
  };
}
