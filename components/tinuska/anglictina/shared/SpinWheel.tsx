"use client";

import type { CategoryId } from "../types";

export type WheelSlice = {
  id: string;
  label: string;
  emoji: string;
  color: string;
  categoryId?: CategoryId;
  kind: "category" | "bonus2" | "mystery";
};

type SpinWheelProps = {
  slices: WheelSlice[];
  rotationDeg: number;
  spinning: boolean;
  size?: number;
  onSpinClick: () => void;
};

export function SpinWheel({
  slices,
  rotationDeg,
  spinning,
  size = 280,
  onSpinClick,
}: SpinWheelProps) {
  const n = slices.length;
  const step = 360 / n;

  return (
    <div className="relative mx-auto flex flex-col items-center">
      <div
        className="mb-2 text-2xl text-[#1a1a1a]"
        aria-hidden
      >
        ▼
      </div>
      <div
        className="relative rounded-full shadow-lg ring-4 ring-[#e5e7eb]"
        style={{ width: size, height: size }}
      >
        <button
          type="button"
          onClick={onSpinClick}
          disabled={spinning}
          className="absolute left-1/2 top-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#3b82f6] bg-[#ffffff] text-sm font-extrabold text-[#3b82f6] shadow-md transition hover:bg-sky-50 disabled:cursor-wait disabled:opacity-70"
          aria-label="Točit kolem"
        >
          TOČI!
        </button>
        <div
          className="h-full w-full rounded-full transition-transform duration-[4000ms] ease-[cubic-bezier(0.12,0.8,0.12,1)]"
          style={{
            transform: `rotate(${rotationDeg}deg)`,
            background: `conic-gradient(${slices
              .map((s, i) => {
                const a0 = i * step;
                const a1 = (i + 1) * step;
                return `${s.color} ${a0}deg ${a1}deg`;
              })
              .join(", ")})`,
          }}
        />
        <div className="pointer-events-none absolute inset-0">
          {slices.map((s, i) => {
            const mid = (i + 0.5) * step;
            const rad = ((mid - 90) * Math.PI) / 180;
            const r = size * 0.32;
            const x = size / 2 + Math.cos(rad) * r;
            const y = size / 2 + Math.sin(rad) * r;
            return (
              <span
                key={s.id}
                className="absolute max-w-[4.5rem] -translate-x-1/2 -translate-y-1/2 text-center text-[10px] font-bold leading-tight text-white drop-shadow sm:text-xs"
                style={{ left: x, top: y }}
              >
                <span className="block" aria-hidden>
                  {s.emoji}
                </span>
                <span className="block">{s.label}</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
