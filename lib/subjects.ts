export type SubjectNav = {
  name: string;
  emoji: string;
  /** Cíl v aplikaci při kliknutí v levém panelu na úvodní stránce */
  href: string;
};

export const tinuskaSubjects: readonly SubjectNav[] = [
  { name: "Matika", emoji: "🔢", href: "/tinuska" },
  { name: "Čeština", emoji: "📖", href: "/tinuska" },
  { name: "Angličtina", emoji: "🇬🇧", href: "/tinuska/anglictina" },
  { name: "Prvouka", emoji: "🌍", href: "/tinuska" },
] as const;

export const teoSubjects: readonly SubjectNav[] = [
  { name: "Čeština", emoji: "📖", href: "/teo" },
  { name: "Matematika", emoji: "🔢", href: "/teo" },
  { name: "Zeměpis", emoji: "🗺️", href: "/teo" },
  { name: "Fyzika", emoji: "⚡", href: "/teo" },
  { name: "Angličtina", emoji: "🇬🇧", href: "/teo/anglictina" },
] as const;
