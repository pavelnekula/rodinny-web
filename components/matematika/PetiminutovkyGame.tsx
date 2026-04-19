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
import {
  type PetiminutovkaTyp,
  type PetiminutovkaZaznam,
  getPetiminutovkaLastCorrect,
  getPetiminutovkaLastFive,
  getPetiminutovkaRecord,
  savePetiminutovkaRun,
} from "@/lib/mathStorage";
import { MathNav } from "./MathNav";

const TOTAL_MS = 3 * 60 * 1000;

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

function timerColor(remainingMs: number): string {
  const p = 1 - remainingMs / TOTAL_MS;
  if (p < 0.33) return "#22c55e";
  if (p < 0.66) {
    const t = (p - 0.33) / 0.33;
    const r = Math.round(34 + (249 - 34) * t);
    const g = Math.round(197 + (115 - 197) * t);
    const b = Math.round(94 + (22 - 94) * t);
    return `rgb(${r},${g},${b})`;
  }
  const t = (p - 0.66) / 0.34;
  const r = Math.round(249 + (220 - 249) * t);
  const g = Math.round(115 + (38 - 115) * t);
  const b = Math.round(22 + (38 - 22) * t);
  return `rgb(${r},${g},${b})`;
}

function aggregateMistakes(
  list: WrongEntry[],
  cat: MathExample["category"],
): Map<string, { count: number; sample: WrongEntry }> {
  const m = new Map<string, { count: number; sample: WrongEntry }>();
  for (const w of list) {
    if (w.ex.category !== cat) continue;
    const key = `${w.ex.display}|${w.ex.answer}`;
    const prev = m.get(key);
    if (prev) prev.count += 1;
    else m.set(key, { count: 1, sample: w });
  }
  return m;
}

