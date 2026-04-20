"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Word, WordSetKey } from "../types";
import { shuffle } from "../utils/shuffle";
import { useGameSounds } from "../hooks/useGameSounds";
import { useGameHighScores } from "../hooks/useGameHighScores";

type FillLettersProps = {
  words: Word[];
  categoryLabel: string;
  wordSetKey: WordSetKey;
  onExit: () => void;
  onCorrectAnswer: (wordId: string) => void;
};

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

function puzzleKey(word: Word): string {
  const base = word.en.toLowerCase().replace(/[^a-z]/g, "");
  const last = word.id.split("-").pop() ?? "";
  if (/^(ty|vy|tu|vu)$/i.test(last)) {
    return (base + last.toLowerCase()).slice(0, 28);
  }
  return base.length > 0 ? base.slice(0, 28) : word.id.replace(/[^a-z]/g, "").slice(0, 16);
}

function buildMask(target: string): boolean[] {
  const n = target.length;
  if (n === 0) return [];
  const hideCount = Math.max(1, Math.min(n - 1, Math.ceil(n * 0.45)));
  const idx = shuffle([...Array(n).keys()]).slice(0, hideCount);
  const mask = Array(n).fill(false);
  for (const i of idx) mask[i] = true;
  return mask;
}

function isComplete(
  target: string,
  mask: boolean[],
  filled: string[],
): boolean {
  return target.split("").every((ch, i) => {
    if (!mask[i]) return true;
    return filled[i] === ch;
  });
}

type Phase = "play" | "done";

