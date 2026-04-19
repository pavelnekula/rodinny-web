"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { CategoryId, Word } from "./types";
import { getCategoryMeta, VOCABULARY_CATEGORIES } from "./VocabularyData";
import { CategoryWordsBrowseModal } from "./CategoryWordsBrowseModal";

type CategorySelectorProps = {
  value: CategoryId | null;
  onChange: (id: CategoryId) => void;
  mergedWords: Word[];
};

export function CategorySelector({
  value,
  onChange,
  mergedWords,
}: CategorySelectorProps) {
  const [browseCategoryId, setBrowseCategoryId] = useState<CategoryId | null>(
    null,
  );

  const selectedMeta = value ? getCategoryMeta(value) : undefined;

  return (
    <div>
      <h2 className="mb-2 text-xl font-bold text-app-fg sm:text-2xl">
        Kategorie (postup učení)
      </h2>
      {selectedMeta ? (
        <p
          className="app-card mb-4 flex flex-wrap items-center gap-2 border-app-accent px-4 py-3 text-base font-semibold text-app-fg"
          role="status"
          aria-live="polite"
        >
          <span
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-app-accent text-lg text-white"
            aria-hidden
          >
            ✓
          </span>
          <span>
            Vybraná oblast:{" "}
            <span className="text-app-accent">{selectedMeta.titleCs}</span>
          </span>
        </p>
      ) : (
        <p className="mb-4 text-base text-app-muted">
          Klikni na dlaždici — nahoře se zvýrazní „Vybraná oblast“.
        </p>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3">
        {VOCABULARY_CATEGORIES.map((cat, i) => {
          const selected = value === cat.id;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`relative flex min-h-[7.5rem] flex-col p-4 pb-11 text-left text-app-fg transition focus-within:ring-2 focus-within:ring-app-accent/50 app-card app-card-interactive ${cat.tileClass} ${
                selected
                  ? "z-[1] border-app-accent ring-2 ring-app-accent ring-offset-2 ring-offset-app-bg"
                  : "border-app-border opacity-95 hover:opacity-100"
              }`}
            >
              {selected ? (
                <span className="absolute right-12 top-3 z-[2] inline-flex items-center rounded-full bg-app-accent px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm">
                  Vybráno
                </span>
              ) : null}
              <button
                type="button"
                aria-pressed={selected}
                aria-current={selected ? "true" : undefined}
                aria-label={`Vybrat kategorii ${cat.titleCs}`}
                onClick={() => onChange(cat.id)}
                className="w-full rounded-xl border-2 border-transparent bg-transparent text-left transition hover:border-app-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
              >
                <span className="text-3xl" role="img" aria-hidden>
                  {cat.tileEmoji}
                </span>
                <span className="mt-2 block text-lg font-extrabold leading-snug">
                  {cat.titleCs}
                </span>
                <span className="mt-0.5 block text-sm font-medium leading-snug opacity-90">
                  {cat.subtitleCs}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setBrowseCategoryId(cat.id)}
                className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-lg border border-app-border bg-app-card text-lg transition hover:border-app-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
                aria-label={`Prohlédnout slovíčka kategorie ${cat.titleCs}`}
                title="Prohlédnout slovíčka"
              >
                <span aria-hidden>📋</span>
              </button>
            </motion.div>
          );
        })}
      </div>

      {browseCategoryId ? (
        <CategoryWordsBrowseModal
          open
          onClose={() => setBrowseCategoryId(null)}
          categoryId={browseCategoryId}
          categoryTitleCs={
            getCategoryMeta(browseCategoryId)?.titleCs ?? "Kategorie"
          }
          words={mergedWords}
        />
      ) : null}
    </div>
  );
}
