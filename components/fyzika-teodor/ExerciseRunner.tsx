"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ExerciseDef } from "@/data/fyzika/types";
import { answersMatch } from "@/lib/fyzika/normalizeAnswer";
import {
  loadAllProgress,
  saveTopicExerciseProgress,
} from "@/lib/fyzika/storage";
import { StepSolution } from "./StepSolution";
import { useFyzikaSounds } from "./useFyzikaSounds";

type ExerciseRunnerProps = {
  slug: string;
  exercises: ExerciseDef[];
  backHref: string;
};

export function ExerciseRunner({ slug, exercises, backHref }: ExerciseRunnerProps) {
  const { playCorrect, playWrong } = useFyzikaSounds();
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [feedback, setFeedback] = useState<"ok" | "bad" | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const ex = exercises[idx];

  useEffect(() => {
    const all = loadAllProgress();
    const ids = all[slug]?.exerciseIds ?? [];
    setCompletedIds(ids);
  }, [slug]);

  const progressDone = useMemo(() => {
    const set = new Set(completedIds);
    return exercises.filter((e) => set.has(e.id)).length;
  }, [completedIds, exercises]);

  const persistIds = useCallback(
    (ids: string[]) => {
      saveTopicExerciseProgress(slug, exercises.length, ids);
      setCompletedIds(ids);
    },
    [slug, exercises.length],
  );

  const submit = useCallback(() => {
    if (!ex) return;
    const ok = answersMatch(ex.expected, input);
    if (ok) {
      playCorrect();
      setFeedback("ok");
      let pts = 0;
      if (!hintUsed) {
        pts = attempts === 0 ? 3 : attempts === 1 ? 1 : 0;
      }
      setScore((s) => s + pts);
      const nextIds = completedIds.includes(ex.id)
        ? completedIds
        : [...completedIds, ex.id];
      persistIds(nextIds);
      window.setTimeout(() => {
        setFeedback(null);
        setInput("");
        setAttempts(0);
        setHintUsed(false);
        setShowHint(false);
        setShowSteps(false);
        setIdx((i) => (i + 1 >= exercises.length ? i : i + 1));
      }, 900);
    } else {
      playWrong();
      setFeedback("bad");
      setAttempts((a) => a + 1);
      window.setTimeout(() => setFeedback(null), 500);
    }
  }, [
    ex,
    input,
    playCorrect,
    playWrong,
    attempts,
    hintUsed,
    completedIds,
    persistIds,
    exercises.length,
  ]);

  if (!ex) {
    return (
      <p className="text-slate-400">Žádná cvičení v tomto celku.</p>
    );
  }

  const pct = Math.round((progressDone / exercises.length) * 100);

  return (
    <div className="space-y-6">
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-sm text-slate-400">
        Příklad {idx + 1} / {exercises.length} · Splněno celkem: {progressDone}{" "}
        · Body v session: {score}
      </p>

      <div
        className={`rounded-2xl border border-slate-600 bg-slate-900/70 p-6 transition ${feedback === "ok" ? "border-emerald-500/60 shadow-[0_0_20px_rgba(52,211,153,0.2)]" : ""} ${feedback === "bad" ? "animate-fyzika-shake border-rose-500/50" : ""}`}
      >
        <p className="text-lg text-slate-100">{ex.question}</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="ex-ans" className="sr-only">
              Odpověď
            </label>
            <input
              id="ex-ans"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className="w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              placeholder="Tvoje odpověď…"
            />
          </div>
          <button
            type="button"
            onClick={submit}
            className="rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:brightness-110"
          >
            Zkontrolovat
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setShowHint(true);
              setHintUsed(true);
            }}
            className="rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-200"
          >
            Nápověda
          </button>
          <button
            type="button"
            onClick={() => setShowSteps((s) => !s)}
            className="rounded-lg border border-slate-500 px-4 py-2 text-sm text-slate-300"
          >
            {showSteps ? "Skrýt postup" : "Ukázat postup"}
          </button>
        </div>

        {showHint ? (
          <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-100">
            💡 {ex.hint}
          </p>
        ) : null}

        <StepSolution steps={ex.steps} visible={showSteps} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={backHref}
          className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300"
        >
          ← Zpět na výklad
        </Link>
      </div>
    </div>
  );
}
