"use client";

import { useEffect, useRef, useState } from "react";
import { playSound } from "./utils/gameSoundFx";
import type { AchievementDef } from "./utils/achievementStore";

export function AchievementToastHost({
  queue,
  onConsumed,
}: {
  queue: AchievementDef[];
  onConsumed: () => void;
}) {
  const [visible, setVisible] = useState<AchievementDef | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (visible !== null) return;
    if (queue.length === 0) return;
    const next = queue[0]!;
    setVisible(next);
    playSound("achievement");
    timerRef.current = window.setTimeout(() => {
      setVisible(null);
      onConsumed();
      timerRef.current = null;
    }, 4000);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [queue, visible, onConsumed]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-auto fixed right-4 top-4 z-[100] max-w-sm transition-all duration-300"
      role="status"
      aria-live="polite"
    >
      <div className="rounded-2xl border-2 border-amber-300 bg-[#ffffff] p-4 shadow-xl ring-2 ring-amber-200/80">
        <p className="text-sm font-bold text-[#1a1a1a]">🏅 Nový odznak!</p>
        <p className="mt-1 text-lg font-extrabold text-[#3b82f6]">
          {visible.icon} {visible.titleCs}
        </p>
        <p className="mt-1 text-sm text-[#6b7280]">{visible.descriptionCs}</p>
        <button
          type="button"
          className="mt-3 text-sm font-semibold text-[#3b82f6] underline"
          onClick={() => {
            if (timerRef.current) window.clearTimeout(timerRef.current);
            timerRef.current = null;
            setVisible(null);
            onConsumed();
          }}
        >
          Zavřít
        </button>
      </div>
    </div>
  );
}