export function FillLetters({
  words,
  categoryLabel,
  wordSetKey,
  onExit,
  onCorrectAnswer,
}: FillLettersProps) {
  const { playCorrect, playWrong, playFanfare } = useGameSounds();
  const { getHighScore, saveIfBetter } = useGameHighScores();

  const playable = useMemo(
    () => words.filter((w) => puzzleKey(w).length > 0),
    [words],
  );

  const [order, setOrder] = useState<number[]>(() =>
    shuffle(playable.map((_, i) => i)),
  );
  const [roundIdx, setRoundIdx] = useState(0);
  const [mask, setMask] = useState<boolean[]>([]);
  const [filled, setFilled] = useState<string[]>([]);
  const [lives, setLives] = useState(3);
  const [hintsLeft, setHintsLeft] = useState(2);
  const [hintsUsedCount, setHintsUsedCount] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [phase, setPhase] = useState<Phase>("play");
  const [shake, setShake] = useState(false);
  const [flashOk, setFlashOk] = useState(false);
  const [keyboardUsed, setKeyboardUsed] = useState<Set<string>>(
    () => new Set(),
  );

  const word = playable[order[roundIdx] ?? 0];
  const target = word ? puzzleKey(word) : "";

  useEffect(() => {
    if (!word || !target) return;
    const m = buildMask(target);
    setMask(m);
    setFilled(
      target.split("").map((ch, i) => (m[i] ? "" : ch)),
    );
    setHintsUsedCount(0);
  }, [word?.id, target]);

  const nextHiddenIndex = useMemo(() => {
    if (!target) return -1;
    for (let i = 0; i < target.length; i++) {
      if (mask[i] && filled[i] === "") return i;
    }
    return -1;
  }, [target, mask, filled]);

  const advanceRound = useCallback(
    (pts: number, wid: string) => {
      setTotalScore((s) => s + pts);
      setFlashOk(true);
      window.setTimeout(() => setFlashOk(false), 400);
      onCorrectAnswer(wid);
      setRoundIdx((i) => {
        if (i + 1 >= order.length) {
          window.setTimeout(() => {
            setPhase("done");
            playFanfare();
          }, 400);
          return i;
        }
        return i + 1;
      });
    },
    [onCorrectAnswer, order.length, playFanfare],
  );

  const tryLetter = useCallback(
    (letter: string) => {
      if (!word || !target || phase !== "play") return;
      const low = letter.toLowerCase();
      if (!/^[a-z]$/.test(low)) return;
      const idx = nextHiddenIndex;
      if (idx < 0) return;

      setKeyboardUsed((prev) => new Set(prev).add(low));

      if (low === target[idx]) {
        playCorrect();
        setFilled((prev) => {
          const next = [...prev];
          next[idx] = low;
          if (isComplete(target, mask, next)) {
            let pts = 10;
            pts -= hintsUsedCount * 3;
            if (pts < 0) pts = 0;
            window.setTimeout(() => advanceRound(pts, word.id), 0);
          }
          return next;
        });
      } else {
        playWrong();
        setShake(true);
        window.setTimeout(() => setShake(false), 400);
        setLives((l) => {
          const nl = Math.max(0, l - 1);
          if (nl === 0) window.setTimeout(() => setPhase("done"), 500);
          return nl;
        });
      }
    },
    [
      word,
      target,
      mask,
      phase,
      nextHiddenIndex,
      playCorrect,
      playWrong,
      advanceRound,
      hintsUsedCount,
    ],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase !== "play") return;
      tryLetter(e.key);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tryLetter, phase]);

  const useHint = useCallback(() => {
    if (hintsLeft <= 0 || !target || !word || phase !== "play") return;
    const hiddenIdx = target
      .split("")
      .map((_, i) => (mask[i] && filled[i] === "" ? i : -1))
      .filter((i) => i >= 0);
    if (hiddenIdx.length === 0) return;
    const pick =
      hiddenIdx[Math.floor(Math.random() * hiddenIdx.length)]!;
    const ch = target[pick]!;
    const nextHintsUsed = hintsUsedCount + 1;
    setHintsLeft((h) => h - 1);
    setHintsUsedCount(nextHintsUsed);
    setKeyboardUsed((prev) => new Set(prev).add(ch));
    setFilled((prev) => {
      const next = [...prev];
      next[pick] = ch;
      if (isComplete(target, mask, next)) {
        let pts = 10;
        pts -= nextHintsUsed * 3;
        if (pts < 0) pts = 0;
        window.setTimeout(() => advanceRound(pts, word.id), 0);
      }
      return next;
    });
  }, [
    hintsLeft,
    target,
    mask,
    filled,
    phase,
    word,
    hintsUsedCount,
    advanceRound,
  ]);

  const savedDoneRef = useRef(false);
  const totalScoreRef = useRef(totalScore);
  totalScoreRef.current = totalScore;
  useEffect(() => {
    if (phase !== "done") {
      savedDoneRef.current = false;
      return;
    }
    if (savedDoneRef.current) return;
    savedDoneRef.current = true;
    const t = window.setTimeout(() => {
      saveIfBetter("fillLetters", wordSetKey, totalScoreRef.current);
    }, 50);
    return () => window.clearTimeout(t);
  }, [phase, saveIfBetter, wordSetKey]);

  const smiley = useMemo(() => {
    if (totalScore >= 50) return "🤩";
    if (totalScore >= 25) return "😄";
    return "😊";
  }, [totalScore]);

  const best = getHighScore("fillLetters", wordSetKey);

  if (playable.length === 0) {
    return (
      <p className="text-center text-lg text-app-muted">
        V této sadě není vhodné slovo pro doplňování písmen.
      </p>
    );
  }

  if (phase === "done") {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-4 py-8 text-center">
        <p className="text-4xl">{smiley}</p>
        <p className="text-2xl font-extrabold text-app-fg">
          Konec hry! Body: {totalScore}
        </p>
        <p className="text-app-muted">
          Životy: {"❤️".repeat(Math.max(0, lives))}
          {lives === 0 ? " (žádné)" : ""}
        </p>
        {best > 0 ? (
          <p className="text-teal-800">Rekord v této sadě: {best}</p>
        ) : null}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setOrder(shuffle(playable.map((_, i) => i)));
              setRoundIdx(0);
              setLives(3);
              setHintsLeft(2);
              setTotalScore(0);
              setPhase("play");
            }}
            className="rounded-2xl border-4 border-teal-400 bg-teal-200 px-8 py-3 text-xl font-bold text-teal-950"
          >
            Hrát znovu
          </button>
          <button
            type="button"
            onClick={onExit}
            className="rounded-2xl border-2 border-app-border bg-app-card px-8 py-3 text-xl font-bold text-app-muted"
          >
            Zpět
          </button>
        </div>
      </div>
    );
  }

  if (!word) return null;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-app-fg">
            {categoryLabel} · Doplň písmena
          </p>
          <p className="text-sm text-app-muted">
            Body: {totalScore} · Životy: {"❤️".repeat(lives)} · Nápovědy:{" "}
            {hintsLeft} 💡
          </p>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="rounded-xl border-2 border-app-border bg-app-card px-4 py-2 font-semibold text-app-muted"
        >
          ← Zpět
        </button>
      </div>

      <div className="rounded-2xl border-4 border-teal-200 bg-app-card p-4 shadow-lg">
        <p className="text-center text-lg font-bold text-app-fg">
          {word.cs}
        </p>
        <p className="mt-2 text-center text-base text-app-muted">
          {word.sentence}
        </p>
      </div>

      <div
        className={`rounded-3xl border-4 p-4 transition-colors ${
          flashOk ? "border-emerald-400 bg-emerald-50" : "border-app-border bg-app-card"
        } ${shake ? "ring-4 ring-rose-400" : ""}`}
      >
        <div
          className="flex min-h-[3.5rem] flex-wrap items-center justify-center gap-2 font-mono text-2xl font-bold sm:text-3xl"
          aria-live="polite"
        >
          {target.split("").map((ch, i) => (
            <span
              key={`${ch}-${i}`}
              className={`flex h-14 min-w-[2.5rem] items-center justify-center rounded-lg border-2 uppercase ${
                mask[i]
                  ? filled[i]
                    ? "border-emerald-500 bg-emerald-100 text-emerald-900"
                    : "border-dashed border-slate-400 bg-app-card text-app-muted"
                  : "border-app-border bg-app-card text-app-fg"
              }`}
            >
              {mask[i] ? (filled[i] ?? "") : ch}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={useHint}
          disabled={hintsLeft <= 0 || nextHiddenIndex < 0}
          className="rounded-xl border-2 border-amber-400 bg-amber-100 px-4 py-2 font-bold text-amber-950 disabled:opacity-40"
        >
          💡 Nápověda ({hintsLeft})
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {ALPHABET.map((letter) => {
          const used = keyboardUsed.has(letter);
          return (
            <button
              key={letter}
              type="button"
              onClick={() => tryLetter(letter)}
              disabled={lives <= 0}
              className={`flex h-12 min-w-[2.75rem] items-center justify-center rounded-xl border-2 text-xl font-bold uppercase shadow transition sm:h-14 sm:min-w-[3rem] sm:text-2xl ${
                used
                  ? "border-app-border bg-app-card text-app-muted"
                  : "border-amber-300 bg-amber-100 text-amber-950 hover:bg-amber-200"
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
