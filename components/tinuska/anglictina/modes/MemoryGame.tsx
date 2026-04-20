"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Word, WordSetKey } from "../types";
import { shuffle } from "../utils/shuffle";
import { useGameSounds } from "../hooks/useGameSounds";
import { useGameHighScores } from "../hooks/useGameHighScores";
import { useSpeech } from "../hooks/useSpeech";

type Face = "en" | "cs";

type MemCard = {
  uid: string;
  wordId: string;
  face: Face;
  word: Word;
};

type MemoryGameProps = {
  words: Word[];
  categoryLabel: string;
  wordSetKey: WordSetKey;
  onExit: () => void;
  onCorrectAnswer: (wordId: string) => void;
};

const PAIRS_TARGET = 10;

function buildDeck(subset: Word[]): MemCard[] {
  const cards: MemCard[] = [];
  for (const w of subset) {
    cards.push({
      uid: `${w.id}-en`,
      wordId: w.id,
      face: "en",
      word: w,
    });
    cards.push({
      uid: `${w.id}-cs`,
      wordId: w.id,
      face: "cs",
      word: w,
    });
  }
  return shuffle(cards);
}

function bonusForPair(dtSec: number): number {
  if (dtSec <= 3) return 5;
  if (dtSec <= 6) return 3;
  if (dtSec <= 10) return 1;
  return 0;
}

function starRating(moves: number): 1 | 2 | 3 {
  if (moves < 18) return 3;
  if (moves < 25) return 2;
  return 1;
}

