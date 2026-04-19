"use client";

import { useEffect, useMemo } from "react";
import type { CategoryId, Word } from "./types";
import { SpeechButton } from "./shared/SpeechButton";

type CategoryWordsBrowseModalProps = {
  open: boolean;
  onClose: () => void;
  categoryId: CategoryId;
  categoryTitleCs: string;
  words: Word[];
};

export function CategoryWordsBrowseModal({
  open,
  onClose,
  categoryId,
  categoryTitleCs,
  words,
}: CategoryWordsBrowseModalProps) {
  const rows = useMemo(
    () =>
      [...words].filter((w) => w.categoryId === categoryId).sort((a, b) => {
        const ea = a.en.toLowerCase();
        const eb = b.en.toLowerCase();
        return ea.localeCompare(eb, "en");
      }),
    [words, categoryId],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const count = rows.length;
  function slovickoWord(n: number): string {
    if (n === 1) return "slovíčko";
    const n100 = n % 100;
    if (n100 >= 11 && n100 <= 14) return "slovíček";
    const n10 = n % 10;
    if (n10 >= 2 && n10 <= 4) return "slovíčka";
    return "slovíček";
  }
  const heading = `${categoryTitleCs} — ${count} ${slovickoWord(count)}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-words-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Zavřít přehled slovíček"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[min(92vh,900px)] w-full max-w-5xl flex-col rounded-t-2xl border border-app-border bg-app-card shadow-xl sm:rounded-2xl">
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-app-border px-4 py-3 sm:px-6 sm:py-4">
          <h2
            id="category-words-modal-title"
            className="pr-8 text-lg font-bold text-app-fg sm:text-xl"
          >
            {heading}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-2 top-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-2xl text-app-muted transition hover:bg-app-card hover:text-app-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 sm:right-3 sm:top-3"
            aria-label="Zavřít"
          >
            ✕
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-auto px-2 pb-4 pt-2 sm:px-4 sm:pb-6">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm text-app-fg sm:text-base">
            <thead>
              <tr className="border-b border-app-border bg-app-card">
                <th scope="col" className="px-2 py-3 font-semibold sm:px-3">
                  🇬🇧 Anglické slovíčko
                </th>
                <th scope="col" className="px-2 py-3 font-semibold sm:px-3">
                  🇨🇿 Překlad
                </th>
                <th scope="col" className="px-2 py-3 font-semibold sm:px-3">
                  💬 Příklad věty
                </th>
                <th scope="col" className="w-16 px-2 py-3 text-center font-semibold sm:w-20">
                  🔊
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((w, i) => (
                <tr
                  key={w.id}
                  className={
                    i % 2 === 0
                      ? "bg-app-card"
                      : "bg-app-card/90"
                  }
                >
                  <td className="px-2 py-2.5 align-top font-bold sm:px-3 sm:py-3">
                    {w.en}
                  </td>
                  <td className="px-2 py-2.5 align-top text-app-muted sm:px-3 sm:py-3">
                    {w.cs}
                  </td>
                  <td className="px-2 py-2.5 align-top text-app-muted sm:px-3 sm:py-3">
                    {w.sentence?.trim() ? w.sentence : "—"}
                  </td>
                  <td className="px-2 py-2 align-middle sm:px-3 sm:py-3">
                    <div className="flex justify-center">
                      <SpeechButton
                        text={w.en}
                        label={`Přehrát anglické slovíčko: ${w.en}`}
                        className="h-10 w-10 text-xl"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <p className="py-8 text-center text-app-muted">
              V této kategorii zatím nejsou žádná slovíčka.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
