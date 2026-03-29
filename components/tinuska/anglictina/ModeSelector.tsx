"use client";

import { motion } from "framer-motion";
import type { GameMode } from "./types";
import { GAME_MODE_METAS, isGameModeImplemented } from "./gameModes";

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
          const implemented = isGameModeImplemented(mode.id);
          const selected = value === mode.id;
          return (
            <motion.button
              key={mode.id}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={implemented ? { scale: 1.02 } : undefined}
              whileTap={implemented ? { scale: 0.98 } : undefined}
              disabled={!implemented}
              aria-disabled={!implemented}
              aria-pressed={selected}
              aria-label={`${mode.titleCs}. ${mode.descriptionCs}${implemented ? "" : " — brzy k dispozici"}`}
              onClick={() => implemented && onChange(mode.id)}
              className={`relative flex flex-col rounded-2xl border-2 p-4 text-left shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 ${
                implemented
                  ? "border-teal-200 bg-white/95 hover:border-teal-400"
                  : "cursor-not-allowed border-slate-200 bg-slate-100/90 opacity-75"
              } ${
                selected && implemented
                  ? "ring-4 ring-rose-400 ring-offset-2 ring-offset-amber-50"
                  : ""
              }`}
            >
              {!implemented ? (
                <span className="absolute right-2 top-2 rounded-full bg-slate-300 px-2 py-0.5 text-xs font-bold text-slate-700">
                  Brzy
                </span>
              ) : null}
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
