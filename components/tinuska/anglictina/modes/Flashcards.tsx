"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
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
      <p className="text-center text-lg text-slate-600">
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
        <p className="text-lg text-slate-600">
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
            className="rounded-2xl border-2 border-slate-300 bg-white px-6 py-4 text-lg font-bold text-slate-700"
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
        <p className="text-lg font-semibold text-slate-800">
          {categoryLabel} · Kartičky
        </p>
        <button
          type="button"
          onClick={onExit}
          className="rounded-xl border-2 border-slate-300 bg-white px-4 py-2 text-base font-semibold text-slate-700"
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
      <p className="text-center text-base font-bold text-slate-700">
        {progressLabel}
      </p>
      <p className="text-center text-lg text-slate-600">
        ✅ {okCount} · ❌ {badCount}
      </p>

      <div className="mx-auto w-full max-w-md [perspective:1200px]">
        <div
          className="relative aspect-[4/5] w-full cursor-pointer rounded-3xl border-4 border-white shadow-2xl outline-none transition-transform duration-500 [transform-style:preserve-3d] focus-visible:ring-4 focus-visible:ring-teal-400"
          style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
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
              ? `Zadní strana: ${current.cs}. Klikni pro anglické slovo.`
              : `Přední strana: ${current.en}. Klikni pro překlad.`
          }
        >
          <span
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl bg-gradient-to-br from-sky-50 via-white to-teal-50 p-6 [backface-visibility:hidden]"
          >
            <span className="text-7xl sm:text-8xl" aria-hidden>
              {current.emoji}
            </span>
            <span className="text-center text-3xl font-extrabold capitalize leading-tight text-slate-900 sm:text-4xl">
              {current.en}
            </span>
            <span
              className="pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <SpeechButton
                text={current.en}
                label={`Vyslovit ${current.en}`}
                className="h-14 w-14 text-3xl"
              />
            </span>
          </span>
          <span
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-rose-50 p-6 [backface-visibility:hidden]"
            style={{ transform: "rotateY(180deg)" }}
          >
            <p className="text-4xl font-extrabold text-teal-900 sm:text-5xl">
              {current.cs}
            </p>
            <p className="text-center text-base font-medium leading-snug text-slate-700 sm:text-lg">
              {current.sentence}
            </p>
          </span>
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
