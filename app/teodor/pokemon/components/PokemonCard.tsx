import type { PokemonCardRow } from "@/lib/pokemonCards";

/** Tailwind třídy badge podle stavu karty. */
function conditionBadgeClass(condition: string): string {
  const c = condition.trim();
  if (c === "Mint") return "bg-emerald-500/20 text-emerald-300 ring-emerald-500/40";
  if (c === "Near Mint")
    return "bg-sky-500/20 text-sky-200 ring-sky-500/40";
  if (c === "Good") return "bg-amber-500/20 text-amber-200 ring-amber-500/40";
  if (c === "Fair") return "bg-zinc-500/25 text-zinc-300 ring-zinc-500/40";
  return "bg-app-card text-app-muted ring-app-border";
}

export function PokemonCard({ card }: { card: PokemonCardRow }) {
  const price =
    card.price_czk != null && Number.isFinite(Number(card.price_czk))
      ? `${Number(card.price_czk).toLocaleString("cs-CZ")} Kč`
      : "Cena bude doplněna";

  return (
    <article className="app-card flex flex-col overflow-hidden rounded-2xl border border-app-border shadow-lg shadow-black/20 ring-1 ring-white/5 transition hover:border-app-border-hover hover:shadow-xl">
      <div className="relative aspect-[63/88] w-full bg-app-bg">
        {card.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- externí URL z DB bez známých domén
          <img
            src={card.image_url}
            alt={`Karta ${card.name}`}
            className="h-full w-full object-contain p-3"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-app-muted"
            aria-hidden
          >
            <span className="text-5xl">🔴</span>
            <span className="text-xs">bez obrázku</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="text-xl font-bold tracking-tight text-app-fg">
          {card.name}
        </h2>
        <p className="text-sm text-app-muted">{card.card_set}</p>
        <p className="text-sm tabular-nums text-app-muted">Rok: {card.year}</p>
        <span
          className={`inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${conditionBadgeClass(card.condition)}`}
        >
          {card.condition}
        </span>
        <p className="mt-auto text-sm font-medium text-app-fg">{price}</p>
      </div>
    </article>
  );
}
