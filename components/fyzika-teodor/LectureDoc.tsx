import Link from "next/link";
import { getTopicContent, getTopicMeta } from "@/data/fyzika";
import { FormulaBox } from "./FormulaBox";
import { FyzikaBackNav } from "./FyzikaBackNav";

type LectureDocProps = {
  slug: string;
};

export function LectureDoc({ slug }: LectureDocProps) {
  const meta = getTopicMeta(slug);
  const content = getTopicContent(slug);
  if (!meta || !content) {
    return (
      <p className="text-slate-400">Téma nenalezeno.</p>
    );
  }

  return (
    <div>
      <FyzikaBackNav href="/fyzika-teodor" label="Fyzika — úvod" />
      <header className="mb-8">
        <p className="text-3xl" aria-hidden>
          {meta.emoji}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {meta.title}
        </h1>
        <p className="mt-2 text-slate-400">Výklad · prima osmileté gymnázium</p>
      </header>

      <div className="space-y-3">
        {content.lecture.map((sec) => (
          <details
            key={sec.id}
            className="group rounded-xl border border-slate-700/80 bg-slate-900/50 open:border-cyan-500/30"
          >
            <summary className="cursor-pointer list-none px-4 py-4 font-semibold text-slate-100 marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-2">
                {sec.title}
                <span className="text-cyan-400 transition group-open:rotate-180">▼</span>
              </span>
            </summary>
            <div className="space-y-3 border-t border-slate-700/60 px-4 pb-4 pt-3 text-slate-300">
              {sec.paragraphs.map((p, i) => (
                <p key={i} className="leading-relaxed">
                  {p}
                </p>
              ))}
              {sec.formula ? <FormulaBox>{sec.formula}</FormulaBox> : null}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href={`/fyzika-teodor/${slug}/cviceni`}
          className="inline-flex rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 px-6 py-3 font-semibold text-white shadow-[0_0_24px_rgba(34,211,238,0.25)] transition hover:brightness-110"
        >
          Zkus si cvičení →
        </Link>
        <Link
          href={`/fyzika-teodor/${slug}/pexeso`}
          className="inline-flex rounded-xl border border-slate-600 px-6 py-3 font-semibold text-slate-200 hover:border-cyan-500/50"
        >
          Pexeso
        </Link>
      </div>
    </div>
  );
}
