"use client";

import { ExerciseRunner } from "./ExerciseRunner";
import { FyzikaBackNav } from "./FyzikaBackNav";
import { getTopicContent, getTopicMeta } from "@/data/fyzika";

export function ExercisePageClient({ slug }: { slug: string }) {
  const meta = getTopicMeta(slug);
  const content = getTopicContent(slug);
  if (!meta || !content) {
    return <p className="text-slate-400">Téma nenalezeno.</p>;
  }

  return (
    <div>
      <FyzikaBackNav href={`/fyzika-teodor/${slug}`} label={meta.title} />
      <h1 className="mb-6 text-2xl font-bold text-white sm:text-3xl">
        {meta.emoji} Cvičení · {meta.title}
      </h1>
      <ExerciseRunner
        slug={slug}
        exercises={content.exercises}
        backHref={`/fyzika-teodor/${slug}`}
      />
    </div>
  );
}
