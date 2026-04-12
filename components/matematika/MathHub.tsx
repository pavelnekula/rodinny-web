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
  border: string;
  bg: string;
  hover: string;
  stars: number;
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

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-10 text-center sm:text-left">
        <h1 className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl md:text-5xl">
          Matematika pro Tinušku 🧮
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Vyber si cvičení nebo rychlou hru — všechno je jen u nás v prohlížeči.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <li key={c.href}>
            <Link
              href={c.href}
              className={`flex h-full min-h-[140px] flex-col rounded-3xl border-2 ${c.border} ${c.bg} p-6 shadow-lg transition ${c.hover} focus-visible:outline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400`}
            >
              <div className="flex items-start gap-3">
                <span className="text-4xl" aria-hidden>
                  {c.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold text-slate-800">{c.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {c.desc}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/50 pt-3">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Nejlepší výkon
                </span>
                <StarRow count={c.stars} max={3} />
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
      href: "/matematika/pocitani",
      title: "Doplň číslo",
      desc: "Osm příkladů s chybějícím číslem — jen sčítání a odčítání.",
      emoji: "✏️",
      border: "border-sky-300",
      bg: "bg-gradient-to-br from-sky-50 to-blue-100/90",
      hover: "hover:scale-[1.02] hover:shadow-xl",
      stars: s1,
    },
    {
      href: "/matematika/pisemne",
      title: "Písemné příklady",
      desc: "Odčítání pod sebou a zkouška: sedí to s horním číslem?",
      emoji: "📐",
      border: "border-emerald-300",
      bg: "bg-gradient-to-br from-emerald-50 to-green-100/90",
      hover: "hover:scale-[1.02] hover:shadow-xl",
      stars: s2,
    },
    {
      href: "/matematika/zavorky",
      title: "Závorky a pořadí",
      desc: "Závorky, násobení před sčítáním — přesně jako ve škole.",
      emoji: "🧠",
      border: "border-orange-300",
      bg: "bg-gradient-to-br from-orange-50 to-amber-100/90",
      hover: "hover:scale-[1.02] hover:shadow-xl",
      stars: s3,
    },
    {
      href: "/matematika/bleskovky",
      title: "Bleskové příklady",
      desc: "60 sekund, co nejvíc správně — časomíra a body.",
      emoji: "⚡",
      border: "border-violet-300",
      bg: "bg-gradient-to-br from-violet-50 to-purple-100/90",
      hover: "hover:scale-[1.02] hover:shadow-xl",
      stars: s4,
    },
    {
      href: "/matematika/karty",
      title: "Matematické karty",
      desc: "Pexeso: spáruj příklad s výsledkem nebo dva stejné výsledky.",
      emoji: "🃏",
      border: "border-pink-300",
      bg: "bg-gradient-to-br from-pink-50 to-rose-100/90",
      hover: "hover:scale-[1.02] hover:shadow-xl",
      stars: s5,
    },
    {
      href: "/matematika/petiminutovky",
      title: "Pětiminutovky",
      desc: "Pět minut drilování — násobilka, dělení, po desítkách nebo vše najednou.",
      emoji: "⏱️",
      border: "border-cyan-300",
      bg: "bg-gradient-to-br from-cyan-50 to-sky-100/90",
      hover: "hover:scale-[1.02] hover:shadow-xl",
      stars: s6,
    },
  ];
}
