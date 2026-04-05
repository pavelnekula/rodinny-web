import type { CategoryId } from "../types";
import { VOCABULARY_CATEGORIES } from "../VocabularyData";

export type DailyChallenge = {
  id: string;
  titleCs: string;
  descriptionCs: string;
  /** Typ pro reporting / splnění */
  kind: "answer10" | "mapSteps" | "quizStars";
  target: number;
  categoryId?: CategoryId;
};

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Deterministická denní výzva podle data (stejná po refreshi). */
export function getDailyChallenge(date: Date): DailyChallenge {
  const key = dayKey(date);
  const h = hashSeed(`tinuska-daily-${key}`);
  const cats = [...VOCABULARY_CATEGORIES];
  const cat = cats[h % cats.length]!;

  const variants: DailyChallenge[] = [
    {
      id: `${key}-a`,
      titleCs: "Desítka z kategorie",
      descriptionCs: `Odpověz správně na 10 otázek ze slovíček: ${cat.titleCs}.`,
      kind: "answer10",
      target: 10,
      categoryId: cat.id,
    },
    {
      id: `${key}-b`,
      titleCs: "Výstup na mapě",
      descriptionCs: "Zdolaj 5 zastávek na Mapě dobrodružství (libovolná hora).",
      kind: "mapSteps",
      target: 5,
    },
    {
      id: `${key}-c`,
      titleCs: "Hvězdný kvíz",
      descriptionCs: "Získej 3 hvězdičky v Kvízovém souboji (sólo).",
      kind: "quizStars",
      target: 3,
    },
  ];
  return variants[h % variants.length]!;
}

const STORAGE_KEY = "tinuska-anglictina-daily-challenge-v1";

type Store = Record<string, boolean>;

function readStore(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const p: unknown = JSON.parse(raw);
    if (typeof p !== "object" || p === null) return {};
    return p as Store;
  } catch {
    return {};
  }
}

function writeStore(s: Store) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* quota */
  }
}

export function isDailyChallengeCompleted(date: Date): boolean {
  const id = getDailyChallenge(date).id;
  return !!readStore()[id];
}

export function completeDailyChallenge(date: Date): void {
  const id = getDailyChallenge(date).id;
  const s = readStore();
  s[id] = true;
  writeStore(s);
}
