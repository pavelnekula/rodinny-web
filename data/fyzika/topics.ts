export type TopicMeta = {
  slug: string;
  title: string;
  emoji: string;
  shortDescription: string;
  /** Tailwind barvy pro pexeso / akcent */
  accent: string;
  cardBack: string;
  borderGlow: string;
};

export const FYZIKA_TOPICS: TopicMeta[] = [
  {
    slug: "mereni",
    title: "Měření a jednotky",
    emoji: "📏",
    shortDescription: "Veličiny, SI, měřidla a převody.",
    accent: "from-cyan-500/20 to-blue-600/30",
    cardBack: "bg-slate-800/90 border-cyan-500/40",
    borderGlow: "shadow-[0_0_20px_rgba(34,211,238,0.25)]",
  },
  {
    slug: "vlastnosti-latek",
    title: "Vlastnosti látek",
    emoji: "🧊",
    shortDescription: "Skupenství, hustota, plavání a potápění.",
    accent: "from-emerald-500/20 to-teal-600/30",
    cardBack: "bg-slate-800/90 border-emerald-500/40",
    borderGlow: "shadow-[0_0_20px_rgba(52,211,153,0.25)]",
  },
  {
    slug: "pohyb",
    title: "Pohyb těles",
    emoji: "🚀",
    shortDescription: "Dráha, rychlost, grafy s–t.",
    accent: "from-violet-500/20 to-indigo-600/30",
    cardBack: "bg-slate-800/90 border-violet-500/40",
    borderGlow: "shadow-[0_0_20px_rgba(167,139,250,0.25)]",
  },
  {
    slug: "sily",
    title: "Síly",
    emoji: "💪",
    shortDescription: "Newton, tíha, tření, skládání sil.",
    accent: "from-amber-500/20 to-orange-600/30",
    cardBack: "bg-slate-800/90 border-amber-500/40",
    borderGlow: "shadow-[0_0_20px_rgba(251,191,36,0.25)]",
  },
  {
    slug: "jednoduche-stroje",
    title: "Jednoduché stroje",
    emoji: "⚙️",
    shortDescription: "Páka, kladka, nakloněná rovina.",
    accent: "from-sky-500/20 to-cyan-600/30",
    cardBack: "bg-slate-800/90 border-sky-500/40",
    borderGlow: "shadow-[0_0_20px_rgba(56,189,248,0.25)]",
  },
  {
    slug: "teplo",
    title: "Teplo a teplota",
    emoji: "🌡️",
    shortDescription: "°C, K, °F, skupenské přeměny.",
    accent: "from-rose-500/20 to-red-600/30",
    cardBack: "bg-slate-800/90 border-rose-500/40",
    borderGlow: "shadow-[0_0_20px_rgba(251,113,133,0.25)]",
  },
];

export function getTopicMeta(slug: string): TopicMeta | undefined {
  return FYZIKA_TOPICS.find((t) => t.slug === slug);
}
