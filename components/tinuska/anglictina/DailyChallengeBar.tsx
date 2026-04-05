"use client";

import { useMemo } from "react";
import {
  getDailyChallenge,
  isDailyChallengeCompleted,
} from "./utils/dailyChallenge";

export function DailyChallengeBar() {
  const today = useMemo(() => new Date(), []);
  const ch = useMemo(() => getDailyChallenge(today), [today]);
  const done = useMemo(
    () => isDailyChallengeCompleted(today),
    [today],
  );

  return (
    <div className="rounded-2xl border-2 border-dashed border-[#3b82f6]/40 bg-sky-50/80 px-4 py-3 text-left shadow-sm">
      <p className="text-sm font-bold text-[#1a1a1a]">Denní výzva</p>
      <p className="mt-1 text-base text-[#374151]">{ch.descriptionCs}</p>
      {done ? (
        <p className="mt-2 text-sm font-semibold text-emerald-700">
          ✓ Splněno dnes
        </p>
      ) : (
        <p className="mt-2 text-sm text-[#6b7280]">
          Splní se automaticky při splnění úkolu v příslušné hře (postupně
          doplníme).
        </p>
      )}
    </div>
  );
}
