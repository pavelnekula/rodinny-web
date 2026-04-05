"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { CategoryId, GameMode } from "./types";
import {
  GAME_MODE_METAS,
  PAGE_GAME_MODES,
  hrefWithCategory,
} from "./gameModes";
type UnifiedGameModeSelectorProps = {
  value: GameMode | null;
  onChange: (id: GameMode) => void;
  categoryId: CategoryId | null;
};

export function UnifiedGameModeSelector({
  value,
  onChange,
  categoryId,
}: UnifiedGameModeSelectorProps) {
  const inlineCount = GAME_MODE_METAS.length;
  const pageStart = inlineCount;

  return (
    <div>
      <h2 className="mb-2 text-xl font-bold text-slate-800 sm:text-2xl">
        Vyber herní mód
      </h2>
      <p className="mb-4 max-w-3xl text-base text-[#6b7280]">
        Níže jsou <strong className="font-semibold text-[#374151]">všechny</strong>{" "}
        způsoby hraní: první tři poběží tady po tlačítku Začít; u dalších klikni na
        kartu — otevře se připravená hra na vlastní stránce (kategorie nahoře se
        předává v odkazu, kde to dává smysl).
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {GAME_MODE_METAS.map((mode, i) => {
          const selected = value === mode.id;
          return (
            <motion.button
              key={mode.id}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-pressed={selected}
              aria-label={`${mode.titleCs}. ${mode.descriptionCs}. Hra proběhne na této stránce po Začít.`}
              onClick={() => onChange(mode.id)}
              className={`relative flex min-h-[8.5rem] flex-col rounded-2xl border-2 border-teal-200 bg-white/95 p-4 text-left shadow-sm transition hover:border-teal-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 ${
                selected
                  ? "ring-4 ring-rose-400 ring-offset-2 ring-offset-amber-50"
                  : ""
              }`}
            >
              <span className="text-4xl" role="img" aria-hidden>
                {mode.icon}
              </span>
              <span className="mt-2 text-lg font-bold text-slate-800">
                {mode.titleCs}
              </span>
              <span className="mt-1 flex-1 text-base text-slate-600">
                {mode.descriptionCs}
              </span>
              <span className="mt-3 text-xs font-semibold uppercase tracking-wide text-teal-700">
                → hra tady dole (Začít)
              </span>
            </motion.button>
          );
        })}
        {PAGE_GAME_MODES.map((page, j) => {
          const i = pageStart + j;
          const href = hrefWithCategory(page, categoryId);
          return (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                href={href}
                className="flex min-h-[8.5rem] h-full flex-col rounded-2xl border-2 border-[#e5e7eb] bg-[#ffffff] p-4 text-left shadow-sm transition hover:border-[#3b82f6] hover:bg-sky-50/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3b82f6]"
                aria-label={`${page.titleCs}. ${page.descriptionCs}. Otevře novou stránku.`}
              >
                <span className="text-4xl" role="img" aria-hidden>
                  {page.icon}
                </span>
                <span className="mt-2 text-lg font-bold text-[#1a1a1a]">
                  {page.titleCs}
                </span>
                <span className="mt-1 flex-1 text-base text-[#6b7280]">
                  {page.descriptionCs}
                </span>
                <span className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#3b82f6]">
                  Otevřít stránku →
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