function topMistakes(
  list: WrongEntry[],
  cat: MathExample["category"],
  limit: number,
): { count: number; sample: WrongEntry }[] {
  const m = aggregateMistakes(list, cat);
  return [...m.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function topMistakesForCategories(
  list: WrongEntry[],
  cats: readonly MathExample["category"][],
  limit: number,
): { count: number; sample: WrongEntry }[] {
  const m = new Map<string, { count: number; sample: WrongEntry }>();
  for (const w of list) {
    if (!cats.includes(w.ex.category)) continue;
    const key = `${w.ex.display}|${w.ex.answer}`;
    const prev = m.get(key);
    if (prev) prev.count += 1;
    else m.set(key, { count: 1, sample: w });
  }
  return [...m.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function topMistakesFiltered(
  list: WrongEntry[],
  pred: (w: WrongEntry) => boolean,
  limit: number,
): { count: number; sample: WrongEntry }[] {
  const m = new Map<string, { count: number; sample: WrongEntry }>();
  for (const w of list) {
    if (!pred(w)) continue;
    const key = `${w.ex.display}|${w.ex.answer}`;
    const prev = m.get(key);
    if (prev) prev.count += 1;
    else m.set(key, { count: 1, sample: w });
  }
  return [...m.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function mistakeLine(w: WrongEntry): string {
  const { ex, userAnswer } = w;
  return `${ex.display} ❌ (ty napsala ${userAnswer}, správně je ${ex.answer})`;
}

function buildRecommendations(
  mistakes: WrongEntry[],
  correct: number,
  wrong: number,
  typ: PetiminutovkaTyp,
): string[] {
  const out: string[] = [];
  const total = correct + wrong;
  if (total === 0) return out;
  const acc = (correct / total) * 100;

  const nas = mistakes.filter((m) => m.ex.category === "nasobilka");
  const nas78 = nas.filter(
    (m) =>
      m.ex.a === 7 ||
      m.ex.b === 7 ||
      m.ex.a === 8 ||
      m.ex.b === 8,
  );
  if (nas.length > 0 && nas78.length / nas.length > 0.3) {
    out.push(
      "💡 Procvič si násobilku 7 a 8 — tam nejvíce chybuješ!",
    );
  }

  const divFirst = mistakes.filter(
    (m) => m.ex.category === "deleni" && m.ex.missingPosition === "first",
  );
  if (mistakes.length > 0 && divFirst.length / mistakes.length > 0.3) {
    out.push(
      "💡 Zkus si říkat: kolikrát se vejde B do A? Pomůže ti násobilka pozpátku!",
    );
  }

  const divAll = mistakes.filter((m) => m.ex.category === "deleni");
  if (mistakes.length > 0 && divAll.length / mistakes.length > 0.45) {
    out.push(
      "💡 Dělení je násobilka pozpátku — procvič si ji a dělení půjde samo! 🔄",
    );
  }

  const odc = mistakes.filter((m) => m.ex.category === "odcitani");
  if (mistakes.length > 0 && odc.length / mistakes.length > 0.3) {
    out.push(
      "💡 Zkus zítra soutěž jen na odečítání — bude to lepší!",
    );
  }

  if (acc < 60) {
    out.push(
      "💡 Zkus nejdřív jeden typ samostatně, ať si upevníš základ.",
    );
  }

  if (acc > 90) {
    out.push(
      typ === "all"
        ? "💡 Jsi borkyně! Zkus příště ještě rychlejší tempo nebo delší sérii!"
        : "💡 Jsi borkyně! Zkus příště „Vše dohromady“ pro větší výzvu!",
    );
  }

  const uniq = [...new Set(out)];
  return uniq.slice(0, 3);
}

function ratingTitle(correct: number): {
  title: string;
  color: string;
} {
  if (correct >= 40)
    return { title: "🏆 SUPER VÝSLEDEK!", color: "text-amber-500" };
  if (correct >= 25)
    return { title: "🌟 Výborně!", color: "text-app-muted" };
  if (correct >= 10)
    return { title: "👍 Dobrá práce!", color: "text-[#3b82f6]" };
  return { title: "💪 Příště to půjde!", color: "text-emerald-600" };
}

function Confetti({ show }: { show: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        left: `${(i * 7.3) % 100}%`,
        delay: `${(i % 12) * 0.08}s`,
        dur: `${2.4 + (i % 5) * 0.2}s`,
        hue: (i * 47) % 360,
      })),
    [],
  );
  if (!show) return null;
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
      aria-hidden
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes petconfetti-fall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:.85}}`,
        }}
      />
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-[-12px] h-3 w-2 rounded-sm opacity-90"
          style={{
            left: p.left,
            animationName: "petconfetti-fall",
            animationDelay: p.delay,
            animationDuration: p.dur,
            animationTimingFunction: "ease-in",
            animationFillMode: "forwards",
            backgroundColor: `hsl(${p.hue} 85% 55%)`,
          }}
        />
      ))}
    </div>
  );
}

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
  const [wrongNote, setWrongNote] = useState<string | null>(null);
  const [blocking, setBlocking] = useState(false);
  const [motivation, setMotivation] = useState<string | null>(null);
  const [scoreBump, setScoreBump] = useState(false);
  const [wrongLog, setWrongLog] = useState<WrongEntry[]>([]);

  const [records, setRecords] = useState<Record<PetiminutovkaTyp, number | null>>({
    nasobilka: null,
    deleni: null,
    scitani_odcitani: null,
    scitani_odcitani_do100: null,
    chybejici_cislo: null,
    all: null,
  });
  const [lastFive, setLastFive] = useState<Record<PetiminutovkaTyp, PetiminutovkaZaznam[]>>({
    nasobilka: [],
    deleni: [],
    scitani_odcitani: [],
    scitani_odcitani_do100: [],
    chybejici_cislo: [],
    all: [],
  });

  const [doneMeta, setDoneMeta] = useState<{
    isNewRecord: boolean;
    prevCorrect: number | null;
  }>({ isNewRecord: false, prevCorrect: null });

  const inputRef = useRef<HTMLInputElement>(null);
  const finishedRef = useRef(false);
  const correctRef = useRef(0);
  const wrongRef = useRef(0);
  correctRef.current = correct;
  wrongRef.current = wrong;

  const refreshStorage = useCallback(() => {
    setRecords({
      nasobilka: getPetiminutovkaRecord("nasobilka"),
      deleni: getPetiminutovkaRecord("deleni"),
      scitani_odcitani: getPetiminutovkaRecord("scitani_odcitani"),
      scitani_odcitani_do100: getPetiminutovkaRecord("scitani_odcitani_do100"),
      chybejici_cislo: getPetiminutovkaRecord("chybejici_cislo"),
      all: getPetiminutovkaRecord("all"),
    });
    setLastFive({
      nasobilka: getPetiminutovkaLastFive("nasobilka"),
      deleni: getPetiminutovkaLastFive("deleni"),
      scitani_odcitani: getPetiminutovkaLastFive("scitani_odcitani"),
      scitani_odcitani_do100: getPetiminutovkaLastFive("scitani_odcitani_do100"),
      chybejici_cislo: getPetiminutovkaLastFive("chybejici_cislo"),
      all: getPetiminutovkaLastFive("all"),
    });
  }, []);

  useEffect(() => {
    refreshStorage();
  }, [refreshStorage]);

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
    setWrongNote(null);
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
        const prev = typ ? getPetiminutovkaLastCorrect(typ) : null;
        const c = correctRef.current;
        const w = wrongRef.current;
        const total = c + w;
        const isNew =
          typ && total > 0
            ? savePetiminutovkaRun(typ, c, w).isNewRecord
            : false;
        setDoneMeta({ isNewRecord: isNew, prevCorrect: prev });
        if (typ) refreshStorage();
        setPhase("done");
        playFanfare();
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [phase, paused, refreshStorage]);

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
      setScoreBump(true);
      setTimeout(() => setScoreBump(false), 500);
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
      setWrongNote(`Správně je: ${problem.answer}`);
      setBlocking(true);
      window.setTimeout(() => {
        setWrongNote(null);
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

  const totalAttempts = correct + wrong;
  const accPct =
    totalAttempts > 0 ? Math.round((correct / totalAttempts) * 1000) / 10 : 0;
  const showConfetti = phase === "done" && accPct > 80;

  const barPct = Math.max(0, Math.min(100, (timeLeftMs / TOTAL_MS) * 100));
  const lowTime = timeLeftMs <= 60_000;
  const panic = timeLeftMs <= 30_000;

  const rt = phase === "done" ? ratingTitle(correct) : null;
  const recs =
    phase === "done" && contestTyp
      ? buildRecommendations(wrongLog, correct, wrong, contestTyp)
      : [];

  const shellClass =
    phase === "play"
      ? "flex min-h-0 w-full flex-1 flex-col px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 sm:px-4 md:px-6 md:pt-3 lg:px-8"
      : "mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 md:max-w-4xl md:py-10";

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-[#ffffff] text-[#1a1a1a] touch-manipulation">
      <Confetti show={showConfetti} />
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
              Tříminutovky ⏱️
            </h1>
            <p className="mt-2 text-lg text-[#6b7280] md:text-xl">
              Tři minuty na co nejvíc správně — jak rychle to dnes zvládneš?
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
                <p className="mt-3 text-sm font-medium text-[#3b82f6]">
                  Rekord:{" "}
                  {records.nasobilka != null
                    ? `${records.nasobilka} správně`
                    : "—"}
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
                <p className="mt-3 text-sm font-medium text-[#3b82f6]">
                  Rekord:{" "}
                  {records.deleni != null
                    ? `${records.deleni} správně`
                    : "—"}
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
                <p className="mt-3 text-sm font-medium text-[#3b82f6]">
                  Rekord:{" "}
                  {records.scitani_odcitani != null
                    ? `${records.scitani_odcitani} správně`
                    : "—"}
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
                <p className="mt-3 text-sm font-medium" style={{ color: "#0A84FF" }}>
                  Rekord:{" "}
                  {records.scitani_odcitani_do100 != null
                    ? `${records.scitani_odcitani_do100} správně`
                    : "—"}
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
                <p className="mt-3 text-sm font-medium" style={{ color: "#BF5AF2" }}>
                  Rekord:{" "}
                  {records.chybejici_cislo != null
                    ? `${records.chybejici_cislo} správně`
                    : "—"}
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
                <p className="mt-3 text-sm font-medium text-[#3b82f6]">
                  Rekord:{" "}
                  {records.all != null ? `${records.all} správně` : "—"}
                </p>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#e5e7eb] shadow-sm">
              <table className="w-full min-w-[880px] text-left text-sm">
                <caption className="border-b border-[#e5e7eb] bg-[#fafafa] px-4 py-3 text-center font-medium text-[#1a1a1a]">
                  Posledních 5 výsledků podle typu
                </caption>
                <thead>
                  <tr className="border-b border-[#e5e7eb] bg-[#fafafa] text-xs uppercase tracking-wide text-[#6b7280]">
                    <th className="px-4 py-2">Typ</th>
                    <th className="px-4 py-2">Datum</th>
                    <th className="px-4 py-2">Výsledek</th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      ["nasobilka", "Násobilka ×"],
                      ["deleni", "Dělení :"],
                      ["scitani_odcitani", "± po 10"],
                      ["scitani_odcitani_do100", "± do 100"],
                      ["chybejici_cislo", "Chyb. číslo"],
                      ["all", "Vše"],
                    ] as const
                  ).flatMap(([key, label]) => {
                    const rows = lastFive[key];
                    if (!rows.length) {
                      return [
                        <tr
                          key={`${key}-empty`}
                          className="border-b border-[#e5e7eb]"
                        >
                          <td className="px-4 py-2 font-medium">{label}</td>
                          <td className="px-4 py-2 text-[#6b7280]" colSpan={2}>
                            Zatím žádná data
                          </td>
                        </tr>,
                      ];
                    }
                    return rows.map((z, i) => (
                      <tr
                        key={`${key}-${z.date}-${i}`}
                        className="border-b border-[#e5e7eb]"
                      >
                        <td className="px-4 py-2 font-medium">
                          {i === 0 ? label : ""}
                        </td>
                        <td className="px-4 py-2 tabular-nums text-[#6b7280]">
                          {new Date(z.date).toLocaleString("cs-CZ", {
                            day: "numeric",
                            month: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-4 py-2">
                          <span className="text-emerald-600">
                            ✅ {z.correct}
                          </span>{" "}
                          <span className="text-rose-600">
                            ❌ {z.wrong}
                          </span>
                        </td>
                      </tr>
                    ));
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                disabled={!contestTyp}
                onClick={() => contestTyp && startGame(contestTyp)}
                className="inline-flex min-h-[56px] min-w-[240px] items-center justify-center rounded-2xl bg-[#3b82f6] px-10 text-lg font-bold text-white shadow-md transition hover:bg-blue-600 focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 animate-bounce md:min-h-[72px] md:min-w-[280px] md:text-xl md:px-14"
                aria-label="Spustit tříminutovky"
              >
                STARTOVAT 🚀
              </button>
            </div>
          </div>
        )}

        {phase === "play" && problem && (
          <div className="flex min-h-0 flex-1 flex-col gap-4 md:gap-6">
            <div className="shrink-0">
              <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-[#e5e7eb] md:h-5">
                <div
                  className="h-full rounded-full transition-[width] duration-100 ease-linear"
                  style={{
                    width: `${barPct}%`,
                    backgroundColor: timerColor(timeLeftMs),
                  }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between gap-4">
                <span
                  className={`text-3xl font-bold tabular-nums text-[#1a1a1a] sm:text-5xl md:text-6xl lg:text-7xl ${
                    panic
                      ? "animate-pulse text-red-600"
                      : lowTime
                        ? "animate-pulse"
                        : ""
                  }`}
                >
                  {String(Math.floor(timeLeftMs / 60_000)).padStart(2, "0")}:
                  {String(Math.floor((timeLeftMs % 60_000) / 1000)).padStart(
                    2,
                    "0",
                  )}
                </span>
                <button
                  type="button"
                  onClick={togglePause}
                  className="rounded-xl border border-[#e5e7eb] bg-[#fafafa] px-4 py-2 text-sm font-medium text-[#1a1a1a] hover:bg-[#f3f4f6] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] md:px-6 md:py-3 md:text-lg"
                >
                  {paused ? "▶ Pokračovat" : "⏸ Pauza"}
                </button>
              </div>
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

                {wrongNote && (
                  <p className="mt-3 text-center text-lg font-semibold text-rose-600 md:mt-4 md:text-2xl">
                    {wrongNote}
                  </p>
                )}

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

                <div
                  className={`mt-4 flex flex-wrap items-center justify-center gap-4 text-lg sm:mt-6 sm:text-xl md:gap-6 md:text-2xl ${
                    scoreBump ? "animate-bounce" : ""
                  }`}
                >
                  <span className="text-emerald-600">
                    ✅ {correct} správně
                  </span>
                  <span className="text-rose-600">❌ {wrong} špatně</span>
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

        {phase === "done" && contestTyp && rt && (
          <div className="space-y-10">
            <section className="rounded-3xl border border-[#e5e7eb] bg-[#fafafa] p-8 text-center shadow-sm">
              <h2 className={`text-3xl font-bold ${rt.color}`}>{rt.title}</h2>
              {doneMeta.isNewRecord && (
                <p className="mt-4 animate-pulse text-2xl font-bold text-amber-500">
                  🎊 Nový rekord!
                </p>
              )}
              <ul className="mx-auto mt-6 max-w-md space-y-2 text-left text-lg">
                <li>
                  Celkem příkladů:{" "}
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
                  <strong className="tabular-nums">{accPct}%</strong>
                </li>
              </ul>
              {doneMeta.prevCorrect != null && (
                <p className="mt-6 text-[#6b7280]">
                  {correct > doneMeta.prevCorrect ? (
                    <>
                      O{" "}
                      <strong>
                        {correct - doneMeta.prevCorrect}
                      </strong>{" "}
                      příkladů více než minule! 🎉
                    </>
                  ) : (
                    <>
                      Minule jsi měla{" "}
                      <strong className="tabular-nums">
                        {doneMeta.prevCorrect}
                      </strong>{" "}
                      správně
                    </>
                  )}
                </p>
              )}
              {doneMeta.prevCorrect == null && totalAttempts > 0 && (
                <p className="mt-6 text-[#6b7280]">
                  To byl tvůj první záznam tohoto typu — jen tak dál!
                </p>
              )}
            </section>

            <section>
              <h3 className="mb-4 text-xl font-semibold text-[#1a1a1a]">
                Analýza chyb
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <MistakeCard
                  title="Násobilka ×"
                  emoji="🟡"
                  border="border-amber-300"
                  bg="bg-amber-50"
                  lines={topMistakes(wrongLog, "nasobilka", 5).map((x) =>
                    mistakeLine(x.sample),
                  )}
                  empty="Násobilku zvládáš perfektně! ✅"
                />
                <MistakeCard
                  title="Dělení :"
                  emoji="🟠"
                  border="border-orange-300"
                  bg="bg-orange-50"
                  lines={topMistakes(wrongLog, "deleni", 5).map((x) =>
                    mistakeLine(x.sample),
                  )}
                  empty="Dělení zvládáš perfektně! ✅"
                />
                <MistakeCard
                  title="Sčítání +"
                  emoji="🔵"
                  border="border-sky-300"
                  bg="bg-sky-50"
                  lines={topMistakes(wrongLog, "scitani", 5).map((x) =>
                    mistakeLine(x.sample),
                  )}
                  empty="Sčítání zvládáš perfektně! ✅"
                />
                <MistakeCard
                  title="Odečítání −"
                  emoji="🟣"
                  border="border-violet-300"
                  bg="bg-violet-50"
                  lines={topMistakes(wrongLog, "odcitani", 5).map((x) =>
                    mistakeLine(x.sample),
                  )}
                  empty="Odečítání zvládáš perfektně! ✅"
                />
                <MistakeCard
                  title="Sčítání a odečítání do 100"
                  emoji="🔵"
                  border="border-sky-300"
                  bg="bg-sky-50"
                  lines={topMistakesForCategories(
                    wrongLog,
                    ["scitani100", "odcitani100"],
                    5,
                  ).map((x) => mistakeLine(x.sample))}
                  empty="Sčítání do 100 zvládáš perfektně! ✅"
                />
                <ChybejiciMistakesCard wrongLog={wrongLog} />
              </div>
            </section>

            {recs.length > 0 && (
              <section>
                <h3 className="mb-3 text-xl font-semibold text-[#1a1a1a]">
                  Doporučení
                </h3>
                <ul className="space-y-2 text-[#1a1a1a]">
                  {recs.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </section>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
              <button
                type="button"
                onClick={() => {
                  deadlineRef.current = null;
                  finishedRef.current = false;
                  setPhase("intro");
                  setContestTyp(null);
                  setProblem(null);
                  setEndsAt(null);
                  refreshStorage();
                }}
                className="rounded-2xl border border-[#e5e7eb] bg-[#ffffff] px-6 py-3 font-semibold text-[#1a1a1a] shadow-sm hover:bg-[#fafafa] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6]"
              >
                🔄 Hrát znovu
              </button>
              <Link
                href="/matematika/petiminutovky/statistiky"
                className="inline-flex items-center justify-center rounded-2xl border border-[#e5e7eb] bg-[#ffffff] px-6 py-3 font-semibold text-[#1a1a1a] shadow-sm hover:bg-[#fafafa] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6]"
              >
                📊 Moje statistiky
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

function ChybejiciMistakesCard({ wrongLog }: { wrongLog: WrongEntry[] }) {
  const chybCats = (w: WrongEntry) =>
    w.ex.category === "chybejici_scitani" ||
    w.ex.category === "chybejici_odcitani";

  const anyChyb = wrongLog.filter(chybCats);
  const firstLines = topMistakesFiltered(
    wrongLog,
    (w) => chybCats(w) && w.ex.missingPosition === "first",
    5,
  ).map((x) => mistakeLine(x.sample));
  const secondLines = topMistakesFiltered(
    wrongLog,
    (w) => chybCats(w) && w.ex.missingPosition === "second",
    5,
  ).map((x) => mistakeLine(x.sample));
  const resultLines = topMistakesFiltered(
    wrongLog,
    (w) => chybCats(w) && w.ex.missingPosition === "result",
    4,
  ).map((x) => mistakeLine(x.sample));
  const showH1Tip = wrongLog.some(
    (w) =>
      w.ex.category === "chybejici_odcitani" &&
      w.ex.missingPosition === "first",
  );

  if (anyChyb.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-[#BF5AF2] bg-violet-50 p-4 shadow-sm">
        <h4 className="font-bold text-[#1a1a1a]">
          <span aria-hidden>🟣</span> Chybějící číslo
        </h4>
        <p className="mt-3 text-sm text-[#6b7280]">
          Chybějící číslo zvládáš perfektně! ✅
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-[#BF5AF2] bg-violet-50 p-4 shadow-sm">
      <h4 className="font-bold text-[#1a1a1a]">
        <span aria-hidden>🟣</span> Chybějící číslo
      </h4>
      <div className="mt-3 space-y-4 text-sm text-[#1a1a1a]">
        <div>
          <p className="font-semibold text-[#6b7280]">
            Chyběl první člen (___ na začátku)
          </p>
          {firstLines.length === 0 ? (
            <p className="mt-1 text-[#6b7280]">Žádné takové chyby.</p>
          ) : (
            <ul className="mt-1 list-inside list-disc space-y-1">
              {firstLines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <p className="font-semibold text-[#6b7280]">
            Chyběl druhý člen (___ uprostřed)
          </p>
          {secondLines.length === 0 ? (
            <p className="mt-1 text-[#6b7280]">Žádné takové chyby.</p>
          ) : (
            <ul className="mt-1 list-inside list-disc space-y-1">
              {secondLines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          )}
        </div>
        {resultLines.length > 0 ? (
          <div>
            <p className="font-semibold text-[#6b7280]">
              Chyběl výsledek (___ za =)
            </p>
            <ul className="mt-1 list-inside list-disc space-y-1">
              {resultLines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      {showH1Tip ? (
        <p className="mt-4 text-sm font-medium text-[#1a1a1a]">
          💡 U chybějícího menšence zkus: výsledek + odečítané číslo = ?
        </p>
      ) : null}
    </div>
  );
}

function MistakeCard({
  title,
  emoji,
  border,
  bg,
  lines,
  empty,
}: {
  title: string;
  emoji: string;
  border: string;
  bg: string;
  lines: string[];
  empty: string;
}) {
  return (
    <div
      className={`rounded-2xl border-2 ${border} ${bg} p-4 shadow-sm`}
    >
      <h4 className="font-bold text-[#1a1a1a]">
        <span aria-hidden>{emoji}</span> {title}
      </h4>
      {lines.length === 0 ? (
        <p className="mt-3 text-sm text-[#6b7280]">{empty}</p>
      ) : (
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[#1a1a1a]">
          {lines.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
