"use client";

import { useCallback, useEffect, useState } from "react";
import { generateWrittenProblems, type WrittenProblem } from "@/lib/mathGenerators";
import { playFanfare } from "@/lib/mathSound";
import { setBestPisemneIfBetter } from "@/lib/mathStorage";
import { MathNav } from "./MathNav";

export function PisemneExercise() {
  const [problems, setProblems] = useState<WrittenProblem[]>(() =>
    generateWrittenProblems(4),
  );
  const [resultIn, setResultIn] = useState<string[]>(() => Array(4).fill(""));
  const [checkIn, setCheckIn] = useState<string[]>(() => Array(4).fill(""));
  const [checked, setChecked] = useState(false);
  const [okRes, setOkRes] = useState<boolean[] | null>(null);
  const [okCh, setOkCh] = useState<boolean[] | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const regen = useCallback(() => {
    setProblems(generateWrittenProblems(4));
    setResultIn(Array(4).fill(""));
    setCheckIn(Array(4).fill(""));
    setChecked(false);
    setOkRes(null);
    setOkCh(null);
    setShowConfetti(false);
  }, []);

  useEffect(() => {
    if (!showConfetti) return;
    const t = window.setTimeout(() => setShowConfetti(false), 3200);
    return () => window.clearTimeout(t);
  }, [showConfetti]);

  const onCheck = useCallback(() => {
    const resOk = problems.map((p, i) => {
      const n = Number(String(resultIn[i]).trim());
      return Number.isFinite(n) && n === p.result;
    });
    const chOk = problems.map((p, i) => {
      const n = Number(String(checkIn[i]).trim());
      return Number.isFinite(n) && n === p.minuend;
    });
    setOkRes(resOk);
    setOkCh(chOk);
    setChecked(true);
    const fullRows = problems.reduce(
      (acc, _, i) => acc + (resOk[i] && chOk[i] ? 1 : 0),
      0,
    );
    setBestPisemneIfBetter(fullRows, 4);
    if (resOk.every(Boolean) && chOk.every(Boolean)) {
      setShowConfetti(true);
      playFanfare();
    }
  }, [problems, resultIn, checkIn]);

  return (
    <div className="relative mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      {showConfetti && <ConfettiBurst />}
      <MathNav />
      <header className="mb-8">
        <h1 className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
          📐 Písemné odčítání se zkouškou
        </h1>
        <p className="mt-2 text-slate-600">
          Spočítej výsledek pod čárou. Zkouška: k výsledku přičti spodní číslo —
          musí to vyjít jako horní číslo.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {problems.map((p, i) => (
          <div
            key={i}
            className="rounded-3xl border-2 border-emerald-200 bg-white/95 p-5 shadow-lg"
          >
            <div className="font-mono text-2xl leading-relaxed text-slate-800">
              <div className="text-right tabular-nums">{String(p.minuend).padStart(4, " ")}</div>
              <div className="text-right tabular-nums">
                − {String(p.subtrahend).padStart(2, " ")}
              </div>
              <div className="border-t-2 border-slate-400 pt-1 text-right">────</div>
              <div className="mt-3 flex items-center justify-end gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  aria-label={`Výsledek příklad ${i + 1}`}
                  value={resultIn[i]}
                  onChange={(e) => {
                    const next = [...resultIn];
                    next[i] = e.target.value.replace(/[^\d-]/g, "");
                    setResultIn(next);
                  }}
                  className={`w-24 rounded-xl border-2 px-2 py-1 text-right text-2xl font-bold tabular-nums focus-visible:outline focus-visible:ring-2 ${
                    checked && okRes
                      ? okRes[i]
                        ? "border-emerald-500 ring-emerald-200"
                        : "border-rose-500 ring-rose-100"
                      : "border-sky-400"
                  }`}
                />
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600">
              Zkouška (výsledek + menšitel = ?)
            </p>
            <input
              type="text"
              inputMode="numeric"
              aria-label={`Zkouška příklad ${i + 1}`}
              value={checkIn[i]}
              onChange={(e) => {
                const next = [...checkIn];
                next[i] = e.target.value.replace(/[^\d-]/g, "");
                setCheckIn(next);
              }}
              className={`mt-1 w-full max-w-[12rem] rounded-xl border-2 px-3 py-2 text-xl font-semibold tabular-nums focus-visible:outline focus-visible:ring-2 ${
                checked && okCh
                  ? okCh[i]
                    ? "border-emerald-500 ring-emerald-200"
                    : "border-rose-500 ring-rose-100"
                  : "border-violet-300"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={onCheck}
          className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-[1.02] focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          Zkontrolovat
        </button>
        <button
          type="button"
          onClick={regen}
          className="rounded-2xl border-2 border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700"
        >
          Nové příklady
        </button>
      </div>
    </div>
  );
}

function ConfettiBurst() {
  const pieces = "🎉✨🌟💚📐⭐🎊".split("");
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 flex flex-wrap items-start justify-center gap-2 overflow-hidden p-8"
      aria-hidden
    >
      {Array.from({ length: 24 }, (_, i) => (
        <span
          key={i}
          className="animate-bounce text-3xl"
          style={{
            animationDelay: `${(i % 8) * 0.1}s`,
            transform: `translate(${((i * 17) % 200) - 100}px, ${i * 3}px)`,
          }}
        >
          {pieces[i % pieces.length]}
        </span>
      ))}
    </div>
  );
}
