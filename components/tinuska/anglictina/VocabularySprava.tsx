"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CategoryId, Word } from "./types";
import {
  CUSTOM_WORD_ID_PREFIX,
  isCustomWordId,
  makeCustomWordId,
  readCustomWords,
  writeCustomWords,
} from "./mergedVocabulary";
import { VOCABULARY_CATEGORIES } from "./VocabularyData";

const labelByCategory: Record<CategoryId, string> = Object.fromEntries(
  VOCABULARY_CATEGORIES.map((c) => [c.id, c.titleCs]),
) as Record<CategoryId, string>;

export function VocabularySprava() {
  const [customWords, setCustomWords] = useState<Word[]>([]);
  const [categoryId, setCategoryId] = useState<CategoryId>("colors");
  const [en, setEn] = useState("");
  const [cs, setCs] = useState("");
  const [emoji, setEmoji] = useState("📌");

  const reload = useCallback(() => {
    setCustomWords(readCustomWords());
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    const onChange = () => reload();
    window.addEventListener("storage", onChange);
    window.addEventListener("anglictina-vocabulary-changed", onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("anglictina-vocabulary-changed", onChange);
    };
  }, [reload]);

  const sortedCustom = useMemo(
    () =>
      [...customWords].sort((a, b) => {
        const cat = a.categoryId.localeCompare(b.categoryId);
        if (cat !== 0) return cat;
        return a.en.localeCompare(b.en, "cs");
      }),
    [customWords],
  );

  const addWord = useCallback(() => {
    const enTrim = en.trim();
    const csTrim = cs.trim();
    if (!enTrim || !csTrim) return;
    const next: Word = {
      id: makeCustomWordId(enTrim),
      en: enTrim,
      cs: csTrim,
      sentence: `Listen to this word: ${enTrim}.`,
      emoji: emoji.trim() || "📌",
      categoryId,
    };
    const merged = [...readCustomWords(), next];
    writeCustomWords(merged);
    setCustomWords(merged);
    setEn("");
    setCs("");
    setEmoji("📌");
  }, [categoryId, cs, en, emoji]);

  const removeWord = useCallback(
    (id: string) => {
      if (!isCustomWordId(id)) return;
      const merged = readCustomWords().filter((w) => w.id !== id);
      writeCustomWords(merged);
      setCustomWords(merged);
    },
    [],
  );

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#1a1a1a]">
      <div className="mx-auto w-full max-w-2xl px-6 py-12 sm:px-8">
        <Link
          href="/tinuska/anglictina"
          className="inline-block w-fit text-base font-medium text-[#3b82f6] underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2"
          aria-label="Zpět na angličtinu"
        >
          ← Zpět na angličtinu
        </Link>

        <header className="mt-8">
          <h1 className="text-3xl font-semibold tracking-tight text-[#1a1a1a]">
            Správa slovíček
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[#6b7280]">
            Přidej vlastní slovíčka podle oblasti. Ukládají se jen v tomto
            prohlížeči (localStorage). Základní seznam z webu zůstává; vlastní
            záznamy mají id začínající na{" "}
            <span className="font-mono text-sm">{CUSTOM_WORD_ID_PREFIX}</span>.
          </p>
        </header>

        <section
          className="mt-10 rounded-lg border border-[#e5e7eb] bg-[#ffffff] p-6 shadow-sm"
          aria-labelledby="add-heading"
        >
          <h2 id="add-heading" className="text-lg font-medium text-[#1a1a1a]">
            Přidat slovíčko
          </h2>
          <div className="mt-4 flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#1a1a1a]">Oblast</span>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value as CategoryId)}
                className="rounded-md border border-[#e5e7eb] bg-[#ffffff] px-3 py-2 text-[#1a1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2"
                aria-label="Oblast slovíčka"
              >
                {VOCABULARY_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.titleCs}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#1a1a1a]">
                Anglicky
              </span>
              <input
                type="text"
                value={en}
                onChange={(e) => setEn(e.target.value)}
                className="rounded-md border border-[#e5e7eb] px-3 py-2 text-[#1a1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2"
                placeholder="např. chair"
                autoComplete="off"
                aria-label="Anglické slovo"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#1a1a1a]">Česky</span>
              <input
                type="text"
                value={cs}
                onChange={(e) => setCs(e.target.value)}
                className="rounded-md border border-[#e5e7eb] px-3 py-2 text-[#1a1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2"
                placeholder="např. židle"
                autoComplete="off"
                aria-label="Český překlad"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#1a1a1a]">
                Emoji (volitelné)
              </span>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="max-w-[8rem] rounded-md border border-[#e5e7eb] px-3 py-2 text-[#1a1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2"
                maxLength={8}
                aria-label="Emoji u slovíčka"
              />
            </label>
            <button
              type="button"
              onClick={addWord}
              className="w-fit rounded-md border border-[#e5e7eb] bg-[#ffffff] px-4 py-2 text-sm font-medium text-[#1a1a1a] shadow-sm transition hover:border-[#3b82f6] hover:text-[#3b82f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2"
              aria-label="Uložit nové slovíčko"
            >
              Uložit slovíčko
            </button>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="list-heading">
          <h2 id="list-heading" className="text-lg font-medium text-[#1a1a1a]">
            Tvoje vlastní slovíčka ({sortedCustom.length})
          </h2>
          {sortedCustom.length === 0 ? (
            <p className="mt-3 text-[#6b7280]">Zatím žádná vlastní slova.</p>
          ) : (
            <ul className="mt-4 divide-y divide-[#e5e7eb] rounded-lg border border-[#e5e7eb] bg-[#ffffff] shadow-sm">
              {sortedCustom.map((w) => (
                <li
                  key={w.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0 flex flex-1 flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-xl" aria-hidden>
                      {w.emoji}
                    </span>
                    <span className="font-medium text-[#1a1a1a]">{w.en}</span>
                    <span className="text-[#6b7280]">· {w.cs}</span>
                    <span className="rounded border border-[#e5e7eb] px-2 py-0.5 text-xs text-[#6b7280]">
                      {labelByCategory[w.categoryId]}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeWord(w.id)}
                    className="shrink-0 rounded-md border border-[#e5e7eb] px-3 py-1.5 text-sm text-[#1a1a1a] transition hover:border-red-400 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2"
                    aria-label={`Smazat slovíčko ${w.en}`}
                  >
                    Smazat
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