export function MemoryGame({
  words,
  categoryLabel,
  wordSetKey,
  onExit,
  onCorrectAnswer,
}: MemoryGameProps) {
  const { playCorrect, playWrong, playFanfare } = useGameSounds();
  const { getHighScore, saveIfBetter } = useGameHighScores();
  const { speakSlow } = useSpeech();

  const wordsSig = useMemo(
    () => [...words].map((w) => w.id).sort().join(","),
    [words],
  );
  const pairCount = Math.min(PAIRS_TARGET, Math.max(1, words.length));
  const subset = useMemo(() => {
    return shuffle([...words]).slice(0, pairCount);
  }, [wordsSig, words, pairCount]);

  const [deck, setDeck] = useState<MemCard[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(() => new Set());
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [lock, setLock] = useState(false);
  const [done, setDone] = useState(false);
  const pairStartRef = useRef<number | null>(null);
  const completionRef = useRef(false);
  const scoreRef = useRef(0);
  scoreRef.current = score;

  const resetGame = useCallback(() => {
    completionRef.current = false;
    setDeck(buildDeck(subset));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setScore(0);
    setLock(false);
    setDone(false);
    pairStartRef.current = null;
  }, [subset]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    if (flipped.length === 0) return;
    const lastUid = flipped[flipped.length - 1]!;
    const card = deck.find((c) => c.uid === lastUid);
    if (card?.face === "en") {
      speakSlow(card.word.en);
    }
  }, [flipped, deck, speakSlow]);


  useEffect(() => {
    if (matched.size < pairCount || pairCount === 0 || completionRef.current) {
      return;
    }
    completionRef.current = true;
    setDone(true);
    playFanfare();
    queueMicrotask(() => {
      saveIfBetter("memory", wordSetKey, scoreRef.current);
    });
  }, [matched, pairCount, playFanfare, saveIfBetter, wordSetKey]);

  const onCardClick = useCallback(
    (card: MemCard) => {
      if (lock || done) return;
      if (matched.has(card.wordId)) return;
      if (flipped.includes(card.uid)) return;
      if (flipped.length >= 2) return;

      if (flipped.length === 0) {
        pairStartRef.current = performance.now();
      }

      const next = [...flipped, card.uid];
      setFlipped(next);

      if (next.length < 2) return;

      setMoves((m) => m + 1);
      setLock(true);
      const [a, b] = next;
      const ca = deck.find((c) => c.uid === a);
      const cb = deck.find((c) => c.uid === b);
      if (!ca || !cb) {
        setLock(false);
        return;
      }

      const isPair =
        ca.wordId === cb.wordId && ca.face !== cb.face;

      if (isPair) {
        const dt =
          pairStartRef.current != null
            ? (performance.now() - pairStartRef.current) / 1000
            : 10;
        const bonusPts = bonusForPair(dt);
        setScore((s) => s + 10 + bonusPts);
        playCorrect();
        onCorrectAnswer(ca.wordId);
        window.setTimeout(() => {
          setMatched((prev) => new Set(prev).add(ca.wordId));
          setFlipped([]);
          setLock(false);
          pairStartRef.current = null;
        }, 450);
      } else {
        playWrong();
        setScore((s) => Math.max(0, s - 2));
        window.setTimeout(() => {
          setFlipped([]);
          setLock(false);
          pairStartRef.current = null;
        }, 1000);
      }
    },
    [lock, done, matched, flipped, deck, onCorrectAnswer, playCorrect, playWrong],
  );

  const gridClass = useMemo(() => {
    const n = deck.length;
    if (n === 20) return "grid-cols-5 grid-rows-4";
    if (n <= 12) return "grid-cols-3 sm:grid-cols-4";
    if (n <= 20) return "grid-cols-4 sm:grid-cols-5";
    return "grid-cols-5";
  }, [deck.length]);

  const best = getHighScore("memory", wordSetKey);

  if (words.length < 2) {
    return (
      <p className="text-center text-lg text-app-muted">
        Potřebujeme alespoň 2 slovíčka.
      </p>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-app-fg">
            {categoryLabel} · Pexeso
          </p>
          <p className="text-base text-app-muted">
            Tahy: <span className="font-bold tabular-nums">{moves}</span> ·
            Body: <span className="font-bold tabular-nums">{score}</span>
            {best > 0 ? (
              <span className="ml-2 text-teal-700">
                · Rekord: {best}
              </span>
            ) : null}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={resetGame}
            className="rounded-xl border-2 border-amber-300 bg-amber-100 px-4 py-2 font-semibold text-amber-950"
          >
            Znovu
          </button>
          <button
            type="button"
            onClick={onExit}
            className="rounded-xl border-2 border-app-border bg-app-card px-4 py-2 font-semibold text-app-muted"
          >
            ← Zpět
          </button>
        </div>
      </div>

      {done ? (
        <div className="relative overflow-hidden rounded-3xl border-4 border-emerald-400 bg-emerald-50 p-8 text-center shadow-xl">
          <div
            className="pointer-events-none absolute inset-0 flex flex-wrap justify-center gap-2 p-4 opacity-50"
            aria-hidden
          >
            {["🎉", "✨", "🎊", "⭐", "🌟"].map((e, i) => (
              <span
                key={i}
                className="animate-bounce text-3xl"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {e}
              </span>
            ))}
          </div>
          <p className="relative text-3xl font-extrabold text-emerald-900">
            Hotovo! 🎉
          </p>
          <p className="relative mt-2 text-lg text-emerald-800">
            Tahů: <strong>{moves}</strong> · Body: <strong>{score}</strong>
          </p>
          <p className="relative mt-4 text-5xl" aria-label="Hvězdy">
            {"⭐".repeat(starRating(moves))}
          </p>
          <p className="relative mt-2 text-sm text-app-muted">
            1⭐ dokončeno · 2⭐ méně než 25 tahů · 3⭐ méně než 18 tahů
          </p>
          <div className="relative mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={resetGame}
              className="rounded-2xl border-4 border-teal-400 bg-teal-200 px-8 py-3 text-xl font-bold text-teal-950"
            >
              Hrát znovu
            </button>
            <button
              type="button"
              onClick={onExit}
              className="rounded-2xl border-2 border-slate-400 bg-app-card px-8 py-3 text-xl font-bold text-app-muted"
            >
              Zpět
            </button>
          </div>
        </div>
      ) : null}

      {!done ? (
        <div className={`grid gap-2 ${gridClass}`}>
          {deck.map((card) => {
            const isOpen =
              flipped.includes(card.uid) || matched.has(card.wordId);
            const isMatched = matched.has(card.wordId);
            return (
              <button
                key={card.uid}
                type="button"
                onClick={() => onCardClick(card)}
                disabled={lock && !isOpen}
                className={`flex min-h-[4.5rem] flex-col items-center justify-center rounded-2xl border-2 p-2 text-center shadow transition [transform-style:preserve-3d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 sm:min-h-[5.5rem] ${
                  isMatched
                    ? "border-emerald-500 bg-emerald-100/90 opacity-90"
                    : isOpen
                      ? card.face === "en"
                        ? "border-blue-500 bg-blue-100"
                        : "border-red-500 bg-red-100"
                      : "border-[#e5e7eb] bg-[#f3f4f6] hover:bg-[#e5e7eb]"
                }`}
              >
                {isOpen ? (
                  <>
                    <span className="text-lg" aria-hidden>
                      {card.face === "en" ? "🇬🇧" : "🇨🇿"}
                    </span>
                    <span className="mt-1 px-1 text-sm font-bold leading-tight text-app-fg sm:text-base">
                      {card.face === "en" ? card.word.en : card.word.cs}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-app-muted">?</span>
                )}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
