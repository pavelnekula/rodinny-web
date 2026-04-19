"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  POKEMON_CONDITIONS,
  type PokemonCondition,
} from "@/lib/pokemonCards";

type Props = {
  /** Po úspěšném uložení (např. router.refresh + zavření panelu). */
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function AddCardForm({ onSuccess, onCancel }: Props) {
  const [name, setName] = useState("");
  const [cardSet, setCardSet] = useState("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [condition, setCondition] = useState<PokemonCondition>("Near Mint");
  const [priceRaw, setPriceRaw] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const trimmedName = name.trim();
    const trimmedSet = cardSet.trim();
    if (!trimmedName || !trimmedSet) {
      setError("Vyplň název Pokémona i sérii.");
      return;
    }
    if (!Number.isFinite(year) || year < 1900 || year > 2100) {
      setError("Zadej rozumný rok vydání.");
      return;
    }

    let price_czk: number | null = null;
    if (priceRaw.trim() !== "") {
      const n = Number(priceRaw.replace(",", ".").trim());
      if (!Number.isFinite(n) || n < 0) {
        setError("Cena musí být nezáporné číslo (nebo pole nech prázdné).");
        return;
      }
      price_czk = n;
    }

    setSubmitting(true);
    const { error: insertError } = await supabase.from("pokemon_cards").insert({
      name: trimmedName,
      card_set: trimmedSet,
      year,
      condition,
      price_czk,
      image_url: null,
    });

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSuccess(true);
    setName("");
    setCardSet("");
    setYear(new Date().getFullYear());
    setCondition("Near Mint");
    setPriceRaw("");
    onSuccess?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="app-card mt-4 space-y-4 rounded-2xl border border-app-border p-5 shadow-md"
      aria-labelledby="add-card-heading"
    >
      <h3 id="add-card-heading" className="text-lg font-semibold text-app-fg">
        Nová karta
      </h3>

      {error && (
        <p
          className="rounded-lg border border-rose-500/40 bg-rose-950/40 px-3 py-2 text-sm text-rose-200"
          role="alert"
        >
          {error}
        </p>
      )}
      {success && (
        <p
          className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-3 py-2 text-sm text-emerald-200"
          role="status"
        >
          Karta byla uložena.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-app-muted">Název Pokémona</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="app-field rounded-lg border border-app-border bg-app-bg px-3 py-2 text-app-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
            required
            autoComplete="off"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-app-muted">Série / sada</span>
          <input
            type="text"
            value={cardSet}
            onChange={(e) => setCardSet(e.target.value)}
            className="app-field rounded-lg border border-app-border bg-app-bg px-3 py-2 text-app-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
            required
            autoComplete="off"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-app-muted">Rok vydání</span>
          <input
            type="number"
            min={1900}
            max={2100}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="app-field rounded-lg border border-app-border bg-app-bg px-3 py-2 text-app-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-app-muted">Stav karty</span>
          <select
            value={condition}
            onChange={(e) =>
              setCondition(e.target.value as PokemonCondition)
            }
            className="app-field rounded-lg border border-app-border bg-app-bg px-3 py-2 text-app-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
          >
            {POKEMON_CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="text-app-muted">
            Cena v Kč (volitelné — jinak doplníme později)
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={priceRaw}
            onChange={(e) => setPriceRaw(e.target.value)}
            placeholder="např. 1500"
            className="app-field rounded-lg border border-app-border bg-app-bg px-3 py-2 text-app-fg placeholder:text-app-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="app-btn-pill rounded-xl bg-app-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
        >
          {submitting ? "Ukládám…" : "Uložit kartu"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-app-border px-5 py-2.5 text-sm font-medium text-app-muted transition hover:border-app-border-hover hover:text-app-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
          >
            Zavřít
          </button>
        )}
      </div>
    </form>
  );
}
