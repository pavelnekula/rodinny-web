"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type MathExample,
  type PetiminutovkaMixedTyp,
  PetiminutovkaRing20,
  generateMixed,
} from "@/lib/mathGenerators";
import {
  playFanfare,
  playPetiminutovkaCorrect,
  playPetiminutovkaWrong,
} from "@/lib/mathSound";
import { type PetiminutovkaTyp, savePetiminutovkaRun } from "@/lib/mathStorage";
import { MathNav } from "./MathNav";

const TOTAL_MS = 5 * 60 * 1000;

type Phase = "intro" | "play" | "done";

type WrongEntry = {
  ex: MathExample;
  userAnswer: number;
};

const MOTIVATION = [
  "Skvěle! Jedeš jako stroj! 🔥",
  "Wow, to je rychlost! ⚡",
  "Tinušku nikdo nezastaví! 🏆",
  "Úžasné! Pokračuj! 💪",
  "Matematická mistryně! 🌟",
];

export function PetiminutovkyGame() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [contestTyp, setContestTyp] = useState<PetiminutovkaTyp | null>(null);
  const mixedTyp = useMemo((): PetiminutovkaMixedTyp | null => {
    if (!contestTyp) return null;
    if (contestTyp === "scitani_odcitani") return "scitani_odcitani";
    if (contestTyp === "scitani_odcitani_do100")
      return "scitani_odcitani_do100";
    if (contestTyp === "chybejici_cislo") return "chybejici_cislo";
    if (contestTyp === "nasobilka") return "nasobilka";
    if (contestTyp === "deleni") return "deleni";
    return "all";
  }, [contestTyp]);

  const ringRef = useRef(new PetiminutovkaRing20());
  /** Absolutní konec kola — ref se nastaví synchronně při startu/pauze, aby timer nezávisel na batchi `endsAt`. */
  const deadlineRef = useRef<number | null>(null);
  const contestTypRef = useRef<PetiminutovkaTyp | null>(null);
  contestTypRef.current = contestTyp;

  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [pausedLeftMs, setPausedLeftMs] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  const [timeLeftMs, setTimeLeftMs] = useState(TOTAL_MS);
  const [problem, setProblem] = useState<MathExample | null>(null);
  const [input, setInput] = useState("");
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [flash, setFlash] = useState<"ok" | "bad" | null>(null);
  const [blocking, setBlocking] = useState(false);
  const [motivation, setMotivation] = useState<string | null>(null);
  const [wrongLog, setWrongLog] = useState<WrongEntry[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const finishedRef = useRef(false);
  const correctRef = useRef(0);
  const wrongRef = useRef(0);
  correctRef.current = correct;
  wrongRef.current = wrong;

  const nextProblem = useCallback(() => {
    if (!mixedTyp) return;
    const ex = generateMixed(mixedTyp, ringRef.current);
    setProblem(ex);
    setInput("");
  }, [mixedTyp]);

  const startGame = (t: PetiminutovkaTyp) => {
    finishedRef.current = false;
    setContestTyp(t);
    contestTypRef.current = t;
    ringRef.current = new PetiminutovkaRing20();
    setWrongLog([]);
    setCorrect(0);
    setWrong(0);
    setPaused(false);
    setPausedLeftMs(null);
    const end = Date.now() + TOTAL_MS;
    deadlineRef.current = end;
    setEndsAt(end);
    setTimeLeftMs(TOTAL_MS);
    setPhase("play");
    setFlash(null);
    setMotivation(null);
    const mt: PetiminutovkaMixedTyp =
      t === "scitani_odcitani"
        ? "scitani_odcitani"
        : t === "scitani_odcitani_do100"
          ? "scitani_odcitani_do100"
          : t === "chybejici_cislo"
            ? "chybejici_cislo"
            : t === "nasobilka"
              ? "nasobilka"
              : t === "deleni"
                ? "deleni"
                : "all";
    const ex = generateMixed(mt, ringRef.current);
    setProblem(ex);
    setInput("");
  };

  useEffect(() => {
    if (phase !== "play" || paused) return;
    if (deadlineRef.current == null) return;

    const id = window.setInterval(() => {
      const end = deadlineRef.current;
      if (end == null) return;
      const left = Math.max(0, end - Date.now());
      setTimeLeftMs(left);
      if (left <= 0 && !finishedRef.current) {
        finishedRef.current = true;
        window.clearInterval(id);
        deadlineRef.current = null;
        setEndsAt(null);
        const typ = contestTypRef.current;
        const c = correctRef.current;
        const w = wrongRef.current;
        const total = c + w;
        if (typ && total > 0) {
          savePetiminutovkaRun(typ, c, w);
        }
        setPhase("done");
        playFanfare();
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [phase, paused]);

  useEffect(() => {
    if (phase === "play" && !paused && !blocking) {
      inputRef.current?.focus();
    }
  }, [phase, paused, blocking, problem]);

  const submit = useCallback(() => {
    if (phase !== "play" || paused || blocking || !problem || !mixedTyp) return;
    const raw = input.trim();
    if (raw === "") return;
    const n = Number(raw);
    if (!Number.isFinite(n)) return;
    const ok = n === problem.answer;
    if (ok) {
      playPetiminutovkaCorrect();
      setFlash("ok");
      const nc = correct + 1;
      setCorrect(nc);
      if (nc > 0 && nc % 10 === 0) {
        setMotivation(
          MOTIVATION[Math.floor(Math.random() * MOTIVATION.length)] ?? null,
        );
        window.setTimeout(() => setMotivation(null), 2800);
      }
      window.setTimeout(() => {
        setFlash(null);
        nextProblem();
      }, 120);
    } else {
      playPetiminutovkaWrong();
      setFlash("bad");
      setWrong((w) => w + 1);
      setWrongLog((log) => [...log, { ex: problem, userAnswer: n }]);
      setBlocking(true);
      window.setTimeout(() => {
        setFlash(null);
        setBlocking(false);
        nextProblem();
      }, 1500);
    }
  }, [
    phase,
    paused,
    blocking,
    problem,
    mixedTyp,
    input,
    correct,
    nextProblem,
  ]);

  const totalAttempts = correct + wrong;
  const accPct =
    totalAttempts > 0 ? Math.round((correct / totalAttempts) * 1000) / 10 : 0;

  const togglePause = () => {
    if (phase !== "play") return;
    if (!paused) {
      const end = deadlineRef.current ?? endsAt;
      if (end == null) return;
      const left = Math.max(0, end - Date.now());
      setPausedLeftMs(left);
      deadlineRef.current = null;
      setPaused(true);
      setEndsAt(null);
      setTimeLeftMs(left);
    } else {
      const base = pausedLeftMs ?? timeLeftMs;
      const nextEnd = Date.now() + base;
      deadlineRef.current = nextEnd;
      setEndsAt(nextEnd);
      setPaused(false);
      setPausedLeftMs(null);
    }
  };

  const shellClass =
    phase === "play"
      ? "flex min-h-0 w-full flex-1 flex-col px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 sm:px-4 md:px-6 md:pt-3 lg:px-8"
      : "mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 md:max-w-4xl md:py-10";

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-[#ffffff] text-[#1a1a1a] touch-manipulation">
      {flash === "ok" && (
        <div
          className="pointer-events-none fixed inset-0 z-[80] animate-pulse bg-emerald-400/35"
          aria-hidden
        />
      )}
      {flash === "bad" && (
        <div
          className="pointer-events-none fixed inset-0 z-[80] bg-rose-500/30"
          aria-hidden
        />
      )}

      <div className={shellClass}>
        <div className={phase === "play" ? "mb-2 shrink-0 md:mb-3" : "mb-6"}>
          <MathNav />
        </div>

        {phase !== "play" && (
          <header className="mb-8 text-center md:mb-10">
            <h1 className="text-3xl font-semibold tracking-tight text-[#1a1a1a] sm:text-4xl md:text-5xl">
              Pětiminutovky ⏱️
            </h1>
            <p className="mt-2 text-lg text-[#6b7280] md:text-xl">
              Pět minut bez času na obrazovce — po skončení kola uvidíš výsledky
              a příklady, u kterých to nevyšlo.
            </p>
          </header>
        )}

        {phase === "intro" && (
          <div className="space-y-8 md:space-y-10">
            <div className="grid gap-4 md:gap-6 sm:grid-cols-2 xl:grid-cols-3">
              <button
                type="button"
                onClick={() => setContestTyp("nasobilka")}
                className={`rounded-2xl border-2 p-6 text-left shadow-sm transition focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2 md:min-h-[180px] md:p-8 ${
                  contestTyp === "nasobilka"
                    ? "border-amber-400 bg-amber-50 ring-2 ring-amber-300"
                    : "border-[#e5e7eb] bg-[#ffffff] hover:border-amber-200"
                }`}
                aria-pressed={contestTyp === "nasobilka"}
              >
                <span className="text-2xl" aria-hidden>
                  🟡
                </span>
                <span className="mt-2 block text-xl font-bold md:text-2xl">
                  Násobilka ×
                </span>
                <p className="mt-1 text-sm text-[#6b7280] md:text-base">
                  Oba činitele znáš — dopočítej jen výsledek (např. 6 × 7 = __).
                </p>
              </button>

              <button
                type="button"
                onClick={() => setContestTyp("deleni")}
                className={`rounded-2xl border-2 p-6 text-left shadow-sm transition focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2 md:min-h-[180px] md:p-8 ${
                  contestTyp === "deleni"
                    ? "border-orange-400 bg-orange-50 ring-2 ring-orange-300"
                    : "border-[#e5e7eb] bg-[#ffffff] hover:border-orange-200"
                }`}
                aria-pressed={contestTyp === "deleni"}
              >
                <span className="text-2xl" aria-hidden>
                  🟠
                </span>
                <span className="mt-2 block text-xl font-bold md:text-2xl">
                  Dělení :
                </span>
                <p className="mt-1 text-sm text-[#6b7280] md:text-base">
                  Dělenec i dělitel jsou dané — dopočítej výsledek, vždy celé
                  číslo (např. 42 : 7 = __).
                </p>
              </button>

              <button
                type="button"
                onClick={() => setContestTyp("scitani_odcitani")}
                className={`rounded-2xl border-2 p-6 text-left shadow-sm transition focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2 md:min-h-[180px] md:p-8 ${
                  contestTyp === "scitani_odcitani"
                    ? "border-sky-400 bg-sky-50 ring-2 ring-sky-300"
                    : "border-[#e5e7eb] bg-[#ffffff] hover:border-sky-200"
                }`}
                aria-pressed={contestTyp === "scitani_odcitani"}
              >
                <span className="text-2xl" aria-hidden>
                  🔵
                </span>
                <span className="mt-2 block text-xl font-bold md:text-2xl">
                  Sčítání a odečítání
                </span>
                <p className="mt-1 text-sm text-[#6b7280] md:text-base">
                  Po desítkách do 1000 — sčítání i odečítání.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setContestTyp("scitani_odcitani_do100")}
                className={`rounded-2xl border-2 p-6 text-left shadow-sm transition focus-visible:outline focus-visible:ring-2 focus-visible:ring-offset-2 md:min-h-[180px] md:p-8 ${
                  contestTyp === "scitani_odcitani_do100"
                    ? "border-[#0A84FF] bg-sky-50 ring-2 ring-[#0A84FF]"
                    : "border-[#e5e7eb] bg-[#ffffff] hover:border-sky-200"
                }`}
                aria-pressed={contestTyp === "scitani_odcitani_do100"}
              >
                <span className="text-2xl" aria-hidden>
                  🔵
                </span>
                <span className="mt-2 block text-xl font-bold md:text-2xl">
                  Sčítání a odečítání do 100
                </span>
                <p className="mt-1 text-sm text-[#6b7280] md:text-base">
                  Klasické příklady a + b a a − b, čísla do 100.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setContestTyp("chybejici_cislo")}
                className={`rounded-2xl border-2 p-6 text-left shadow-sm transition focus-visible:outline focus-visible:ring-2 focus-visible:ring-offset-2 md:min-h-[180px] md:p-8 ${
                  contestTyp === "chybejici_cislo"
                    ? "border-[#BF5AF2] bg-violet-50 ring-2 ring-[#BF5AF2]"
                    : "border-[#e5e7eb] bg-[#ffffff] hover:border-violet-200"
                }`}
                aria-pressed={contestTyp === "chybejici_cislo"}
              >
                <span className="text-2xl" aria-hidden>
                  🟣
                </span>
                <span className="mt-2 block text-xl font-bold md:text-2xl">
                  Chybějící číslo
                </span>
                <p className="mt-1 text-sm text-[#6b7280] md:text-base">
                  Znáš výsledek — doplň chybějící číslo (sčítání i odečítání).
                </p>
              </button>

              <button
                type="button"
                onClick={() => setContestTyp("all")}
                className={`rounded-2xl border-2 p-6 text-left shadow-sm transition focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2 md:min-h-[180px] md:p-8 ${
                  contestTyp === "all"
                    ? "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-300"
                    : "border-[#e5e7eb] bg-[#ffffff] hover:border-emerald-200"
                }`}
                aria-pressed={contestTyp === "all"}
              >
                <span className="text-2xl" aria-hidden>
                  🟢
                </span>
                <span className="mt-2 block text-xl font-bold md:text-2xl">
                  Vše dohromady
                </span>
                <p className="mt-1 text-sm text-[#6b7280] md:text-base">
                  Mix: násobilka, dělení, ± po desítkách, sčítání a odečítání do
                  100, chybějící číslo u + a −.
                </p>
              </button>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                disabled={!contestTyp}
                onClick={() => contestTyp && startGame(contestTyp)}
                className="inline-flex min-h-[56px] min-w-[240px] items-center justify-center rounded-2xl bg-[#3b82f6] px-10 text-lg font-bold text-white shadow-md transition hover:bg-blue-600 focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 animate-bounce md:min-h-[72px] md:min-w-[280px] md:text-xl md:px-14"
                aria-label="Spustit pětiminutovky"
              >
                STARTOVAT 🚀
              </button>
            </div>
          </div>
        )}

        {phase === "play" && problem && (
          <div className="flex min-h-0 flex-1 flex-col gap-4 md:gap-6">
            <div className="flex shrink-0 justify-end">
              <button
                type="button"
                onClick={togglePause}
                className="rounded-xl border border-[#e5e7eb] bg-[#fafafa] px-4 py-2 text-sm font-medium text-[#1a1a1a] hover:bg-[#f3f4f6] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] md:px-6 md:py-3 md:text-lg"
              >
                {paused ? "▶ Pokračovat" : "⏸ Pauza"}
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 flex-col">
              {paused && (
                <div
                  className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-[#6b7280]/40 backdrop-blur-[1px]"
                  aria-live="polite"
                >
                  <p className="rounded-xl bg-app-card px-6 py-4 text-lg font-semibold shadow-lg md:px-10 md:py-6 md:text-2xl">
                    Pauza — odpočiň si 😊
                  </p>
                </div>
              )}

              <div className="flex min-h-0 flex-1 flex-col rounded-3xl border border-[#e5e7eb] bg-[#ffffff] p-4 shadow-sm sm:p-6 md:p-8 lg:p-10">
                <p className="flex min-h-[3.5rem] flex-1 items-center justify-center text-center text-4xl font-bold leading-tight text-[#1a1a1a] sm:min-h-[4rem] sm:text-5xl md:min-h-[5rem] md:text-6xl lg:min-h-0 lg:text-7xl xl:text-8xl">
                  {problem.display}
                </p>

                <div className="mt-4 flex flex-col items-stretch gap-4 md:mt-6 md:gap-6">
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    autoFocus
                    disabled={paused || blocking}
                    aria-label="Odpověď"
                    value={input}
                    onChange={(e) =>
                      setInput(e.target.value.replace(/\D/g, ""))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submit();
                    }}
                    className="w-full max-w-none rounded-2xl border-2 border-[#3b82f6] px-3 py-4 text-center text-4xl font-bold text-[#1a1a1a] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] disabled:bg-[#f3f4f6] sm:py-5 sm:text-5xl md:py-6 md:text-6xl lg:mx-auto lg:max-w-4xl lg:text-7xl"
                  />

                  <div className="grid w-full max-w-none grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3 md:gap-4 lg:mx-auto lg:max-w-5xl">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "OK"].map(
                      (k) => (
                        <button
                          key={k}
                          type="button"
                          disabled={paused || blocking}
                          className="min-h-[52px] min-w-0 rounded-xl border border-[#e5e7eb] bg-[#fafafa] text-lg font-semibold text-[#1a1a1a] hover:bg-[#f3f4f6] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] disabled:opacity-50 sm:min-h-[56px] sm:text-xl md:min-h-[72px] md:text-2xl lg:min-h-[80px] lg:text-3xl"
                          aria-label={
                            k === "⌫"
                              ? "Smazat číslo"
                              : k === "OK"
                                ? "Potvrdit odpověď"
                                : `Číslice ${k}`
                          }
                          onClick={() => {
                            if (k === "⌫") {
                              setInput((s) => s.slice(0, -1));
                              return;
                            }
                            if (k === "OK") {
                              submit();
                              return;
                            }
                            setInput((s) => s + k);
                          }}
                        >
                          {k}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {motivation && (
                  <p className="mt-3 text-center text-lg font-semibold text-[#3b82f6] md:text-xl">
                    {motivation}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {phase === "done" && contestTyp && (
          <div className="space-y-8">
            <section className="rounded-3xl border border-[#e5e7eb] bg-[#fafafa] p-8 text-center shadow-sm">
              <h2 className="text-3xl font-bold text-[#1a1a1a]">
                Konec kola — výsledky
              </h2>
              <ul className="mx-auto mt-6 max-w-md space-y-2 text-left text-lg">
                <li>
                  Příkladů celkem:{" "}
                  <strong className="tabular-nums">{totalAttempts}</strong>
                </li>
                <li className="text-emerald-600">
                  Správně:{" "}
                  <strong className="tabular-nums">{correct}</strong>
                </li>
                <li className="text-rose-600">
                  Špatně: <strong className="tabular-nums">{wrong}</strong>
                </li>
                <li>
                  Úspěšnost:{" "}
                  <strong className="tabular-nums">
                    {totalAttempts > 0 ? `${accPct} %` : "—"}
                  </strong>
                </li>
              </ul>
            </section>

            <section className="rounded-3xl border border-[#e5e7eb] bg-[#ffffff] p-6 shadow-sm sm:p-8">
              <h3 className="text-xl font-semibold text-[#1a1a1a]">
                Příklady, které nebyly správně
              </h3>
              {wrongLog.length === 0 ? (
                <p className="mt-4 text-[#6b7280]">
                  Žádné — všechny zapsané odpovědi v téhle sérii sedí. Skvělá
                  práce.
                </p>
              ) : (
                <ul className="mt-4 list-inside list-disc space-y-3 text-left text-base text-[#1a1a1a]">
                  {wrongLog.map((w, i) => (
                    <li key={`${w.ex.display}-${w.userAnswer}-${i}`}>
                      <span className="font-semibold">{w.ex.display}</span>
                      {" — "}
                      napsala jsi{" "}
                      <span className="tabular-nums text-rose-600">
                        {w.userAnswer}
                      </span>
                      , správně je{" "}
                      <span className="tabular-nums text-emerald-600">
                        {w.ex.answer}
                      </span>
                      .
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
              <button
                type="button"
                onClick={() => {
                  deadlineRef.current = null;
                  finishedRef.current = false;
                  setWrongLog([]);
                  setPhase("intro");
                  setContestTyp(null);
                  setProblem(null);
                  setEndsAt(null);
                }}
                className="rounded-2xl border border-[#e5e7eb] bg-[#ffffff] px-6 py-3 font-semibold text-[#1a1a1a] shadow-sm hover:bg-[#fafafa] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6]"
              >
                🔄 Hrát znovu
              </button>
              <Link
                href="/matematika/petiminutovky/statistiky"
                className="inline-flex items-center justify-center rounded-2xl border border-[#e5e7eb] bg-[#ffffff] px-6 py-3 text-sm font-semibold text-[#6b7280] shadow-sm hover:bg-[#fafafa] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6]"
              >
                📊 Statistiky (volitelně)
              </Link>
              <Link
                href="/matematika"
                className="inline-flex items-center justify-center rounded-2xl bg-[#3b82f6] px-6 py-3 font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2"
              >
                🏠 Zpět na matematiku
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
