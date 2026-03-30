"use client";

import { useMemo } from "react";
import type { CategoryId, GameMode, Word, WordSetKey } from "./types";
import { VOCABULARY_CATEGORIES } from "./VocabularyData";
import { shuffle } from "./utils/shuffle";

const MIX_COUNT = 20;

type WordSetPickerProps = {
  mode: GameMode;
  mergedWords: Word[];
  onBack: () => void;
  onStart: (words: Word[], setKey: WordSetKey, labelCs: string) => void;
};

export function WordSetPicker({
  mode,
  mergedWords,
  onBack,
  onStart,
}: WordSetPickerProps) {
  const counts = useMemo(() => {
    const m = new Map<CategoryId, number>();
    for (const c of VOCABULARY_CATEGORIES) {
      m.set(
        c.id,
        mergedWords.filter((w) => w.categoryId === c.id).length,
      );
    }
    return m;
  }, [mergedWords]);

  const mixWords = useMemo(() => {
    if (mergedWords.length === 0) return [];
    const s = shuffle([...mergedWords]);
    return s.slice(0, Math.min(MIX_COUNT, s.length));
  }, [mergedWords]);

  const modeHint =
    mode === "memory"
      ? "Potřebuješ aspoň 2 slovíčka v sadě (nejlepší je 10 párů)."
      : mode === "fillLetters"
        ? "Vyber sadu s kratšími slovy, nebo zkus MIX."
        : "Vyber kategorii nebo MIX podle chuti.";

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Vyber sadu slovíček
          </h2>
          <p className="mt-2 max-w-xl text-base text-slate-600">{modeHint}</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border-2 border-slate-300 bg-white px-4 py-2 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          aria-label="Zpět na výběr módu"
        >
          ← Zpět
        </button>
      </div>

      <div className="rounded-2xl border-4 border-dashed border-amber-300/80 bg-amber-50/50 p-4 sm:p-6">
        <p className="mb-4 text-center text-lg font-bold text-amber-900">
          🎲 MIX — všechna slovíčka
        </p>
        <button
          type="button"
          disabled={mixWords.length < 2}
          onClick={() =>
            onStart(mixWords, "mix", "MIX — všechna slovíčka")
          }
          className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-4 border-amber-400 bg-gradient-to-r from-amber-200 to-orange-200 px-6 py-8 text-xl font-extrabold text-amber-950 shadow-lg transition enabled:hover:scale-[1.01] enabled:hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`MIX, ${mixWords.length} slovíček`}
        >
          <span className="text-4xl" aria-hidden>
            🎲
          </span>
          <span>
            {mixWords.length} slovíček náhodně z celé aplikace
          </span>
        </button>
      </div>

      <div>
        <p className="mb-4 text-center text-lg font-bold text-slate-800">
          Nebo vyber jednu kategorii
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {VOCABULARY_CATEGORIES.map((cat) => {
            const n = counts.get(cat.id) ?? 0;
            const list = mergedWords.filter((w) => w.categoryId === cat.id);
            const disabled = n < 2;
            return (
              <button
                key={cat.id}
                type="button"
                disabled={disabled}
                onClick={() =>
                  onStart(list, cat.id, cat.titleCs)
                }
                className={`flex flex-col items-start rounded-2xl border-4 bg-gradient-to-br p-5 text-left shadow-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 enabled:hover:scale-[1.01] enabled:hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 ${cat.tileClass}`}
                aria-label={`${cat.titleCs}, ${n} slovíček`}
              >
                <span className="text-4xl" role="img" aria-hidden>
                  {cat.tileEmoji}
                </span>
                <span className="mt-2 text-xl font-extrabold">{cat.titleCs}</span>
                <span className="mt-1 text-sm font-medium opacity-90">
                  {n} slovíček
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
