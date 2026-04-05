"use client";

type QuizAnswerGridProps = {
  labels: string[];
  disabled?: boolean;
  highlightIndex?: number | null;
  wrongIndex?: number | null;
  onPick: (index: number) => void;
};

export function QuizAnswerGrid({
  labels,
  disabled,
  highlightIndex,
  wrongIndex,
  onPick,
}: QuizAnswerGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {labels.map((label, i) => {
        const isOk = highlightIndex === i;
        const isBad = wrongIndex === i;
        return (
          <button
            key={`${label}-${i}`}
            type="button"
            disabled={disabled}
            onClick={() => onPick(i)}
            className={`min-h-[52px] rounded-2xl border-2 px-3 py-3 text-center text-base font-bold transition-all duration-200 sm:text-lg ${
              isOk
                ? "border-emerald-500 bg-emerald-100 text-emerald-950"
                : isBad
                  ? "border-rose-500 bg-rose-100 text-rose-950"
                  : "border-[#e5e7eb] bg-[#ffffff] text-[#1a1a1a] hover:border-[#3b82f6] hover:bg-sky-50"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
