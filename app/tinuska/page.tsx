import Link from "next/link";
import { tinuskaSubjects as subjects } from "@/lib/subjects";

export default function TinuskaPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col py-2 sm:py-4">
      <Link
        href="/"
        className="mb-8 inline-flex w-fit text-sm font-medium text-app-accent underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
      >
        ← Zpět na úvod
      </Link>

      <header className="mb-10">
        <h1 className="app-title-gradient text-3xl font-bold tracking-[-0.05em] sm:text-4xl sm:tracking-[-0.06em]">
          📚 Výuka Tinuška
        </h1>
        <p className="mt-2 text-app-muted">
          Předměty – obsah budeme doplňovat postupně.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {subjects.map((s) => {
          const cardClass =
            "app-card app-card-interactive flex flex-col gap-4 p-5 focus-within:ring-2 focus-within:ring-app-accent";
          const linkRowClass =
            "flex items-center gap-4 focus-visible:outline-none";

          if (s.sublinks && s.sublinks.length > 0) {
            return (
              <li key={s.name}>
                <div className={cardClass}>
                  <div className={`${linkRowClass} pointer-events-none`}>
                    <span className="text-3xl" aria-hidden>
                      {s.emoji}
                    </span>
                    <span className="text-lg font-semibold text-app-fg">
                      {s.name}
                    </span>
                  </div>
                  <ul
                    className="flex flex-col gap-2 border-t border-app-divider pt-3"
                    aria-label={`${s.name} — odkazy`}
                  >
                    {s.sublinks.map((sub) => (
                      <li key={sub.href}>
                        <Link
                          href={sub.href}
                          className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-app-fg transition hover:bg-app-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
                        >
                          <span>{sub.name}</span>
                          <span className="text-app-accent" aria-hidden>
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
                  className={`${cardClass} ${linkRowClass} flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent`}
                  aria-label={`Otevřít ${s.name}`}
                >
                  <span className="text-3xl" aria-hidden>
                    {s.emoji}
                  </span>
                  <span className="text-lg font-semibold text-app-fg">
                    {s.name}
                  </span>
                  <span className="ml-auto text-sm font-medium text-app-accent">
                    Otevřít →
                  </span>
                </Link>
              </li>
            );
          }
          return (
            <li
              key={s.name}
              className={`${cardClass} flex items-center gap-4`}
            >
              <span className="text-3xl" aria-hidden>
                {s.emoji}
              </span>
              <span className="text-lg font-semibold text-app-fg">
                {s.name}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
