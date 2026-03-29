"use client";

import { useSpeech } from "../hooks/useSpeech";

type SpeechButtonProps = {
  text: string;
  label?: string;
  className?: string;
};

export function SpeechButton({
  text,
  label = "Přehrát výslovnost anglického slova",
  className = "",
}: SpeechButtonProps) {
  const { speak } = useSpeech();

  return (
    <button
      type="button"
      onClick={() => speak(text)}
      aria-label={label}
      className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-teal-400/80 bg-teal-100 text-2xl text-teal-900 shadow-md transition hover:scale-105 hover:bg-teal-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 active:scale-95 ${className}`}
    >
      <span role="img" aria-hidden>
        🔊
      </span>
    </button>
  );
}
