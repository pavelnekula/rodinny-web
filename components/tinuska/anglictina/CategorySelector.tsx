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

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-slate-800 sm:text-2xl">
        Kategorie (postup učení)
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3">
        {VOCABULARY_CATEGORIES.map((cat, i) => {
          const selected = value === cat.id;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`relative flex min-h-[7.5rem] flex-col rounded-2xl border-2 bg-gradient-to-br p-4 pb-11 text-left shadow-sm transition focus-within:ring-2 focus-within:ring-teal-400/50 ${cat.tileClass} ${
                selected
                  ? "ring-2 ring-teal-500 ring-offset-2 ring-offset-amber-50"
                  : "opacity-95 hover:opacity-100"
              }`}
            >
              <button
                type="button"
                aria-pressed={selected}
                aria-label={`Vybrat kategorii ${cat.titleCs}`}
                onClick={() => onChange(cat.id)}
                className="w-full rounded-xl border-2 border-transparent bg-transparent text-left transition hover:border-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
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
                className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-lg border-2 border-white/70 bg-white/50 text-lg shadow-sm backdrop-blur-sm transition hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
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
