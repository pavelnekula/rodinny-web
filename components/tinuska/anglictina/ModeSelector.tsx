"use client";

import { motion } from "framer-motion";
import type { GameMode } from "./types";
import { GAME_MODE_METAS } from "./gameModes";

type ModeSelectorProps = {
  value: GameMode | null;
  onChange: (id: GameMode) => void;
};

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-slate-800 sm:text-2xl">
        Vyber herní mód
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {GAME_MODE_METAS.map((mode, i) => {
          const selected = value === mode.id;
          return (
            <motion.button
              key={mode.id}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-pressed={selected}
              aria-label={`${mode.titleCs}. ${mode.descriptionCs}`}
              onClick={() => onChange(mode.id)}
              className={`relative flex flex-col rounded-2xl border-2 border-teal-200 bg-white/95 p-4 text-left shadow-sm transition hover:border-teal-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 ${
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
              <span className="mt-1 text-base text-slate-600">
                {mode.descriptionCs}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
