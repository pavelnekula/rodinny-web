import type { KapitolaId } from "@/data/delitelnost";

export type DelitelnostProgress = {
  spravne: number;
  celkem: number;
  posledniSession: string;
};

function key(id: KapitolaId): string {
  return `delitelnost_progress_${id}`;
}

export function nactiProgress(id: KapitolaId): DelitelnostProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key(id));
    if (!raw) return null;
    const o = JSON.parse(raw) as DelitelnostProgress;
    if (
      typeof o.spravne !== "number" ||
      typeof o.celkem !== "number" ||
      typeof o.posledniSession !== "string"
    ) {
      return null;
    }
    return o;
  } catch {
    return null;
  }
}

export function ulozProgress(
  id: KapitolaId,
  spravne: number,
  celkem: number,
): void {
  if (typeof window === "undefined") return;
  const payload: DelitelnostProgress = {
    spravne,
    celkem,
    posledniSession: new Date().toISOString(),
  };
  window.localStorage.setItem(key(id), JSON.stringify(payload));
}

export function pomerUspechu(p: DelitelnostProgress | null): number | null {
  if (!p || p.celkem <= 0) return null;
  return (p.spravne / p.celkem) * 100;
}
