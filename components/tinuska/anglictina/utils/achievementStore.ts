import type { CategoryId } from "../types";

const STORAGE_KEY = "tinuska-anglictina-achievements-v1";

export type AchievementDef = {
  id: string;
  titleCs: string;
  descriptionCs: string;
  icon: string;
  category: "streak" | "category" | "daily" | "game" | "milestone";
};

export const ACHIEVEMENTS: readonly AchievementDef[] = [
  {
    id: "streak-5",
    titleCs: "Rozehřátý/á",
    descriptionCs: "5 správných odpovědí za sebou v libovolné hře.",
    icon: "⭐",
    category: "streak",
  },
  {
    id: "streak-10",
    titleCs: "V ráži!",
    descriptionCs: "10 správných odpovědí za sebou.",
    icon: "⭐⭐",
    category: "streak",
  },
  {
    id: "streak-20",
    titleCs: "Nezastavitelný/á!",
    descriptionCs: "20 správných odpovědí za sebou.",
    icon: "⭐⭐⭐",
    category: "streak",
  },
  {
    id: "streak-50",
    titleCs: "Legenda!",
    descriptionCs: "50 správných odpovědí za sebou.",
    icon: "💎",
    category: "streak",
  },
  {
    id: "daily-3",
    titleCs: "Trojdenní streak",
    descriptionCs: "Hrál/a jsi 3 dny po sobě.",
    icon: "🔥",
    category: "daily",
  },
  {
    id: "daily-7",
    titleCs: "Týdenní bojovník",
    descriptionCs: "7 dní po sobě.",
    icon: "🔥🔥",
    category: "daily",
  },
  {
    id: "daily-14",
    titleCs: "Čtrnáctidenní mašina",
    descriptionCs: "14 dní po sobě.",
    icon: "🔥🔥🔥",
    category: "daily",
  },
  {
    id: "daily-30",
    titleCs: "Měsíční šampion!",
    descriptionCs: "30 dní po sobě.",
    icon: "🌋",
    category: "daily",
  },
  {
    id: "milestone-100",
    titleCs: "Stovka",
    descriptionCs: "100 správných odpovědí celkem.",
    icon: "📊",
    category: "milestone",
  },
  {
    id: "milestone-500",
    titleCs: "Pětistovka",
    descriptionCs: "500 správných odpovědí celkem.",
    icon: "📈",
    category: "milestone",
  },
  {
    id: "milestone-1000",
    titleCs: "Tisícovka",
    descriptionCs: "1000 správných odpovědí celkem.",
    icon: "🏅",
    category: "milestone",
  },
  {
    id: "all-games",
    titleCs: "Všechny typy her",
    descriptionCs: "Hrál/a jsi kartičky, pexeso, doplň písmena, kvíz, kolo i mapu.",
    icon: "🎮",
    category: "milestone",
  },
  {
    id: "flash-100",
    titleCs: "Kartičkový mág",
    descriptionCs: "Otočil/a 100 kartiček (celkem).",
    icon: "🃏",
    category: "game",
  },
  {
    id: "flash-500",
    titleCs: "Kartičková legenda",
    descriptionCs: "Otočil/a 500 kartiček.",
    icon: "🃏",
    category: "game",
  },
  {
    id: "memory-fast",
    titleCs: "Pexeso blesk",
    descriptionCs: "Dokončil/a pexeso pod 60 sekund.",
    icon: "🧩",
    category: "game",
  },
  {
    id: "memory-clean",
    titleCs: "Pexeso bez chyby",
    descriptionCs: "Dokončil/a kolo pexesa bez špatného páru.",
    icon: "✨",
    category: "game",
  },
  {
    id: "fill-50",
    titleCs: "Doplňovač",
    descriptionCs: "Doplnil/a 50 slov v Doplň písmena.",
    icon: "✏️",
    category: "game",
  },
  {
    id: "fill-hard",
    titleCs: "Tvrdý trenér",
    descriptionCs: "Přežil/a těžkou obtížnost bez ztráty života.",
    icon: "💪",
    category: "game",
  },
  {
    id: "quiz-stars",
    titleCs: "Hvězdný kvíz",
    descriptionCs: "Získal/a 3 hvězdičky v Kvízovém souboji.",
    icon: "⚡",
    category: "game",
  },
  {
    id: "quiz-duel-win",
    titleCs: "Šampion souboje",
    descriptionCs: "Vyhrál/a souboj dvou hráčů.",
    icon: "🆚",
    category: "game",
  },
  {
    id: "wheel-mystery",
    titleCs: "Mystery lovec",
    descriptionCs: "Správně trefil/a Mystery otázku v Kole štěstí.",
    icon: "🎁",
    category: "game",
  },
  {
    id: "wheel-bonus-3",
    titleCs: "Bonusový lovec",
    descriptionCs: "Třikrát za jednu hru Bonus ×2 v Kole štěstí.",
    icon: "⭐",
    category: "game",
  },
  {
    id: "map-first",
    titleCs: "Horolezec",
    descriptionCs: "Zdolal/a první horu (mapu kategorie).",
    icon: "🗺️",
    category: "game",
  },
  {
    id: "map-all",
    titleCs: "Královna/Král hor",
    descriptionCs: "Zdolal/a všechny hory (všechny kategorie).",
    icon: "🏔️",
    category: "game",
  },
  {
    id: "master-en",
    titleCs: "Mistr angličtiny!",
    descriptionCs: "Alespoň jednou správně ke každému slovíčku ve všech kategoriích.",
    icon: "🏆",
    category: "category",
  },
] as const;

