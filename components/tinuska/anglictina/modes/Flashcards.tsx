"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Word } from "../types";
import { SpeechButton } from "../shared/SpeechButton";

type FlashcardsProps = {
  words: Word[];
  categoryLabel: string;
  hasStar: (wordId: string) => boolean;
  onExit: () => void;
};

export function Flashcards({
  words,
  categoryLabel,
  hasStar,
  onExit,
}: FlashcardsProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const safeIndex = Math.min(index, Math.max(0, words.length - 1));
  const word = words[safeIndex];

  useEffect(() => {
    setFlipped(false);
  }, [safeIndex]);

  const goPrev = useCallback(() => {
    if (words.length === 0) return;
    setIndex((i) => (i - 1 + words.length) % words.length);
  }, [words.length]);

  const goNext = useCallback(() => {
    if (words.length === 0) return;
    setIndex((i) => (i + 1) % words.length);
  }, [words.length]);

  const goRandom = useCallback(() => {
    if (words.length <= 1) return;
    let next = safeIndex;
    let guard = 0;
    while (next === safeIndex && guard < 20) {
      next = Math.floor(Math.random() * words.length);
      guard += 1;
    }
    setIndex(next);
  }, [words.length, safeIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === "r" || e.key === "R") {
        goRandom();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, goRandom]);

  const star = useMemo(
    () => (word ? hasStar(word.id) : false),
    [word, hasStar],
  );

  if (!word || words.length === 0) {
    return (
      <p className="text-center text-lg text-slate-600">
        V této kategorii zatím nejsou slovíčka.
      </p>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-lg font-semibold text-slate-700">
          {categoryLabel} · {safeIndex + 1} / {words.length}
        </p>
        <button
          type="button"
          onClick={onExit}
          className="rounded-xl border-2 border-slate-300 bg-white px-4 py-2 text-base font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          aria-label="Zpět na výběr kategorie a módu"
        >
          ← Zpět
        </button>
      </div>

      <p className="text-center text-base text-slate-500">
        Klikni na kartu nebo mezerníkem otoč · šipky ◀ ▶ · R náhodně
      </p>

      <div className="mx-auto w-full max-w-md [perspective:1200px]">
        <motion.button
          type="button"
          layout
          onClick={() => setFlipped((f) => !f)}
          aria-label={
            flipped
              ? `Karta otočená, český překlad ${word.cs}. Klikni pro zobrazení anglického slova.`
              : `Karta: ${word.en}. Klikni pro zobrazení českého překladu.`
          }
          className="relative aspect-[4/5] w-full cursor-pointer rounded-3xl border-4 border-white shadow-2xl outline-none focus-visible:ring-4 focus-visible:ring-teal-400"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        >
          {/* Přední strana */}
          <span
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl bg-gradient-to-br from-amber-100 via-white to-teal-100 p-6 [backface-visibility:hidden]"
            style={{ transform: "rotateY(0deg)" }}
          >
            {star ? (
              <span
                className="absolute right-4 top-4 text-3xl text-amber-400 drop-shadow"
                role="img"
                aria-label="Naučeno alespoň třikrát správně v kvízech"
              >
                ⭐
              </span>
            ) : null}
            <span
              className="text-8xl sm:text-9xl"
              role="img"
              aria-label={word.en}
            >
              {word.emoji}
            </span>
            <span className="text-3xl font-extrabold capitalize text-slate-800 sm:text-4xl">
              {word.en}
            </span>
            <span className="text-lg text-slate-500">Česky uvidíš po otočení</span>
          </span>

          {/* Zadní strana */}
          <span
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl bg-gradient-to-br from-rose-100 via-white to-cyan-100 p-6 [backface-visibility:hidden]"
            style={{ transform: "rotateY(180deg)" }}
          >
            <span
              className="text-8xl sm:text-9xl opacity-90"
              role="img"
              aria-hidden
            >
              {word.emoji}
            </span>
            <span className="text-4xl font-extrabold text-teal-900 sm:text-5xl">
              {word.cs}
            </span>
            <span className="text-xl font-semibold capitalize text-slate-600">
              {word.en}
            </span>
          </span>
        </motion.button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <SpeechButton
          text={word.en}
          label={`Vyslovit anglicky: ${word.en}`}
          className="h-14 w-14 text-3xl"
        />
        <button
          type="button"
          onClick={goPrev}
          aria-label="Předchozí kartička"
          className="rounded-2xl border-2 border-teal-300 bg-teal-50 px-5 py-3 text-lg font-bold text-teal-900 shadow transition hover:bg-teal-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          ◀ Předchozí
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Další kartička"
          className="rounded-2xl border-2 border-teal-300 bg-teal-50 px-5 py-3 text-lg font-bold text-teal-900 shadow transition hover:bg-teal-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          Další ▶
        </button>
        <button
          type="button"
          onClick={goRandom}
          aria-label="Náhodná kartička"
          className="rounded-2xl border-2 border-rose-300 bg-rose-50 px-5 py-3 text-lg font-bold text-rose-900 shadow transition hover:bg-rose-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
        >
          🎲 Náhodně
        </button>
      </div>
    </div>
  );
}
