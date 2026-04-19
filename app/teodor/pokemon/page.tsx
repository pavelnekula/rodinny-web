import Link from "next/link";
import type { Metadata } from "next";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { PokemonCardRow } from "@/lib/pokemonCards";
import { PokemonGrid } from "./components/PokemonGrid";
import { PokemonAddSection } from "./components/PokemonAddSection";

export const metadata: Metadata = {
  title: "Pokémon kolekce Teodora",
  description: "Přehled Pokémon karet v kolekci — Supabase.",
};

export const dynamic = "force-dynamic";

function toNumber(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

export default async function TeodorPokemonPage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-3xl py-4">
        <Link
          href="/teodor"
          className="mb-6 inline-flex text-sm font-medium text-app-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
        >
          ← Zpět na Teodora
        </Link>
        <p className="rounded-xl border border-amber-500/40 bg-amber-950/30 px-4 py-3 text-amber-100">
          Chybí proměnné prostředí{" "}
          <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> a{" "}
          <code className="text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> v{" "}
          <code className="text-xs">.env.local</code>.
        </p>
      </div>
    );
  }

  const { data, error } = await getSupabase()
    .from("pokemon_cards")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="mx-auto max-w-3xl py-4">
        <Link
          href="/teodor"
          className="mb-6 inline-flex text-sm font-medium text-app-accent underline-offset-4 hover:underline"
        >
          ← Zpět na Teodora
        </Link>
        <p className="rounded-xl border border-rose-500/40 bg-rose-950/40 px-4 py-3 text-rose-100">
          Nepodařilo se načíst karty: {error.message}
        </p>
        <p className="mt-4 text-sm text-app-muted">
          Zkontroluj tabulku <code>pokemon_cards</code>, RLS politiky a klíče v
          Supabase.
        </p>
      </div>
    );
  }

  const cards = (data ?? []) as PokemonCardRow[];
  const totalCount = cards.length;
  const totalValueCzk = cards.reduce(
    (sum, c) => sum + toNumber(c.price_czk),
    0,
  );
  const pricedCount = cards.filter(
    (c) => c.price_czk != null && toNumber(c.price_czk) > 0,
  ).length;

  return (
    <div className="mx-auto w-full max-w-6xl py-2 sm:py-4">
      <Link
        href="/teodor"
        className="mb-6 inline-flex text-sm font-medium text-app-accent underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
      >
        ← Zpět na Teodora
      </Link>

      <header className="mb-8">
        <h1 className="app-title-gradient text-3xl font-bold tracking-[-0.05em] sm:text-4xl md:text-5xl">
          🃏 Pokémon kolekce Teodora
        </h1>
        <p className="mt-2 max-w-2xl text-lg text-app-muted">
          Správa a přehled všech Pokémon karet v kolekci (data v Supabase).
        </p>
      </header>

      <section
        className="mb-8 grid gap-4 sm:grid-cols-2"
        aria-label="Statistiky kolekce"
      >
        <div className="app-card rounded-2xl p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-app-subtle">
            Počet karet
          </p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-app-fg">
            {totalCount}
          </p>
        </div>
        <div className="app-card rounded-2xl p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-app-subtle">
            Odhadovaná celková hodnota
          </p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-app-fg">
            {totalValueCzk > 0
              ? `${totalValueCzk.toLocaleString("cs-CZ")} Kč`
              : "—"}
          </p>
          {pricedCount === 0 && totalCount > 0 && (
            <p className="mt-2 text-xs text-app-muted">
              U žádné karty zatím není vyplněná cena — součet se doplní po zadání
              nebo budoucím odhadu.
            </p>
          )}
        </div>
      </section>

      <PokemonAddSection />

      <PokemonGrid cards={cards} />
    </div>
  );
}
