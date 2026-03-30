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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {VOCABULARY_CATEGORIES.map((cat, i) => {
          const selected = value === cat.id;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`relative flex min-h-[11rem] flex-col rounded-3xl border-4 bg-gradient-to-br p-6 pb-14 text-left shadow-md transition focus-within:ring-2 focus-within:ring-teal-400/50 ${cat.tileClass} ${
                selected
                  ? "ring-4 ring-teal-500 ring-offset-2 ring-offset-amber-50"
                  : "opacity-95 hover:opacity-100"
              }`}
            >
              <button
                type="button"
                aria-pressed={selected}
                aria-label={`Vybrat kategorii ${cat.titleCs}`}
                onClick={() => onChange(cat.id)}
                className="w-full rounded-2xl border-2 border-transparent bg-transparent text-left transition hover:border-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
              >
                <span className="text-5xl" role="img" aria-hidden>
                  {cat.tileEmoji}
                </span>
                <span className="mt-3 block text-2xl font-extrabold">
                  {cat.titleCs}
                </span>
                <span className="mt-1 block text-base font-medium opacity-90">
                  {cat.subtitleCs}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setBrowseCategoryId(cat.id)}
                className="absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white/70 bg-white/50 text-2xl shadow-md backdrop-blur-sm transition hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
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