export type AchievementStats = {
  totalCorrect: number;
  totalWrong: number;
  /** Aktuální série správných odpovědí (reset při chybě) */
  currentAnswerStreak: number;
  maxAnswerStreak: number;
  dailyStreak: number;
  longestDailyStreak: number;
  lastPlayDay: string | null;
  flashcardFlips: number;
  memoryBestSec: number | null;
  memoryLastFlawless: boolean;
  fillWords: number;
  fillHardNoLife: boolean;
  quizStars3: number;
  duelWins: number;
  wheelMysteryHits: number;
  wheelBonus2xInOneGame: number;
  mountainsCompleted: string[];
  gameTypesPlayed: Set<string>;
  perfectQuizCategory: Record<string, boolean>;
};

export type UnlockedMap = Record<string, { unlockedAt: string; seen: boolean }>;

export function defaultStats(): AchievementStats {
  return {
    totalCorrect: 0,
    totalWrong: 0,
    currentAnswerStreak: 0,
    maxAnswerStreak: 0,
    dailyStreak: 0,
    longestDailyStreak: 0,
    lastPlayDay: null,
    flashcardFlips: 0,
    memoryBestSec: null,
    memoryLastFlawless: false,
    fillWords: 0,
    fillHardNoLife: false,
    quizStars3: 0,
    duelWins: 0,
    wheelMysteryHits: 0,
    wheelBonus2xInOneGame: 0,
    mountainsCompleted: [],
    gameTypesPlayed: new Set(),
    perfectQuizCategory: {},
  };
}

export type PersistedAchievementState = {
  unlocked: UnlockedMap;
  stats: Omit<AchievementStats, "gameTypesPlayed"> & {
    gameTypesPlayed: string[];
  };
  avatar: string;
};

function serialize(s: AchievementStats): PersistedAchievementState["stats"] {
  return {
    ...s,
    gameTypesPlayed: [...s.gameTypesPlayed],
  };
}

function deserialize(
  s: PersistedAchievementState["stats"] | undefined,
): AchievementStats {
  if (!s) return defaultStats();
  return {
    ...defaultStats(),
    ...s,
    gameTypesPlayed: new Set(s.gameTypesPlayed ?? []),
  };
}

export function loadPersisted(): {
  unlocked: UnlockedMap;
  stats: AchievementStats;
  avatar: string;
} {
  if (typeof window === "undefined") {
    return { unlocked: {}, stats: defaultStats(), avatar: "🧗" };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { unlocked: {}, stats: defaultStats(), avatar: "🧗" };
    const p = JSON.parse(raw) as PersistedAchievementState;
    return {
      unlocked: p.unlocked ?? {},
      stats: deserialize(p.stats),
      avatar: p.avatar ?? "🧗",
    };
  } catch {
    return { unlocked: {}, stats: defaultStats(), avatar: "🧗" };
  }
}

