import type { PrikladTyp } from "@/data/delitelnost";

function parseIntsFromList(s: string): number[] {
  return s
    .split(/[,;\s]+/)
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => Number(x))
    .filter((n) => Number.isFinite(n));
}

function normAnoNe(s: string): "ano" | "ne" | null {
  const t = s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
  if (t === "ano" || t === "a" || t === "yes" || t === "y" || t === "1")
    return "ano";
  if (t === "ne" || t === "n" || t === "no" || t === "0") return "ne";
  return null;
}

/** Porovnání uživatelské odpovědi se vzorem z generátoru. */
export function porovnejOdpoved(
  uzivatel: string,
  spravne: string,
  typ: PrikladTyp,
): boolean {
  if (typ === "ano-ne") {
    const u = normAnoNe(uzivatel);
    const v = normAnoNe(spravne);
    return u !== null && v !== null && u === v;
  }
  if (typ === "vypocet") {
    const a = Number(String(uzivatel).trim().replace(/\s+/g, ""));
    const b = Number(String(spravne).trim().replace(/\s+/g, ""));
    return Number.isFinite(a) && Number.isFinite(b) && a === b;
  }
  const ua = parseIntsFromList(uzivatel).sort((x, y) => x - y);
  const va = parseIntsFromList(spravne).sort((x, y) => x - y);
  if (ua.length !== va.length) return false;
  return ua.every((n, i) => n === va[i]);
}
