"use client";

type CircularTimerProps = {
  /** 0–1 zbývající část času */
  progress: number;
  /** Velikost v px */
  size?: number;
  className?: string;
};

export function CircularTimer({
  progress,
  size = 56,
  className = "",
}: CircularTimerProps) {
  const p = Math.max(0, Math.min(1, progress));
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - p);

  return (
    <svg
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#3b82f6"
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-[stroke-dashoffset] duration-100 ease-linear"
      />
    </svg>
  );
}
