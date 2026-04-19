"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddCardForm } from "./AddCardForm";

/** Tlačítko pro zobrazení/skrytí admin formuláře + obnovení seznamu po uložení. */
export function PokemonAddSection() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="mb-8">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="app-btn-pill inline-flex items-center gap-2 rounded-xl border border-app-border bg-app-card px-4 py-2.5 text-sm font-semibold text-app-fg transition hover:border-app-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
        aria-expanded={open}
        aria-controls="pokemon-add-form-region"
      >
        {open ? "Skrýt formulář" : "Přidat kartu"}
      </button>

      {open && (
        <div id="pokemon-add-form-region">
          <AddCardForm
            onSuccess={() => {
              router.refresh();
            }}
            onCancel={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
