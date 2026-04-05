import type { CategoryId, GameMode, GameModeMeta } from "./types";

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

/** Hry na samostatné stránce — stejná vizuální rodina jako kartičky/pexeso. */
export type PageGameModeMeta = {
  id: string;
  titleCs: string;
  descriptionCs: string;
  icon: string;
  /** Základní cesta (bez query) */
  href: string;
  /** Přidat ?category=… když je v hubu vybraná kategorie */
  passCategory: boolean;
};

export const PAGE_GAME_MODES: readonly PageGameModeMeta[] = [
  {
    id: "quiz",
    titleCs: "Kvízový souboj",
    descriptionCs: "Čas, streak, výběr odpovědí — otevře se na vlastní stránce",
    icon: "⚡",
    href: "/tinuska/anglictina/kviz",
    passCategory: true,
  },
  {
    id: "wheel",
    titleCs: "Kolo štěstí",
    descriptionCs: "Roztoč kolo, otázka z náhodné kategorie",
    icon: "🎡",
    href: "/tinuska/anglictina/kolo-stesti",
    passCategory: true,
  },
  {
    id: "map",
    titleCs: "Mapa dobrodružství",
    descriptionCs: "Šplhej na horu slovíček podle kategorie",
    icon: "🗺️",
    href: "/tinuska/anglictina/mapa-dobrodruzstvi",
    passCategory: true,
  },
  {
    id: "stars",
    titleCs: "Moje hvězdy",
    descriptionCs: "Odznáčky, statistiky a série",
    icon: "🏅",
    href: "/tinuska/anglictina/hvezdy",
    passCategory: false,
  },
] as const;

export function hrefWithCategory(
  meta: PageGameModeMeta,
  categoryId: CategoryId | null,
): string {
  if (!meta.passCategory || !categoryId) return meta.href;
  const sep = meta.href.includes("?") ? "&" : "?";
  return `${meta.href}${sep}category=${encodeURIComponent(categoryId)}`;
}
