export type Obtiznost = "lehka" | "stredni" | "tezka";

export interface Kapitola {
  id: string;
  cislo: number;
  nazev: string;
  popis: string;
  ikona: string;
  obtiznosti: Obtiznost[];
}

export type PrikladTyp = "ano-ne" | "vypocet" | "doplneni" | "multi-vyber";

export interface Priklad {
  zadani: string;
  odpoved: string;
  vysvetleni: string;
  typ: PrikladTyp;
  /** U typu `multi-vyber` — nabídka čísel (např. dělitelů k označení). */
  moznosti?: string[];
  /** U typu `multi-vyber` — které z `moznosti` mají být vybrané (shoda množin). */
  spravneMoznosti?: string[];
  /** Volitelná nápověda k zadání. */
  hint?: string;
}

export const KAPITOLY: readonly Kapitola[] = [
  {
    id: "nasobek",
    cislo: 1,
    nazev: "Násobek",
    popis: "Rozpoznáš násobek, násobky čísla a nejmenší společný násobek dvou čísel.",
    ikona: "✖️",
    obtiznosti: ["lehka", "stredni", "tezka"],
  },
  {
    id: "delitel",
    cislo: 2,
    nazev: "Dělitel",
    popis: "Počet dělitelů, jejich vyjmenování a vztah „dělí / nedělí“.",
    ikona: "➗",
    obtiznosti: ["lehka", "stredni", "tezka"],
  },
  {
    id: "delitelnost-souctu",
    cislo: 3,
    nazev: "Dělitelnost součtu, rozdílu a součinu",
    popis: "Kdy lze ze dělitelnosti sčítanců usoudit na dělitelnost součtu nebo rozdílu.",
    ikona: "➕",
    obtiznosti: ["lehka", "stredni", "tezka"],
  },
  {
    id: "znaky-10-5-2",
    cislo: 4,
    nazev: "Znaky dělitelnosti 10, 5 a 2",
    popis: "Poslední číslice a dělitelnost dvěma, pěti a deseti.",
    ikona: "🔟",
    obtiznosti: ["lehka", "stredni", "tezka"],
  },
  {
    id: "znaky-4-8",
    cislo: 5,
    nazev: "Znaky dělitelnosti 4 a 8",
    popis: "Dvojice a trojice posledních číslic u čtyřky a osmičky.",
    ikona: "🎱",
    obtiznosti: ["lehka", "stredni", "tezka"],
  },
  {
    id: "znaky-9-3",
    cislo: 6,
    nazev: "Znaky dělitelnosti 9 a 3",
    popis: "Součet číslic a dělitelnost trojkou a devítkou.",
    ikona: "9️⃣",
    obtiznosti: ["lehka", "stredni", "tezka"],
  },
  {
    id: "prvocisla",
    cislo: 7,
    nazev: "Prvočísla a čísla složená",
    popis: "Rozlišíš prvočíslo od složeného a vyznáš se v malých číslech.",
    ikona: "🧬",
    obtiznosti: ["lehka", "stredni", "tezka"],
  },
  {
    id: "rozklad",
    cislo: 8,
    nazev: "Rozklad složených čísel",
    popis: "Rozklad na prvočinitele v kanonickém tvaru.",
    ikona: "🔢",
    obtiznosti: ["lehka", "stredni", "tezka"],
  },
  {
    id: "spolecny-delitel",
    cislo: 9,
    nazev: "Společný dělitel",
    popis: "Největší společný dělitel dvou čísel (NSD).",
    ikona: "🤝",
    obtiznosti: ["lehka", "stredni", "tezka"],
  },
  {
    id: "soudela-nesoudela",
    cislo: 10,
    nazev: "Čísla soudělná a nesoudělná",
    popis: "Zda mají dvě čísla společného dělitele většího než 1.",
    ikona: "🔗",
    obtiznosti: ["lehka", "stredni", "tezka"],
  },
  {
    id: "spolecny-nasobek",
    cislo: 11,
    nazev: "Společný násobek",
    popis: "Nejmenší společný násobek dvou čísel (NSN).",
    ikona: "📊",
    obtiznosti: ["lehka", "stredni", "tezka"],
  },
  {
    id: "znaky-dalsi",
    cislo: 12,
    nazev: "Znaky dělitelnosti dalšími čísly",
    popis: "Šestka, dvanáctka a další praktické znaky z učebnice.",
    ikona: "✨",
    obtiznosti: ["lehka", "stredni", "tezka"],
  },
  {
    id: "slovni-ulohy",
    cislo: 13,
    nazev: "Slovní úlohy",
    popis: "Příběhové zadání — přečti, zvol odpověď nebo spočítej.",
    ikona: "📖",
    obtiznosti: ["lehka", "stredni", "tezka"],
  },
  {
    id: "olympiada",
    cislo: 14,
    nazev: "Úlohy z matematické olympiády",
    popis: "Náročnější hlavičkové úlohy v duchu olympiády.",
    ikona: "🏅",
    obtiznosti: ["lehka", "stredni", "tezka"],
  },
  {
    id: "souhrnna",
    cislo: 15,
    nazev: "Souhrnná cvičení",
    popis: "Mix témat z celé kapitoly dělitelnosti.",
    ikona: "🎯",
    obtiznosti: ["lehka", "stredni", "tezka"],
  },
] as const;

export type KapitolaId = (typeof KAPITOLY)[number]["id"];

export function getKapitola(id: string): Kapitola | undefined {
  return KAPITOLY.find((k) => k.id === id);
}
