"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAnglictinaAchievements } from "../AchievementProvider";
import { useGameHighScores } from "../hooks/useGameHighScores";
import { CircularTimer } from "../shared/CircularTimer";
import { QuizAnswerGrid } from "../shared/QuizAnswerGrid";
import { SpinWheel, type WheelSlice } from "../shared/SpinWheel";
import type { CategoryId, Word } from "../types";
import { VOCABULARY_CATEGORIES } from "../VocabularyData";
import { playSound } from "../utils/gameSoundFx";
import {
  buildFourChoices,
  pickQuestionWords,
  quizDirectionForDifficulty,
} from "../utils/quizHelpers";
import { useSpeech } from "../hooks/useSpeech";

const SPINS = 12;
const Q_TIME = 12;

const WHEEL_COLORS: Record<string, string> = {
  colors: "#ef4444",
  furniture: "#92400e",
  toys: "#eab308",
  body: "#22c55e",
  food: "#f97316",
  numbers: "#3b82f6",
  school: "#0ea5e9",
  toBe: "#a855f7",
  toHave: "#94a3b8",
};

function buildSlices(): WheelSlice[] {
  const cats = VOCABULARY_CATEGORIES.map((c) => ({
    id: `cat-${c.id}`,
    label: c.titleCs.split(" ")[0] ?? c.titleCs,
    emoji: c.tileEmoji,
    color: WHEEL_COLORS[c.id] ?? "#64748b",
    categoryId: c.id as CategoryId,
    kind: "category" as const,
  }));
  return [
    ...cats,
    {
      id: "bonus2",
      label: "Bonus×2",
      emoji: "⭐",
      color: "#fbbf24",
      kind: "bonus2",
    },
    {
      id: "mystery",
      label: "Mystery",
      emoji: "🎁",
      color: "#06b6d4",
      kind: "mystery",
    },
  ];
}

