import type { Word } from "../types";
import { shuffle } from "./shuffle";

export type QuizDirection = "enToCs" | "csToEn";

export function pickQuestionWords(words: Word[], count: number): Word[] {
  if (words.length <= count) return shuffle([...words]);
  return shuffle([...words]).slice(0, count);
}

export function buildFourChoices(
  correct: Word,
  pool: Word[],
  direction: QuizDirection,
): { labels: string[]; correctIndex: number } {
  const others = shuffle(pool.filter((w) => w.id !== correct.id)).slice(0, 3);
  const wrongLabels = others.map((w) =>
    direction === "enToCs" ? w.cs : w.en,
  );
  const right =
    direction === "enToCs" ? correct.cs : correct.en;
  const labels = shuffle([right, ...wrongLabels]);
  return { labels, correctIndex: labels.indexOf(right) };
}

export function quizDirectionForDifficulty(
  difficulty: "easy" | "medium" | "hard",
): QuizDirection {
  return difficulty === "hard" ? "csToEn" : "enToCs";
}
