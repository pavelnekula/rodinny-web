import Link from "next/link";
import { teoSubjects as subjects } from "@/lib/subjects";

export default function TeoPage() {
  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-sky-50 via-blue-50/50 to-indigo-50/40">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-10 sm:py-14">
        <Link
          href="/"
          className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-medium text-blue-700 transition hover:text-blue-900"
        >
          ← Zpět na úvod
        </Link>

        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
            🚀 Výuka Teo
          </h1>
          <p className="mt-2 text-slate-600">
            Předměty – obsah budeme doplňovat postupně.
          </p>
        </header>

        <ul className="grid gap-4 sm:grid-cols-2">
          {subjects.map((s) => (
            <li
              key={s.name}
              className="flex items-center gap-4 rounded-2xl border border-sky-200/80 bg-white/80 p-5 shadow-md shadow-blue-500/10 backdrop-blur-sm"
            >
              <span className="text-3xl" aria-hidden>
                {s.emoji}
              </span>
              <span className="text-lg font-semibold text-slate-800">{s.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
