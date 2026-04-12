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
    return { title: "🌟 Výborně!", color: "text-slate-400" };
  if (correct >= 10)
    return { title: "👍 Dobrá práce!", color: "text-[#3b82f6]" };
  return { title: "💪 Příště to půjde!", color: "text-emerald-600" };
}

function Confetti({ show }: { show: boolean }) {
  if (!show) return null;
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
    if (contestTyp === "nasobilka") return "nasobilka";
    if (contestTyp === "deleni") return "deleni";
    return "all";
  }, [contestTyp]);

  const ringRef = useRef(new PetiminutovkaRing20());
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
    all: null,
  });
  const [lastFive, setLastFive] = useState<Record<PetiminutovkaTyp, PetiminutovkaZaznam[]>>({
    nasobilka: [],
    deleni: [],
    scitani_odcitani: [],
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
    const t: PetiminutovkaTyp[] = [
      "nasobilka",
      "deleni",
      "scitani_odcitani",
      "all",
    ];
    setRecords({
      nasobilka: getPetiminutovkaRecord("nasobilka"),
      deleni: getPetiminutovkaRecord("deleni"),
      scitani_odcitani: getPetiminutovkaRecord("scitani_odcitani"),
      all: getPetiminutovkaRecord("all"),
    });
    setLastFive({
      nasobilka: getPetiminutovkaLastFive("nasobilka"),
      deleni: getPetiminutovkaLastFive("deleni"),
      scitani_odcitani: getPetiminutovkaLastFive("scitani_odcitani"),
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
    ringRef.current = new PetiminutovkaRing20();
    setWrongLog([]);
    setCorrect(0);
    setWrong(0);
    setPaused(false);
    setPausedLeftMs(null);
    const end = Date.now() + TOTAL_MS;
    setEndsAt(end);
    setTimeLeftMs(TOTAL_MS);
    setPhase("play");
    setFlash(null);
    setWrongNote(null);
    setMotivation(null);
    const mt: PetiminutovkaMixedTyp =
      t === "scitani_odcitani"
        ? "scitani_odcitani"
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
    if (phase !== "play" || paused || endsAt === null) return;
    const endTs = endsAt;
    const id = window.setInterval(() => {
      const left = Math.max(0, endTs - Date.now());
      setTimeLeftMs(left);
      if (left <= 0 && !finishedRef.current) {
        finishedRef.current = true;
        window.clearInterval(id);
        const typ = contestTyp;
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
  }, [phase, paused, endsAt, contestTyp, refreshStorage]);

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
      if (endsAt === null) return;
      const left = Math.max(0, endsAt - Date.now());
      setPausedLeftMs(left);
      setPaused(true);
      setEndsAt(null);
      setTimeLeftMs(left);
    } else {
      const base = pausedLeftMs ?? timeLeftMs;
      setEndsAt(Date.now() + base);
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

  return (
    <div className="relative min-h-full bg-[#ffffff] text-[#1a1a1a]">
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

      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <MathNav />

        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-[#1a1a1a] sm:text-4xl">
            Pětiminutovky ⏱️
          </h1>
          <p className="mt-2 text-lg text-[#6b7280]">
            Jak rychle to dnes zvládneš?
          </p>
        </header>

        {phase === "intro" && (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setContestTyp("nasobilka")}
                className={`rounded-2xl border-2 p-6 text-left shadow-sm transition focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2 ${
                  contestTyp === "nasobilka"
                    ? "border-amber-400 bg-amber-50 ring-2 ring-amber-300"
                    : "border-[#e5e7eb] bg-[#ffffff] hover:border-amber-200"
                }`}
                aria-pressed={contestTyp === "nasobilka"}
              >
                <span className="text-2xl" aria-hidden>
                  🟡
                </span>
                <span className="mt-2 block text-xl font-bold">
                  Násobilka ×
                </span>
                <p className="mt-1 text-sm text-[#6b7280]">
                  Jen násobení — tři varianty doplňování.
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
                className={`rounded-2xl border-2 p-6 text-left shadow-sm transition focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2 ${
                  contestTyp === "deleni"
                    ? "border-orange-400 bg-orange-50 ring-2 ring-orange-300"
                    : "border-[#e5e7eb] bg-[#ffffff] hover:border-orange-200"
                }`}
                aria-pressed={contestTyp === "deleni"}
              >
                <span className="text-2xl" aria-hidden>
                  🟠
                </span>
                <span className="mt-2 block text-xl font-bold">Dělení :</span>
                <p className="mt-1 text-sm text-[#6b7280]">
                  Jen dělení — vždy vyjde celé číslo.
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
                className={`rounded-2xl border-2 p-6 text-left shadow-sm transition focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2 ${
                  contestTyp === "scitani_odcitani"
                    ? "border-sky-400 bg-sky-50 ring-2 ring-sky-300"
                    : "border-[#e5e7eb] bg-[#ffffff] hover:border-sky-200"
                }`}
                aria-pressed={contestTyp === "scitani_odcitani"}
              >
                <span className="text-2xl" aria-hidden>
                  🔵
                </span>
                <span className="mt-2 block text-xl font-bold">
                  Sčítání a odečítání
                </span>
                <p className="mt-1 text-sm text-[#6b7280]">
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
                onClick={() => setContestTyp("all")}
                className={`rounded-2xl border-2 p-6 text-left shadow-sm transition focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2 ${
                  contestTyp === "all"
                    ? "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-300"
                    : "border-[#e5e7eb] bg-[#ffffff] hover:border-emerald-200"
                }`}
                aria-pressed={contestTyp === "all"}
              >
                <span className="text-2xl" aria-hidden>
                  🟢
                </span>
                <span className="mt-2 block text-xl font-bold">
                  Vše dohromady
                </span>
                <p className="mt-1 text-sm text-[#6b7280]">
                  Mix násobilky, dělení a počítání po desítkách.
                </p>
                <p className="mt-3 text-sm font-medium text-[#3b82f6]">
                  Rekord:{" "}
                  {records.all != null ? `${records.all} správně` : "—"}
                </p>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#e5e7eb] shadow-sm">
              <table className="w-full min-w-[640px] text-left text-sm">
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
                className="inline-flex min-h-[56px] min-w-[240px] items-center justify-center rounded-2xl bg-[#3b82f6] px-10 text-lg font-bold text-white shadow-md transition hover:bg-blue-600 focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 animate-bounce"
                aria-label="Spustit pětiminutovky"
              >
                STARTOVAT 🚀
              </button>
            </div>
          </div>
        )}

        {phase === "play" && problem && (
          <div className="space-y-6">
            <div>
              <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
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
                  className={`text-3xl font-bold tabular-nums text-[#1a1a1a] sm:text-4xl ${
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
                  className="rounded-xl border border-[#e5e7eb] bg-[#fafafa] px-4 py-2 text-sm font-medium text-[#1a1a1a] hover:bg-[#f3f4f6] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6]"
                >
                  {paused ? "▶ Pokračovat" : "⏸ Pauza"}
                </button>
              </div>
            </div>

            <div className="relative">
              {paused && (
                <div
                  className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-[#6b7280]/40 backdrop-blur-[1px]"
                  aria-live="polite"
                >
                  <p className="rounded-xl bg-white px-6 py-4 text-lg font-semibold shadow-lg">
                    Pauza — odpočiň si 😊
                  </p>
                </div>
              )}

              <div className="rounded-3xl border border-[#e5e7eb] bg-[#ffffff] p-6 shadow-sm">
                <p className="flex min-h-[3rem] items-center justify-center text-center text-4xl font-bold leading-snug text-[#1a1a1a] sm:text-5xl">
                  {problem.display}
                </p>

                {wrongNote && (
                  <p className="mt-4 text-center text-lg font-semibold text-rose-600">
                    {wrongNote}
                  </p>
                )}

                <div className="mt-6 flex flex-col items-center gap-4">
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
                    className="w-full max-w-md rounded-2xl border-2 border-[#3b82f6] px-4 py-4 text-center text-4xl font-bold text-[#1a1a1a] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] disabled:bg-[#f3f4f6]"
                  />

                  <div className="grid w-full max-w-md grid-cols-3 gap-2 sm:grid-cols-6">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "OK"].map(
                      (k) => (
                        <button
                          key={k}
                          type="button"
                          disabled={paused || blocking}
                          className="min-h-[48px] min-w-[48px] rounded-xl border border-[#e5e7eb] bg-[#fafafa] text-lg font-semibold text-[#1a1a1a] hover:bg-[#f3f4f6] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] disabled:opacity-50"
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
                  className={`mt-6 flex flex-wrap items-center justify-center gap-4 text-lg ${
                    scoreBump ? "animate-bounce" : ""
                  }`}
                >
                  <span className="text-emerald-600">
                    ✅ {correct} správně
                  </span>
                  <span className="text-rose-600">❌ {wrong} špatně</span>
                </div>

                {motivation && (
                  <p className="mt-4 text-center text-lg font-semibold text-[#3b82f6]">
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
              <div className="grid gap-4 sm:grid-cols-2">
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
