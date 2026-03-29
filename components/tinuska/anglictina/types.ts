export type CategoryId = "colors" | "furniture" | "toys" | "body";

export interface Word {
  id: string;
  en: string;
  cs: string;
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

export type GameMode =
  | "flashcards"
  | "fillLetters"
  | "multipleChoice"
  | "memory"
  | "listenChoose"
  | "speedQuiz";

export interface GameModeMeta {
  id: GameMode;
  titleCs: string;
  descriptionCs: string;
  icon: string;
}

/** Per-word correct answers (quizzes); flashcards do not auto-increment */
export interface WordProgress {
  wordId: string;
  correctCount: number;
}

export interface ProgressState {
  words: Record<string, number>;
}
