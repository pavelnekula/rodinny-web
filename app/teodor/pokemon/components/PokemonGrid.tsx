import type { PokemonCardRow } from "@/lib/pokemonCards";
import { PokemonCard } from "./PokemonCard";

/** Mřížka karet — responzivní sloupce. */
export function PokemonGrid({ cards }: { cards: PokemonCardRow[] }) {
  if (cards.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-app-border bg-app-card/50 px-6 py-10 text-center text-app-muted">
        Zatím žádné karty. Přidej první přes tlačítko níže nebo načti seed SQL v
        Supabase.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map((card) => (
        <li key={card.id}>
          <PokemonCard card={card} />
        </li>
      ))}
    </ul>
  );
}
