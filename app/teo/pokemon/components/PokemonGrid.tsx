import type { PokemonCard } from "@/lib/pokemonCards";
import { PokemonCard as PokemonCardItem } from "./PokemonCard";

type Props = {
  cards: PokemonCard[];
};

/**
 * Responzivní mřížka: 1 sloupec mobil, 2 tablet, 3 desktop, 4 velký desktop.
 */
export function PokemonGrid({ cards }: Props) {
  if (cards.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-app-border bg-app-card/50 px-6 py-10 text-center text-app-muted">
        Zatím žádné karty v tabulce <code className="text-xs">pokemon_cards</code>.
        Přidej první přes formulář níže nebo vlož data v Supabase.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map((card) => (
        <li key={card.id}>
          <PokemonCardItem card={card} />
        </li>
      ))}
    </ul>
  );
}
