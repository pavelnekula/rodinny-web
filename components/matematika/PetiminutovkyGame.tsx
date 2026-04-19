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
  type PetiminutovkaHistoryChyba,
  type PetiminutovkaTyp,
  finalizePetiminutovkaRound,
  getPetiminutovkaRekord,
} from "@/lib/mathStorage";
import { MathNav } from "./MathNav";

const COUNT = 20;
const LEGACY_CAS_SENTINEL = 999_999;

type Phase = "intro" | "play";

type TypeCardDef = {
  typ: PetiminutovkaTyp;
  emoji: string;
  title: string;
  shortTitle: string;
  desc: string;
  accent: string;
};

const TYPE_CARDS: TypeCardDef[] = [
  {
    typ: "nasobilka",
    emoji: "🟡",
    title: "Násobilka ×",
    shortTitle: "Násobilka ×",
    desc: "Dopočítej výsledek.",
    accent: "#ffcc00",
  },
  {
    typ: "deleni",
    emoji: "🟠",
    title: "Dělení :",
    shortTitle: "Dělení :",
    desc: "Dopočítej výsledek.",
    accent: "#ff9f0a",
  },
  {
    typ: "scitani_odcitani_do100",
    emoji: "🔵",
    title: "Sčítání a odečítání do 100",
    shortTitle: "± do 100",
    desc: "Součty a rozdíly do 100.",
    accent: "#0a84ff",
  },
  {
    typ: "chybejici_cislo",
    emoji: "🟣",
    title: "Chybějící číslo",
    shortTitle: "Chybějící číslo",
    desc: "Doplň chybějící člen.",
    accent: "#bf5af2",
  },
  {
    typ: "scitani_odcitani",
    emoji: "🩶",
    title: "Sčítání a odečítání po 10 do 1000",
    shortTitle: "± po 10 do 1000",
    desc: "Po desítkách do 1000.",
    accent: "#98989d",
  },
  {
    typ: "all",
    emoji: "🟢",
    title: "Vše dohromady",
    shortTitle: "Mix",
    desc: "Náhodný mix všech typů.",
    accent: "#30d158",
  },
];

function typToMixed(t: PetiminutovkaTyp): PetiminutovkaMixedTyp {
  if (t === "scitani_odcitani") return "scitani_odcitani";
  if (t === "scitani_odcitani_do100") return "scitani_odcitani_do100";
  if (t === "chybejici_cislo") return "chybejici_cislo";
  if (t === "nasobilka") return "nasobilka";
  if (t === "deleni") return "deleni";
  return "all";
}

function generateUniqueSet(mt: PetiminutovkaMixedTyp): MathExample[] {
  const ring = new PetiminutovkaRing20();
  const out: MathExample[] = [];
  for (let i = 0; i < COUNT; i++) {
    out.push(generateMixed(mt, ring));
  }
  return out;
}

