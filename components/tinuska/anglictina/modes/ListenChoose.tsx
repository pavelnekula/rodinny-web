"use client";

import { motion, useAnimate } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Word } from "../types";
import { shuffle } from "../utils/shuffle";
import { useSpeech } from "../hooks/useSpeech";
import { ConfettiBurst } from "../shared/ConfettiBurst";

type ListenChooseProps = {
  words: Word[];
  categoryLabel: string;
  onExit: () => void;
  onCorrectAnswer: (wordId: string) => void;
};

function buildOptions(correct: Word, pool: Word[]): Word[] {
  const others = pool.filter((w) => w.id !== correct.id);
  const shuffled = shuffle(others);
  const pick: Word[] = [];
  for (let i = 0; i < 3; i++) {
    pick.push(shuffled[i % Math.max(shuffled.length, 1)]!);
  }
  return shuffle([correct, ...pick]);
}

export function ListenChoose({
  words,
  categoryLabel,
  onExit,
  onCorrectAnswer,
}: ListenChooseProps) {
  const { speak } = useSpeech();
  const [order, setOrder] = useState<number[]>(() =>
    shuffle(words.map((_, i) => i)),
  );
  const [idx, setIdx] = useState(0);
  const [options, setOptions] = useState<Word[]>([]);
  const [locked, setLocked] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [boardRef, shakeBoard] = useAnimate();
  const playedForWord = useRef<string | null>(null);

  const current = words[order[idx] ?? 0];

  useEffect(() => {
    if (!current || words.length < 2) return;
    setOptions(buildOptions(current, words));
    setLocked(false);
    playedForWord.current = null;
  }, [current, words]);

  useEffect(() => {
    if (!current) return;
    if (playedForWord.current === current.id) return;
    playedForWord.current = current.id;
    const t = window.setTimeout(() => speak(current.en), 300);
    return () => window.clearTimeout(t);
  }, [current, speak]);

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
        onCorrectAnswer(current.id);
        setConfetti(true);
        window.setTimeout(() => setConfetti(false), 1000);
        window.setTimeout(() => goNext(), 900);
      } else {
        const el = boardRef.current;
        if (el)
          await shakeBoard(
            el,
            { x: [0, -10, 10, -10, 10, 0] },
            { duration: 0.4 },
          );
      }
    },
    [current, locked, onCorrectAnswer, goNext, shakeBoard, boardRef],
  );

  const replay = useCallback(() => {
    if (current) speak(current.en);
  }, [current, speak]);

  if (words.length < 2 || !current) {
    return (
      <p className="text-center text-lg text-slate-600">
        Potřebujeme alespoň 2 slovíčka.
      </p>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <ConfettiBurst active={confetti} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-lg font-semibold text-slate-700">
          {categoryLabel} · Poslechni a vyber
        </p>
        <button
          type="button"
          onClick={onExit}
          className="rounded-xl border-2 border-slate-300 bg-white px-4 py-2 text-base font-semibold text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          aria-label="Zpět na výběr"
        >
          ← Zpět
        </button>
      </div>

      <motion.div
        ref={boardRef}
        className="rounded-3xl border-4 border-cyan-200 bg-white/95 p-6 text-center shadow-lg"
      >
        <p className="text-xl font-bold text-slate-800">Co slyšíš?</p>
        <button
          type="button"
          onClick={replay}
          aria-label="Přehrát slovo znovu"
          className="mt-4 inline-flex items-center gap-2 rounded-2xl border-2 border-teal-400 bg-teal-100 px-6 py-3 text-lg font-bold text-teal-900 shadow transition hover:bg-teal-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          <span aria-hidden>🔊</span> Přehrát znovu
        </button>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {options.map((w) => (
          <motion.button
            key={w.id}
            type="button"
            disabled={locked}
            whileTap={locked ? undefined : { scale: 0.95 }}
            onClick={() => onPick(w)}
            aria-label={`Vybrat ${w.en}`}
            className={`flex min-h-[8rem] flex-col items-center justify-center rounded-3xl border-4 p-4 text-6xl shadow transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 disabled:opacity-60 ${
              locked && w.id === current.id
                ? "border-emerald-500 bg-emerald-100"
                : "border-amber-200 bg-amber-50 hover:bg-amber-100"
            }`}
          >
            <span role="img" aria-label={w.en}>
              {w.emoji}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
