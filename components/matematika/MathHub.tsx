"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getBestBleskovky,
  getBestKarty,
  getBestPisemne,
  getBestPocitani,
  getBestZavorky,
  getPetiminutovkaRecord,
  starsFromBleskovky,
  starsFromPetiminutovky,
  starsFromScore,
} from "@/lib/mathStorage";
import { StarRow } from "./StarRow";

type CardDef = {
  href: string;
  title: string;
  desc: string;
  emoji: string;
  stars: number;
  /** Skryje hvězdičky „nejlepší výkon“ (např. u cvičení bez tlaku na skóre). */
  hideStars?: boolean;
};

export function MathHub() {
  const [cards, setCards] = useState<CardDef[]>(() =>
    buildCards(0, 0, 0, 0, 0, 0),
  );

  useEffect(() => {
    const p = getBestPocitani() ?? 0;
    const pi = getBestPisemne() ?? 0;
    const z = getBestZavorky() ?? 0;
    const b = getBestBleskovky() ?? 0;
    const k = getBestKarty();
    const kStars = k?.stars ?? 0;
    const petMax = Math.max(
      getPetiminutovkaRecord("nasobilka") ?? 0,
      getPetiminutovkaRecord("deleni") ?? 0,
      getPetiminutovkaRecord("scitani_odcitani") ?? 0,
      getPetiminutovkaRecord("scitani_odcitani_do100") ?? 0,
      getPetiminutovkaRecord("chybejici_cislo") ?? 0,
      getPetiminutovkaRecord("all") ?? 0,
    );
    setCards(
      buildCards(
        starsFromScore(p, 8),
        starsFromScore(pi, 4),
        starsFromScore(z, 6),
        starsFromBleskovky(b),
        kStars,
        starsFromPetiminutovky(petMax),
      ),
    );
  }, []);

  const cardSurface =
    "app-card app-card-interactive flex h-full min-h-[140px] flex-col p-6 focus-within:ring-2 focus-within:ring-app-accent focus-visible:outline-none";

  return (
    <div className="mx-auto w-full max-w-4xl py-2 sm:py-4">
      <header className="mb-10 text-center sm:text-left">
        <h1 className="app-title-gradient text-3xl font-bold tracking-[-0.05em] sm:text-4xl md:text-5xl md:tracking-[-0.07em]">
          Matematika pro Tinušku 🧮
        </h1>
        <p className="mt-3 text-lg text-app-muted">
          Vyber si cvičení nebo rychlou hru — všechno je jen u nás v prohlížeči.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <li key={c.href}>
            <Link href={c.href} className={`${cardSurface} group block`}>
              <div className="flex items-start gap-3">
                <span className="text-4xl" aria-hidden>
                  {c.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold text-app-fg">{c.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-app-muted">
                    {c.desc}
                  </p>
                </div>
              </div>
              <div className="mt-4 border-t border-app-divider pt-3">
                {c.hideStars ? (
                  <p className="text-xs text-app-muted">
                    Klidný režim — bez skóre na téhle kartě.
                  </p>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-app-subtle">
                      Nejlepší výkon
                    </span>
                    <StarRow count={c.stars} max={3} />
                  </div>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function buildCards(
  s1: number,
  s2: number,
  s3: number,
  s4: number,
  s5: number,
  s6: number,
): CardDef[] {
  return [
    {
      href: "/matematika/delitelnost",
      title: "Dělitelnost pro Teodora",
      desc: "Dělitelnost – 15 kapitol: násobky, znaky, prvočísla, slovní úlohy.",
      emoji: "🔢",
      stars: 0,
    },
    {
      href: "/matematika/pocitani",
      title: "Doplň číslo",
      desc: "Osm příkladů s chybějícím číslem — jen sčítání a odčítání.",
      emoji: "✏️",
      stars: s1,
    },
    {
      href: "/matematika/pisemne",
      title: "Písemné příklady",
      desc: "Odčítání pod sebou a zkouška: sedí to s horním číslem?",
      emoji: "📐",
      stars: s2,
    },
    {
      href: "/matematika/zavorky",
      title: "Závorky a pořadí",
      desc: "Závorky, násobení před sčítáním — přesně jako ve škole.",
      emoji: "🧠",
      stars: s3,
    },
    {
      href: "/matematika/bleskovky",
      title: "Bleskové příklady",
      desc: "60 sekund, co nejvíc správně — časomíra a body.",
      emoji: "⚡",
      stars: s4,
    },
    {
      href: "/matematika/karty",
      title: "Matematické karty",
      desc: "Pexeso: spáruj příklad s výsledkem nebo dva stejné výsledky.",
      emoji: "🃏",
      stars: s5,
    },
    {
      href: "/matematika/petiminutovky",
      title: "Pětiminutovky",
      desc: "Pět minut bez času během hry — po kole přehled a špatné příklady; násobilka, dělení, mix.",
      emoji: "⏱️",
      stars: s6,
      hideStars: true,
    },
  ];
}
