"use client";

import { motion, useAnimate } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Word } from "../types";
import { shuffle } from "../utils/shuffle";

type SpeedQuizProps = {
  words: Word[];
  categoryLabel: string;
  onExit: () => void;
  onCorrectAnswer: (wordId: string) => void;
};

function buildEnglishChoices(correct: Word, pool: Word[]): string[] {
  const others = pool.filter((w) => w.id !== correct.id);
  const shuffled = shuffle(others);
  const w1 = shuffled[0];
  const w2 = shuffled[1] ?? shuffled[0];
  return shuffle([
    correct.en,
    w1?.en ?? correct.en,
    w2?.en ?? correct.en,
  ]).slice(0, 3);
}

function pointsForSpeed(elapsedSec: number): number {
  return Math.max(1, Math.min(10, Math.ceil(10 - elapsedSec * 1.8)));
}

function starCount(score: number, roundsPlayed: number): 1 | 2 | 3 {
  const avg = roundsPlayed > 0 ? score / roundsPlayed : 0;
  if (avg >= 6) return 3;
  if (avg >= 3) return 2;
  return 1;
}

export function SpeedQuiz({
  words,
  categoryLabel,
  onExit,
  onCorrectAnswer,
}: SpeedQuizProps) {
  const [phase, setPhase] = useState<"play" | "done">("play");
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [order] = useState<number[]>(() => shuffle(words.map((_, i) => i)));
  const [qIdx, setQIdx] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const questionStart = useRef<number>(Date.now());
  const [cardRef, shakeCard] = useAnimate();

  const current = words[order[qIdx] ?? 0];

  useEffect(() => {
    if (phase !== "play" || !current || words.length < 2) return;
    setChoices(buildEnglishChoices(current, words));
    setLocked(false);
    questionStart.current = Date.now();
  }, [current, words, phase, qIdx]);

  useEffect(() => {
    if (phase !== "play") return;
    if (timeLeft <= 0) {
      setPhase("done");
      return;
    }
    const t = window.setInterval(
      () => setTimeLeft((s) => (s <= 0 ? 0 : s - 1)),
      1000,
    );
    return () => window.clearInterval(t);
  }, [phase, timeLeft]);

  const advance = useCallback(() => {
    setQIdx((i) => (i + 1 >= order.length ? 0 : i + 1));
  }, [order.length]);

  const onPick = useCallback(
    async (label: string) => {
      if (!current || locked || phase !== "play") return;
      setLocked(true);
      const elapsed = (Date.now() - questionStart.current) / 1000;
      const ok =
        label.trim().toLowerCase() === current.en.trim().toLowerCase();
      setRounds((r) => r + 1);
      if (ok) {
        const pts = pointsForSpeed(elapsed);
        setScore((s) => s + pts);
        onCorrectAnswer(current.id);
      } else {
        const el = cardRef.current;
        if (el)
          await shakeCard(
            el,
            { x: [0, -10, 10, -10, 10, 0] },
            { duration: 0.35 },
          );
      }
      window.setTimeout(() => {
        advance();
        setLocked(false);
      }, 450);
    },
    [current, locked, phase, onCorrectAnswer, advance, shakeCard, cardRef],
  );

  const stars = useMemo(
    () => starCount(score, rounds),
    [score, rounds],
  );

  if (words.length < 2) {
    return (
      <p className="text-center text-lg text-slate-600">
        Potřebujeme alespoň 2 slovíčka.
      </p>
    );
  }

  if (phase === "done") {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 rounded-3xl border-4 border-violet-200 bg-violet-50 p-8 text-center shadow-xl">
        <p className="text-3xl font-extrabold text-violet-900">Čas vypršel!</p>
        <p className="text-xl text-violet-800">
          Body: <strong className="tabular-nums">{score}</strong> · Otázek:{" "}
          <strong className="tabular-nums">{rounds}</strong>
        </p>
        <p className="text-6xl" role="img" aria-label={`${stars} hvězdy`}>
          {"⭐".repeat(stars)}
        </p>
        <button
          type="button"
          onClick={() => {
            setPhase("play");
            setTimeLeft(60);
            setScore(0);
            setRounds(0);
            setQIdx(0);
          }}
          className="rounded-2xl border-4 border-teal-400 bg-teal-200 px-8 py-3 text-xl font-bold text-teal-950"
          aria-label="Hrát znovu"
        >
          Znovu
        </button>
        <button
          type="button"
          onClick={onExit}
          className="rounded-xl border-2 border-slate-300 bg-white px-6 py-2 text-base font-semibold text-slate-700"
          aria-label="Zpět na výběr"
        >
          ← Zpět
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p
          className="text-lg font-bold text-rose-700"
          role="status"
          aria-live="polite"
        >
          ⏱ {timeLeft}s · Body:{" "}
          <span className="tabular-nums text-teal-800">{score}</span>
        </p>
        <button
          type="button"
          onClick={onExit}
          className="rounded-xl border-2 border-slate-300 bg-white px-4 py-2 text-base font-semibold text-slate-700"
          aria-label="Zpět na výběr"
        >
          ← Zpět
        </button>
      </div>
      <p className="text-center text-base text-slate-600">{categoryLabel}</p>

      <motion.div
        ref={cardRef}
        className="rounded-3xl border-4 border-amber-200 bg-white p-8 text-center shadow-lg"
      >
        <span className="text-9xl" role="img" aria-label={current.en}>
          {current.emoji}
        </span>
        <p className="mt-4 text-lg font-semibold text-slate-600">
          Vyber správné anglické slovo
        </p>
      </motion.div>

      <div className="flex flex-col gap-3">
        {choices.map((c, i) => (
          <motion.button
            key={`${c}-${i}`}
            type="button"
            disabled={locked}
            whileTap={locked ? undefined : { scale: 0.98 }}
            onClick={() => onPick(c)}
            aria-label={`Odpověď ${c}`}
            className="rounded-2xl border-2 border-teal-300 bg-teal-50 py-4 text-xl font-bold capitalize text-teal-950 shadow hover:bg-teal-100 disabled:opacity-60"
          >
            {c}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
