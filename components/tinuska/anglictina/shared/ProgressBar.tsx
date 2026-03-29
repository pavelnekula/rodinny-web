"use client";

type ProgressBarProps = {
  label: string;
  current: number;
  total: number;
  className?: string;
};

export function ProgressBar({
  label,
  current,
  total,
  className = "",
}: ProgressBarProps) {
  const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  return (
    <div className={className}>
      <div className="mb-1 flex justify-between text-base font-medium text-slate-700">
        <span>{label}</span>
        <span className="tabular-nums">
          {current} / {total}
        </span>
      </div>
      <div
        className="h-4 w-full overflow-hidden rounded-full border border-teal-200 bg-teal-50"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
