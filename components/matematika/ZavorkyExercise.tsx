"use client";

import { useCallback, useState } from "react";
import {
  type BracketProblem,
  generateBracketProblems,
} from "@/lib/mathGenerators";
import { playFanfare } from "@/lib/mathSound";
import { setBestZavorkyIfBetter } from "@/lib/mathStorage";
import { MathNav } from "./MathNav";

export function ZavorkyExercise() {
  const [problems, setProblems] = useState<BracketProblem[]>(() =>
    generateBracketProblems(6),
  );
  const [inputs, setInputs] = useState<string[]>(() => Array(6).fill(""));
  const [checked, setChecked] = useState(false);
  const [mask, setMask] = useState<boolean[] | null>(null);

  const regen = useCallback(() => {
    setProblems(generateBracketProblems(6));
    setInputs(Array(6).fill(""));
    setChecked(false);
    setMask(null);
  }, []);

  const onCheck = useCallback(() => {
    const m = problems.map((p, i) => {
      const n = Number(String(inputs[i]).trim());
      return Number.isFinite(n) && n === p.answer;
    });
    setMask(m);
    setChecked(true);
    const score = m.filter(Boolean).length;
    setBestZavorkyIfBetter(score, 6);
    if (score === 6) playFanfare();
  }, [problems, inputs]);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <MathNav />
      <header className="mb-8">
        <h1 className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
          🧠 Závorky a pořadí počtů
        </h1>
        <p className="mt-2 text-app-muted">
          Šest příkladů — nejdřív závorka nebo násobení, pak zbytek.
        </p>
      </header>

      <ul className="space-y-4">
        {problems.map((p, i) => {
          const wrong = checked && mask && !mask[i];
          return (
            <li
              key={i}
              className={`rounded-2xl border-2 bg-app-card p-4 shadow-md ${
                checked && mask
                  ? mask[i]
                    ? "border-emerald-400"
                    : "border-rose-400"
                  : "border-orange-200"
              }`}
            >
              <div className="flex flex-wrap items-center gap-3 text-xl font-semibold text-app-fg sm:text-2xl">
                <span>{p.expression}</span>
                <span>=</span>
                <input
                  type="text"
                  inputMode="numeric"
                  aria-label={`Výsledek ${i + 1}`}
                  value={inputs[i]}
                  onChange={(e) => {
                    const next = [...inputs];
                    next[i] = e.target.value.replace(/\D/g, "");
                    setInputs(next);
                    setChecked(false);
                    setMask(null);
                  }}
                  className="w-24 rounded-xl border-2 border-orange-400 px-2 py-2 text-center text-2xl font-bold focus-visible:outline focus-visible:ring-2 focus-visible:ring-orange-400"
                />
                {checked && mask && mask[i] && (
                  <span className="animate-pulse text-2xl text-emerald-500">✓</span>
                )}
              </div>
              {wrong && (
                <p className="mt-3 text-sm font-medium text-rose-600">
                  Nezapomeň nejdřív spočítat závorku! 😊 Správně:{" "}
                  <strong>{p.answer}</strong>
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={onCheck}
          className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-[1.02] focus-visible:outline focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          Zkontrolovat
        </button>
        <button
          type="button"
          onClick={regen}
          className="rounded-2xl border-2 border-app-border bg-app-card px-6 py-3 font-semibold text-app-muted"
        >
          Nové příklady
        </button>
        {checked && mask && (
          <p className="text-lg font-bold text-app-fg">
            Skóre: {mask.filter(Boolean).length}/6
          </p>
        )}
      </div>
    </div>
  );
}
