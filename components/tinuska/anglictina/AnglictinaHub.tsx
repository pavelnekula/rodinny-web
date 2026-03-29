"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { CategorySelector } from "./CategorySelector";
import {
  ALL_IMPLEMENTED_MODES,
  isGameModeImplemented,
} from "./gameModes";
import { useProgress } from "./hooks/useProgress";
import { FillLetters } from "./modes/FillLetters";
import { Flashcards } from "./modes/Flashcards";
import { ListenChoose } from "./modes/ListenChoose";
import { MemoryGame } from "./modes/MemoryGame";
import { MultipleChoice } from "./modes/MultipleChoice";
import { SpeedQuiz } from "./modes/SpeedQuiz";
import { ModeSelector } from "./ModeSelector";
import type { CategoryId, GameMode } from "./types";
import {
  getCategoryMeta,
  getWordsByCategory,
  VOCABULARY_CATEGORIES,
} from "./VocabularyData";
import { ProgressBar } from "./shared/ProgressBar";

type Phase = "hub" | "play";

function PlayShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-gradient-to-b from-amber-50 via-teal-50/80 to-rose-50 py-8">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">{children}</div>
    </div>
  );
}

export function AnglictinaHub() {
  const [phase, setPhase] = useState<Phase>("hub");
  const [categoryId, setCategoryId] = useState<CategoryId | null>(null);
  const [mode, setMode] = useState<GameMode | null>(null);

  const {
    masteredCount,
    totalWords,
    hasStar,
    recordCorrect,
    categoryMasteredCount,
    categoryTotal,
  } = useProgress();

  const words = useMemo(
    () => (categoryId ? getWordsByCategory(categoryId) : []),
    [categoryId],
  );

  const categoryMeta = categoryId ? getCategoryMeta(categoryId) : undefined;
  const categoryLabel = categoryMeta?.titleCs ?? "Kategorie";

  const startPlay = useCallback(() => {
    if (!categoryId || !mode || !isGameModeImplemented(mode)) return;
    setPhase("play");
  }, [categoryId, mode]);

  const startRandom = useCallback(() => {
    const cats = [...VOCABULARY_CATEGORIES];
    const catPick = cats[Math.floor(Math.random() * cats.length)]!;
    const modePick =
      ALL_IMPLEMENTED_MODES[
        Math.floor(Math.random() * ALL_IMPLEMENTED_MODES.length)
      ]!;
    setCategoryId(catPick.id);
    setMode(modePick);
    setPhase("play");
  }, []);

  const exitPlay = useCallback(() => {
    setPhase("hub");
  }, []);

  if (phase === "play" && categoryId && mode) {
    const common = {
      words,
      categoryLabel,
      onExit: exitPlay,
      onCorrectAnswer: recordCorrect,
    };

    switch (mode) {
      case "flashcards":
        return (
          <PlayShell>
            <Flashcards
              words={words}
              categoryLabel={categoryLabel}
              hasStar={hasStar}
              onExit={exitPlay}
            />
          </PlayShell>
        );
      case "fillLetters":
        return (
          <PlayShell>
            <FillLetters {...common} />
          </PlayShell>
        );
      case "multipleChoice":
        return (
          <PlayShell>
            <MultipleChoice {...common} />
          </PlayShell>
        );
      case "memory":
        return (
          <PlayShell>
            <MemoryGame {...common} />
          </PlayShell>
        );
      case "listenChoose":
        return (
          <PlayShell>
            <ListenChoose {...common} />
          </PlayShell>
        );
      case "speedQuiz":
        return (
          <PlayShell>
            <SpeedQuiz {...common} />
          </PlayShell>
        );
      default: {
        const _m: never = mode;
        return _m;
      }
    }
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-amber-50 via-teal-50/70 to-rose-50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href="/tinuska"
          className="inline-flex w-fit items-center gap-2 rounded-xl border-2 border-violet-200 bg-white/90 px-4 py-2 text-base font-semibold text-violet-800 shadow-sm transition hover:bg-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          aria-label="Zpět na výuku Tinušky"
        >
          ← Zpět na Tinušku
        </Link>

        <header className="text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl md:text-5xl">
            🇬🇧 Angličtina · slovíčka
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600 sm:text-xl">
            Pastelové kartičky a hry pro klidné učení. Vyber kategorii a mód.
          </p>
          <p
            className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl border-2 border-teal-200 bg-white/90 px-5 py-3 text-lg font-bold text-teal-900 shadow-sm sm:justify-start"
            role="status"
            aria-live="polite"
          >
            <span role="img" aria-hidden>
              🌟
            </span>
            Umíš{" "}
            <span className="tabular-nums text-2xl text-rose-600">
              {masteredCount}
            </span>{" "}
            z {totalWords} slovíček
            <span className="sr-only">
              (po třech správných odpovědích v kvízech u každého slovíčka)
            </span>
          </p>
        </header>

        {categoryId ? (
          <ProgressBar
            label={`V této kategorii (${categoryMeta?.titleCs ?? ""})`}
            current={categoryMasteredCount(categoryId)}
            total={categoryTotal(categoryId)}
          />
        ) : (
          <p className="text-base text-slate-500">
            Vyber kategorii – uvidíš, kolik slovíček v ní už máš na tři hvězdy.
          </p>
        )}

        <CategorySelector value={categoryId} onChange={setCategoryId} />

        <ModeSelector value={mode} onChange={setMode} />

        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
          <button
            type="button"
            onClick={startRandom}
            className="rounded-2xl border-4 border-amber-300 bg-gradient-to-r from-amber-200 to-orange-200 px-8 py-4 text-xl font-extrabold text-amber-950 shadow-lg transition hover:scale-[1.02] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
            aria-label="Náhodná kategorie a náhodný herní mód"
          >
            🎲 Náhodný mód
          </button>
          <button
            type="button"
            onClick={startPlay}
            disabled={!categoryId || !mode || !isGameModeImplemented(mode)}
            aria-disabled={!categoryId || !mode || !isGameModeImplemented(mode)}
            className="rounded-2xl border-4 border-teal-400 bg-gradient-to-r from-teal-300 to-cyan-300 px-10 py-4 text-xl font-extrabold text-teal-950 shadow-lg transition enabled:hover:scale-[1.02] enabled:hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Začít hru s vybranou kategorií a módem"
          >
            ▶ Začít hrát
          </button>
        </div>
      </div>
    </div>
  );
}
