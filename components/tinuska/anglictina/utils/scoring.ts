import type { QuizDifficulty } from "../types";

/** Základní body za správnou odpověď ve kvízu */
export const QUIZ_BASE_POINTS = 100;

export function quizSpeedBonus(
  timeRemainingSec: number,
  maxTimeSec: number,
): number {
  const r = Math.max(0, Math.min(timeRemainingSec, maxTimeSec));
  return Math.round(r * 20);
}

/** Streak násobič: 3+ → 1.5, 5+ → 2, 10+ → 3 */
export function streakMultiplier(streak: number): number {
  if (streak >= 10) return 3;
  if (streak >= 5) return 2;
  if (streak >= 3) return 1.5;
  return 1;
}

export function soloQuizRoundScore(params: {
  timeRemainingSec: number;
  maxTimeSec: number;
  streakAfterCorrect: number;
}): number {
  const mult = streakMultiplier(params.streakAfterCorrect);
  const base = QUIZ_BASE_POINTS + quizSpeedBonus(params.timeRemainingSec, params.maxTimeSec);
  return Math.round(base * mult);
}

export function timeLimitForDifficulty(d: QuizDifficulty): number {
  switch (d) {
    case "easy":
      return 15;
    case "medium":
      return 10;
    case "hard":
      return 7;
    default:
      return 10;
  }
}

export function starRatingFromRatio(ratio: number): 1 | 2 | 3 {
  if (ratio > 0.9) return 3;
  if (ratio > 0.75) return 2;
  if (ratio > 0.5) return 1;
  return 1;
}
