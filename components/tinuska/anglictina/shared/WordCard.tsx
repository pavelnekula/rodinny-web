"use client";

import { motion } from "framer-motion";
import type { Word } from "../types";

type WordCardProps = {
  word: Word;
  showStar?: boolean;
  className?: string;
};

/**
 * Statická náhledová karta slovíčka (emoji + text) – znovupoužitelná v módech.
 */
export function WordCard({ word, showStar, className = "" }: WordCardProps) {
  return (
    <motion.div
      layout
      className={`relative flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-white/40 bg-app-card p-6 text-center shadow-lg ${className}`}
    >
      {showStar ? (
        <span
          className="absolute right-3 top-3 text-2xl text-amber-400 drop-shadow"
          role="img"
          aria-label="Naučeno alespoň třikrát správně"
        >
          ⭐
        </span>
      ) : null}
      <span
        className="text-7xl sm:text-8xl"
        role="img"
        aria-label={word.en}
      >
        {word.emoji}
      </span>
      <p className="text-2xl font-bold capitalize text-app-fg sm:text-3xl">
        {word.en}
      </p>
    </motion.div>
  );
}
