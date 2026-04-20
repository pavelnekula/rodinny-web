"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAnglictinaAchievements } from "../AchievementProvider";
import { useGameHighScores } from "../hooks/useGameHighScores";
import { useSpeech } from "../hooks/useSpeech";
import { ConfettiBurst } from "../shared/ConfettiBurst";
import { QuizAnswerGrid } from "../shared/QuizAnswerGrid";
import type { CategoryId, QuizDifficulty, Word } from "../types";
import { VOCABULARY_CATEGORIES } from "../VocabularyData";
import { playSound } from "../utils/gameSoundFx";
import {
  pickQuestionWords,
  buildFourChoices,
  quizDirectionForDifficulty,
  type QuizDirection,
} from "../utils/quizHelpers";
import {
  soloQuizRoundScore,
  streakMultiplier,
  starRatingFromRatio,
} from "../utils/scoring";

const SOLO_TOTAL = 10;

type Phase = "menu" | "soloSetup" | "soloPlay" | "soloEnd";

type Q = {
  word: Word;
  direction: QuizDirection;
  labels: string[];
  correctIndex: number;
};

function buildQuestions(
  pool: Word[],
  difficulty: QuizDifficulty,
  count: number,
): Q[] {
  const words = pickQuestionWords(pool, count);
  const dir = quizDirectionForDifficulty(difficulty);
  return words.map((w) => {
    const { labels, correctIndex } = buildFourChoices(w, pool, dir);
    return { word: w, direction: dir, labels, correctIndex };
  });
}

