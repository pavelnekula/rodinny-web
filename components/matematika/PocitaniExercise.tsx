"use client";

import { useCallback, useMemo, useState } from "react";
import {
  type FillProblem,
  fillProblemLabel,
  generateFillProblems,
} from "@/lib/mathGenerators";
import { playCorrectTone, playFanfare } from "@/lib/mathSound";
import { setBestPocitaniIfBetter } from "@/lib/mathStorage";
import { MathNav } from "./MathNav";

function parseAns(s: string): number | null {
  const t = s.trim();
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? Math.round(n) : null;
}

export function PocitaniExercise() {
  const [problems, setProblems] = useState<FillProblem[]>(() =>
    generateFillProblems(8),
  );
  const [inputs, setInputs] = useState<string[]>(() => Array(8).fill(""));
  const [checked, setChecked] = useState<boolean | null>(null);
  const [correctMask, setCorrectMask] = useState<boolean[] | null>(null);

  const regen = useCallback(() => {
    setProblems(generateFillProblems(8));
    setInputs(Array(8).fill(""));
    setChecked(null);
    setCorrectMask(null);
  }, []);

  const onCheck = useCallback(() => {
    const mask = problems.map((p, i) => parseAns(inputs[i] ?? "") === p.answer);
    setChecked(true);
    setCorrectMask(mask);
    const score = mask.filter(Boolean).length;
    if (score === 8) {
      playFanfare();
    } else {
      const anyWrong = mask.some((x) => !x);
      if (!anyWrong) playCorrectTone();
    }
    setBestPocitaniIfBetter(score, 8);
  }, [problems, inputs]);

  const score = useMemo(() => {
    if (!correctMask) return null;
    return correctMask.filter(Boolean).length;
  }, [correctMask]);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <MathNav />
      <header className="mb-8">
        <h1 className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
          ✏️ Doplň číslo
        </h1>
        <p className="mt-2 text-app-muted">
          Osm příkladů — doplníš chybějící číslo. Rozsah 1–99, výsledek také nejvýš
          99.
        </p>
      </header>

      <ul className="space-y-4">
        {problems.map((p, i) => (
          <li
            key={i}
            className={`rounded-2xl border-2 bg-app-card p-4 shadow-md transition ${
              checked && correctMask
                ? correctMask[i]
                  ? "border-emerald-400 ring-2 ring-emerald-200"
                  : "border-rose-400 ring-2 ring-rose-100"
                : "border-sky-200"
            }`}
          >
            <FillRow
              p={p}
              value={inputs[i] ?? ""}
              onChange={(v) => {
                const next = [...inputs];
                next[i] = v;
                setInputs(next);
                setChecked(null);
                setCorrectMask(null);
              }}
              showResult={Boolean(
                checked === true && correctMask && !correctMask[i],
              )}
            />
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onCheck}
          className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl focus-visible:outline focus-visible:ring-2 focus-visible:ring-app-accent"
        >
          Zkontrolovat
        </button>
        <button
          type="button"
          onClick={regen}
          className="rounded-2xl border-2 border-app-border bg-app-card px-6 py-3 font-semibold text-app-muted shadow-sm transition hover:bg-app-card"
        >
          Nové příklady
        </button>
        {score !== null && (
          <p
            className={`text-lg font-bold ${
              score === 8 ? "animate-bounce text-emerald-600" : "text-app-muted"
            }`}
          >
            Skóre: {score}/8
            {score === 8 && <span className="ml-2">✓</span>}
          </p>
        )}
      </div>
    </div>
  );
}

function FillRow({
  p,
  value,
  onChange,
  showResult,
}: {
  p: FillProblem;
  value: string;
  onChange: (v: string) => void;
  showResult: boolean;
}) {
  const L = fillProblemLabel(p);
  const input = (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      aria-label="Odpověď"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
      className="w-20 rounded-xl border-2 border-sky-400 bg-app-card px-2 py-2 text-center text-2xl font-bold text-app-fg shadow-inner focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-400"
    />
  );

  if (p.kind === "result") {
    return (
      <div className="flex flex-wrap items-center gap-2 text-2xl font-semibold text-app-fg">
        <span>{L.left}</span>
        <span>{L.op}</span>
        <span>{L.mid}</span>
        <span>=</span>
        {input}
        {showResult && (
          <span className="text-base font-medium text-rose-600">
            (správně: {p.answer})
          </span>
        )}
      </div>
    );
  }
  if (p.kind === "first") {
    return (
      <div className="flex flex-wrap items-center gap-2 text-2xl font-semibold text-app-fg">
        {input}
        <span>{L.op}</span>
        <span>{L.mid}</span>
        <span>=</span>
        <span>{L.eq}</span>
        {showResult && (
          <span className="text-base font-medium text-rose-600">
            (správně: {p.answer})
          </span>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-2 text-2xl font-semibold text-app-fg">
      <span>{L.left}</span>
      <span>{L.op}</span>
      {input}
      <span>=</span>
      <span>{L.eq}</span>
      {showResult && (
        <span className="text-base font-medium text-rose-600">
          (správně: {p.answer})
        </span>
      )}
    </div>
  );
}
