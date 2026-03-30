import type { CategoryId, Word } from "./types";
import { VOCABULARY_WORDS } from "./VocabularyData";

/** Vlastní slovíčka doplněná v UI (localStorage) */
export const CUSTOM_VOCABULARY_STORAGE_KEY =
  "tinuska-anglictina-custom-vocabulary-v1";

export const CUSTOM_WORD_ID_PREFIX = "custom-";

export function dispatchVocabularyChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("anglictina-vocabulary-changed"));
}

function isValidCategoryId(id: string): id is CategoryId {
  return (
    id === "colors" ||
    id === "furniture" ||
    id === "toys" ||
    id === "body" ||
    id === "food" ||
    id === "numbers" ||
    id === "school" ||
    id === "toBe" ||
    id === "toHave"
  );
}

function parseWord(raw: unknown): Word | null {
  if (typeof raw !== "object" || raw === null) return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "string" ? o.id : "";
  const en = typeof o.en === "string" ? o.en.trim() : "";
  const cs = typeof o.cs === "string" ? o.cs.trim() : "";
  const emoji = typeof o.emoji === "string" ? o.emoji : "📌";
  const categoryId = typeof o.categoryId === "string" ? o.categoryId : "";
  const sentenceRaw = o.sentence;
  const sentence =
    typeof sentenceRaw === "string" && sentenceRaw.trim().length > 0
      ? sentenceRaw.trim()
      : `Listen to this word: ${en}.`;
  if (!id || !en || !cs || !isValidCategoryId(categoryId)) return null;
  return { id, en, cs, sentence, emoji: emoji || "📌", categoryId };
}

export function readCustomWords(): Word[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CUSTOM_VOCABULARY_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const out: Word[] = [];
    for (const item of parsed) {
      const w = parseWord(item);
      if (w) out.push(w);
    }
    return out;
  } catch {
    return [];
  }
}

export function writeCustomWords(words: Word[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      CUSTOM_VOCABULARY_STORAGE_KEY,
      JSON.stringify(words),
    );
    dispatchVocabularyChanged();
  } catch {
    /* quota */
  }
}

/** Základní slovíčka + vlastní; při stejném `id` přepíše vlastní záznam. */
export function getMergedWords(): Word[] {
  const base = [...VOCABULARY_WORDS] as Word[];
  const custom = readCustomWords();
  const map = new Map<string, Word>();
  for (const w of base) {
    map.set(w.id, w);
  }
  for (const w of custom) {
    map.set(w.id, w);
  }
  return Array.from(map.values());
}

export function getWordsByCategoryMerged(categoryId: CategoryId): Word[] {
  return getMergedWords().filter((w) => w.categoryId === categoryId);
}

export function getWordByIdMerged(wordId: string): Word | undefined {
  return getMergedWords().find((w) => w.id === wordId);
}

export function makeCustomWordId(en: string): string {
  const slug = en
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
  const tail = Math.random().toString(36).slice(2, 9);
  return `${CUSTOM_WORD_ID_PREFIX}${slug || "word"}-${tail}`;
}

export function isCustomWordId(id: string): boolean {
  return id.startsWith(CUSTOM_WORD_ID_PREFIX);
}
