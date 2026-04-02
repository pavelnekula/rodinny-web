"use client";

import { useState } from "react";
import type { ExerciseStep } from "@/data/fyzika/types";

type StepSolutionProps = {
  steps: ExerciseStep[];
  visible: boolean;
};

export function StepSolution({ steps, visible }: StepSolutionProps) {
  const [open, setOpen] = useState(0);

  if (!visible) return null;

  return (
    <div className="mt-4 space-y-2 rounded-xl border border-slate-600/80 bg-slate-900/60 p-4">
      <p className="text-sm font-semibold text-emerald-400">Postup řešení</p>
      <ol className="list-decimal space-y-3 pl-5 text-sm text-slate-200">
        {steps.map((s, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => setOpen(i === open ? -1 : i)}
              className="text-left font-medium text-cyan-300 hover:underline"
            >
              {s.title}
            </button>
            {(open === i || steps.length <= 2) && (
              <p className="mt-1 font-light text-slate-300">{s.detail}</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
