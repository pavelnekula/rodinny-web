"use client";

import { motion, useAnimate } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Word } from "../types";
import { shuffle } from "../utils/shuffle";
import { ConfettiBurst } from "../shared/ConfettiBurst";

type MultipleChoiceProps = {
  words: Word[];
  categoryLabel: string;
  onExit: () => void;
  onCorrectAnswer: (wordId: string) => void;
};

function buildChoices(correct: Word, pool: Word[]): Word[] {
  const others = pool.filter((w) => w.id !== correct.id);
  const shuffled = shuffle(others);
  const wrong: Word[] = [];
  for (let i = 0; i < 3; i++) {
    wrong.push(shuffled[i % Math.max(shuffled.length, 1)]!);
  }
  return shuffle([correct, ...wrong]);
}

export function MultipleChoice({
  words,
  categoryLabel,
  onExit,
  onCorrectAnswer,
}: MultipleChoiceProps) {
  const [order, setOrder] = useState<number[]>(() =>
    shuffle(words.map((_, i) => i)),
  );
  const [idx, setIdx] = useState(0);
  const [choices, setChoices] = useState<Word[]>([]);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [cardRef, animateCard] = useAnimate();
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = words[order[idx] ?? 0];

  useEffect(() => {
    if (!current || words.length < 2) return;
    setChoices(buildChoices(current, words));
    setLocked(false);
  }, [current, words]);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, [current]);

  const goNext = useCallback(() => {
    setIdx((i) => {
      if (i + 1 >= order.length) {
        setOrder(shuffle(words.map((_, j) => j)));
        return 0;
      }
      return i + 1;
    });
  }, [order.length, words]);

  const onPick = useCallback(
    async (w: Word) => {
      if (!current || locked) return;
      if (w.id === current.id) {
        setLocked(true);
        setScore((s) => s + 1);
        onCorrectAnswer(current.id);
        setConfetti(true);
        window.setTimeout(() => setConfetti(false), 1200);
        advanceTimer.current = setTimeout(() => {
          goNext();
        }, 1500);
      } else {
        await animateCard(
          cardRef.current,
          { x: [0, -12, 12, -12, 12, 0] },
          { duration: 0.4 },
        );
      }
    },
    [current, locked, onCorrectAnswer, goNext, animateCard, cardRef],
  );

  const choiceRows = useMemo(() => choices, [choices]);

  if (words.length < 2 || !current) {
    return (
      <p className="text-center text-lg text-slate-600">
        Potřebujeme alespoň 2 slovíčka v kategorii.
      </p>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <ConfettiBurst active={confetti} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p
          className="text-lg font-semibold text-slate-700"
          role="status"
          aria-live="polite"
        >
          {categoryLabel} · Skóre:{" "}
          <span className="tabular-nums text-teal-700">{score}</span>
        </p>
        <button
          type="button"
          onClick={onExit}
          className="rounded-xl border-2 border-slate-300 bg-white px-4 py-2 text-base font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          aria-label="Zpět na výběr"
        >
          ← Zpět
        </button>
      </div>

      <motion.div
        ref={cardRef}
        className="rounded-3xl border-4 border-rose-200 bg-white/95 p-8 text-center shadow-xl"
      >
        <span className="text-9xl" role="img" aria-label={current.en}>
          {current.emoji}
        </span>
        <p className="mt-4 text-xl font-semibold text-slate-600">
          Vyber správný český překlad
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {choiceRows.map((w) => (
          <motion.button
            key={w.id}
            type="button"
            disabled={locked}
            whileTap={locked ? undefined : { scale: 0.97 }}
            onClick={() => onPick(w)}
            aria-label={`Možnost ${w.cs}`}
            className={`rounded-2xl border-2 px-4 py-4 text-left text-lg font-bold shadow transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 disabled:opacity-60 ${
              locked && w.id === current.id
                ? "border-emerald-500 bg-emerald-100 text-emerald-900"
                : "border-teal-200 bg-teal-50 text-teal-900 hover:bg-teal-100"
            }`}
          >
            {w.cs}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
