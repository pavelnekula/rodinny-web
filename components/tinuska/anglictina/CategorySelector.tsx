"use client";

import { motion } from "framer-motion";
import type { CategoryId } from "./types";
import { VOCABULARY_CATEGORIES } from "./VocabularyData";

type CategorySelectorProps = {
  value: CategoryId | null;
  onChange: (id: CategoryId) => void;
};

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-slate-800 sm:text-2xl">
        Vyber kategorii
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {VOCABULARY_CATEGORIES.map((cat, i) => {
          const selected = value === cat.id;
          return (
            <motion.button
              key={cat.id}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-pressed={selected}
              aria-label={`Kategorie ${cat.titleCs}`}
              onClick={() => onChange(cat.id)}
              className={`flex flex-col items-start rounded-3xl border-4 bg-gradient-to-br p-6 text-left shadow-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 ${cat.tileClass} ${
                selected
                  ? "ring-4 ring-teal-500 ring-offset-2 ring-offset-amber-50"
                  : "opacity-95 hover:opacity-100"
              }`}
            >
              <span className="text-5xl" role="img" aria-hidden>
                {cat.tileEmoji}
              </span>
              <span className="mt-3 text-2xl font-extrabold">{cat.titleCs}</span>
              <span className="mt-1 text-base font-medium opacity-90">
                {cat.subtitleCs}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
