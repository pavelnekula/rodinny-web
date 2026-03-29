import type { CategoryId, CategoryMeta, Word } from "./types";

export const VOCABULARY_CATEGORIES: readonly CategoryMeta[] = [
  {
    id: "colors",
    titleCs: "Barvy",
    titleEn: "Colors",
    subtitleCs: "Odstíny a barvy",
    tileEmoji: "🎨",
    tileClass:
      "from-amber-200 via-yellow-100 to-orange-100 border-amber-300/80 text-amber-900",
  },
  {
    id: "furniture",
    titleCs: "Nábytek a místnosti",
    titleEn: "Furniture & rooms",
    subtitleCs: "Věci doma",
    tileEmoji: "🛋️",
    tileClass:
      "from-cyan-200 via-teal-100 to-sky-100 border-teal-300/80 text-teal-900",
  },
  {
    id: "toys",
    titleCs: "Hračky",
    titleEn: "Toys",
    subtitleCs: "Hry a hračky",
    tileEmoji: "🧸",
    tileClass:
      "from-rose-200 via-pink-100 to-fuchsia-100 border-rose-300/80 text-rose-900",
  },
  {
    id: "body",
    titleCs: "Části těla",
    titleEn: "Body parts",
    subtitleCs: "Od hlavy k patě",
    tileEmoji: "🦶",
    tileClass:
      "from-lime-200 via-emerald-100 to-teal-100 border-emerald-300/80 text-emerald-900",
  },
] as const;

export const VOCABULARY_WORDS: readonly Word[] = [
  // A – Barvy
  { id: "red", en: "red", cs: "červená", emoji: "🔴", categoryId: "colors" },
  { id: "blue", en: "blue", cs: "modrá", emoji: "🔵", categoryId: "colors" },
  { id: "green", en: "green", cs: "zelená", emoji: "🟢", categoryId: "colors" },
  {
    id: "yellow",
    en: "yellow",
    cs: "žlutá",
    emoji: "🟡",
    categoryId: "colors",
  },
  {
    id: "orange",
    en: "orange",
    cs: "oranžová",
    emoji: "🟠",
    categoryId: "colors",
  },
  {
    id: "purple",
    en: "purple",
    cs: "fialová",
    emoji: "🟣",
    categoryId: "colors",
  },
  { id: "pink", en: "pink", cs: "růžová", emoji: "🩷", categoryId: "colors" },
  { id: "white", en: "white", cs: "bílá", emoji: "⚪", categoryId: "colors" },
  { id: "black", en: "black", cs: "černá", emoji: "⚫", categoryId: "colors" },
  {
    id: "brown",
    en: "brown",
    cs: "hnědá",
    emoji: "🟤",
    categoryId: "colors",
  },

  // B – Nábytek a místnosti
  {
    id: "chair",
    en: "chair",
    cs: "židle",
    emoji: "🪑",
    categoryId: "furniture",
  },
  {
    id: "table",
    en: "table",
    cs: "stůl",
    emoji: "🍽️",
    categoryId: "furniture",
  },
  {
    id: "bed",
    en: "bed",
    cs: "postel",
    emoji: "🛏️",
    categoryId: "furniture",
  },
  {
    id: "sofa",
    en: "sofa",
    cs: "pohovka",
    emoji: "🛋️",
    categoryId: "furniture",
  },
  {
    id: "cupboard",
    en: "cupboard",
    cs: "skříňka",
    emoji: "🗄️",
    categoryId: "furniture",
  },
  {
    id: "wardrobe",
    en: "wardrobe",
    cs: "šatní skříň",
    emoji: "👔",
    categoryId: "furniture",
  },
  {
    id: "bathroom",
    en: "bathroom",
    cs: "koupelna",
    emoji: "🛁",
    categoryId: "furniture",
  },

  // C – Hračky (car uvedeno jednou)
  { id: "ball", en: "ball", cs: "míč", emoji: "⚽", categoryId: "toys" },
  { id: "doll", en: "doll", cs: "panenka", emoji: "🪆", categoryId: "toys" },
  { id: "car", en: "car", cs: "autíčko", emoji: "🚗", categoryId: "toys" },
  {
    id: "teddy-bear",
    en: "teddy bear",
    cs: "medvídek",
    emoji: "🧸",
    categoryId: "toys",
  },
  {
    id: "blocks",
    en: "blocks",
    cs: "kostky",
    emoji: "🧱",
    categoryId: "toys",
  },
  {
    id: "puzzle",
    en: "puzzle",
    cs: "puzzle",
    emoji: "🧩",
    categoryId: "toys",
  },
  { id: "kite", en: "kite", cs: "drak", emoji: "🪁", categoryId: "toys" },
  { id: "drum", en: "drum", cs: "buben", emoji: "🥁", categoryId: "toys" },
  {
    id: "robot",
    en: "robot",
    cs: "robot",
    emoji: "🤖",
    categoryId: "toys",
  },
  {
    id: "bicycle",
    en: "bicycle",
    cs: "kolo",
    emoji: "🚲",
    categoryId: "toys",
  },
  {
    id: "train",
    en: "train",
    cs: "vlak",
    emoji: "🚂",
    categoryId: "toys",
  },
  {
    id: "plane",
    en: "plane",
    cs: "letadlo",
    emoji: "✈️",
    categoryId: "toys",
  },

  // D – Části těla
  { id: "head", en: "head", cs: "hlava", emoji: "🙂", categoryId: "body" },
  { id: "eyes", en: "eyes", cs: "oči", emoji: "👀", categoryId: "body" },
  { id: "nose", en: "nose", cs: "nos", emoji: "👃", categoryId: "body" },
  { id: "mouth", en: "mouth", cs: "ústa", emoji: "👄", categoryId: "body" },
  { id: "ears", en: "ears", cs: "uši", emoji: "👂", categoryId: "body" },
  { id: "hands", en: "hands", cs: "ruce", emoji: "🙌", categoryId: "body" },
  {
    id: "fingers",
    en: "fingers",
    cs: "prsty",
    emoji: "🤚",
    categoryId: "body",
  },
  { id: "legs", en: "legs", cs: "nohy", emoji: "🦵", categoryId: "body" },
  { id: "feet", en: "feet", cs: "chodidla", emoji: "🦶", categoryId: "body" },
  { id: "tummy", en: "tummy", cs: "bříško", emoji: "👕", categoryId: "body" },
] as const;

export const TOTAL_VOCABULARY_COUNT = VOCABULARY_WORDS.length;

export function getWordsByCategory(categoryId: CategoryId): Word[] {
  return VOCABULARY_WORDS.filter((w) => w.categoryId === categoryId);
}

export function getCategoryMeta(
  categoryId: CategoryId,
): CategoryMeta | undefined {
  return VOCABULARY_CATEGORIES.find((c) => c.id === categoryId);
}

export function getWordById(wordId: string): Word | undefined {
  return VOCABULARY_WORDS.find((w) => w.id === wordId);
}
