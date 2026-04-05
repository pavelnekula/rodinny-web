"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useMergedVocabulary } from "../hooks/useMergedVocabulary";
import { useProgress } from "../hooks/useProgress";
import type { CategoryId } from "../types";
import { VOCABULARY_CATEGORIES } from "../VocabularyData";
import { QuizDuelGame } from "./QuizDuelGame";

const VALID = new Set<string>(VOCABULARY_CATEGORIES.map((c) => c.id));

export function QuizDuelApp() {
  const { mergedWords } = useMergedVocabulary();
  const { recordCorrect } = useProgress(mergedWords);
  const searchParams = useSearchParams();

  const initialCategory = useMemo((): CategoryId | "all" => {
    const c = searchParams.get("category");
    if (c && VALID.has(c)) return c as CategoryId;
    return "all";
  }, [searchParams]);

  return (
    <QuizDuelGame
      mergedWords={mergedWords}
      recordCorrect={recordCorrect}
      initialCategory={initialCategory}
    />
  );
}
