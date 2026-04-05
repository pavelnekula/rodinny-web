"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useMergedVocabulary } from "../hooks/useMergedVocabulary";
import type { CategoryId } from "../types";
import { VOCABULARY_CATEGORIES } from "../VocabularyData";
import { AdventureMapGame } from "./AdventureMapGame";

const VALID = new Set<string>(VOCABULARY_CATEGORIES.map((c) => c.id));

export function AdventureMapApp() {
  const { mergedWords } = useMergedVocabulary();
  const searchParams = useSearchParams();

  const initialCategoryId = useMemo((): CategoryId | null => {
    const c = searchParams.get("category");
    if (c && VALID.has(c)) return c as CategoryId;
    return null;
  }, [searchParams]);

  return (
    <AdventureMapGame
      mergedWords={mergedWords}
      initialCategoryId={initialCategoryId}
    />
  );
}
