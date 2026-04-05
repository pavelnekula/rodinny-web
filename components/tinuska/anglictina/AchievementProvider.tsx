"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CategoryId, Word } from "./types";
import {
  defaultStats,
  loadPersisted,
  savePersisted,
  touchDailyPlay,
  unlockChecks,
  type AchievementDef,
  type AchievementStats,
  type UnlockedMap,
} from "./utils/achievementStore";
import { readProgressWords } from "./utils/progressRead";
import { AchievementToastHost } from "./AchievementToast";

type Bundle = { stats: AchievementStats; unlocked: UnlockedMap };

type Ctx = {
  stats: AchievementStats;
  unlocked: UnlockedMap;
  avatar: string;
  setAvatar: (emoji: string) => void;
  onGameStart: (gameType: string) => void;
  trackAnswer: (correct: boolean) => void;
  trackGameTypePlayed: (gameType: string) => void;
  trackFlashcardFlip: () => void;
  trackMemoryFinish: (seconds: number, flawless: boolean) => void;
  trackFillWord: () => void;
  trackFillHardNoLife: () => void;
  trackQuizStars: (stars: number) => void;
  trackDuelWin: () => void;
  trackWheelMystery: () => void;
  trackWheelBonus2xInGame: (countInGame: number) => void;
  trackMountainComplete: (categoryId: CategoryId) => void;
  markAchievementSeen: (id: string) => void;
  refreshFromStorage: () => void;
};

const AchievementContext = createContext<Ctx | null>(null);

function buildWordIdsByCategory(words: Word[]): Record<CategoryId, string[]> {
  const m: Record<string, string[]> = {};
  for (const w of words) {
    if (!m[w.categoryId]) m[w.categoryId] = [];
    m[w.categoryId]!.push(w.id);
  }
  return m as Record<CategoryId, string[]>;
}

