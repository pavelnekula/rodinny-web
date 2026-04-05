"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAnglictinaAchievements } from "./AchievementProvider";
import { useMergedVocabulary } from "./hooks/useMergedVocabulary";
import {
  ACHIEVEMENTS,
  categoryExpertUnlocked,
} from "./utils/achievementStore";
import { readProgressWords } from "./utils/progressRead";
import { VOCABULARY_CATEGORIES } from "./VocabularyData";
import type { CategoryId } from "./types";

export function MojeHvezdyPage() {
  const { unlocked, stats, avatar, setAvatar } = useAnglictinaAchievements();
  const { mergedWords } = useMergedVocabulary();
  const progress = useMemo(() => readProgressWords(), []);

  const idsByCat = useMemo(() => {
    const m: Record<string, string[]> = {};
    for (const w of mergedWords) {
      if (!m[w.categoryId]) m[w.categoryId] = [];
      m[w.categoryId]!.push(w.id);
    }
    return m as Record<CategoryId, string[]>;
  }, [mergedWords]);

  const totalUnlocked = Object.keys(unlocked).length;

  return (
    <div className="min-h-full bg-gradient-to-b from-amber-50 via-white to-teal-50 py-10">
      <div className="mx-auto max-w-5xl px-4">
        <Link
          href="/tinuska/anglictina"
          className="rounded-xl border-2 border-[#e5e7eb] bg-white px-4 py-2 font-semibold text-[#1a1a1a]"
        >
          ← Zpět do her
        </Link>

        <header className="mt-8 rounded-3xl border-2 border-[#e5e7eb] bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-extrabold text-[#1a1a1a]">
            🏅 Moje hvězdy
          </h1>
          <p className="mt-2 text-[#6b7280]">
            Odznáčky, série a statistiky napříč všemi hrami.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-lg">
            <span>
              Avatar:{" "}
              <select
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="rounded-lg border-2 border-[#e5e7eb] px-2 py-1"
                aria-label="Vybrat avatar"
              >
                {["🧗", "👦", "👧", "🐱", "🐶", "🦊", "🐻"].map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </span>
            <span className="font-semibold text-[#1a1a1a]">
              🔥 Nejdelší denní streak: {stats.longestDailyStreak} dní
            </span>
            <span>
              ⭐ Odznáčky: {totalUnlocked} / {ACHIEVEMENTS.length}
            </span>
            <span>📊 Správně celkem: {stats.totalCorrect}</span>
          </div>
        </header>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-[#1a1a1a]">Odznáčky</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ACHIEVEMENTS.map((a) => {
              const u = unlocked[a.id];
              return (
                <div
                  key={a.id}
                  className={`rounded-2xl border-2 p-4 ${
                    u
                      ? "border-amber-300 bg-amber-50 shadow-sm"
                      : "border-[#e5e7eb] bg-white opacity-70"
                  }`}
                >
                  <p className="text-2xl" aria-hidden>
                    {a.icon}
                  </p>
                  <p className="mt-2 font-bold text-[#1a1a1a]">{a.titleCs}</p>
                  <p className="mt-1 text-sm text-[#6b7280]">{a.descriptionCs}</p>
                  {u ? (
                    <p className="mt-2 text-xs text-emerald-700">
                      Získáno:{" "}
                      {new Date(u.unlockedAt).toLocaleDateString("cs-CZ")}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-[#9ca3af]">Zatím ne</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-[#1a1a1a]">
            Znalci kategorií (alespoň 1× ke každému slovíčku)
          </h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {VOCABULARY_CATEGORIES.map((c) => {
              const ids = idsByCat[c.id] ?? [];
              const ok = categoryExpertUnlocked(c.id, progress, ids);
              return (
                <div
                  key={c.id}
                  className={`rounded-xl border-2 px-3 py-2 ${
                    ok ? "border-emerald-300 bg-emerald-50" : "border-[#e5e7eb]"
                  }`}
                >
                  {c.tileEmoji} {c.titleCs}: {ok ? "✓ Znalec" : "…"}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
