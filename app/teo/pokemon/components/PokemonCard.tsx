import type { PokemonCard } from "@/lib/pokemonCards";

/** Tailwind třídy badge podle stavu karty (Mint / Near Mint / Good / Fair). */
function conditionBadgeClass(condition: string): string {
  const c = condition.trim();
  if (c === "Mint")
    return "bg-emerald-500/25 text-emerald-200 ring-emerald-500/45";
  if (c === "Near Mint")
    return "bg-sky-500/25 text-sky-200 ring-sky-500/45";
  if (c === "Good")
    return "bg-amber-500/25 text-amber-100 ring-amber-500/45";
  if (c === "Fair")
    return "bg-zinc-600/40 text-zinc-200 ring-zinc-500/40";
  return "bg-slate-700/80 text-slate-300 ring-slate-500/35";
}

type Props = {
  card: PokemonCard;
};

/**
 * Jedna sběratelská karta — layout připomíná fyzickou Pokémon kartu (obrázek nahoře, údaje dole).
 */
export function PokemonCard({ card }: Props) {
  const priceLabel =
    card.price_czk != null && Number.isFinite(Number(card.price_czk))
      ? `${Number(card.price_czk).toLocaleString("cs-CZ")} Kč`
      : "cena bude doplněna";

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-600/80 bg-slate-800 shadow-lg shadow-black/40 ring-1 ring-white/5 transition hover:border-slate-500 hover:shadow-xl hover:shadow-black/50">
      {/* Horní část — artwork jako na reálné kartě */}
      <div className="relative aspect-[63/88] w-full bg-slate-950">
        {card.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- URL z databáze, domény nejsou pevné
          <img
            src={card.image_url}
            alt={`Karta ${card.name}`}
            className="h-full w-full object-contain p-3"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-500"
            aria-hidden
          >
            <span className="text-5xl">🔴</span>
            <span className="text-xs">bez obrázku</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 border-t border-slate-700/80 p-4">
        <h2 className="text-xl font-bold tracking-tight text-white">
          {card.name}
        </h2>
        <p className="text-sm text-slate-400">{card.card_set}</p>
        <p className="text-sm tabular-nums text-slate-400">Rok: {card.year}</p>
        <span
          className={`inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${conditionBadgeClass(card.condition)}`}
        >
          {card.condition}
        </span>
        <p className="mt-auto text-sm font-medium text-slate-200">
          {priceLabel}
        </p>
      </div>
    </article>
  );
}
