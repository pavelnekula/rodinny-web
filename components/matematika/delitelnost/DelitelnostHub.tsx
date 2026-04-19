"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { KAPITOLY, type Kapitola } from "@/data/delitelnost";
import { nactiProgress, pomerUspechu } from "@/lib/delitelnostProgress";
import { MathNav } from "@/components/matematika/MathNav";

function stavKarty(pct: number | null): "none" | "progress" | "done" {
  if (pct == null) return "none";
  if (pct >= 80) return "done";
  return "progress";
}

export function DelitelnostHub() {
  const [pctMap, setPctMap] = useState<Record<string, number | null>>({});

  useEffect(() => {
    const m: Record<string, number | null> = {};
    for (const k of KAPITOLY) {
      m[k.id] = pomerUspechu(nactiProgress(k.id));
    }
    setPctMap(m);
  }, []);

  return (
    <div className="mx-auto w-full max-w-5xl py-4 sm:py-6">
      <MathNav />

      <Link
        href="/matematika"
        className="mb-6 inline-flex text-sm font-medium text-indigo-400 underline-offset-4 transition hover:text-indigo-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
      >
        ← Zpět na matematiku
      </Link>

      <header className="mb-10 text-center sm:text-left">
        <h1 className="app-title-gradient text-3xl font-bold tracking-[-0.04em] sm:text-4xl md:text-5xl">
          Dělitelnost 🔢
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-app-muted">
          Procvičuj krok za krokem – od násobků až po olympijské úlohy. V každé
          kapitole 10 příkladů, obtížnost si vybereš sám.
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {KAPITOLY.map((k) => (
          <KapitolaKarta key={k.id} k={k} pct={pctMap[k.id] ?? null} />
        ))}
      </ul>
    </div>
  );
}

function KapitolaKarta({
  k,
  pct,
}: {
  k: Kapitola;
  pct: number | null;
}) {
  const st = stavKarty(pct);
  const borderClass =
    st === "none"
      ? "border-app-border"
      : st === "done"
        ? "border-emerald-500/60 ring-1 ring-emerald-500/40"
        : "border-indigo-500/50 ring-1 ring-indigo-500/35";

  return (
    <li
      className={`app-card flex flex-col p-5 transition ${borderClass} app-card-interactive`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl" aria-hidden>
          {k.ikona}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-app-subtle">
            Kapitola {k.cislo}
          </p>
          <h2 className="text-lg font-bold text-app-fg">{k.nazev}</h2>
          <p className="mt-1 text-sm leading-relaxed text-app-muted">
            {k.popis}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-app-muted">
          <span>Poslední série</span>
          <span>
            {pct == null
              ? "—"
              : `${Math.round(pct)} % správně`}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-app-card">
          <div
            className={`h-full rounded-full transition-all ${
              st === "done"
                ? "bg-emerald-500"
                : st === "progress"
                  ? "bg-indigo-500"
                  : "bg-app-border"
            }`}
            style={{ width: `${pct == null ? 0 : Math.min(100, pct)}%` }}
          />
        </div>
      </div>

      <Link
        href={`/matematika/delitelnost/${k.id}`}
        className="app-btn-pill mt-5 inline-flex w-full items-center justify-center border border-indigo-500/40 bg-indigo-950/40 py-2.5 text-sm font-semibold text-indigo-200 transition hover:border-indigo-400 hover:bg-indigo-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
      >
        Procvičovat
      </Link>
    </li>
  );
}
