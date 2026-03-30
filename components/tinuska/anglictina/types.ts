export type CategoryId =
  | "colors"
  | "furniture"
  | "toys"
  | "body"
  | "food"
  | "numbers"
  | "school"
  | "toBe"
  | "toHave";

export interface Word {
  id: string;
  en: string;
  cs: string;
  /** Jednoduchá příkladová věta v angličtině (A1/A2) s daným slovíčkem */
  sentence: string;
  emoji: string;
  categoryId: CategoryId;
}

export interface CategoryMeta {
  id: CategoryId;
  titleCs: string;
  titleEn: string;
  subtitleCs: string;
  tileEmoji: string;
  /** Pastel Tailwind accent classes for tiles */
  tileClass: string;
}

export type GameMode = "flashcards" | "memory" | "fillLetters";

export interface GameModeMeta {
  id: GameMode;
  titleCs: string;
  descriptionCs: string;
  icon: string;
}

/** Klíč sady slovíček: konkrétní kategorie nebo mix ze všech */
export type WordSetKey = CategoryId | "mix";

/** Per-word correct answers (kvízy); volitelné pro kompatibilitu */
export interface WordProgress {
  wordId: string;
  correctCount: number;
}

export interface ProgressState {
  words: Record<string, number>;
}
