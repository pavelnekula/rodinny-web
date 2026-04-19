import Link from "next/link";
import type { Metadata } from "next";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { PokemonCard } from "@/lib/pokemonCards";
import { PokemonGrid } from "./components/PokemonGrid";
import { PokemonAddSection } from "./components/PokemonAddSection";

export const metadata: Metadata = {
  title: "Pokémon kolekce | Teo",
  description: "Přehled Pokémon karet — data ze Supabase.",
};

/** Stránka načítá čerstvá data z API (žádný statický snapshot bez DB). */
export const dynamic = "force-dynamic";

export default async function TeoPokemonPage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-3xl py-4">
        <Link
          href="/teo"
          className="mb-6 inline-flex text-sm font-medium text-app-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
        >
          ← Zpět na Teo
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

  const { data, error } = await supabase
    .from("pokemon_cards")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="mx-auto max-w-3xl py-4">
        <Link
          href="/teo"
          className="mb-6 inline-flex text-sm font-medium text-app-accent underline-offset-4 hover:underline"
        >
          ← Zpět na Teo
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

  const cards = (data ?? []) as PokemonCard[];
  const totalCount = cards.length;

  return (
    <div className="mx-auto w-full max-w-6xl py-2 sm:py-4">
      <Link
        href="/teo"
        className="mb-6 inline-flex text-sm font-medium text-app-accent underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
      >
        ← Zpět na Teo
      </Link>

      <header className="mb-8">
        <h1 className="app-title-gradient text-3xl font-bold tracking-[-0.05em] sm:text-4xl md:text-5xl">
          🃏 Pokémon kolekce
        </h1>
        <p className="mt-4 text-lg font-semibold tabular-nums text-app-fg">
          Celkem karet:{" "}
          <span className="text-app-accent">{totalCount}</span>
        </p>
        <p className="mt-2 max-w-2xl text-app-muted">
          Záznamy z tabulky <code className="text-xs">pokemon_cards</code> v
          Supabase.
        </p>
      </header>

      <PokemonAddSection />

      <section aria-label="Mřížka karet kolekce" className="mt-8">
        <PokemonGrid cards={cards} />
      </section>
    </div>
  );
}
