"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Word } from "../types";
import { VOCABULARY_WORDS } from "../VocabularyData";
import { getMergedWords } from "../mergedVocabulary";

export function useMergedVocabulary() {
  const [tick, setTick] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTick((t) => t + 1);
  }, []);

  const mergedWords = useMemo((): Word[] => {
    if (!mounted) {
      return [...VOCABULARY_WORDS] as Word[];
    }
    return getMergedWords();
  }, [mounted, tick]);

  const refresh = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    const onChange = () => refresh();
    window.addEventListener("storage", onChange);
    window.addEventListener("anglictina-vocabulary-changed", onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("anglictina-vocabulary-changed", onChange);
    };
  }, [refresh]);

  return { mergedWords, refresh };
}
