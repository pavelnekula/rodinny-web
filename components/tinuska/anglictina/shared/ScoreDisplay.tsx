"use client";

type ScoreDisplayProps = {
  label: string;
  value: string | number;
  className?: string;
};

export function ScoreDisplay({ label, value, className = "" }: ScoreDisplayProps) {
  return (
    <div
      className={`rounded-2xl border-2 border-rose-200 bg-white/90 px-4 py-2 text-center shadow-sm ${className}`}
      role="status"
      aria-live="polite"
    >
      <p className="text-base font-semibold text-slate-600">{label}</p>
      <p className="text-2xl font-bold text-teal-800 tabular-nums">{value}</p>
    </div>
  );
}
