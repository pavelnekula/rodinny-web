import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teodor",
  description: "Sekce pro Teodora — Pokémon kolekce a další.",
};

export default function TeodorPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col py-2 sm:py-4">
      <Link
        href="/"
        className="mb-8 inline-flex w-fit text-sm font-medium text-app-accent underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
      >
        ← Zpět na úvod
      </Link>

      <header className="mb-10">
        <h1 className="app-title-gradient text-3xl font-bold tracking-[-0.05em] sm:text-4xl">
          Teodor
        </h1>
        <p className="mt-2 text-app-muted">
          Odkazy na Teodorovy stránky a sbírky.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        <li>
          <Link
            href="/matematika/delitelnost"
            className="app-card app-card-interactive flex items-center gap-4 p-5 focus-within:ring-2 focus-within:ring-app-accent focus-visible:outline-none"
            aria-label="Otevřít dělitelnost — matematika pro Teodora"
          >
            <span className="text-3xl" aria-hidden>
              🔢
            </span>
            <span className="text-lg font-semibold text-app-fg">
              Dělitelnost pro Teodora
            </span>
            <span className="ml-auto text-sm font-medium text-app-accent">
              Otevřít →
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/teodor/pokemon"
            className="app-card app-card-interactive flex items-center gap-4 p-5 focus-within:ring-2 focus-within:ring-app-accent focus-visible:outline-none"
            aria-label="Otevřít Pokémon kolekci"
          >
            <span className="text-3xl" aria-hidden>
              🃏
            </span>
            <span className="text-lg font-semibold text-app-fg">
              Pokémon kolekce Teodora
            </span>
            <span className="ml-auto text-sm font-medium text-app-accent">
              Otevřít →
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
