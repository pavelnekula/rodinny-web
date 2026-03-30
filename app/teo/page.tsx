import Link from "next/link";
import { teoSubjects as subjects } from "@/lib/subjects";

export default function TeoPage() {
  return (
    <div className="flex min-h-full flex-col bg-[#ffffff] text-[#1a1a1a]">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-10 sm:py-14">
        <Link
          href="/"
          className="mb-8 inline-flex w-fit text-sm font-medium text-[#3b82f6] underline-offset-4 hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2"
        >
          ← Zpět na úvod
        </Link>

        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            🚀 Výuka Teo
          </h1>
          <p className="mt-2 text-[#6b7280]">
            Předměty – obsah budeme doplňovat postupně.
          </p>
        </header>

        <ul className="grid gap-4 sm:grid-cols-2">
          {subjects.map((s) => {
            const cardClass =
              "flex items-center gap-4 rounded-xl border border-[#e5e7eb] bg-[#ffffff] p-5 shadow-sm transition-shadow hover:shadow-md";
            if (s.href !== "/teo") {
              return (
                <li key={s.name}>
                  <Link
                    href={s.href}
                    className={`${cardClass} block focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2`}
                    aria-label={`Otevřít ${s.name}`}
                  >
                    <span className="text-3xl" aria-hidden>
                      {s.emoji}
                    </span>
                    <span className="text-lg font-semibold">{s.name}</span>
                    <span className="ml-auto text-sm font-medium text-[#3b82f6]">
                      Otevřít →
                    </span>
                  </Link>
                </li>
              );
            }
            return (
              <li key={s.name} className={cardClass}>
                <span className="text-3xl" aria-hidden>
                  {s.emoji}
                </span>
                <span className="text-lg font-semibold">{s.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
