"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import type { Word } from "../types";
import { shuffle } from "../utils/shuffle";
import { SpeechButton } from "../shared/SpeechButton";
import { useGameSounds } from "../hooks/useGameSounds";

type FlashcardsProps = {
  words: Word[];
  categoryLabel: string;
  onExit: () => void;
  onKnew: (wordId: string) => void;
};

export function Flashcards({
  words,
  categoryLabel,
  onExit,
  onKnew,
}: FlashcardsProps) {
  const { playCorrect, playWrong, playFanfare } = useGameSounds();
  const initialTotal = words.length;

  const [queue, setQueue] = useState<Word[]>(() => shuffle([...words]));
  const [learnedCount, setLearnedCount] = useState(0);
  const [okCount, setOkCount] = useState(0);
  const [badCount, setBadCount] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [phase, setPhase] = useState<"play" | "done">("play");
  const [failedIds, setFailedIds] = useState<Set<string>>(() => new Set());

  const current = queue[0];

  /** Před vykreslením — žádné jednosnímkové „probliknutí“ angličtiny z předchozí karty. */
  useLayoutEffect(() => {
    setFlipped(false);
  }, [current?.id]);

  useEffect(() => {
    if (phase === "play" && queue.length === 0 && initialTotal > 0) {
      setPhase("done");
      playFanfare();
    }
  }, [queue.length, phase, initialTotal, playFanfare]);

  const progressLabel = useMemo(() => {
    if (initialTotal === 0) return "0 / 0";
    return `${learnedCount} / ${initialTotal} slovíček`;
  }, [learnedCount, initialTotal]);

  const markKnew = useCallback(() => {
    if (!current || phase !== "play") return;
    playCorrect();
    onKnew(current.id);
    setLearnedCount((n) => n + 1);
    setOkCount((n) => n + 1);
    setFlipped(false);
    setQueue((q) => q.slice(1));
  }, [current, phase, onKnew, playCorrect]);

  const markUnknown = useCallback(() => {
    if (!current || phase !== "play") return;
    playWrong();
    setBadCount((n) => n + 1);
    setFailedIds((prev) => new Set(prev).add(current.id));
    setFlipped(false);
    setQueue((q) => {
      const [head, ...rest] = q;
      if (!head) return q;
      return [...rest, head];
    });
  }, [current, phase, playWrong]);

  const retryUnknown = useCallback(() => {
    const failedWords = words.filter((w) => failedIds.has(w.id));
    if (failedWords.length === 0) return;
    setQueue(shuffle([...failedWords]));
    setLearnedCount(0);
    setOkCount(0);
    setBadCount(0);
    setFailedIds(new Set());
    setPhase("play");
    setFlipped(false);
  }, [words, failedIds]);

  const playAgain = useCallback(() => {
    setQueue(shuffle([...words]));
    setLearnedCount(0);
    setOkCount(0);
    setBadCount(0);
    setFailedIds(new Set());
    setPhase("play");
    setFlipped(false);
  }, [words]);

  if (initialTotal === 0) {
    return (
      <p className="text-center text-lg text-app-muted">
        V této sadě nejsou žádná slovíčka.
      </p>
    );
  }

  if (phase === "done") {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 px-4 py-8 text-center">
        <p className="text-3xl font-extrabold text-teal-900">
          Skvělá práce! Znala jsi {learnedCount} z {initialTotal} slovíček 🌟
        </p>
        <p className="text-lg text-app-muted">
          ✅ {okCount} · ❌ {badCount} (hodnocení)
        </p>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <button
            type="button"
            onClick={retryUnknown}
            disabled={failedIds.size === 0}
            className="rounded-2xl border-4 border-amber-400 bg-amber-200 px-6 py-4 text-lg font-extrabold text-amber-950 shadow-lg transition enabled:hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Zopakovat neznámá
          </button>
          <button
            type="button"
            onClick={playAgain}
            className="rounded-2xl border-4 border-teal-400 bg-teal-200 px-6 py-4 text-lg font-extrabold text-teal-950 shadow-lg transition hover:scale-[1.02]"
          >
            Hrát znovu
          </button>
          <button
            type="button"
            onClick={onExit}
            className="rounded-2xl border-2 border-app-border bg-app-card px-6 py-4 text-lg font-bold text-app-muted"
          >
            Zpět
          </button>
        </div>
      </div>
    );
  }

  if (!current) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-lg font-semibold text-app-fg">
          {categoryLabel} · Kartičky
        </p>
        <button
          type="button"
          onClick={onExit}
          className="rounded-xl border-2 border-app-border bg-app-card px-4 py-2 text-base font-semibold text-app-muted"
          aria-label="Zpět"
        >
          ← Zpět
        </button>
      </div>

      <div
        className="h-3 w-full overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-valuenow={learnedCount}
        aria-valuemin={0}
        aria-valuemax={initialTotal}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-[width] duration-300"
          style={{
            width: `${initialTotal ? (learnedCount / initialTotal) * 100 : 0}%`,
          }}
        />
      </div>
      <p className="text-center text-base font-bold text-app-muted">
        {progressLabel}
      </p>
      <p className="text-center text-lg text-app-muted">
        ✅ {okCount} · ❌ {badCount}
      </p>

      <div className="mx-auto w-full max-w-md">
        <div
          className="relative aspect-[4/5] w-full cursor-pointer rounded-3xl border-4 border-[#e5e7eb] bg-[#ffffff] shadow-lg outline-none transition-shadow focus-visible:ring-4 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2"
          onClick={() => setFlipped((f) => !f)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setFlipped((f) => !f);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={
            flipped
              ? `Anglicky: ${current.en}. Klikni pro návrat na český význam.`
              : `Česky: ${current.cs}. Klikni a uvidíš anglický překlad a větu.`
          }
        >
          {!flipped ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
              <span className="text-7xl sm:text-8xl" aria-hidden>
                {current.emoji}
              </span>
              <span className="text-center text-3xl font-extrabold leading-tight text-[#1a1a1a] sm:text-4xl">
                {current.cs}
              </span>
              <p className="text-center text-sm font-medium text-[#6b7280] sm:text-base">
                Překlad si řekni anglicky — pak klikni a zkontroluj
              </p>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
              <p className="text-center text-3xl font-extrabold capitalize leading-tight text-[#1a1a1a] sm:text-4xl">
                {current.en}
              </p>
              <p className="text-center text-base font-medium leading-snug text-[#374151] sm:text-lg">
                {current.sentence}
              </p>
              <span
                className="pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <SpeechButton
                  text={current.en}
                  label={`Vyslovit pomalu: ${current.en}`}
                  className="h-14 w-14 text-3xl"
                  slow
                />
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={markKnew}
          className="min-h-[56px] min-w-[120px] rounded-2xl border-4 border-emerald-400 bg-emerald-200 px-8 py-4 text-3xl font-extrabold text-emerald-950 shadow-lg transition hover:scale-105 active:scale-95"
          aria-label="Znala jsem"
        >
          ✅
        </button>
        <button
          type="button"
          onClick={markUnknown}
          className="min-h-[56px] min-w-[120px] rounded-2xl border-4 border-rose-400 bg-rose-200 px-8 py-4 text-3xl font-extrabold text-rose-950 shadow-lg transition hover:scale-105 active:scale-95"
          aria-label="Neznala jsem"
        >
          ❌
        </button>
      </div>
    </div>
  );
}
