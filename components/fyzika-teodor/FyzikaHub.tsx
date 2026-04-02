"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FYZIKA_TOPICS,
  getTopicContent,
} from "@/data/fyzika";
import {
  averageExerciseRatio,
  getTopicProgress,
} from "@/lib/fyzika/storage";

const SLUGS = FYZIKA_TOPICS.map((t) => t.slug);

function exerciseTotals(): Record<string, number> {
  const o: Record<string, number> = {};
  for (const s of SLUGS) {
    o[s] = getTopicContent(s)?.exercises.length ?? 0;
  }
  return o;
}

export function FyzikaHub() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const totals = useMemo(() => exerciseTotals(), []);
  const overall = mounted
    ? Math.round(averageExerciseRatio(SLUGS, totals) * 100)
    : 0;

  return (
    <div>
      <header className="mb-10 text-center sm:text-left">
        <p className="text-5xl" aria-hidden>
          ⚡
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Fyzika pro Teodora
        </h1>
        <p className="mt-3 text-lg text-slate-400">
          Prima osmiletého gymnázia — všechna témata, výklad, cvičení a hry
        </p>
        <div className="mx-auto mt-6 max-w-md sm:mx-0">
          <div className="mb-1 flex justify-between text-xs text-slate-500">
            <span>Celkový postup (cvičení)</span>
            <span>{overall} %</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 transition-all duration-700"
              style={{ width: `${overall}%` }}
            />
          </div>
        </div>
      </header>

      <Link
        href="/fyzika-teodor/prevody"
        className="mb-8 flex flex-col gap-2 rounded-2xl border-2 border-dashed border-cyan-500/50 bg-gradient-to-br from-cyan-950/50 to-slate-900 p-6 transition hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="text-xl font-bold text-cyan-300">Převody jednotek</p>
          <p className="text-sm text-slate-400">
            Interaktivní převodník + drill · délka, hmotnost, objem, čas, rychlost,
            teplota
          </p>
        </div>
        <span className="text-cyan-400">Otevřít →</span>
      </Link>

      <div className="grid gap-5 sm:grid-cols-2">
        {FYZIKA_TOPICS.map((t) => {
          const total = totals[t.slug] ?? 0;
          const { done } = mounted
            ? getTopicProgress(t.slug, total)
            : { done: 0 };
          const pct = total ? Math.round((done / total) * 100) : 0;
          return (
            <article
              key={t.slug}
              className={`flex flex-col rounded-2xl border border-slate-700/80 bg-slate-900/60 p-5 shadow-lg ${t.borderGlow}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-4xl" aria-hidden>
                  {t.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold text-white">{t.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">{t.shortDescription}</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-emerald-500/90 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Cvičení: {done}/{total}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/fyzika-teodor/${t.slug}`}
                  className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700"
                >
                  Výklad
                </Link>
                <Link
                  href={`/fyzika-teodor/${t.slug}/cviceni`}
                  className="rounded-lg bg-cyan-700/80 px-3 py-2 text-sm font-medium text-white hover:bg-cyan-600"
                >
                  Cvičení
                </Link>
                <Link
                  href={`/fyzika-teodor/${t.slug}/pexeso`}
                  className="rounded-lg border border-slate-600 px-3 py-2 text-sm font-medium text-slate-300 hover:border-cyan-500/50"
                >
                  Pexeso
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
