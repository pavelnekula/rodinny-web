"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type CardDifficulty,
  cardGridCols,
  cardPairCount,
  generateMathCardDeck,
  type MathCardFace,
} from "@/lib/mathGenerators";
import { playCorrectTone, playFanfare } from "@/lib/mathSound";
import { setBestKartyIfBetter } from "@/lib/mathStorage";
import { MathNav } from "./MathNav";
import { StarRow } from "./StarRow";

function kartyStarsEnd(
  pairs: number,
  attempts: number,
  timeSec: number,
): number {
  const tight = Math.ceil(pairs * 1.35);
  const fast = 35 + pairs * 9;
  if (attempts <= tight && timeSec < fast) return 3;
  if (attempts <= Math.ceil(pairs * 2.1)) return 2;
  return 1;
}

export function KartyGame() {
  const [difficulty, setDifficulty] = useState<CardDifficulty | null>(null);
  const [deck, setDeck] = useState<MathCardFace[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [attempts, setAttempts] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [won, setWon] = useState(false);
  const [finalStars, setFinalStars] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  const lockRef = useRef(false);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    startedAtRef.current = startedAt;
  }, [startedAt]);

  useEffect(() => {
    if (startedAt === null || won) return;
    const id = window.setInterval(() => {
      const t = startedAtRef.current;
      if (t === null) return;
      setElapsed(Math.floor((Date.now() - t) / 1000));
    }, 500);
    return () => window.clearInterval(id);
  }, [startedAt, won]);

  const startGame = (d: CardDifficulty) => {
    setDifficulty(d);
    setDeck(generateMathCardDeck(d));
    setFlipped([]);
    setMatched(new Set());
    setAttempts(0);
    setStartedAt(null);
    startedAtRef.current = null;
    setElapsed(0);
    setWon(false);
    lockRef.current = false;
  };

  const onCardClick = useCallback(
    (index: number) => {
      if (won || lockRef.current) return;
      const card = deck[index];
      if (!card || matched.has(card.pairId)) return;
      if (flipped.includes(index)) return;

      if (startedAtRef.current === null) {
        const t = Date.now();
        startedAtRef.current = t;
        setStartedAt(t);
        setElapsed(0);
      }

      if (flipped.length === 0) {
        setFlipped([index]);
        return;
      }
      if (flipped.length === 2) return;

      const firstI = flipped[0]!;
      const first = deck[firstI]!;
      const second = card;
      setFlipped([firstI, index]);
      const attemptNum = attempts + 1;
      setAttempts(attemptNum);

      if (first.pairId === second.pairId) {
        playCorrectTone();
        setMatched((m) => {
          const n = new Set(m);
          n.add(first.pairId);
          const pairs = cardPairCount(difficulty!);
          if (n.size >= pairs) {
            const t0 = startedAtRef.current ?? Date.now();
            const timeSec = Math.floor((Date.now() - t0) / 1000);
            const stars = kartyStarsEnd(pairs, attemptNum, timeSec);
            setFinalStars(stars);
            setFinalTime(timeSec);
            setBestKartyIfBetter(stars, timeSec);
            setWon(true);
            playFanfare();
          }
          return n;
        });
        setFlipped([]);
      } else {
        lockRef.current = true;
        window.setTimeout(() => {
          setFlipped([]);
          lockRef.current = false;
        }, 700);
      }
    },
    [deck, flipped, matched, won, attempts, difficulty],
  );

  const cols = difficulty ? cardGridCols(difficulty) : 4;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <MathNav />
      <header className="mb-8 text-center">
        <h1 className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
          🃏 Matematické karty
        </h1>
        <p className="mt-2 text-app-muted">
          Otoč dvě karty — patří k sobě stejný pár příkladů nebo příklad a
          výsledek.
        </p>
      </header>

      {!difficulty && (
        <div className="grid gap-4 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => startGame("easy")}
            className="rounded-3xl border-2 border-sky-300 bg-sky-50 p-6 text-left shadow-lg transition hover:scale-[1.02]"
          >
            <span className="text-xl font-bold text-sky-900">Lehká</span>
            <p className="mt-2 text-sm text-sky-800">Mřížka 3 × 4 (6 párů)</p>
          </button>
          <button
            type="button"
            onClick={() => startGame("medium")}
            className="rounded-3xl border-2 border-emerald-300 bg-emerald-50 p-6 text-left shadow-lg transition hover:scale-[1.02]"
          >
            <span className="text-xl font-bold text-emerald-900">Střední</span>
            <p className="mt-2 text-sm text-emerald-800">4 × 4 (8 párů)</p>
          </button>
          <button
            type="button"
            onClick={() => startGame("hard")}
            className="rounded-3xl border-2 border-violet-300 bg-violet-50 p-6 text-left shadow-lg transition hover:scale-[1.02]"
          >
            <span className="text-xl font-bold text-violet-900">Těžká</span>
            <p className="mt-2 text-sm text-violet-800">4 × 5 (10 párů)</p>
          </button>
        </div>
      )}

      {difficulty && !won && (
        <>
          <div className="mb-4 flex flex-wrap justify-between gap-2 text-lg font-semibold text-app-muted">
            <span className="tabular-nums">⏱ {elapsed}s</span>
            <span>Pokusů: {attempts}</span>
          </div>
          <div
            className="grid gap-2 sm:gap-3"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            }}
          >
            {deck.map((c, i) => {
              const isOpen = flipped.includes(i) || matched.has(c.pairId);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onCardClick(i)}
                  className="fyzika-flip-scene aspect-[4/3] min-h-[4.5rem] focus-visible:outline focus-visible:ring-2 focus-visible:ring-pink-400"
                  aria-label={isOpen ? c.text : "Karta rubem"}
                >
                  <div
                    className={`fyzika-flip-inner relative h-full w-full rounded-2xl shadow-md ${
                      isOpen ? "is-flipped" : ""
                    }`}
                  >
                    <div className="fyzika-flip-face flex h-full items-center justify-center rounded-2xl border-2 border-pink-200 bg-gradient-to-br from-pink-100 to-rose-50 text-3xl">
                      🎴
                    </div>
                    <div className="fyzika-flip-face fyzika-flip-back flex h-full items-center justify-center rounded-2xl border-2 border-white bg-app-card p-2 text-center text-lg font-bold leading-tight text-app-fg shadow-inner sm:text-xl">
                      {c.text}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              setDifficulty(null);
              setDeck([]);
            }}
            className="mt-6 rounded-xl border border-app-border px-4 py-2 text-sm font-medium text-app-muted"
          >
            Změnit obtížnost
          </button>
        </>
      )}

      {won && difficulty && (
        <div className="rounded-3xl border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50 p-8 text-center shadow-xl">
          <p className="text-2xl font-bold text-app-fg">Hotovo!</p>
          <p className="mt-2 text-app-muted">
            Čas: <strong>{finalTime}</strong>s · pokusů: <strong>{attempts}</strong>
          </p>
          <div className="mt-4 flex justify-center">
            <StarRow count={finalStars} />
          </div>
          <button
            type="button"
            onClick={() => startGame(difficulty)}
            className="mt-6 rounded-2xl bg-pink-600 px-8 py-3 font-bold text-white shadow-md"
          >
            Znovu
          </button>
          <button
            type="button"
            onClick={() => {
              setDifficulty(null);
              setWon(false);
              setDeck([]);
            }}
            className="mt-3 block w-full rounded-xl border border-app-border py-2 text-sm text-app-muted"
          >
            Jiná obtížnost
          </button>
        </div>
      )}
    </div>
  );
}