export function AchievementProvider({
  children,
  mergedWords,
}: {
  children: React.ReactNode;
  mergedWords: Word[];
}) {
  const [bundle, setBundle] = useState<Bundle>(() => ({
    stats: defaultStats(),
    unlocked: {},
  }));
  const [avatar, setAvatarState] = useState("🧗");
  const [toastQueue, setToastQueue] = useState<AchievementDef[]>([]);
  const avatarRef = useRef(avatar);
  avatarRef.current = avatar;

  const wordIdsByCat = useMemo(
    () => buildWordIdsByCategory(mergedWords),
    [mergedWords],
  );

  useEffect(() => {
    const p = loadPersisted();
    setBundle({ stats: p.stats, unlocked: p.unlocked });
    setAvatarState(p.avatar);
    avatarRef.current = p.avatar;
  }, []);

  const persist = useCallback((b: Bundle) => {
    savePersisted({
      unlocked: b.unlocked,
      stats: b.stats,
      avatar: avatarRef.current,
    });
  }, []);

  const apply = useCallback(
    (mutate: (prev: Bundle) => Bundle) => {
      setBundle((prev) => {
        const next = mutate(prev);
        const progress = readProgressWords();
        const newly = unlockChecks(
          next.stats,
          next.unlocked,
          progress,
          wordIdsByCat,
        );
        if (newly.length === 0) {
          persist(next);
          return next;
        }
        const now = new Date().toISOString();
        const unlocked = { ...next.unlocked };
        for (const d of newly) {
          if (!unlocked[d.id])
            unlocked[d.id] = { unlockedAt: now, seen: false };
        }
        setToastQueue((q) => [...q, ...newly]);
        const out = { stats: next.stats, unlocked };
        persist(out);
        return out;
      });
    },
    [wordIdsByCat, persist],
  );

  const onGameStart = useCallback(
    (gameType: string) => {
      apply((prev) => {
        let stats = touchDailyPlay(prev.stats);
        const g = new Set(stats.gameTypesPlayed);
        g.add(gameType);
        stats = { ...stats, gameTypesPlayed: g };
        return { ...prev, stats };
      });
    },
    [apply],
  );

  const trackAnswer = useCallback(
    (correct: boolean) => {
      apply((prev) => {
        const s = { ...prev.stats };
        if (correct) {
          s.totalCorrect += 1;
          s.currentAnswerStreak += 1;
          s.maxAnswerStreak = Math.max(
            s.maxAnswerStreak,
            s.currentAnswerStreak,
          );
        } else {
          s.totalWrong += 1;
          s.currentAnswerStreak = 0;
        }
        return { ...prev, stats: s };
      });
    },
    [apply],
  );

  const trackGameTypePlayed = useCallback(
    (gameType: string) => {
      apply((prev) => {
        const g = new Set(prev.stats.gameTypesPlayed);
        g.add(gameType);
        return { ...prev, stats: { ...prev.stats, gameTypesPlayed: g } };
      });
    },
    [apply],
  );

  const trackFlashcardFlip = useCallback(() => {
    apply((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        flashcardFlips: prev.stats.flashcardFlips + 1,
      },
    }));
  }, [apply]);

  const trackMemoryFinish = useCallback(
    (seconds: number, flawless: boolean) => {
      apply((prev) => {
        const best =
          prev.stats.memoryBestSec === null
            ? seconds
            : Math.min(prev.stats.memoryBestSec, seconds);
        return {
          ...prev,
          stats: {
            ...prev.stats,
            memoryBestSec: best,
            memoryLastFlawless: flawless,
          },
        };
      });
    },
    [apply],
  );

  const trackFillWord = useCallback(() => {
    apply((prev) => ({
      ...prev,
      stats: { ...prev.stats, fillWords: prev.stats.fillWords + 1 },
    }));
  }, [apply]);

  const trackFillHardNoLife = useCallback(() => {
    apply((prev) => ({
      ...prev,
      stats: { ...prev.stats, fillHardNoLife: true },
    }));
  }, [apply]);

  const trackQuizStars = useCallback(
    (stars: number) => {
      if (stars < 3) return;
      apply((prev) => ({
        ...prev,
        stats: { ...prev.stats, quizStars3: prev.stats.quizStars3 + 1 },
      }));
    },
    [apply],
  );

  const trackDuelWin = useCallback(() => {
    apply((prev) => ({
      ...prev,
      stats: { ...prev.stats, duelWins: prev.stats.duelWins + 1 },
    }));
  }, [apply]);

  const trackWheelMystery = useCallback(() => {
    apply((prev) => ({
      ...prev,
      stats: { ...prev.stats, wheelMysteryHits: prev.stats.wheelMysteryHits + 1 },
    }));
  }, [apply]);

  const trackWheelBonus2xInGame = useCallback(
    (countInGame: number) => {
      apply((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          wheelBonus2xInOneGame: Math.max(
            prev.stats.wheelBonus2xInOneGame,
            countInGame,
          ),
        },
      }));
    },
    [apply],
  );

  const trackMountainComplete = useCallback(
    (categoryId: CategoryId) => {
      apply((prev) => {
        if (prev.stats.mountainsCompleted.includes(categoryId)) return prev;
        return {
          ...prev,
          stats: {
            ...prev.stats,
            mountainsCompleted: [...prev.stats.mountainsCompleted, categoryId],
          },
        };
      });
    },
    [apply],
  );

  const setAvatar = useCallback((emoji: string) => {
    setAvatarState(emoji);
    avatarRef.current = emoji;
    setBundle((b) => {
      const out = { ...b };
      savePersisted({ unlocked: out.unlocked, stats: out.stats, avatar: emoji });
      return b;
    });
  }, []);

  const markAchievementSeen = useCallback((id: string) => {
    setBundle((prev) => {
      const e = prev.unlocked[id];
      if (!e || e.seen) return prev;
      const unlocked = {
        ...prev.unlocked,
        [id]: { ...e, seen: true },
      };
      const out = { ...prev, unlocked };
      persist(out);
      return out;
    });
  }, [persist]);

  const refreshFromStorage = useCallback(() => {
    const p = loadPersisted();
    setBundle({ stats: p.stats, unlocked: p.unlocked });
    setAvatarState(p.avatar);
    avatarRef.current = p.avatar;
  }, []);

  const value = useMemo(
    () =>
      ({
        stats: bundle.stats,
        unlocked: bundle.unlocked,
        avatar,
        setAvatar,
        onGameStart,
        trackAnswer,
        trackGameTypePlayed,
        trackFlashcardFlip,
        trackMemoryFinish,
        trackFillWord,
        trackFillHardNoLife,
        trackQuizStars,
        trackDuelWin,
        trackWheelMystery,
        trackWheelBonus2xInGame,
        trackMountainComplete,
        markAchievementSeen,
        refreshFromStorage,
      }) satisfies Ctx,
    [
      bundle.stats,
      bundle.unlocked,
      avatar,
      setAvatar,
      onGameStart,
      trackAnswer,
      trackGameTypePlayed,
      trackFlashcardFlip,
      trackMemoryFinish,
      trackFillWord,
      trackFillHardNoLife,
      trackQuizStars,
      trackDuelWin,
      trackWheelMystery,
      trackWheelBonus2xInGame,
      trackMountainComplete,
      markAchievementSeen,
      refreshFromStorage,
    ],
  );

  const consumeToast = useCallback(() => {
    setToastQueue((q) => (q.length ? q.slice(1) : q));
  }, []);

  return (
    <AchievementContext.Provider value={value}>
      {children}
      <AchievementToastHost queue={toastQueue} onConsumed={consumeToast} />
    </AchievementContext.Provider>
  );
}

export function useAnglictinaAchievements() {
  const v = useContext(AchievementContext);
  if (!v) {
    throw new Error(
      "useAnglictinaAchievements musí být uvnitř AchievementProvider",
    );
  }
  return v;
}

export function useOptionalAnglictinaAchievements() {
  return useContext(AchievementContext);
}
