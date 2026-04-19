"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type BleskDifficulty,
  bleskExpectedAnswer,
  bleskDisplayLine,
  generateBleskProblem,
} from "@/lib/mathGenerators";
import { playCorrectTone, playWrongTone } from "@/lib/mathSound";
import {
  setBestBleskovkyIfBetter,
  starsFromBleskovky,
} from "@/lib/mathStorage";
import { MathNav } from "./MathNav";
import { StarRow } from "./StarRow";

const DURATION = 60;

export function BleskovkyGame() {
  const [difficulty, setDifficulty] = useState<BleskDifficulty | null>(null);
  const [phase, setPhase] = useState<"pick" | "play" | "done">("pick");
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [score, setScore] = useState(0);
  const [problem, setProblem] = useState(() => generateBleskProblem("easy"));
  const [input, setInput] = useState("");
  const [flash, setFlash] = useState<"ok" | "bad" | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scoreRef = useRef(0);
  scoreRef.current = score;

  const nextProblem = useCallback(() => {
    if (!difficulty) return;
    setProblem(generateBleskProblem(difficulty));
    setInput("");
  }, [difficulty]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (phase !== "play") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        const next = t - 1;
        if (next <= 0) {
          stopTimer();
          setBestBleskovkyIfBetter(scoreRef.current);
          setPhase("done");
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, stopTimer]);

  const start = (d: BleskDifficulty) => {
    setDifficulty(d);
    setPhase("play");
    setTimeLeft(DURATION);
    setScore(0);
    scoreRef.current = 0;
    setProblem(generateBleskProblem(d));
    setInput("");
  };

  const submit = useCallback(() => {
    if (phase !== "play") return;
    const n = Number(input.trim());
    if (!Number.isFinite(n)) return;
    const ok = n === bleskExpectedAnswer(problem);
    if (ok) {
      setFlash("ok");
      playCorrectTone();
      setScore((s) => s + 1);
      setTimeout(() => {
        setFlash(null);
        nextProblem();
      }, 220);
    } else {
      setFlash("bad");
      playWrongTone();
      setTimeout(() => {
        setFlash(null);
        nextProblem();
      }, 400);
    }
  }, [phase, input, problem, nextProblem]);

  const stars = starsFromBleskovky(score);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <MathNav />
      <header className="mb-8 text-center">
        <h1 className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
          ⚡ Bleskové příklady
        </h1>
        <p className="mt-2 text-app-muted">
          Máš minutu — odpovídej co nejrychleji správně.
        </p>
      </header>

      {phase === "pick" && (
        <div className="space-y-4">
          <p className="text-center font-medium text-app-muted">
            Vyber obtížnost:
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => start("easy")}
              className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 px-4 py-6 text-left shadow-md transition hover:scale-[1.02]"
            >
              <span className="text-2xl">🟢</span>
              <span className="mt-2 block font-bold text-emerald-900">Lehká</span>
              <span className="text-sm text-emerald-800">
                Jednociferná čísla, + a −
              </span>
            </button>
            <button
              type="button"
              onClick={() => start("medium")}
              className="rounded-2xl border-2 border-amber-300 bg-amber-50 px-4 py-6 text-left shadow-md transition hover:scale-[1.02]"
            >
              <span className="text-2xl">🟡</span>
              <span className="mt-2 block font-bold text-amber-900">Střední</span>
              <span className="text-sm text-amber-900">
                Dvojciferná, + − ×
              </span>
            </button>
            <button
              type="button"
              onClick={() => start("hard")}
              className="rounded-2xl border-2 border-rose-300 bg-rose-50 px-4 py-6 text-left shadow-md transition hover:scale-[1.02] sm:col-span-1"
            >
              <span className="text-2xl">🔴</span>
              <span className="mt-2 block font-bold text-rose-900">Těžká</span>
              <span className="text-sm text-rose-900">
                Závorky, dvojciferná, všechno
              </span>
            </button>
          </div>
        </div>
      )}

      {phase === "play" && (
        <div
          className={`rounded-3xl border-2 border-violet-200 bg-app-card p-6 shadow-xl transition ${
            flash === "bad" ? "animate-pulse bg-rose-50 ring-2 ring-rose-300" : ""
          } ${flash === "ok" ? "ring-2 ring-emerald-300" : ""}`}
        >
          <div className="mb-6 flex items-center justify-between text-lg font-bold">
            <span className="tabular-nums text-violet-700">⏱ {timeLeft} s</span>
            <span className="text-app-muted">Body: {score}</span>
          </div>
          <p className="mb-6 text-center text-2xl font-bold text-app-fg sm:text-3xl">
            {bleskDisplayLine(problem)}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <input
              type="text"
              inputMode="numeric"
              autoFocus
              aria-label="Odpověď"
              value={input}
              onChange={(e) => setInput(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              className="mx-auto w-full max-w-xs rounded-2xl border-2 border-violet-400 px-4 py-3 text-center text-3xl font-bold focus-visible:outline focus-visible:ring-2 focus-visible:ring-violet-400"
            />
            <button
              type="button"
              onClick={submit}
              className="rounded-2xl bg-violet-600 px-8 py-3 font-bold text-white shadow-md hover:bg-violet-700"
            >
              Ověřit
            </button>
          </div>
        </div>
      )}

      {phase === "done" && (
        <div className="rounded-3xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50 p-8 text-center shadow-lg">
          <p className="text-xl font-bold text-app-fg">
            Čas je pryč! Výsledek:{" "}
            <strong className="text-violet-700">{score}</strong> příkladů za{" "}
            {DURATION} sekund
          </p>
          <div className="mt-4 flex justify-center">
            <StarRow count={stars} />
          </div>
          <p className="mt-2 text-sm text-app-muted">
            Nejlepší výsledek se ukládá do prohlížeče.
          </p>
          <button
            type="button"
            onClick={() => {
              setPhase("pick");
              setDifficulty(null);
            }}
            className="mt-6 rounded-2xl bg-violet-600 px-8 py-3 font-bold text-white"
          >
            Hrát znovu
          </button>
        </div>
      )}
    </div>
  );
}
