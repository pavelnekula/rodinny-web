"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Word } from "../types";
import { shuffle } from "../utils/shuffle";

type MemoryCard = {
  uid: string;
  wordId: string;
  face: "word" | "emoji";
  word: Word;
};

type MemoryGameProps = {
  words: Word[];
  categoryLabel: string;
  onExit: () => void;
  onCorrectAnswer: (wordId: string) => void;
};

const MAX_PAIRS = 10;

function buildDeck(subset: Word[]): MemoryCard[] {
  const cards: MemoryCard[] = [];
  for (const w of subset) {
    cards.push({
      uid: `${w.id}-en`,
      wordId: w.id,
      face: "word",
      word: w,
    });
    cards.push({
      uid: `${w.id}-em`,
      wordId: w.id,
      face: "emoji",
      word: w,
    });
  }
  return shuffle(cards);
}

export function MemoryGame({
  words,
  categoryLabel,
  onExit,
  onCorrectAnswer,
}: MemoryGameProps) {
  const pairCount = Math.min(MAX_PAIRS, words.length);
  const [deck, setDeck] = useState<MemoryCard[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(() => new Set());
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [lock, setLock] = useState(false);
  const [done, setDone] = useState(false);

  const resetGame = useCallback(() => {
    const subset = shuffle([...words]).slice(0, pairCount);
    setDeck(buildDeck(subset));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setSeconds(0);
    setLock(false);
    setDone(false);
  }, [words, pairCount]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    if (done) return;
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [done]);

  useEffect(() => {
    if (matched.size >= pairCount && pairCount > 0) {
      setDone(true);
    }
  }, [matched, pairCount]);

  const onCardClick = useCallback(
    (card: MemoryCard) => {
      if (lock || done) return;
      if (matched.has(card.wordId)) return;
      if (flipped.includes(card.uid)) return;
      if (flipped.length >= 2) return;

      const next = [...flipped, card.uid];
      setFlipped(next);

      if (next.length < 2) return;

      setMoves((m) => m + 1);
      setLock(true);
      const [a, b] = next;
      const ca = deck.find((c) => c.uid === a);
      const cb = deck.find((c) => c.uid === b);
      if (ca && cb && ca.wordId === cb.wordId) {
        onCorrectAnswer(ca.wordId);
        window.setTimeout(() => {
          setMatched((prev) => new Set(prev).add(ca.wordId));
          setFlipped([]);
          setLock(false);
        }, 450);
      } else {
        window.setTimeout(() => {
          setFlipped([]);
          setLock(false);
        }, 900);
      }
    },
    [lock, done, matched, flipped, deck, onCorrectAnswer, pairCount],
  );

  const gridCols = useMemo(() => {
    const n = deck.length;
    if (n <= 12) return "grid-cols-3 sm:grid-cols-4";
    return "grid-cols-4 sm:grid-cols-5";
  }, [deck.length]);

  if (words.length < 2) {
    return (
      <p className="text-center text-lg text-slate-600">
        Potřebujeme alespoň 2 slovíčka.
      </p>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-lg font-semibold text-slate-700">
          <p>{categoryLabel} · Pexeso</p>
          <p className="text-base font-normal text-slate-600">
            Tahy: <span className="font-bold tabular-nums">{moves}</span> · Čas:{" "}
            <span className="font-bold tabular-nums">{seconds}</span> s · Páry:{" "}
            {matched.size}/{pairCount}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetGame}
            className="rounded-xl border-2 border-amber-300 bg-amber-100 px-4 py-2 text-base font-semibold text-amber-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
            aria-label="Hrát znovu"
          >
            Znovu
          </button>
          <button
            type="button"
            onClick={onExit}
            className="rounded-xl border-2 border-slate-300 bg-white px-4 py-2 text-base font-semibold text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            aria-label="Zpět na výběr"
          >
            ← Zpět
          </button>
        </div>
      </div>

      {done ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border-4 border-emerald-300 bg-emerald-50 p-8 text-center shadow-lg"
          role="status"
        >
          <p className="text-3xl font-extrabold text-emerald-900">Hotovo! 🎉</p>
          <p className="mt-2 text-lg text-emerald-800">
            Dokončeno za <strong>{moves}</strong> tahů a{" "}
            <strong>{seconds}</strong> sekund.
          </p>
          <button
            type="button"
            onClick={resetGame}
            className="mt-6 rounded-2xl border-4 border-teal-400 bg-teal-200 px-8 py-3 text-xl font-bold text-teal-950 shadow"
            aria-label="Hrát znovu"
          >
            Hrát znovu
          </button>
        </motion.div>
      ) : null}

      <div className={`grid gap-2 ${gridCols}`}>
        {deck.map((card) => {
          const isOpen = flipped.includes(card.uid) || matched.has(card.wordId);
          return (
            <motion.button
              key={card.uid}
              type="button"
              layout
              onClick={() => onCardClick(card)}
              disabled={lock && !isOpen}
              aria-label={
                isOpen
                  ? card.face === "word"
                    ? `Anglické slovo ${card.word.en}`
                    : `Obrázek pro ${card.word.en}`
                  : "Skrytá karta"
              }
              className={`flex min-h-[5.5rem] items-center justify-center rounded-2xl border-2 p-2 text-center shadow transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 disabled:cursor-default ${
                matched.has(card.wordId)
                  ? "border-emerald-400 bg-emerald-100"
                  : isOpen
                    ? "border-teal-300 bg-white"
                    : "border-slate-300 bg-gradient-to-br from-violet-100 to-teal-100 hover:brightness-105"
              }`}
              whileTap={isOpen || matched.has(card.wordId) ? undefined : { scale: 0.96 }}
            >
              {isOpen ? (
                card.face === "word" ? (
                  <span className="px-1 text-base font-bold capitalize text-slate-800 sm:text-lg">
                    {card.word.en}
                  </span>
                ) : (
                  <span className="text-5xl" role="img" aria-hidden>
                    {card.word.emoji}
                  </span>
                )
              ) : (
                <span className="text-3xl" aria-hidden>
                  ❓
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
