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

const modeCardBase =
  "app-card app-card-interactive relative flex min-h-[8.5rem] flex-col p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg";

export function UnifiedGameModeSelector({
  value,
  onChange,
  categoryId,
}: UnifiedGameModeSelectorProps) {
  const inlineCount = GAME_MODE_METAS.length;
  const pageStart = inlineCount;

  return (
    <div>
      <h2 className="mb-2 text-xl font-bold text-app-fg sm:text-2xl">
        Vyber herní mód
      </h2>
      <p className="mb-4 max-w-3xl text-base text-app-muted">
        Níže jsou <strong className="font-semibold text-app-fg">všechny</strong>{" "}
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
              className={`${modeCardBase} ${
                selected
                  ? "border-app-accent ring-2 ring-app-accent ring-offset-2 ring-offset-app-bg"
                  : "border-app-border"
              }`}
            >
              <span className="text-4xl" role="img" aria-hidden>
                {mode.icon}
              </span>
              <span className="mt-2 text-lg font-bold text-app-fg">
                {mode.titleCs}
              </span>
              <span className="mt-1 flex-1 text-base text-app-muted">
                {mode.descriptionCs}
              </span>
              <span className="mt-3 text-xs font-semibold uppercase tracking-wide text-app-accent">
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
                className={`${modeCardBase} flex h-full border-app-border hover:border-app-accent`}
                aria-label={`${page.titleCs}. ${page.descriptionCs}. Otevře novou stránku.`}
              >
                <span className="text-4xl" role="img" aria-hidden>
                  {page.icon}
                </span>
                <span className="mt-2 text-lg font-bold text-app-fg">
                  {page.titleCs}
                </span>
                <span className="mt-1 flex-1 text-base text-app-muted">
                  {page.descriptionCs}
                </span>
                <span className="mt-3 text-xs font-semibold uppercase tracking-wide text-app-accent">
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
