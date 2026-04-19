"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { CategorySelector } from "./CategorySelector";
import { DailyChallengeBar } from "./DailyChallengeBar";
import { ALL_IMPLEMENTED_MODES, isGameModeImplemented } from "./gameModes";
import { useMergedVocabulary } from "./hooks/useMergedVocabulary";
import { useProgress } from "./hooks/useProgress";
import { FillLetters } from "./modes/FillLetters";
import { Flashcards } from "./modes/Flashcards";
import { MemoryGame } from "./modes/MemoryGame";
import { UnifiedGameModeSelector } from "./UnifiedGameModeSelector";
import type { CategoryId, GameMode, WordSetKey } from "./types";
import type { Word } from "./types";
import { getCategoryMeta } from "./VocabularyData";
import { ProgressBar } from "./shared/ProgressBar";
import { shuffle } from "./utils/shuffle";

const MIX_COUNT = 20;

type HubPhase = "hub" | "play";

function PlayShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-app-bg py-6 sm:py-8">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">{children}</div>
    </div>
  );
}

export function AnglictinaHub() {
  const [hubPhase, setHubPhase] = useState<HubPhase>("hub");
  const [categoryId, setCategoryId] = useState<CategoryId | null>(null);
  const [mode, setMode] = useState<GameMode | null>(null);
  const [playWords, setPlayWords] = useState<Word[]>([]);
  const [playSetKey, setPlaySetKey] = useState<WordSetKey>("mix");
  const [playLabel, setPlayLabel] = useState("");

  const { mergedWords } = useMergedVocabulary();

  const {
    masteredCount,
    totalWords,
    recordCorrect,
    categoryMasteredCount,
    categoryTotal,
  } = useProgress(mergedWords);

  const categoryMeta = categoryId ? getCategoryMeta(categoryId) : undefined;

  const exitPlay = useCallback(() => {
    setHubPhase("hub");
    setPlayWords([]);
  }, []);

  const startCategoryPlay = useCallback(() => {
    if (!categoryId || !mode || !isGameModeImplemented(mode)) return;
    const list = mergedWords.filter((w) => w.categoryId === categoryId);
    if (list.length === 0) {
      window.alert("V této kategorii zatím nejsou žádná slovíčka.");
      return;
    }
    if (mode === "memory" && list.length < 2) {
      window.alert("Pro pexeso potřebujeme alespoň 2 slovíčka v této kategorii.");
      return;
    }
    setPlayWords(list);
    setPlaySetKey(categoryId);
    setPlayLabel(getCategoryMeta(categoryId)?.titleCs ?? "Kategorie");
    setHubPhase("play");
  }, [categoryId, mode, mergedWords]);

  const startMixPlay = useCallback(() => {
    if (!mode || !isGameModeImplemented(mode)) return;
    const mix = shuffle([...mergedWords]).slice(
      0,
      Math.min(MIX_COUNT, mergedWords.length),
    );
    if (mix.length === 0) {
      window.alert("Zatím nejsou žádná slovíčka.");
      return;
    }
    if (mode === "memory" && mix.length < 2) {
      window.alert("Pro pexeso potřebujeme alespoň 2 slovíčka.");
      return;
    }
    setPlayWords(mix);
    setPlaySetKey("mix");
    setPlayLabel("MIX — všechna slovíčka");
    setHubPhase("play");
  }, [mode, mergedWords]);

  /** Náhodný herní mód + MIX 20 slov v jednom kroku. */
  const startRandomMix = useCallback(() => {
    const modePick =
      ALL_IMPLEMENTED_MODES[
        Math.floor(Math.random() * ALL_IMPLEMENTED_MODES.length)
      ]!;
    setMode(modePick);
    const mix = shuffle([...mergedWords]).slice(
      0,
      Math.min(MIX_COUNT, mergedWords.length),
    );
    if (mix.length === 0) {
      window.alert("Zatím nejsou žádná slovíčka.");
      return;
    }
    if (modePick === "memory" && mix.length < 2) {
      window.alert("Pro pexeso potřebujeme alespoň 2 slovíčka.");
      return;
    }
    setPlayWords(mix);
    setPlaySetKey("mix");
    setPlayLabel("MIX — náhodný mód");
    setHubPhase("play");
  }, [mergedWords]);

  const playCategoryLabel = playLabel || "Sada slovíček";

  const commonGameProps = useMemo(
    () => ({
      categoryLabel: playCategoryLabel,
      onExit: exitPlay,
      wordSetKey: playSetKey,
    }),
    [playCategoryLabel, exitPlay, playSetKey],
  );

  if (hubPhase === "play" && mode && playWords.length > 0) {
    switch (mode) {
      case "flashcards":
        return (
          <PlayShell>
            <Flashcards
              words={playWords}
              categoryLabel={playCategoryLabel}
              onExit={exitPlay}
              onKnew={recordCorrect}
            />
          </PlayShell>
        );
      case "fillLetters":
        return (
          <PlayShell>
            <FillLetters
              words={playWords}
              {...commonGameProps}
              onCorrectAnswer={recordCorrect}
            />
          </PlayShell>
        );
      case "memory":
        return (
          <PlayShell>
            <MemoryGame
              words={playWords}
              {...commonGameProps}
              onCorrectAnswer={recordCorrect}
            />
          </PlayShell>
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-full bg-app-bg">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-6 sm:px-6 sm:py-10">
        <Link
          href="/tinuska"
          className="app-btn-pill inline-flex w-fit items-center gap-2 border border-app-border bg-app-card px-4 py-2 text-base font-semibold text-app-fg transition hover:border-app-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
          aria-label="Zpět na výuku Tinušky"
        >
          ← Zpět na Tinušku
        </Link>

        <header className="text-center sm:text-left">
          <h1 className="app-title-gradient text-3xl font-bold tracking-[-0.05em] sm:text-4xl md:text-5xl md:tracking-[-0.07em]">
            🇬🇧 Angličtina · slovíčka
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-app-muted sm:text-xl">
            <strong className="font-semibold text-app-fg">
              1) Kategorie
            </strong>{" "}
            → <strong className="font-semibold text-app-fg">2) Herní mód</strong>{" "}
            → <strong className="font-semibold text-app-fg">3) Začít</strong>{" "}
            (u kvízu, kola a mapy klikni na kartu módu a otevře se stránka hry).
          </p>
          <p className="mt-4 flex flex-wrap gap-4">
            <Link
              href="/tinuska/anglictina/sprava"
              className="text-base font-medium text-app-accent underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
              aria-label="Správa vlastních slovíček"
            >
              Správa slovíček (doplň vlastní)
            </Link>
          </p>
          <div className="mt-6 max-w-2xl">
            <DailyChallengeBar />
          </div>
          <p
            className="app-card mt-4 inline-flex flex-wrap items-center justify-center gap-2 px-5 py-3 text-lg font-bold text-app-fg sm:justify-start"
            role="status"
            aria-live="polite"
          >
            <span role="img" aria-hidden>
              🌟
            </span>
            Umíš{" "}
            <span className="tabular-nums text-2xl text-app-accent">
              {masteredCount}
            </span>{" "}
            z {totalWords} slovíček
            <span className="sr-only">
              (po správných odpovědích v hrách u každého slovíčka)
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
          <p className="text-base text-app-muted">
            Klikni na kategorii níže – uvidíš postup učení v ní.
          </p>
        )}

        <CategorySelector
          value={categoryId}
          onChange={setCategoryId}
          mergedWords={mergedWords}
        />

        <UnifiedGameModeSelector
          value={mode}
          onChange={setMode}
          categoryId={categoryId}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
          <button
            type="button"
            onClick={startCategoryPlay}
            disabled={
              !categoryId ||
              !mode ||
              !isGameModeImplemented(mode)
            }
            className="app-btn-pill app-btn-primary px-8 py-4 text-xl font-bold disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
            aria-label="Začít hrát s vybranou kategorií a módem"
          >
            ▶ Hrát — vybraná kategorie
          </button>
          <button
            type="button"
            onClick={startMixPlay}
            disabled={!mode || !isGameModeImplemented(mode)}
            className="app-btn-pill border border-app-border bg-app-card px-8 py-4 text-lg font-bold text-app-fg transition hover:border-app-border-hover disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
            aria-label="Hrát s mixem dvaceti slovíček ze všech kategorií"
          >
            🎲 MIX ({MIX_COUNT} slov)
          </button>
          <button
            type="button"
            onClick={startRandomMix}
            className="app-btn-pill border border-app-accent/40 bg-app-card px-8 py-4 text-lg font-bold text-app-fg transition hover:border-app-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
            aria-label="Náhodný herní mód a mix slovíček"
          >
            🎲 Náhodný mód + MIX
          </button>
        </div>
        <p className="text-center text-sm text-app-muted sm:text-left">
          „Hrát — vybraná kategorie“ platí pro kartičky, pexeso a doplň písmena —
          potřebuješ vybranou kategorii i jeden z prvních tří módů. „MIX“ bere
          náhodných {MIX_COUNT} slov. U kvízu, kola a mapy vyber kategorii nahoře
          a pak klikni na příslušnou kartu módu (předvybere se v odkazu).
        </p>
      </div>
    </div>
  );
}
