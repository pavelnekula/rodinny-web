/** Řádek z tabulky `pokemon_cards` (Supabase vrací snake_case). */
export interface PokemonCard {
  id: number;
  name: string;
  card_set: string;
  year: number;
  condition: string;
  price_czk: number | null;
  image_url: string | null;
  created_at: string;
}

/** Alias pro starší importy — stejný tvar jako `PokemonCard`. */
export type PokemonCardRow = PokemonCard;

/** Povolené hodnoty stavu karty ve formuláři. */
export const POKEMON_CONDITIONS = [
  "Mint",
  "Near Mint",
  "Good",
  "Fair",
] as const;

export type PokemonCondition = (typeof POKEMON_CONDITIONS)[number];
