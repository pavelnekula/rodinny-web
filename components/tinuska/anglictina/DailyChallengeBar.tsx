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
    <div className="app-card border-dashed border-app-accent/35 px-4 py-3 text-left">
      <p className="text-sm font-bold text-app-fg">Denní výzva</p>
      <p className="mt-1 text-base text-app-muted">{ch.descriptionCs}</p>
      {done ? (
        <p className="mt-2 text-sm font-semibold text-app-accent">
          ✓ Splněno dnes
        </p>
      ) : (
        <p className="mt-2 text-sm text-app-subtle">
          Splní se automaticky při splnění úkolu v příslušné hře (postupně
          doplníme).
        </p>
      )}
    </div>
  );
}
