export type SubjectSublink = {
  name: string;
  href: string;
};

export type SubjectNav = {
  name: string;
  emoji: string;
  /** Výchozí cíl (např. přehled), když nejsou sublinky */
  href: string;
  /** Dílčí odkazy pod předmětem (např. Matika → přehled + pětiminutovky) */
  sublinks?: readonly SubjectSublink[];
};

export const tinuskaSubjects: readonly SubjectNav[] = [
  {
    name: "Matika",
    emoji: "🔢",
    href: "/matematika",
    sublinks: [
      { name: "Přehled", href: "/matematika" },
      { name: "Pětiminutovky", href: "/matematika/petiminutovky" },
    ],
  },
  { name: "Čeština", emoji: "📖", href: "/tinuska" },
  { name: "Angličtina", emoji: "🇬🇧", href: "/tinuska/anglictina" },
  { name: "Prvouka", emoji: "🌍", href: "/tinuska" },
] as const;

export const teoSubjects: readonly SubjectNav[] = [
  { name: "Čeština", emoji: "📖", href: "/teo" },
  { name: "Matematika", emoji: "🔢", href: "/teo" },
  { name: "Zeměpis", emoji: "🗺️", href: "/teo" },
  { name: "Angličtina", emoji: "🇬🇧", href: "/teo/anglictina" },
] as const;