export function QuizDuelGame({
  mergedWords,
  recordCorrect,
  initialCategory = "all",
}: {
  mergedWords: Word[];
  recordCorrect: (wordId: string) => void;
  /** Z URL (?category=…) z hubu */
  initialCategory?: CategoryId | "all";
}) {
  const { speakSlow, stop } = useSpeech();
  const ach = useAnglictinaAchievements();
  const { getHighScore, saveIfBetter } = useGameHighScores();

  const [phase, setPhase] = useState<Phase>("menu");
  const [soloDiff, setSoloDiff] = useState<QuizDifficulty>("medium");
  const [soloCat, setSoloCat] = useState<CategoryId | "all">(initialCategory);

  const [questions, setQuestions] = useState<Q[]>([]);
  const [idx, setIdx] = useState(0);
  const [soloScore, setSoloScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctN, setCorrectN] = useState(0);
  const [wrongN, setWrongN] = useState(0);
  const [feedback, setFeedback] = useState<"ok" | "bad" | null>(null);
  const [pickedWrong, setPickedWrong] = useState<number | null>(null);
  const [lock, setLock] = useState(false);

  const QUIZ_POINTS_MAX_TIME = 10;
  const streakRef = useRef(0);
  const scoreRef = useRef(0);

  const [showConfetti, setShowConfetti] = useState(false);
  const [newRecord, setNewRecord] = useState(false);

  const poolSolo = useMemo(() => {
    if (soloCat === "all") return mergedWords;
    return mergedWords.filter((w) => w.categoryId === soloCat);
  }, [mergedWords, soloCat]);

  const soloHsKey = useMemo(() => {
    const base = soloCat === "all" ? "mix" : soloCat;
    return `${String(base)}-solo-${soloDiff}`;
  }, [soloCat, soloDiff]);

  const current = questions[idx];

  useEffect(() => {
    streakRef.current = streak;
  }, [streak]);

  useEffect(() => {
    scoreRef.current = soloScore;
  }, [soloScore]);

  const finishSoloRun = useCallback(
    (finalScore: number, correct: number, wrong: number) => {
      const ratio = correct / SOLO_TOTAL;
      const stars = starRatingFromRatio(ratio);
      ach.trackQuizStars(stars);
      const prev = getHighScore("quizDuel", soloHsKey);
      if (finalScore > prev) {
        saveIfBetter("quizDuel", soloHsKey, finalScore);
        setNewRecord(true);
        setShowConfetti(true);
        window.setTimeout(() => setShowConfetti(false), 2500);
      } else {
        setNewRecord(false);
      }
      setSoloScore(finalScore);
      setCorrectN(correct);
      setWrongN(wrong);
      setPhase("soloEnd");
    },
    [ach, getHighScore, saveIfBetter, soloHsKey],
  );

  const startSolo = useCallback(() => {
    if (poolSolo.length < 4) {
      window.alert("Potřebujeme alespoň 4 slovíčka v sadě.");
      return;
    }
    ach.onGameStart("quizDuel");
    ach.trackGameTypePlayed("quizDuel");
    const qs = buildQuestions(poolSolo, soloDiff, SOLO_TOTAL);
    setQuestions(qs);
    setIdx(0);
    setSoloScore(0);
    scoreRef.current = 0;
    setStreak(0);
    streakRef.current = 0;
    setCorrectN(0);
    setWrongN(0);
    setFeedback(null);
    setPickedWrong(null);
    setLock(false);
    setPhase("soloPlay");
    if (soloDiff === "easy" && qs[0]?.direction === "enToCs") {
      window.setTimeout(() => speakSlow(qs[0]!.word.en), 200);
    }
  }, [poolSolo, soloDiff, ach, speakSlow]);

  const handleSoloPick = (i: number) => {
    if (phase !== "soloPlay" || lock || !current) return;
    setLock(true);
    const ok = i === current.correctIndex;
    const correctAfter = correctN + (ok ? 1 : 0);
    const wrongAfter = wrongN + (ok ? 0 : 1);
    if (ok) {
      playSound("correct");
      ach.trackAnswer(true);
      recordCorrect(current.word.id);
      const nextStreak = streakRef.current + 1;
      streakRef.current = nextStreak;
      setStreak(nextStreak);
      const pts = soloQuizRoundScore({
        timeRemainingSec: QUIZ_POINTS_MAX_TIME,
        maxTimeSec: QUIZ_POINTS_MAX_TIME,
        streakAfterCorrect: nextStreak,
      });
      const newScore = scoreRef.current + pts;
      scoreRef.current = newScore;
      setSoloScore(newScore);
      setCorrectN((n) => n + 1);
      setFeedback("ok");
    } else {
      playSound("wrong");
      ach.trackAnswer(false);
      streakRef.current = 0;
      setStreak(0);
      setWrongN((n) => n + 1);
      setFeedback("bad");
      setPickedWrong(i);
    }

    window.setTimeout(() => {
      const nextIdx = idx + 1;

      if (nextIdx >= questions.length) {
        finishSoloRun(scoreRef.current, correctAfter, wrongAfter);
        return;
      }

      setFeedback(null);
      setPickedWrong(null);
      setLock(false);
      stop();
      setIdx(nextIdx);
      if (soloDiff === "easy" && questions[nextIdx]?.direction === "enToCs") {
        window.setTimeout(() => speakSlow(questions[nextIdx]!.word.en), 200);
      }
    }, 1200);
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-amber-50 via-teal-50/80 to-rose-50 py-8">
      <div className="mx-auto w-full max-w-3xl px-4">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/tinuska/anglictina"
            className="rounded-xl border-2 border-[#e5e7eb] bg-app-card px-4 py-2 font-semibold text-[#1a1a1a]"
          >
            ← Zpět do menu
          </Link>
          {phase === "soloPlay" ? (
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-amber-800">
                🔥 ×{streakMultiplier(streak)}
              </span>
              <span className="text-lg font-bold text-app-fg">
                💯 {soloScore}
              </span>
            </div>
          ) : null}
        </div>

        {phase === "menu" ? (
          <div className="rounded-3xl border-2 border-[#e5e7eb] bg-app-card p-8 text-center shadow-sm">
            <h1 className="text-3xl font-extrabold text-[#1a1a1a]">
              ⚡ Kvízový souboj
            </h1>
            <p className="mt-3 text-lg text-[#6b7280]">
              Sólo: 10 otázek, čas, streak a body. Souboj dvou hráčů přidáme
              brzy.
            </p>
            <button
              type="button"
              className="mt-8 min-h-[52px] rounded-2xl border-2 border-[#3b82f6] bg-[#3b82f6] px-8 py-4 text-xl font-bold text-white shadow-md transition hover:opacity-95"
              onClick={() => setPhase("soloSetup")}
            >
              Sólo — začít
            </button>
          </div>
        ) : null}

        {phase === "soloSetup" ? (
          <SoloSetup
            soloCat={soloCat}
            setSoloCat={setSoloCat}
            soloDiff={soloDiff}
            setSoloDiff={setSoloDiff}
            onStart={startSolo}
            onBack={() => setPhase("menu")}
          />
        ) : null}

        {phase === "soloPlay" && current ? (
          <SoloPlay
            current={current}
            feedback={feedback}
            pickedWrong={pickedWrong}
            lock={lock}
            idx={idx}
            total={SOLO_TOTAL}
            onPick={handleSoloPick}
          />
        ) : null}

        {phase === "soloEnd" ? (
          <SoloEnd
            score={soloScore}
            correct={correctN}
            wrong={wrongN}
            hs={getHighScore("quizDuel", soloHsKey)}
            newRecord={newRecord}
            onAgain={() => setPhase("soloSetup")}
            onMenu={() => setPhase("menu")}
          />
        ) : null}
      </div>
      <ConfettiBurst active={showConfetti} />
    </div>
  );
}

