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
              "rounded-2xl border border-violet-200/80 bg-white/80 p-5 shadow-md shadow-violet-500/10 backdrop-blur-sm transition hover:border-violet-300 hover:shadow-lg";
            const linkRowClass =
              "flex items-center gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500";

            if (s.sublinks && s.sublinks.length > 0) {
              return (
                <li key={s.name}>
                  <div className={`${cardClass} flex flex-col gap-4`}>
                    <div className={`${linkRowClass} pointer-events-none`}>
                      <span className="text-3xl" aria-hidden>
                        {s.emoji}
                      </span>
                      <span className="text-lg font-semibold text-slate-800">
                        {s.name}
                      </span>
                    </div>
                    <ul
                      className="flex flex-col gap-2 border-t border-violet-200/60 pt-3"
                      aria-label={`${s.name} — odkazy`}
                    >
                      {s.sublinks.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-violet-800 transition hover:bg-violet-100/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                          >
                            <span>{sub.name}</span>
                            <span className="text-violet-500" aria-hidden>
                              →
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            }

            if (s.href !== "/tinuska") {
              return (
                <li key={s.name}>
                  <Link
                    href={s.href}
                    className={`${cardClass} ${linkRowClass} flex items-center`}
                    aria-label={`Otevřít ${s.name}`}
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
              <li key={s.name} className={`${cardClass} flex items-center gap-4`}>
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
