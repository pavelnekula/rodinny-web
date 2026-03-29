import Link from "next/link";
import { tinuskaSubjects as subjects } from "@/lib/subjects";

export default function TinuskaPage() {
  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-violet-50 via-fuchsia-50/50 to-amber-50">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-10 sm:py-14">
        <Link
          href="/"
          className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-medium text-purple-700 transition hover:text-purple-900"
        >
          ← Zpět na úvod
        </Link>

        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
            📚 Výuka Tinuška
          </h1>
          <p className="mt-2 text-slate-600">
            Předměty – obsah budeme doplňovat postupně.
          </p>
        </header>

        <ul className="grid gap-4 sm:grid-cols-2">
          {subjects.map((s) => {
            const cardClass =
              "flex items-center gap-4 rounded-2xl border border-violet-200/80 bg-white/80 p-5 shadow-md shadow-violet-500/10 backdrop-blur-sm transition hover:border-violet-300 hover:shadow-lg";
            if (s.name === "Angličtina") {
              return (
                <li key={s.name}>
                  <Link
                    href="/tinuska/anglictina"
                    className={`${cardClass} block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500`}
                    aria-label="Otevřít anglická slovíčka"
                  >
                    <span className="text-3xl" aria-hidden>
                      {s.emoji}
                    </span>
                    <span className="text-lg font-semibold text-slate-800">
                      {s.name}
                    </span>
                    <span className="ml-auto text-sm font-medium text-violet-600">
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
                <span className="text-lg font-semibold text-slate-800">
                  {s.name}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
