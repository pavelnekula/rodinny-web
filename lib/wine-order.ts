/** Sdílené konstanty a validace objednávky vína (klient + server). */

export type BottleTyp = "sklo" | "plast";

export type WineOrderLine = {
  vinoId: string;
  typ: BottleTyp;
  pocet: number;
};

export const PRICE_SKLO = 150;
export const PRICE_PLAST = 240;

export const WINES = [
  { id: "rynsky-ryzlink-2025", name: "Rýnský ryzlink 2025" },
  { id: "vlasky-ryzlink-2025", name: "Vlašský ryzlink 2025" },
  { id: "tramin-cerveny-2025", name: "Tramín červený 2025" },
  { id: "palava-2025", name: "Pálava 2025" },
] as const;

export type WineId = (typeof WINES)[number]["id"];

export const WINE_IDS = new Set<string>(WINES.map((w) => w.id));

export const DELIVERY_OPTIONS = [
  { id: "sklep", label: "Osobní převzetí ve sklepě" },
  { id: "temin", label: "Dovoz Temelín" },
  { id: "dukovany", label: "Dovoz Dukovany" },
  { id: "praha", label: "Dovoz Praha" },
] as const;

export type DeliveryId = (typeof DELIVERY_OPTIONS)[number]["id"];

export const DELIVERY_IDS = new Set<string>(
  DELIVERY_OPTIONS.map((d) => d.id),
);

const EMAIL_RE =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(s: string): boolean {
  return EMAIL_RE.test(s.trim());
}

export function wineNameById(id: string): string | undefined {
  return WINES.find((w) => w.id === id)?.name;
}

export function deliveryLabelById(id: string): string | undefined {
  return DELIVERY_OPTIONS.find((d) => d.id === id)?.label;
}

export function priceForTyp(typ: BottleTyp): number {
  return typ === "sklo" ? PRICE_SKLO : PRICE_PLAST;
}

export function lineTotal(line: WineOrderLine): number {
  if (line.pocet <= 0) return 0;
  return line.pocet * priceForTyp(line.typ);
}

export function formatCZK(n: number): string {
  return `${new Intl.NumberFormat("cs-CZ").format(n)} Kč`;
}

export function orderTotalKc(lines: WineOrderLine[]): number {
  return lines.reduce((sum, l) => sum + lineTotal(l), 0);
}
