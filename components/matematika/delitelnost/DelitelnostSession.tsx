"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { KapitolaId } from "@/data/delitelnost";
import { getKapitola, type Obtiznost, type Priklad } from "@/data/delitelnost";
import { vygenerujPriklad } from "@/lib/delitelnostGenerators";
import { porovnejOdpoved } from "@/lib/delitelnostPorovnani";
import { ulozProgress } from "@/lib/delitelnostProgress";
import {
  zvukChybne,
  zvukDokonceni,
  zvukSpravne,
} from "@/lib/delitelnostZvuky";
import { MathNav } from "@/components/matematika/MathNav";

type Faze = "obtiznost" | "priklad" | "feedback" | "souhrn";

type VysledekRadku = {
  priklad: Priklad;
  uzivatel: string;
  ok: boolean;
};

const SESSION_LEN = 10;

function vygenerujSadou(id: KapitolaId, o: Obtiznost, n: number): Priklad[] {
  const out: Priklad[] = [];
  for (let i = 0; i < n; i++) {
    out.push(vygenerujPriklad(id, o));
  }
  return out;
}

export function DelitelnostSession({ kapitolaId }: { kapitolaId: KapitolaId }) {
  const meta = getKapitola(kapitolaId);
  const [obtiznost, setObtiznost] = useState<Obtiznost | null>(null);
  const [faze, setFaze] = useState<Faze>("obtiznost");
  const [rada, setRada] = useState<Priklad[]>([]);
  const [index, setIndex] = useState(0);
  const [vstup, setVstup] = useState("");
  const [posledniOk, setPosledniOk] = useState<boolean | null>(null);
  const [vysledky, setVysledky] = useState<VysledekRadku[]>([]);
  const [flash, setFlash] = useState<"ok" | "bad" | null>(null);
  const [shake, setShake] = useState(false);
  const [confetti, setConfetti] = useState(false);
  /** Vybrané hodnoty u typu `multi-vyber` (např. dělitelé). */
  const [vybraneMoznosti, setVybraneMoznosti] = useState<string[]>([]);

  const aktualni = rada[index] ?? null;

  useEffect(() => {
    setVybraneMoznosti([]);
  }, [index, aktualni?.zadani]);

  const spustSadou = useCallback(
    (seznam: Priklad[]) => {
      setRada(seznam);
      setIndex(0);
      setVstup("");
      setVybraneMoznosti([]);
      setVysledky([]);
      setPosledniOk(null);
      setFaze("priklad");
      setFlash(null);
    },
    [],
  );

  const zacni = useCallback(
    (o: Obtiznost) => {
      setObtiznost(o);
      spustSadou(vygenerujSadou(kapitolaId, o, SESSION_LEN));
    },
    [kapitolaId, spustSadou],
  );

  const toggleMoznost = useCallback((moznost: string) => {
    setVybraneMoznosti((prev) =>
      prev.includes(moznost)
        ? prev.filter((x) => x !== moznost)
        : [...prev, moznost],
    );
  }, []);

  const zkontroluj = useCallback(() => {
    if (!aktualni || faze !== "priklad" || obtiznost == null) return;
    const userStr =
      aktualni.typ === "multi-vyber"
        ? [...vybraneMoznosti]
            .sort((a, b) => Number(a) - Number(b))
            .join(", ")
        : vstup;
    const ok = porovnejOdpoved(userStr, aktualni.odpoved, aktualni.typ);
    setPosledniOk(ok);
    setVysledky((r) => [...r, { priklad: aktualni, uzivatel: userStr, ok }]);
    setFaze("feedback");
    if (ok) {
      zvukSpravne();
      setFlash("ok");
    } else {
      zvukChybne();
      setFlash("bad");
      setShake(true);
      window.setTimeout(() => setShake(false), 450);
    }
    window.setTimeout(() => setFlash(null), 500);
  }, [aktualni, faze, obtiznost, vstup, vybraneMoznosti]);

  const dalsi = useCallback(() => {
    if (index + 1 >= rada.length) {
      setVysledky((results) => {
        const spr = results.filter((x) => x.ok).length;
        const celk = results.length;
        ulozProgress(kapitolaId, spr, celk);
        return results;
      });
      setFaze("souhrn");
      zvukDokonceni();
      setConfetti(true);
      window.setTimeout(() => setConfetti(false), 3200);
      return;
    }
    setIndex((i) => i + 1);
    setVstup("");
    setVybraneMoznosti([]);
    setPosledniOk(null);
    setFaze("priklad");
  }, [index, kapitolaId, rada.length]);

  const zopakovatChyby = useCallback(() => {
    if (!obtiznost) return;
    const spatne = vysledky.filter((x) => !x.ok).map((x) => x.priklad);
    if (spatne.length === 0) return;
    const doplnit = SESSION_LEN - spatne.length;
    const dalsi =
      doplnit > 0
        ? [...spatne, ...vygenerujSadou(kapitolaId, obtiznost, doplnit)]
        : spatne.slice(0, SESSION_LEN);
    spustSadou(dalsi);
  }, [kapitolaId, obtiznost, spustSadou, vysledky]);

  const novaSada = useCallback(() => {
    if (!obtiznost) return;
    zacni(obtiznost);
  }, [obtiznost, zacni]);

  if (!meta) return null;

  const spravnePocet = vysledky.filter((x) => x.ok).length;

  return (
    <div className="mx-auto w-full max-w-2xl py-4 sm:py-6">
      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes delitelnost-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}`,
        }}
      />

      <MathNav />

      <Link
        href="/matematika/delitelnost"
        className="mb-6 inline-flex text-sm font-medium text-indigo-400 underline-offset-4 hover:text-indigo-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        ← Zpět na kapitoly
      </Link>

      <header className="mb-8 flex flex-wrap items-center gap-3">
        <span className="text-4xl" aria-hidden>
          {meta.ikona}
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-app-subtle">
            Kapitola {meta.cislo}
          </p>
          <h1 className="text-2xl font-bold text-app-fg sm:text-3xl">
            {meta.nazev}
          </h1>
        </div>
      </header>

      <section className="mb-8">
        <p className="mb-3 text-sm font-medium text-app-muted">Obtížnost</p>
        <div className="flex flex-wrap gap-3">
          {(
            [
              ["lehka", "Lehká", "🌱", "border-emerald-500/50 bg-emerald-950/30 text-emerald-200"],
              ["stredni", "Střední", "🔥", "border-amber-500/50 bg-amber-950/30 text-amber-100"],
              ["tezka", "Těžká", "💪", "border-rose-500/50 bg-rose-950/30 text-rose-100"],
            ] as const
          ).map(([id, lab, em, cls]) => (
            <button
              key={id}
              type="button"
              disabled={faze === "priklad" || faze === "feedback"}
              onClick={() => zacni(id)}
              className={`app-btn-pill flex-1 min-w-[7rem] border px-4 py-3 text-sm font-semibold transition disabled:opacity-40 ${cls} ${
                obtiznost === id ? "ring-2 ring-indigo-400" : ""
              }`}
            >
              {lab} {em}
            </button>
          ))}
        </div>
      </section>

      {obtiznost && faze !== "obtiznost" && faze !== "souhrn" && (
        <p className="mb-2 text-center text-sm text-app-muted">
          Příklad {Math.min(index + 1, SESSION_LEN)} / {rada.length || SESSION_LEN}
        </p>
      )}
      {obtiznost && faze !== "obtiznost" && faze !== "souhrn" && (
        <div className="mb-6 h-2 overflow-hidden rounded-full bg-app-card">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all"
            style={{
              width: `${rada.length ? (vysledky.length / rada.length) * 100 : 0}%`,
            }}
          />
        </div>
      )}

      {faze === "obtiznost" && (
        <p className="rounded-xl border border-app-border bg-app-card p-4 text-center text-app-muted">
          Vyber obtížnost — spustí se série {SESSION_LEN} příkladů.
        </p>
      )}

      {aktualni && faze !== "souhrn" && (
        <div
          className={`app-card relative overflow-hidden p-6 sm:p-8 ${
            flash === "ok"
              ? "ring-2 ring-emerald-500"
              : flash === "bad"
                ? "ring-2 ring-rose-500"
                : ""
          } ${shake ? "animate-[delitelnost-shake_0.45s_ease-in-out]" : ""}`}
        >
          <p className="text-center text-xl font-semibold leading-snug text-app-fg sm:text-2xl">
            {aktualni.zadani}
          </p>
          {aktualni.hint && (
            <p className="mt-3 text-center text-sm text-app-muted">{aktualni.hint}</p>
          )}

          {faze === "priklad" && (
            <div className="mt-8 space-y-4">
              {aktualni.typ === "multi-vyber" &&
                aktualni.moznosti &&
                aktualni.moznosti.length > 0 && (
                  <div
                    className="flex flex-wrap justify-center gap-3"
                    role="group"
                    aria-label="Výběr dělitelů"
                  >
                    {aktualni.moznosti.map((moznost) => {
                      const sel = vybraneMoznosti.includes(moznost);
                      return (
                        <button
                          key={moznost}
                          type="button"
                          onClick={() => toggleMoznost(moznost)}
                          className={`min-w-[3.5rem] rounded-xl border-2 px-5 py-3 text-lg font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                            sel
                              ? "border-indigo-500 bg-indigo-600 text-white"
                              : "border-app-border bg-app-card text-app-fg hover:border-indigo-400"
                          }`}
                          aria-pressed={sel}
                        >
                          {moznost}
                        </button>
                      );
                    })}
                  </div>
                )}
              {aktualni.typ === "ano-ne" && (
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setVstup("Ano");
                    }}
                    className="app-btn-pill min-w-[120px] border border-emerald-500/50 bg-emerald-900/40 py-4 text-lg font-bold text-emerald-100 hover:bg-emerald-800/50"
                  >
                    ANO
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVstup("Ne");
                    }}
                    className="app-btn-pill min-w-[120px] border border-rose-500/50 bg-rose-900/40 py-4 text-lg font-bold text-rose-100 hover:bg-rose-800/50"
                  >
                    NE
                  </button>
                </div>
              )}
              {(aktualni.typ === "vypocet" || aktualni.typ === "doplneni") && (
                <input
                  type="text"
                  inputMode={aktualni.typ === "vypocet" ? "numeric" : "text"}
                  value={vstup}
                  onChange={(e) => setVstup(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") zkontroluj();
                  }}
                  className="app-field w-full px-4 py-3 text-center text-lg focus-visible:outline-none"
                  placeholder={
                    aktualni.typ === "vypocet"
                      ? "Číslo…"
                      : "Odpověď (čárky mezi čísly)…"
                  }
                  aria-label="Odpověď"
                />
              )}
              <button
                type="button"
                onClick={zkontroluj}
                disabled={
                  faze !== "priklad" ||
                  (aktualni.typ === "ano-ne" && vstup.trim() === "") ||
                  ((aktualni.typ === "vypocet" || aktualni.typ === "doplneni") &&
                    vstup.trim() === "")
                }
                className="app-btn-pill app-btn-primary mx-auto flex w-full max-w-xs justify-center py-3 disabled:opacity-40"
              >
                Zkontrolovat odpověď
              </button>
            </div>
          )}

          {faze === "feedback" && posledniOk != null && (
            <div className="mt-8 space-y-4 text-center">
              <p
                className={`text-xl font-bold ${posledniOk ? "text-emerald-400" : "text-rose-400"}`}
              >
                {posledniOk ? "✅ Správně!" : "❌ Špatně…"}
              </p>
              <p className="text-left text-sm leading-relaxed text-app-muted">
                {aktualni.vysvetleni}
              </p>
              <button
                type="button"
                onClick={dalsi}
                className="app-btn-pill border border-indigo-500/40 bg-indigo-950/50 px-6 py-3 font-semibold text-indigo-100 hover:border-indigo-400"
              >
                Další příklad
              </button>
            </div>
          )}
        </div>
      )}

      {faze === "souhrn" && (
        <div className="app-card space-y-6 p-6">
          <h2 className="text-center text-xl font-bold text-app-fg">
            Hotovo — série dokončena
          </h2>
          <p className="text-center text-lg text-app-muted">
            Správně:{" "}
            <strong className="text-app-fg">
              {spravnePocet} / {vysledky.length}
            </strong>
          </p>
          <div className="max-h-64 overflow-auto rounded-lg border border-app-border">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-app-bg text-app-subtle">
                <tr>
                  <th className="px-3 py-2">Příklad</th>
                  <th className="px-3 py-2">Ty</th>
                  <th className="px-3 py-2">Stav</th>
                </tr>
              </thead>
              <tbody>
                {vysledky.map((r, i) => (
                  <tr key={i} className="border-t border-app-divider">
                    <td className="px-3 py-2 text-app-muted">{r.priklad.zadani}</td>
                    <td className="px-3 py-2 font-mono text-xs text-app-fg">
                      {r.uzivatel || "—"}
                    </td>
                    <td className="px-3 py-2">
                      {r.ok ? (
                        <span className="text-emerald-400">✓</span>
                      ) : (
                        <span className="text-rose-400">✗</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={zopakovatChyby}
              disabled={!vysledky.some((x) => !x.ok)}
              className="app-btn-pill flex-1 border border-app-border bg-app-card py-3 font-medium text-app-fg disabled:opacity-40"
            >
              Zopakovat chyby
            </button>
            <button
              type="button"
              onClick={novaSada}
              className="app-btn-pill flex-1 border border-indigo-500/40 bg-indigo-950/40 py-3 font-medium text-indigo-100"
            >
              Nová sada
            </button>
            <Link
              href="/matematika/delitelnost"
              className="app-btn-pill flex flex-1 items-center justify-center border border-app-border py-3 text-center font-medium text-app-muted hover:text-app-fg"
            >
              Zpět na kapitoly
            </Link>
          </div>
        </div>
      )}

      {confetti && (
        <div
          className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
          aria-hidden
        >
          {Array.from({ length: 36 }).map((_, i) => (
            <span
              key={i}
              className="absolute h-2 w-2 rounded-sm opacity-90"
              style={{
                left: `${(i * 11) % 100}%`,
                top: "-10px",
                backgroundColor: `hsl(${(i * 41) % 360} 80% 60%)`,
                animation: `delitelnost-fall ${2 + (i % 3) * 0.2}s linear forwards`,
              }}
            />
          ))}
          <style
            dangerouslySetInnerHTML={{
              __html: `@keyframes delitelnost-fall{to{transform:translateY(110vh) rotate(360deg)}}`,
            }}
          />
        </div>
      )}
    </div>
  );
}
