"use client";

import { motion, useAnimate } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Word } from "../types";
import { shuffle } from "../utils/shuffle";
import { SpeechButton } from "../shared/SpeechButton";

type FillLettersProps = {
  words: Word[];
  categoryLabel: string;
  onExit: () => void;
  onCorrectAnswer: (wordId: string) => void;
};

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

function puzzleKey(word: Word): string {
  const first = word.en.trim().split(/\s+/)[0] ?? word.en;
  return first.toLowerCase().replace(/[^a-z]/g, "");
}

function buildLetterPool(target: string): string[] {
  const chars = target.split("");
  const wrong = shuffle(
    ALPHABET.filter((c) => !target.includes(c)),
  ).slice(0, 4);
  return shuffle([...chars, ...wrong]);
}

export function FillLetters({
  words,
  categoryLabel,
  onExit,
  onCorrectAnswer,
}: FillLettersProps) {
  const playable = useMemo(
    () => words.filter((w) => puzzleKey(w).length > 0),
    [words],
  );
  const [order, setOrder] = useState<number[]>(() =>
    playable.map((_, i) => i),
  );
  const [roundIdx, setRoundIdx] = useState(0);
  const [pool, setPool] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [correctTotal, setCorrectTotal] = useState(0);
  const [shakeBoard, setShakeBoard] = useState(false);
  const [flashOk, setFlashOk] = useState(false);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    setOrder(shuffle(playable.map((_, i) => i)));
    setRoundIdx(0);
    setCorrectTotal(0);
  }, [playable]);

  const word = playable[order[roundIdx] ?? 0];
  const target = word ? puzzleKey(word) : "";

  useEffect(() => {
    if (!word || !target) return;
    setProgress(0);
    setPool(buildLetterPool(target));
  }, [word, target]);

  const remainingSlots = target.length - progress;

  const advanceRound = useCallback(() => {
    setCorrectTotal((c) => c + 1);
    if (word) onCorrectAnswer(word.id);
    setFlashOk(true);
    window.setTimeout(() => setFlashOk(false), 450);
    window.setTimeout(() => {
      setRoundIdx((i) => {
        if (i + 1 >= order.length) {
          setOrder(shuffle(playable.map((_, j) => j)));
          return 0;
        }
        return i + 1;
      });
    }, 500);
  }, [word, onCorrectAnswer, order.length, playable]);

  const onPickLetter = useCallback(
    async (letter: string, indexInPool: number) => {
      if (!target || remainingSlots <= 0) return;
      const expected = target[progress]!;
      if (letter === expected) {
        const nextProgress = progress + 1;
        setProgress(nextProgress);
        setPool((p) => p.filter((_, idx) => idx !== indexInPool));
        if (nextProgress >= target.length) {
          advanceRound();
        }
      } else {
        setShakeBoard(true);
        const el = scope.current;
        if (el)
          await animate(
            el,
            { x: [0, -10, 10, -10, 10, 0] },
            { duration: 0.45 },
          );
        setShakeBoard(false);
      }
    },
    [target, progress, remainingSlots, advanceRound, animate, scope],
  );

  if (playable.length === 0 || !word) {
    return (
      <p className="text-center text-lg text-slate-600">
        V této kategorii není vhodné slovo pro doplňování písmen.
      </p>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-lg font-semibold text-slate-700">
          {categoryLabel} · Doplň písmena · {correctTotal} správně
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
        ref={scope}
        className={`rounded-3xl border-4 p-6 text-center shadow-lg transition-colors ${
          flashOk
            ? "border-emerald-400 bg-emerald-50"
            : "border-teal-200 bg-white/95"
        } ${shakeBoard ? "ring-2 ring-rose-400" : ""}`}
      >
        <span className="text-8xl" role="img" aria-label={word.en}>
          {word.emoji}
        </span>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Slož anglické slovo (první část)
        </p>
        <div
          className="mt-4 flex min-h-[3rem] flex-wrap items-center justify-center gap-2 font-mono text-3xl font-bold tracking-widest text-slate-800"
          aria-live="polite"
        >
          {target.split("").map((ch, i) => (
            <span
              key={`${ch}-${i}`}
              className={`flex h-12 w-10 items-center justify-center rounded-lg border-2 ${
                i < progress
                  ? "border-emerald-400 bg-emerald-100 text-emerald-900"
                  : "border-slate-300 bg-slate-50 text-slate-400"
              }`}
            >
              {i < progress ? ch.toUpperCase() : "—"}
            </span>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <SpeechButton
            text={word.en}
            label={`Vyslovit ${word.en}`}
            className="h-12 w-12"
          />
        </div>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-2">
        {pool.map((letter, idx) => (
          <motion.button
            key={`${letter}-${idx}`}
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => onPickLetter(letter, idx)}
            aria-label={`Písmeno ${letter.toUpperCase()}`}
            className="flex h-14 min-w-[3rem] items-center justify-center rounded-2xl border-2 border-amber-300 bg-amber-100 text-2xl font-bold uppercase text-amber-950 shadow transition hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
          >
            {letter}
          </motion.button>
        ))}
      </div>

      <p className="text-center text-base text-slate-600" role="status">
        Skóre: <span className="font-bold text-teal-800">{correctTotal}</span>{" "}
        správných slov
      </p>
    </div>
  );
}
