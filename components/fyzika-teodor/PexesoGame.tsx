"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PexesoPair } from "@/data/fyzika/types";
import {
  loadPexesoBest,
  savePexesoIfBetter,
} from "@/lib/fyzika/storage";
import { shuffle } from "@/components/tinuska/anglictina/utils/shuffle";
import { useFyzikaSounds } from "./useFyzikaSounds";

type Card = {
  uid: string;
  pairId: string;
  text: string;
};

function buildDeck(pairs: PexesoPair[]): Card[] {
  const cards: Card[] = [];
  for (const p of pairs) {
    cards.push({
      uid: `${p.id}-a`,
      pairId: p.id,
      text: p.sideA,
    });
    cards.push({
      uid: `${p.id}-b`,
      pairId: p.id,
      text: p.sideB,
    });
  }
  return shuffle(cards);
}

function starRating(moves: number): 1 | 2 | 3 {
  if (moves < 18) return 3;
  if (moves < 25) return 2;
  return 1;
}

type PexesoGameProps = {
  slug: string;
  pairs: PexesoPair[];
  cardBackClass: string;
  accentBorder: string;
};

export function PexesoGame({
  slug,
  pairs,
  cardBackClass,
  accentBorder,
}: PexesoGameProps) {
  const { playWrong, playPairFound, playFanfare } = useFyzikaSounds();
  const subset = useMemo(() => pairs.slice(0, Math.min(10, pairs.length)), [pairs]);
  const subSig = subset.map((p) => p.id).join(",");

  const [deck, setDeck] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(() => new Set());
  const [moves, setMoves] = useState(0);
  const [centi, setCenti] = useState(0);
  const [lock, setLock] = useState(false);
  const [done, setDone] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const completionRef = useRef(false);

  const reset = useCallback(() => {
    completionRef.current = false;
    setDeck(buildDeck(subset));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setCenti(0);
    setLock(false);
    setDone(false);
    setToast(null);
  }, [subset]);

  useEffect(() => {
    reset();
  }, [reset, subSig]);

  useEffect(() => {
    if (done) return;
    const t = window.setInterval(() => setCenti((c) => c + 1), 10);
    return () => window.clearInterval(t);
  }, [done]);

  const targetPairs = Math.min(10, subset.length);

  useEffect(() => {
    if (completionRef.current) return;
    if (matched.size < targetPairs || targetPairs === 0) {
      return;
    }
    completionRef.current = true;
    setDone(true);
    playFanfare();
    queueMicrotask(() => {
      savePexesoIfBetter(slug, moves, centi);
    });
  }, [matched.size, targetPairs, playFanfare, slug, moves, centi]);

  const onCard = useCallback(
    (card: Card) => {
      if (lock || done) return;
      if (matched.has(card.pairId)) return;
      if (flipped.includes(card.uid)) return;
      if (flipped.length >= 2) return;

      const next = [...flipped, card.uid];
      setFlipped(next);
      if (next.length < 2) return;

      setMoves((m) => m + 1);
      setLock(true);
      const [u1, u2] = next;
      const c1 = deck.find((c) => c.uid === u1);
      const c2 = deck.find((c) => c.uid === u2);
      if (!c1 || !c2) {
        setLock(false);
        return;
      }

      if (c1.pairId === c2.pairId) {
        playPairFound();
        const pair = subset.find((p) => p.id === c1.pairId);
        if (pair?.explanation) {
          setToast(pair.explanation);
          window.setTimeout(() => setToast(null), 2000);
        }
        window.setTimeout(() => {
          setMatched((prev) => new Set(prev).add(c1.pairId));
          setFlipped([]);
          setLock(false);
        }, 450);
      } else {
        playWrong();
        window.setTimeout(() => {
          setFlipped([]);
          setLock(false);
        }, 900);
      }
    },
    [lock, done, matched, flipped, deck, subset, playPairFound, playWrong],
  );

  const seconds = (centi / 100).toFixed(1);
  const best = loadPexesoBest(slug);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
        <span>
          Tahy: <strong className="text-white">{moves}</strong> · Čas:{" "}
          <strong className="text-white">{seconds}</strong> s
        </span>
        {best ? (
          <span className="text-cyan-400">
            Rekord: {best.moves} tahů / {(best.centiSecs / 100).toFixed(1)} s
          </span>
        ) : null}
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-slate-600 px-3 py-1 text-slate-200"
        >
          Znovu
        </button>
      </div>

      {toast ? (
        <div
          className="pointer-events-none fixed bottom-24 left-1/2 z-50 max-w-sm -translate-x-1/2 rounded-xl border border-emerald-500/50 bg-slate-900/95 px-4 py-3 text-center text-sm text-emerald-100 shadow-[0_0_30px_rgba(52,211,153,0.3)]"
          role="status"
        >
          {toast}
        </div>
      ) : null}

      {done ? (
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-6 text-center">
          <div className="pointer-events-none absolute inset-0 flex flex-wrap justify-center gap-2 p-4 opacity-40">
            {["✨", "⚡", "🎮", "⭐"].map((e, i) => (
              <span key={i} className="animate-bounce text-2xl" style={{ animationDelay: `${i * 0.08}s` }}>
                {e}
              </span>
            ))}
          </div>
          <p className="relative text-xl font-bold text-white">Hotovo!</p>
          <p className="relative mt-2 text-slate-300">
            Tahy: {moves} · Čas: {seconds} s
          </p>
          <p className="relative mt-3 text-4xl" aria-label="Hvězdy">
            {"⭐".repeat(starRating(moves))}
          </p>
          <p className="relative mt-2 text-xs text-slate-500">
            3⭐ &lt;18 tahů · 2⭐ &lt;25 tahů · 1⭐ dokončeno
          </p>
        </div>
      ) : null}

      {!done ? (
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {deck.map((card) => {
            const open = flipped.includes(card.uid) || matched.has(card.pairId);
            const isMatched = matched.has(card.pairId);
            return (
              <button
                key={card.uid}
                type="button"
                onClick={() => onCard(card)}
                disabled={lock && !open}
                className={`fyzika-flip-scene aspect-square min-h-[4.5rem] sm:min-h-[5.5rem] ${accentBorder}`}
              >
                <span
                  className={`fyzika-flip-inner block h-full w-full ${open ? "is-flipped" : ""}`}
                >
                  <span
                    className={`fyzika-flip-face fyzika-flip-front flex h-full items-center justify-center rounded-xl border-2 text-lg font-bold text-slate-200 ${cardBackClass}`}
                  >
                    ?
                  </span>
                  <span
                    className={`fyzika-flip-face fyzika-flip-back flex h-full items-center justify-center rounded-xl border-2 p-1 text-center text-[0.65rem] font-semibold leading-tight text-slate-100 sm:text-xs ${
                      isMatched
                        ? "border-emerald-500/60 bg-emerald-900/40"
                        : "border-cyan-500/40 bg-slate-800/90"
                    }`}
                  >
                    {card.text}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
