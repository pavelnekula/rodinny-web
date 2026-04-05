import type { CategoryId } from "../types";

const KEY = "tinuska-anglictina-adventure-v1";

export type AdventureRow = {
  step: number;
  avatar: string;
};

export function loadAdventure(): Record<string, AdventureRow> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const p: unknown = JSON.parse(raw);
    if (typeof p !== "object" || p === null) return {};
    return p as Record<string, AdventureRow>;
  } catch {
    return {};
  }
}

export function saveAdventure(
  cat: CategoryId,
  row: AdventureRow,
  all: Record<string, AdventureRow>,
) {
  if (typeof window === "undefined") return;
  const next = { ...all, [cat]: row };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* quota */
  }
}
