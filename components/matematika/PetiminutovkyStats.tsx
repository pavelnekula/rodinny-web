"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  EMPTY_PETIMINUTOVKA_GLOBAL_STATS,
  type PetiminutovkaGlobalStats,
  type PetiminutovkaRunLog,
  getPetiminutovkaGlobalStats,
  getPetiminutovkaRunsForChart,
} from "@/lib/mathStorage";
import { MathNav } from "./MathNav";

function typLabel(t: PetiminutovkaRunLog["typ"]): string {
  switch (t) {
    case "nasobilka":
      return "×";
    case "deleni":
      return ":";
    case "scitani_odcitani":
      return "±10";
    case "scitani_odcitani_do100":
      return "±100";
    case "chybejici_cislo":
      return "?č";
    case "all":
      return "Vše";
    default:
      return t;
  }
}

export function PetiminutovkyStats() {
  const [stats, setStats] = useState<PetiminutovkaGlobalStats>(
    EMPTY_PETIMINUTOVKA_GLOBAL_STATS,
  );
  const [runs, setRuns] = useState<PetiminutovkaRunLog[]>([]);

  useEffect(() => {
    setStats(getPetiminutovkaGlobalStats());
    setRuns(getPetiminutovkaRunsForChart(18));
  }, []);

  const recordDateStr =
    stats.recordDate != null
      ? new Date(stats.recordDate).toLocaleString("cs-CZ", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null;

  return (
    <div className="min-h-full bg-[#ffffff] text-[#1a1a1a]">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <MathNav />

        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            📊 Statistiky — tříminutovky
          </h1>
          <p className="mt-2 text-[#6b7280]">
            Přehled uložený v tomhle prohlížeči (LocalStorage).
          </p>
        </header>

        <section className="mb-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#e5e7eb] bg-[#fafafa] p-5 shadow-sm">
            <p className="text-sm font-medium text-[#6b7280]">
              Odehraných soutěží
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums">
              {stats.totalRuns}
            </p>
          </div>
          <div className="rounded-2xl border border-[#e5e7eb] bg-[#fafafa] p-5 shadow-sm">
            <p className="text-sm font-medium text-[#6b7280]">
              Příkladů celkem
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums">
              {stats.totalExamples}
            </p>
          </div>
          <div className="rounded-2xl border border-[#e5e7eb] bg-[#fafafa] p-5 shadow-sm">
            <p className="text-sm font-medium text-[#6b7280]">
              Průměrná úspěšnost
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-[#3b82f6]">
              {stats.totalRuns > 0 ? `${stats.avgAccuracyPct} %` : "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-[#e5e7eb] bg-[#fafafa] p-5 shadow-sm">
            <p className="text-sm font-medium text-[#6b7280]">
              Rekord (správně v jedné soutěži)
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-emerald-600">
              {stats.recordCorrect > 0 ? stats.recordCorrect : "—"}
            </p>
            {recordDateStr && (
              <p className="mt-2 text-sm text-[#6b7280]">{recordDateStr}</p>
            )}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">
            Graf posledních soutěží
          </h2>
          <p className="mb-4 text-sm text-[#6b7280]">
            Sloupce = úspěšnost v dané hře (výška), štítek = typ a datum.
          </p>
          {runs.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-[#e5e7eb] p-8 text-center text-[#6b7280]">
              Zatím žádné odehrané soutěže — zkus to na hlavní stránce
              tříminutovek.
            </p>
          ) : (
            <div
              className="flex h-48 items-end gap-1 overflow-x-auto rounded-2xl border border-[#e5e7eb] bg-[#fafafa] px-3 pb-2 pt-6"
              role="img"
              aria-label="Graf úspěšnosti posledních soutěží"
            >
              {[...runs].reverse().map((r, i) => {
                const tot = r.correct + r.wrong;
                const pct = tot > 0 ? (r.correct / tot) * 100 : 0;
                const h = Math.max(6, (pct / 100) * 160);
                return (
                  <div
                    key={`${r.date}-${i}`}
                    className="flex min-w-[28px] flex-1 flex-col items-center justify-end gap-1"
                    title={`${typLabel(r.typ)} · ${pct.toFixed(0)} %`}
                  >
                    <div
                      className="w-full min-w-[20px] max-w-[40px] rounded-t-md bg-[#3b82f6] transition-all"
                      style={{ height: `${h}px` }}
                    />
                    <span className="max-w-[48px] truncate text-center text-[10px] leading-tight text-[#6b7280]">
                      {typLabel(r.typ)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/matematika/petiminutovky"
            className="inline-flex rounded-2xl bg-[#3b82f6] px-6 py-3 font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2"
          >
            ← Zpět k tříminutovkám
          </Link>
          <Link
            href="/matematika"
            className="inline-flex rounded-2xl border border-[#e5e7eb] bg-[#ffffff] px-6 py-3 font-semibold text-[#1a1a1a] shadow-sm hover:bg-[#fafafa] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6]"
          >
            Matematika
          </Link>
        </div>
      </div>
    </div>
  );
}
