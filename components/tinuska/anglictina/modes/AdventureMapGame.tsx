"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAnglictinaAchievements } from "../AchievementProvider";
import { QuizAnswerGrid } from "../shared/QuizAnswerGrid";
import type { CategoryId, Word } from "../types";
import { VOCABULARY_CATEGORIES } from "../VocabularyData";
import { playSound } from "../utils/gameSoundFx";
import {
  buildFourChoices,
  pickQuestionWords,
  quizDirectionForDifficulty,
} from "../utils/quizHelpers";
import {
  loadAdventure,
  saveAdventure,
  type AdventureRow,
} from "../utils/adventureStorage";

const STEPS = 20;
export function AdventureMapGame({
  mergedWords,
  initialCategoryId = null,
}: {
  mergedWords: Word[];
  initialCategoryId?: CategoryId | null;
}) {
  const ach = useAnglictinaAchievements();
  const [cat, setCat] = useState<CategoryId | null>(initialCategoryId);
  const [store, setStore] = useState<Record<string, AdventureRow>>({});
  const [avatar, setAvatar] = useState(ach.avatar);
  const [word, setWord] = useState<Word | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [feedback, setFeedback] = useState<"ok" | "bad" | null>(null);
  const [wrongI, setWrongI] = useState<number | null>(null);
  const [lock, setLock] = useState(false);

  useEffect(() => {
    setStore(loadAdventure());
  }, []);

  const step = cat ? (store[cat]?.step ?? 0) : 0;

  const pool = useMemo(() => {
    if (!cat) return [];
    return mergedWords.filter((w) => w.categoryId === cat);
  }, [mergedWords, cat]);

  const pickWord = useCallback(() => {
    if (pool.length < 4) return;
    const w = pickQuestionWords(pool, 1)[0]!;
    const dir = quizDirectionForDifficulty("medium");
    const { labels: L, correctIndex: ci } = buildFourChoices(w, pool, dir);
    setWord(w);
    setLabels(L);
    setCorrectIndex(ci);
    setFeedback(null);
    setWrongI(null);
    setLock(false);
  }, [pool]);

  const onChooseCat = (id: CategoryId) => {
    setCat(id);
    ach.onGameStart("adventureMap");
    ach.trackGameTypePlayed("adventureMap");
    setStore(loadAdventure());
  };

  const didTrackInitial = useRef(false);
  useEffect(() => {
    if (didTrackInitial.current || !initialCategoryId) return;
    didTrackInitial.current = true;
    ach.onGameStart("adventureMap");
    ach.trackGameTypePlayed("adventureMap");
    setStore(loadAdventure());
  }, [initialCategoryId, ach]);

  const onPick = (i: number) => {
    if (!cat || !word || lock) return;
    setLock(true);
    const ok = i === correctIndex;
    if (ok) {
      playSound("correct");
      ach.trackAnswer(true);
      setFeedback("ok");
      const nextStep = Math.min(STEPS, step + 1);
      const row: AdventureRow = { step: nextStep, avatar };
      const all = { ...store, [cat]: row };
      setStore(all);
      saveAdventure(cat, row, all);
      if (nextStep >= STEPS) {
        ach.trackMountainComplete(cat);
        playSound("fanfare");
      }
    } else {
      playSound("wrong");
      ach.trackAnswer(false);
      setFeedback("bad");
      setWrongI(i);
    }
    window.setTimeout(() => {
      setWord(null);
      if (ok && step + 1 >= STEPS) {
        /* done */
      } else if (ok) {
        pickWord();
      } else {
        pickWord();
      }
    }, 900);
  };

  useEffect(() => {
    if (cat && pool.length >= 4 && !word && step < STEPS) pickWord();
  }, [cat, pool, word, step, pickWord]);

  if (!cat) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link
          href="/tinuska/anglictina"
          className="rounded-xl border-2 border-[#e5e7eb] bg-white px-4 py-2 font-semibold"
        >
          ← Zpět
        </Link>
        <h1 className="mt-6 text-3xl font-extrabold text-[#1a1a1a]">
          🗺️ Mapa dobrodružství
        </h1>
        <p className="mt-2 text-[#6b7280]">
          Vyber horu (kategorii). Každá správná odpověď = krok nahoru. Cíl:{" "}
          {STEPS}. kroků.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {VOCABULARY_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onChooseCat(c.id)}
              className="rounded-2xl border-2 border-[#e5e7eb] bg-white p-4 text-left shadow-sm transition hover:border-[#3b82f6]"
            >
              <span className="text-3xl" aria-hidden>
                {c.tileEmoji}
              </span>
              <span className="mt-2 block font-bold text-[#1a1a1a]">
                {c.titleCs}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step >= STEPS) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <p className="text-5xl" aria-hidden>
          🏔️
        </p>
        <h2 className="mt-4 text-3xl font-extrabold text-emerald-800">
          Zdolal/a jsi horu!
        </h2>
        <p className="mt-2 text-lg text-[#6b7280]">
          Kategorie:{" "}
          {VOCABULARY_CATEGORIES.find((x) => x.id === cat)?.titleCs ?? ""}
        </p>
        <Link
          href="/tinuska/anglictina"
          className="mt-8 inline-block rounded-2xl border-2 border-[#3b82f6] bg-[#3b82f6] px-6 py-3 font-bold text-white"
        >
          Zpět do menu her
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-emerald-50 via-white to-sky-50 py-8">
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/tinuska/anglictina/mapa-dobrodruzstvi"
            className="rounded-xl border-2 border-[#e5e7eb] bg-white px-4 py-2 font-semibold"
          >
            ← Zpět
          </Link>
          <p className="text-lg font-bold text-[#1a1a1a]">
            Krok {step} / {STEPS} · {ach.avatar}
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-2">
          {Array.from({ length: STEPS }).map((_, i) => {
            const n = STEPS - i;
            const done = step >= n;
            return (
              <div
                key={n}
                className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 ${
                  done
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-[#e5e7eb] bg-white"
                }`}
              >
                <span className="font-mono text-lg font-bold text-[#6b7280]">
                  {n}
                </span>
                {n === STEPS ? (
                  <span className="font-bold text-emerald-800">🏔️ Vrchol</span>
                ) : (
                  <span className="text-[#1a1a1a]">Zastávka</span>
                )}
                {done ? <span className="ml-auto text-emerald-700">✓</span> : null}
              </div>
            );
          })}
        </div>

        {word ? (
          <div className="mt-8 rounded-3xl border-2 border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-center text-3xl font-extrabold uppercase text-[#1a1a1a]">
              {word.en}
            </p>
            <p className="mt-2 text-center text-sm text-[#6b7280]">
              Vyber český překlad
            </p>
            <div className="mt-6">
              <QuizAnswerGrid
                labels={labels}
                disabled={lock}
                highlightIndex={feedback ? correctIndex : null}
                wrongIndex={wrongI}
                onPick={onPick}
              />
            </div>
          </div>
        ) : (
          <p className="mt-8 text-center text-[#6b7280]">Načítám otázku…</p>
        )}
      </div>
    </div>
  );
}