export function LuckyWheelGame({ mergedWords }: { mergedWords: Word[] }) {
  const ach = useAnglictinaAchievements();
  const { speakSlow } = useSpeech();
  const { getHighScore, saveIfBetter } = useGameHighScores();

  const slices = useMemo(() => buildSlices(), []);
  const step = 360 / slices.length;

  const [spin, setSpin] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [activeSlice, setActiveSlice] = useState<WheelSlice | null>(null);
  const [phase, setPhase] = useState<"idle" | "q" | "end">("idle");
  const [score, setScore] = useState(0);
  const [mult, setMult] = useState(1);
  const [bonus2Next, setBonus2Next] = useState(false);
  const [word, setWord] = useState<Word | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [remain, setRemain] = useState(Q_TIME);
  const [lock, setLock] = useState(false);
  const [feedback, setFeedback] = useState<"ok" | "bad" | null>(null);
  const [wrongI, setWrongI] = useState<number | null>(null);
  const [bonus2CountGame, setBonus2CountGame] = useState(0);

  const startQuestionForCategory = useCallback(
    (cat: CategoryId | "mystery") => {
      const pool =
        cat === "mystery"
          ? mergedWords
          : mergedWords.filter((w) => w.categoryId === cat);
      if (pool.length < 4) {
        window.alert("V této kategorii není dost slovíček.");
        setPhase("idle");
        return;
      }
      const w = pickQuestionWords(pool, 1)[0]!;
      const dir = quizDirectionForDifficulty("medium");
      const { labels: L, correctIndex: ci } = buildFourChoices(
        w,
        pool,
        dir,
      );
      setWord(w);
      setLabels(L);
      setCorrectIndex(ci);
      setRemain(Q_TIME);
      setLock(false);
      setFeedback(null);
      setWrongI(null);
      setPhase("q");
    },
    [mergedWords],
  );

  useEffect(() => {
    if (phase !== "q" || lock) return;
    const id = window.setInterval(() => {
      setRemain((r) => (r <= 0 ? 0 : Math.max(0, Math.round((r - 0.1) * 10) / 10)));
    }, 100);
    return () => window.clearInterval(id);
  }, [phase, lock]);

  useEffect(() => {
    if (phase !== "q" || lock || !word) return;
    if (remain > 0) return;
    setLock(true);
    playSound("wrong");
    ach.trackAnswer(false);
    setFeedback("bad");
    setWrongI(null);
    setMult(1);
    window.setTimeout(() => {
      setPhase("idle");
      setWord(null);
      setSpin((s) => {
        const ns = s + 1;
        if (ns >= SPINS) setPhase("end");
        return ns;
      });
    }, 900);
  }, [remain, phase, lock, word, ach]);

  const onSpin = () => {
    if (spinning || spin >= SPINS || phase === "q") return;
    ach.onGameStart("luckyWheel");
    ach.trackGameTypePlayed("luckyWheel");
    setSpinning(true);
    playSound("click");
    const idx = Math.floor(Math.random() * slices.length);
    const slice = slices[idx]!;
    const extra = 4 + Math.random() * 2;
    const target = extra * 360 + (360 - idx * step - step / 2);
    setRotation((r) => r + target);
    window.setTimeout(() => {
      setSpinning(false);
      setActiveSlice(slice);
      if (slice.kind === "bonus2") {
        setBonus2Next(true);
        setMult(2);
        setBonus2CountGame((c) => {
          const n = c + 1;
          ach.trackWheelBonus2xInGame(n);
          return n;
        });
        playSound("complete");
        window.setTimeout(() => {
          setSpin((s) => {
            const ns = s + 1;
            if (ns >= SPINS) setPhase("end");
            else setPhase("idle");
            return ns;
          });
          setActiveSlice(null);
        }, 900);
        return;
      }
      if (slice.kind === "mystery") {
        ach.trackWheelMystery();
        setMult(3);
        startQuestionForCategory("mystery");
        return;
      }
      if (slice.categoryId) {
        if (bonus2Next) setMult(2);
        else setMult(1);
        setBonus2Next(false);
        startQuestionForCategory(slice.categoryId);
      }
    }, 4100);
  };

  const onPick = (i: number) => {
    if (!word || lock) return;
    setLock(true);
    const ok = i === correctIndex;
    const base = 100 + Math.round(remain * 5);
    const pts = ok ? base * mult : 0;
    if (ok) {
      playSound("correct");
      ach.trackAnswer(true);
      setFeedback("ok");
    } else {
      playSound("wrong");
      ach.trackAnswer(false);
      setFeedback("bad");
      setWrongI(i);
    }
    setMult(1);
    setBonus2Next(false);
    window.setTimeout(() => {
      setActiveSlice(null);
      setWord(null);
      setScore((sc) => {
        const nsScore = ok ? sc + pts : sc;
        setSpin((sp) => {
          const nsp = sp + 1;
          if (nsp >= SPINS) {
            const prev = getHighScore("luckyWheel", "mix");
            if (nsScore > prev) saveIfBetter("luckyWheel", "mix", nsScore);
            setPhase("end");
          } else {
            setPhase("idle");
          }
          return nsp;
        });
        return nsScore;
      });
    }, 900);
  };

  if (phase === "end") {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 text-center">
        <h2 className="text-3xl font-extrabold text-[#1a1a1a]">Konec kola!</h2>
        <p className="mt-4 text-2xl font-bold text-[#3b82f6]">{score} bodů</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            className="rounded-2xl border-2 border-[#3b82f6] bg-[#3b82f6] px-6 py-3 font-bold text-white"
            onClick={() => {
              setSpin(0);
              setScore(0);
              setPhase("idle");
              setRotation(0);
              setBonus2CountGame(0);
            }}
          >
            Točit znovu
          </button>
          <Link
            href="/tinuska/anglictina"
            className="rounded-2xl border-2 border-[#e5e7eb] bg-white px-6 py-3 font-bold text-[#1a1a1a]"
          >
            Zpět
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-amber-50 via-teal-50/80 to-rose-50 py-8">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/tinuska/anglictina"
            className="rounded-xl border-2 border-[#e5e7eb] bg-white px-4 py-2 font-semibold"
          >
            ← Zpět
          </Link>
          <p className="text-lg font-bold text-slate-800">
            💯 {score} · Otočení {Math.min(spin, SPINS)} / {SPINS}
          </p>
        </div>

        <SpinWheel
          slices={slices}
          rotationDeg={rotation}
          spinning={spinning}
          onSpinClick={onSpin}
        />

        {activeSlice && phase === "idle" ? (
          <p className="mt-4 text-center text-lg font-semibold text-[#1a1a1a]">
            Výsledek: {activeSlice.emoji} {activeSlice.label}
          </p>
        ) : null}

        {phase === "q" && word ? (
          <div className="mt-8 rounded-3xl border-2 border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-2xl font-extrabold text-[#1a1a1a]">
                  {word.en}
                </p>
                <p className="mt-2 text-sm text-[#6b7280]">
                  Vyber český překlad
                </p>
              </div>
              <div className="flex flex-col items-center">
                <CircularTimer progress={remain / Q_TIME} size={56} />
                <button
                  type="button"
                  className="mt-2 text-2xl"
                  aria-label="Přehrát slovo"
                  onClick={() => speakSlow(word.en)}
                >
                  🔊
                </button>
              </div>
            </div>
            <div className="mt-6">
              <QuizAnswerGrid
                labels={labels}
                disabled={lock}
                highlightIndex={
                  feedback ? correctIndex : null
                }
                wrongIndex={wrongI}
                onPick={onPick}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