function SoloSetup({
  soloCat,
  setSoloCat,
  soloDiff,
  setSoloDiff,
  onStart,
  onBack,
}: {
  soloCat: CategoryId | "all";
  setSoloCat: (c: CategoryId | "all") => void;
  soloDiff: QuizDifficulty;
  setSoloDiff: (d: QuizDifficulty) => void;
  onStart: () => void;
  onBack: () => void;
}) {
  return (
    <div className="rounded-3xl border-2 border-[#e5e7eb] bg-app-card p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-[#1a1a1a]">Sólo — nastavení</h2>
      <p className="mt-2 text-[#6b7280]">10 otázek bez časového limitu.</p>
      <div className="mt-4">
        <p className="font-semibold text-[#1a1a1a]">Kategorie</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-xl border-2 px-3 py-2 text-sm font-semibold ${
              soloCat === "all"
                ? "border-[#3b82f6] bg-sky-50"
                : "border-[#e5e7eb] bg-app-card"
            }`}
            onClick={() => setSoloCat("all")}
          >
            Všechna slovíčka
          </button>
          {VOCABULARY_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`rounded-xl border-2 px-3 py-2 text-sm font-semibold ${
                soloCat === c.id
                  ? "border-[#3b82f6] bg-sky-50"
                  : "border-[#e5e7eb] bg-app-card"
              }`}
              onClick={() => setSoloCat(c.id)}
            >
              {c.tileEmoji} {c.titleCs}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <p className="font-semibold text-[#1a1a1a]">Obtížnost</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {(
            [
              ["easy", "Lehká", "bez limitu, čte se anglicky"],
              ["medium", "Střední", "bez limitu, bez čtení"],
              ["hard", "Těžká", "bez limitu, česky → výběr EN"],
            ] as const
          ).map(([id, t, d]) => (
            <button
              key={id}
              type="button"
              onClick={() => setSoloDiff(id)}
              className={`rounded-2xl border-2 p-4 text-left ${
                soloDiff === id
                  ? "border-[#3b82f6] bg-sky-50"
                  : "border-[#e5e7eb] bg-app-card"
              }`}
            >
              <span className="block font-bold text-[#1a1a1a]">{t}</span>
              <span className="mt-1 block text-sm text-[#6b7280]">{d}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-xl border-2 border-[#e5e7eb] bg-app-card px-6 py-3 font-semibold"
          onClick={onBack}
        >
          Zpět
        </button>
        <button
          type="button"
          className="rounded-xl border-2 border-[#3b82f6] bg-[#3b82f6] px-6 py-3 font-bold text-white"
          onClick={onStart}
        >
          Začít
        </button>
      </div>
    </div>
  );
}

function SoloPlay({
  current,
  feedback,
  pickedWrong,
  lock,
  idx,
  total,
  onPick,
}: {
  current: Q;
  feedback: "ok" | "bad" | null;
  pickedWrong: number | null;
  lock: boolean;
  idx: number;
  total: number;
  onPick: (i: number) => void;
}) {
  const prompt =
    current.direction === "enToCs" ? current.word.en : current.word.cs;
  return (
    <div className="rounded-3xl border-2 border-[#e5e7eb] bg-app-card p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#6b7280]">
            Otázka {idx + 1} / {total}
          </p>
          <p className="mt-4 break-words text-center text-3xl font-extrabold uppercase text-[#1a1a1a] sm:text-5xl">
            {prompt}
          </p>
          <p className="mt-2 text-center text-sm text-[#6b7280]">
            {current.direction === "enToCs"
              ? "Vyber český překlad"
              : "Vyber anglické slovo"}
          </p>
        </div>
      </div>
      <div className="mt-8">
        <QuizAnswerGrid
          labels={current.labels}
          disabled={lock}
          highlightIndex={
            feedback === "ok" || feedback === "bad" ? current.correctIndex : null
          }
          wrongIndex={pickedWrong}
          onPick={onPick}
        />
      </div>
    </div>
  );
}

function SoloEnd({
  score,
  correct,
  wrong,
  hs,
  newRecord,
  onAgain,
  onMenu,
}: {
  score: number;
  correct: number;
  wrong: number;
  hs: number;
  newRecord: boolean;
  onAgain: () => void;
  onMenu: () => void;
}) {
  const ratio = correct / SOLO_TOTAL;
  const stars = starRatingFromRatio(ratio);
  return (
    <div className="rounded-3xl border-2 border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
      <h2 className="text-3xl font-extrabold text-emerald-900">Hotovo!</h2>
      {newRecord ? (
        <p className="mt-2 text-xl font-bold text-amber-700">🏆 Nový rekord!</p>
      ) : null}
      <p className="mt-4 text-5xl font-black tabular-nums text-[#1a1a1a]">
        {score}
      </p>
      <p className="mt-2 text-lg text-emerald-900">
        Správně: {correct} · Špatně: {wrong}
      </p>
      <p className="mt-4 text-4xl" aria-label="Hvězdy">
        {"⭐".repeat(stars)}
      </p>
      <p className="mt-2 text-sm text-[#6b7280]">Rekord: {hs}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          className="rounded-2xl border-2 border-[#3b82f6] bg-[#3b82f6] px-6 py-3 font-bold text-white"
          onClick={onAgain}
        >
          Hrát znovu
        </button>
        <button
          type="button"
          className="rounded-2xl border-2 border-[#e5e7eb] bg-app-card px-6 py-3 font-bold text-[#1a1a1a]"
          onClick={onMenu}
        >
          Zpět do menu
        </button>
      </div>
    </div>
  );
}
