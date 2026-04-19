import Link from "next/link";
import { teoSubjects as subjects } from "@/lib/subjects";

export default function TeoPage() {
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
          🚀 Výuka Teo
        </h1>
        <p className="mt-2 text-app-muted">
          Předměty – obsah budeme doplňovat postupně.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {subjects.map((s) => {
          const cardClass =
            "app-card app-card-interactive flex items-center gap-4 p-5 focus-within:ring-2 focus-within:ring-app-accent";
          if (s.href !== "/teo") {
            return (
              <li key={s.name}>
                <Link
                  href={s.href}
                  className={`${cardClass} focus-visible:outline-none`}
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
            <li key={s.name} className={cardClass}>
              <span className="text-3xl" aria-hidden>
                {s.emoji}
              </span>
              <span className="text-lg font-semibold text-app-fg">{s.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