export function savePersisted(state: {
  unlocked: UnlockedMap;
  stats: AchievementStats;
  avatar: string;
}) {
  if (typeof window === "undefined") return;
  const payload: PersistedAchievementState = {
    unlocked: state.unlocked,
    stats: serialize(state.stats),
    avatar: state.avatar,
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota */
  }
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Aktualizace denního streaku při startu hry */
export function touchDailyPlay(stats: AchievementStats): AchievementStats {
  const t = todayKey();
  if (stats.lastPlayDay === t) return stats;
  let next = { ...stats, lastPlayDay: t };
  if (!stats.lastPlayDay) {
    next.dailyStreak = 1;
  } else {
    const prev = new Date(stats.lastPlayDay + "T12:00:00");
    const diff = Math.round(
      (new Date(t + "T12:00:00").getTime() - prev.getTime()) / 86400000,
    );
    if (diff === 1) next.dailyStreak = stats.dailyStreak + 1;
    else if (diff > 1) next.dailyStreak = 1;
  }
  if (next.dailyStreak > next.longestDailyStreak)
    next.longestDailyStreak = next.dailyStreak;
  return next;
}

export function unlockChecks(
  stats: AchievementStats,
  unlocked: UnlockedMap,
  progressWords: Record<string, number>,
  mergedWordIdsByCategory: Record<CategoryId, string[]>,
): AchievementDef[] {
  const newly: AchievementDef[] = [];
  const has = (id: string) => !!unlocked[id];

  const tryUnlock = (def: AchievementDef, ok: boolean) => {
    if (ok && !has(def.id)) newly.push(def);
  };

  const byId = (id: string) => ACHIEVEMENTS.find((a) => a.id === id)!;

  tryUnlock(byId("streak-5"), stats.maxAnswerStreak >= 5);
  tryUnlock(byId("streak-10"), stats.maxAnswerStreak >= 10);
  tryUnlock(byId("streak-20"), stats.maxAnswerStreak >= 20);
  tryUnlock(byId("streak-50"), stats.maxAnswerStreak >= 50);

  tryUnlock(byId("daily-3"), stats.longestDailyStreak >= 3);
  tryUnlock(byId("daily-7"), stats.longestDailyStreak >= 7);
  tryUnlock(byId("daily-14"), stats.longestDailyStreak >= 14);
  tryUnlock(byId("daily-30"), stats.longestDailyStreak >= 30);

  tryUnlock(byId("milestone-100"), stats.totalCorrect >= 100);
  tryUnlock(byId("milestone-500"), stats.totalCorrect >= 500);
  tryUnlock(byId("milestone-1000"), stats.totalCorrect >= 1000);

  const needed = new Set([
    "flashcards",
    "memory",
    "fillLetters",
    "quizDuel",
    "luckyWheel",
    "adventureMap",
  ]);
  for (const g of stats.gameTypesPlayed) needed.delete(g);
  tryUnlock(byId("all-games"), needed.size === 0);

  tryUnlock(byId("flash-100"), stats.flashcardFlips >= 100);
  tryUnlock(byId("flash-500"), stats.flashcardFlips >= 500);

  tryUnlock(
    byId("memory-fast"),
    stats.memoryBestSec !== null && stats.memoryBestSec < 60,
  );
  tryUnlock(byId("memory-clean"), stats.memoryLastFlawless);

  tryUnlock(byId("fill-50"), stats.fillWords >= 50);
  tryUnlock(byId("fill-hard"), stats.fillHardNoLife);

  tryUnlock(byId("quiz-stars"), stats.quizStars3 >= 1);
  tryUnlock(byId("quiz-duel-win"), stats.duelWins >= 1);
  tryUnlock(byId("wheel-mystery"), stats.wheelMysteryHits >= 1);
  tryUnlock(byId("wheel-bonus-3"), stats.wheelBonus2xInOneGame >= 3);

  tryUnlock(byId("map-first"), stats.mountainsCompleted.length >= 1);
  tryUnlock(
    byId("map-all"),
    stats.mountainsCompleted.length >= Object.keys(mergedWordIdsByCategory).length,
  );

  let allWordsOnce = true;
  for (const [cat, ids] of Object.entries(mergedWordIdsByCategory)) {
    for (const wid of ids) {
      if ((progressWords[wid] ?? 0) < 1) {
        allWordsOnce = false;
        break;
      }
    }
    if (!allWordsOnce) break;
  }
  tryUnlock(byId("master-en"), allWordsOnce && idsNonEmpty(mergedWordIdsByCategory));

  return newly;
}

function idsNonEmpty(m: Record<CategoryId, string[]>) {
  return Object.values(m).some((a) => a.length > 0);
}

/** „Znalec [kategorie]“ — generované dynamicky v UI podle progressWords */

export function categoryExpertUnlocked(
  categoryId: CategoryId,
  progressWords: Record<string, number>,
  wordIds: string[],
): boolean {
  if (wordIds.length === 0) return false;
  return wordIds.every((id) => (progressWords[id] ?? 0) >= 1);
}
