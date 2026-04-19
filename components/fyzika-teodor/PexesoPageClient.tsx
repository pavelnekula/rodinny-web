"use client";

import Link from "next/link";
import { getTopicContent, getTopicMeta } from "@/data/fyzika";
import { FyzikaBackNav } from "./FyzikaBackNav";
import { PexesoGame } from "./PexesoGame";

export function PexesoPageClient({ slug }: { slug: string }) {
  const meta = getTopicMeta(slug);
  const content = getTopicContent(slug);
  if (!meta || !content) {
    return <p className="text-app-muted">Téma nenalezeno.</p>;
  }

  return (
    <div>
      <FyzikaBackNav href={`/fyzika-teodor/${slug}`} label={meta.title} />
      <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
        {meta.emoji} Pexeso · {meta.title}
      </h1>
      <p className="mb-6 text-sm text-app-muted">
        Mřížka 5×4 · najdi 10 párů · otoč dvě karty
      </p>
      <PexesoGame
        slug={slug}
        pairs={content.pexeso}
        cardBackClass={`bg-gradient-to-br ${meta.accent} border-slate-600`}
        accentBorder="focus-visible:ring-2 focus-visible:ring-app-accent"
      />
      <div className="mt-8">
        <Link
          href={`/fyzika-teodor/${slug}/cviceni`}
          className="text-sm text-app-accent hover:underline"
        >
          → Cvičení
        </Link>
      </div>
    </div>
  );
}
