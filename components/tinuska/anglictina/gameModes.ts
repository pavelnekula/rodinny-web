import type { GameMode, GameModeMeta } from "./types";

export const GAME_MODE_METAS: readonly GameModeMeta[] = [
  {
    id: "flashcards",
    titleCs: "Kartičky",
    descriptionCs: "Obrázek + anglicky, otoč na česky",
    icon: "🃏",
  },
  {
    id: "fillLetters",
    titleCs: "Doplň písmena",
    descriptionCs: "Slož slovo z písmen",
    icon: "🔤",
  },
  {
    id: "multipleChoice",
    titleCs: "Výběr ze 4",
    descriptionCs: "Vyber správný překlad",
    icon: "✅",
  },
  {
    id: "memory",
    titleCs: "Pexeso",
    descriptionCs: "Páruj slovo a obrázek",
    icon: "🧠",
  },
  {
    id: "listenChoose",
    titleCs: "Poslechni a vyber",
    descriptionCs: "Slyš slovo, klikni obrázek",
    icon: "👂",
  },
  {
    id: "speedQuiz",
    titleCs: "Rychlý kvíz",
    descriptionCs: "60 sekund, co nejvíc bodů",
    icon: "⏱️",
  },
] as const;

/** Módy již implementované v aplikaci */
export const IMPLEMENTED_GAME_MODES = new Set<GameMode>([
  "flashcards",
  "fillLetters",
  "multipleChoice",
  "memory",
  "listenChoose",
  "speedQuiz",
]);

/** Pořadí pro náhodný mód */
export const ALL_IMPLEMENTED_MODES: readonly GameMode[] = [
  "flashcards",
  "fillLetters",
  "multipleChoice",
  "memory",
  "listenChoose",
  "speedQuiz",
] as const;

export function isGameModeImplemented(mode: GameMode): boolean {
  return IMPLEMENTED_GAME_MODES.has(mode);
}
