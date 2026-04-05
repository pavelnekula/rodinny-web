"use client";

import { useMergedVocabulary } from "../hooks/useMergedVocabulary";
import { LuckyWheelGame } from "./LuckyWheelGame";

export function LuckyWheelApp() {
  const { mergedWords } = useMergedVocabulary();
  return <LuckyWheelGame mergedWords={mergedWords} />;
}
