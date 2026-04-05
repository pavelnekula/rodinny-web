"use client";

import { useMergedVocabulary } from "./hooks/useMergedVocabulary";
import { AchievementProvider } from "./AchievementProvider";

export function AnglictinaGameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mergedWords } = useMergedVocabulary();
  return (
    <AchievementProvider mergedWords={mergedWords}>{children}</AchievementProvider>
  );
}
