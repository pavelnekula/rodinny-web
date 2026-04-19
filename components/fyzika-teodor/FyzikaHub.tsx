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

  const pillGhost =
    "app-btn-pill inline-flex items-center justify-center border border-app-border bg-app-card px-3 py-2 text-sm font-medium text-app-fg transition hover:border-app-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg";

  const pillAccent =
    "app-btn-pill app-btn-primary inline-flex items-center justify-center px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg";

  return (
    <div>
      <header className="mb-10 text-center sm:text-left">
        <p className="text-5xl" aria-hidden>
          ⚡
        </p>
        <h1 className="app-title-gradient mt-4 text-4xl font-bold tracking-[-0.05em] sm:text-5xl sm:tracking-[-0.07em]">
          Fyzika pro Teodora
        </h1>
        <p className="mt-3 text-lg text-app-muted">
          Prima osmiletého gymnázia — všechna témata, výklad, cvičení a hry
        </p>
        <div className="mx-auto mt-6 max-w-md sm:mx-0">
          <div className="mb-1 flex justify-between text-xs text-app-subtle">
            <span>Celkový postup (cvičení)</span>
            <span>{overall} %</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-app-card">
            <div
              className="h-full bg-app-accent transition-all duration-700"
              style={{ width: `${overall}%` }}
            />
          </div>
        </div>
      </header>

      <Link
        href="/fyzika-teodor/prevody"
        className="app-card app-card-interactive mb-8 flex flex-col gap-2 border-dashed border-app-border-hover p-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="text-xl font-bold text-app-fg">Převody jednotek</p>
          <p className="text-sm text-app-muted">
            Interaktivní převodník + drill · délka, hmotnost, objem, čas, rychlost,
            teplota
          </p>
        </div>
        <span className="font-medium text-app-accent">Otevřít →</span>
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
              className={`app-card app-card-interactive flex flex-col p-5 ${t.borderGlow}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-4xl" aria-hidden>
                  {t.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold text-app-fg">{t.title}</h2>
                  <p className="mt-1 text-sm text-app-muted">{t.shortDescription}</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-app-card">
                    <div
                      className="h-full bg-app-accent/90 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-app-subtle">
                    Cvičení: {done}/{total}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/fyzika-teodor/${t.slug}`} className={pillGhost}>
                  Výklad
                </Link>
                <Link
                  href={`/fyzika-teodor/${t.slug}/cviceni`}
                  className={pillAccent}
                >
                  Cvičení
                </Link>
                <Link
                  href={`/fyzika-teodor/${t.slug}/pexeso`}
                  className={pillGhost}
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
