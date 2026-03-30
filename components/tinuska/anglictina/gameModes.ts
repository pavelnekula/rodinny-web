import type { GameMode, GameModeMeta } from "./types";

export const GAME_MODE_METAS: readonly GameModeMeta[] = [
  {
    id: "flashcards",
    titleCs: "Kartičky",
    descriptionCs: "Otoč kartu a zkus si pamatovat překlad",
    icon: "🃏",
  },
  {
    id: "memory",
    titleCs: "Pexeso",
    descriptionCs: "Spáruj anglické slovo s českým překladem",
    icon: "🧩",
  },
  {
    id: "fillLetters",
    titleCs: "Doplň písmena",
    descriptionCs: "Doplň chybějící písmena podle nápovědy",
    icon: "✏️",
  },
] as const;

export const IMPLEMENTED_GAME_MODES = new Set<GameMode>([
  "flashcards",
  "memory",
  "fillLetters",
]);

export const ALL_IMPLEMENTED_MODES: readonly GameMode[] = [
  "flashcards",
  "memory",
  "fillLetters",
] as const;

export function isGameModeImplemented(mode: GameMode): boolean {
  return IMPLEMENTED_GAME_MODES.has(mode);
}