function formatMmSs(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

function splitDisplay(display: string): { before: string; after: string } {
  const parts = display.split("___");
  if (parts.length !== 2) {
    return { before: display, after: "" };
  }
  return { before: parts[0]!, after: parts[1]! };
}

function newRunId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `run-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function scoreMessage(spravne: number): string {
  if (spravne === 20) return "🏆 Perfektní výsledek!";
  if (spravne >= 15) return "🌟 Výborně!";
  if (spravne >= 10) return "👍 Dobrá práce!";
  return "💪 Příště to půjde!";
}

function rekordLine(prev: { cas: number; spravne: number } | null): string {
  if (!prev) return "Zatím žádný uložený rekord.";
  if (prev.cas >= LEGACY_CAS_SENTINEL) {
    return `Nejlepší dosud: ${prev.spravne}/${COUNT} správně`;
  }
  return `Rekord: ${formatMmSs(prev.cas)} · ${prev.spravne}/${COUNT} správně`;
}

function comparisonLine(
  spravne: number,
  cas: number,
  prev: { cas: number; spravne: number } | null,
): string {
  if (!prev || prev.cas >= LEGACY_CAS_SENTINEL) {
    if (spravne === 20) return "Paráda — plný počet správně!";
    return "Zkus to znovu — čas se počítá u každého kola.";
  }
  if (spravne === 20 && prev.spravne === 20) {
    if (cas < prev.cas) {
      const d = prev.cas - cas;
      return `Nejlepší čas byl ${formatMmSs(prev.cas)} — překonáváš ho o ${d}s!`;
    }
    if (cas > prev.cas) {
      return `Tvůj rekord je ${formatMmSs(prev.cas)} — dnes ${formatMmSs(cas)}.`;
    }
    return `Stejně rychle jako rekord — ${formatMmSs(prev.cas)}.`;
  }
  if (spravne === 20 && prev.spravne < 20) {
    return `První kolo bez chyby — ${formatMmSs(cas)}.`;
  }
  if (spravne < 20 && prev.spravne === 20) {
    return `Rekord zůstává ${formatMmSs(prev.cas)} (20/20) — dnes ${spravne}/${COUNT} za ${formatMmSs(cas)}.`;
  }
  if (
    spravne > prev.spravne ||
    (spravne === prev.spravne && cas < prev.cas)
  ) {
    return `Lepší než uložený rekord (${prev.spravne}/${COUNT}, ${formatMmSs(prev.cas)}).`;
  }
  return `Uložený rekord: ${prev.spravne}/${COUNT} za ${formatMmSs(prev.cas)}.`;
}

export function PetiminutovkyGame() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [selectedTyp, setSelectedTyp] = useState<PetiminutovkaTyp | null>(null);
  const [playTyp, setPlayTyp] = useState<PetiminutovkaTyp | null>(null);
  const [problems, setProblems] = useState<MathExample[]>([]);
  const [answers, setAnswers] = useState<string[]>(() =>
    Array.from({ length: COUNT }, () => ""),
  );
  const [elapsedSec, setElapsedSec] = useState(0);
  const [graded, setGraded] = useState(false);
  const [spravneCount, setSpravneCount] = useState(0);
  const [spatneCount, setSpatneCount] = useState(0);
  const [resultsPerIndex, setResultsPerIndex] = useState<
    ("ok" | "bad" | null)[]
  >(() => Array.from({ length: COUNT }, () => null));
  const [rekordSnapshot, setRekordSnapshot] = useState<{
    cas: number;
    spravne: number;
  } | null>(null);
  const [introRekordy, setIntroRekordy] = useState<
    Partial<Record<PetiminutovkaTyp, { cas: number; spravne: number }>>
  >({});

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const elapsedRef = useRef(0);
  const timerActiveRef = useRef(false);

  const mixedTyp = useMemo((): PetiminutovkaMixedTyp | null => {
    if (!playTyp) return null;
    return typToMixed(playTyp);
  }, [playTyp]);

  const accentForPlay = useMemo(() => {
    const c = TYPE_CARDS.find((x) => x.typ === playTyp);
    return c?.accent ?? "#0a84ff";
  }, [playTyp]);

  useEffect(() => {
    const next: Partial<
      Record<PetiminutovkaTyp, { cas: number; spravne: number }>
    > = {};
    for (const row of TYPE_CARDS) {
      next[row.typ] = getPetiminutovkaRekord(row.typ) ?? undefined;
    }
    setIntroRekordy(next);
  }, [phase]);

  useEffect(() => {
    if (phase !== "play" || graded || !mixedTyp) return;
    timerActiveRef.current = true;
    elapsedRef.current = 0;
    setElapsedSec(0);
    const id = window.setInterval(() => {
      if (!timerActiveRef.current) return;
      elapsedRef.current += 1;
      setElapsedSec(elapsedRef.current);
    }, 1000);
    return () => {
      window.clearInterval(id);
      timerActiveRef.current = false;
    };
  }, [phase, graded, mixedTyp, problems]);

  const filledCount = useMemo(
    () => answers.filter((a) => a.trim() !== "").length,
    [answers],
  );

  const startRound = (t: PetiminutovkaTyp) => {
    const mt = typToMixed(t);
    const set = generateUniqueSet(mt);
    setPlayTyp(t);
    setProblems(set);
    setAnswers(Array.from({ length: COUNT }, () => ""));
    setResultsPerIndex(Array.from({ length: COUNT }, () => null));
    setGraded(false);
    setSpravneCount(0);
    setSpatneCount(0);
    setElapsedSec(0);
    elapsedRef.current = 0;
    setPhase("play");
    queueMicrotask(() => {
      inputRefs.current[0]?.focus();
    });
  };

  const focusAt = (i: number) => {
    const el = inputRefs.current[i];
    if (el) {
      el.focus();
      el.select();
    }
  };

  const goNextField = (fromIndex: number) => {
    const next = (fromIndex + 1) % COUNT;
    focusAt(next);
  };

  const onAnswerKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (graded) return;
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      goNextField(index);
    }
  };

  const setAnswerAt = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = digits;
      return next;
    });
  };

  const evaluate = useCallback(() => {
    if (!playTyp || graded || problems.length !== COUNT) return;
    timerActiveRef.current = false;
    const finalSec = elapsedRef.current;
    const prev = getPetiminutovkaRekord(playTyp);
    setRekordSnapshot(prev);

    const per: ("ok" | "bad")[] = [];
    const chyby: PetiminutovkaHistoryChyba[] = [];
    let spravne = 0;
    let spatne = 0;

    for (let i = 0; i < COUNT; i++) {
      const ex = problems[i]!;
      const raw = answers[i]?.trim() ?? "";
      if (raw === "") {
        per[i] = "bad";
        spatne += 1;
        chyby.push({
          priklad: ex.display,
          odpoved: null,
          spravne: ex.answer,
          category: ex.category,
          missingPosition: ex.missingPosition,
        });
        continue;
      }
      const n = Number(raw);
      if (!Number.isFinite(n) || n !== ex.answer) {
        per[i] = "bad";
        spatne += 1;
        chyby.push({
          priklad: ex.display,
          odpoved: Number.isFinite(n) ? n : null,
          spravne: ex.answer,
          category: ex.category,
          missingPosition: ex.missingPosition,
        });
      } else {
        per[i] = "ok";
        spravne += 1;
      }
    }

    setResultsPerIndex(per);
    setSpravneCount(spravne);
    setSpatneCount(spatne);
    setGraded(true);

    finalizePetiminutovkaRound({
      id: newRunId(),
      datum: new Date().toISOString(),
      typ: playTyp,
      cas_sekundy: finalSec,
      celkem: 20,
      spravne,
      spatne,
      chyby,
    });
  }, [playTyp, graded, problems, answers]);

  const newExamplesSameTyp = () => {
    if (!playTyp) return;
    const mt = typToMixed(playTyp);
    setProblems(generateUniqueSet(mt));
    setAnswers(Array.from({ length: COUNT }, () => ""));
    setResultsPerIndex(Array.from({ length: COUNT }, () => null));
    setGraded(false);
    setSpravneCount(0);
    setSpatneCount(0);
    setElapsedSec(0);
    elapsedRef.current = 0;
    queueMicrotask(() => inputRefs.current[0]?.focus());
  };

  const backToIntro = () => {
    timerActiveRef.current = false;
    setPhase("intro");
    setPlayTyp(null);
    setProblems([]);
    setSelectedTyp(null);
    setGraded(false);
  };

  const topOffset =
    "calc(3.5rem + env(safe-area-inset-top, 0px) + 0.25rem)" as const;

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-app-bg text-app-fg">
      <div className="mx-auto w-full max-w-[800px] flex-1 px-3 pb-40 pt-2 sm:px-4 md:px-6">
        <div className="mb-4">
          <MathNav />
        </div>

        {phase === "intro" && (
          <>
            <header className="mb-8 text-center">
              <h1 className="app-title-gradient text-3xl font-bold tracking-tight sm:text-4xl">
                Pětiminutovky
              </h1>
              <p className="mt-2 text-lg text-app-muted">
                20 příkladů, vlastním tempem
              </p>
            </header>

            <div className="mb-8 grid gap-3 sm:grid-cols-2">
              {TYPE_CARDS.map((c) => {
                const rek = introRekordy[c.typ];
                const selected = selectedTyp === c.typ;
                return (
                  <button
                    key={c.typ}
                    type="button"
                    onClick={() => setSelectedTyp(c.typ)}
                    className={`app-card text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg ${
                      selected
                        ? "border-app-accent ring-2 ring-app-accent ring-offset-2 ring-offset-app-bg"
                        : "hover:border-app-border-hover"
                    }`}
                    style={
                      selected
                        ? { borderColor: `${c.accent}99` }
                        : undefined
                    }
                    aria-pressed={selected}
                  >
                    <div className="p-5 sm:p-6">
                      <span className="text-2xl" aria-hidden>
                        {c.emoji}
                      </span>
                      <span className="mt-2 block text-lg font-bold sm:text-xl">
                        {c.title}
                      </span>
                      <p className="mt-1 text-sm text-app-muted">{c.desc}</p>
                      <p className="mt-3 text-xs text-app-subtle">
                        {rekordLine(rek ?? null)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center pb-8">
              <button
                type="button"
                disabled={!selectedTyp}
                onClick={() => selectedTyp && startRound(selectedTyp)}
                className="app-btn-pill app-btn-primary min-h-[52px] min-w-[200px] px-10 text-lg font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg disabled:cursor-not-allowed disabled:opacity-45"
                aria-label="Začít pětiminutovky"
              >
                ZAČÍT
              </button>
            </div>
          </>
        )}

        {phase === "play" && playTyp && problems.length === COUNT && (
          <>
            <div
              className="fixed right-0 left-0 z-40 border-b border-app-nav-border bg-app-nav-bg/95 px-3 py-2 backdrop-blur-md sm:px-4"
              style={{
                top: topOffset,
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <div className="mx-auto flex max-w-[800px] items-center justify-between gap-2 text-sm sm:text-base">
                <span
                  className="min-w-0 shrink truncate font-medium text-app-fg"
                  style={{ maxWidth: "38%" }}
                >
                  {
                    TYPE_CARDS.find((t) => t.typ === playTyp)?.shortTitle
                  }
                </span>
                <span className="shrink-0 text-app-muted tabular-nums">
                  {filledCount} / {COUNT} vyplněno
                </span>
                <span className="shrink-0 tabular-nums text-app-subtle">
                  {formatMmSs(elapsedSec)}
                </span>
              </div>
            </div>

            <div
              style={{
                paddingTop:
                  "calc(3.5rem + env(safe-area-inset-top, 0px) + 3.25rem)",
              }}
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {problems.map((ex, i) => {
                  const { before, after } = splitDisplay(ex.display);
                  const res = resultsPerIndex[i];
                  const val = answers[i] ?? "";
                  const hasVal = val.trim() !== "";
                  const pulseEmpty =
                    !graded &&
                    filledCount > 0 &&
                    filledCount < COUNT &&
                    !hasVal;

                  let cardBg = "bg-app-card";
                  let borderRing = "border-app-border";
                  if (graded && res === "ok") {
                    cardBg = "bg-[rgba(48,209,88,0.15)]";
                    borderRing = "border-[rgba(48,209,88,0.55)]";
                  } else if (graded && res === "bad") {
                    cardBg = "bg-[rgba(255,69,58,0.10)]";
                    borderRing = "border-[rgba(255,69,58,0.45)]";
                  }

                  return (
                    <div
                      key={`${i}-${ex.display}-${ex.answer}`}
                      className={`relative rounded-2xl border p-4 sm:p-5 ${cardBg} ${borderRing}`}
                    >
                      <span className="absolute left-3 top-3 text-xs text-app-subtle sm:left-4 sm:top-4">
                        {i + 1}
                      </span>
                      <div className="mt-5 flex flex-wrap items-center gap-x-1 gap-y-2 text-[min(22px,5.5vw)] font-bold leading-tight sm:text-2xl">
                        <span className="tabular-nums">{before}</span>
                        <input
                          ref={(el) => {
                            inputRefs.current[i] = el;
                          }}
                          type="number"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          tabIndex={i + 1}
                          disabled={graded}
                          value={val}
                          onChange={(e) => setAnswerAt(i, e.target.value)}
                          onKeyDown={(e) => onAnswerKeyDown(e, i)}
                          aria-label={`Odpověď příkladu ${i + 1}`}
                          className={`petiminutovky-num-input h-12 w-[88px] min-h-[48px] border-0 border-b-2 border-app-input-border bg-app-input text-center text-[min(22px,5.5vw)] font-bold text-app-fg outline-none transition sm:h-14 sm:w-20 sm:text-2xl ${
                            pulseEmpty ? "animate-pulse" : ""
                          } rounded-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg disabled:opacity-90`}
                          style={{
                            borderBottomColor:
                              hasVal && !graded ? accentForPlay : undefined,
                            color: "var(--app-fg)",
                          }}
                        />
                        <span className="tabular-nums">{after}</span>
                        {graded && res === "ok" && (
                          <span
                            className="ml-1 text-emerald-400"
                            aria-hidden
                          >
                            ✓
                          </span>
                        )}
                      </div>
                      {graded && res === "bad" && (
                        <p className="mt-2 text-sm text-app-muted">
                          Správně:{" "}
                          <span className="font-semibold text-app-fg tabular-nums">
                            {ex.answer}
                          </span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {phase === "play" && playTyp && (
        <div
          className="fixed right-0 bottom-0 left-0 z-40 border-t border-app-nav-border px-3 py-3 backdrop-blur-md sm:px-4"
          style={{
            paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
            background: graded ? "rgba(0,0,0,0.92)" : "rgba(0,0,0,0.9)",
            WebkitBackdropFilter: "blur(12px)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="mx-auto max-w-[800px]">
            {!graded ? (
              <button
                type="button"
                disabled={filledCount < 1}
                onClick={evaluate}
                className="app-btn-pill flex min-h-[52px] w-full items-center justify-center gap-2 text-base font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-40 sm:text-lg"
                style={{
                  backgroundColor:
                    filledCount >= 1 ? accentForPlay : "rgba(255,255,255,0.12)",
                  color: filledCount >= 1 ? "#fff" : "rgba(255,255,255,0.45)",
                }}
                aria-label="Zkontrolovat výsledky"
              >
                Zkontrolovat výsledky →
              </button>
            ) : (
              <div className="space-y-3 text-app-fg">
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm sm:text-base">
                  <span className="tabular-nums">
                    ✅ {spravneCount} správně
                  </span>
                  <span className="tabular-nums">
                    ❌ {spatneCount} špatně
                  </span>
                  <span className="tabular-nums text-app-muted">
                    ⏱ {formatMmSs(elapsedSec)}
                  </span>
                </div>
                <p className="text-center text-base font-semibold">
                  {scoreMessage(spravneCount)}
                </p>
                <p className="text-center text-sm text-app-muted">
                  {comparisonLine(
                    spravneCount,
                    elapsedSec,
                    rekordSnapshot,
                  )}
                </p>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
                  <button
                    type="button"
                    onClick={newExamplesSameTyp}
                    className="app-btn-pill app-btn-secondary min-h-[48px] flex-1 px-4 py-2 text-sm font-semibold sm:flex-none sm:px-6"
                  >
                    🔄 Nové příklady
                  </button>
                  <Link
                    href="/matematika/petiminutovky/statistiky"
                    className="app-btn-pill app-btn-secondary inline-flex min-h-[48px] flex-1 items-center justify-center px-4 py-2 text-center text-sm font-semibold sm:flex-none sm:px-6"
                  >
                    📊 Statistiky
                  </Link>
                  <Link
                    href="/matematika"
                    className="app-btn-pill inline-flex min-h-[48px] flex-1 items-center justify-center border border-app-border bg-app-card px-4 py-2 text-sm font-semibold sm:flex-none sm:px-6"
                  >
                    🏠 Zpět
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={backToIntro}
                  className="w-full text-center text-sm text-app-subtle underline-offset-2 hover:text-app-muted hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
                >
                  Změnit typ úloh
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
