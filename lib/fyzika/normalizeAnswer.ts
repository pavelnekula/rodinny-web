/** Odstraní diakritiku pro porovnání textových odpovědí. */
function stripDiacritics(s: string): string {
  return s.normalize("NFD").replace(/\p{M}/gu, "");
}

export function normalizeTextAnswer(input: string): string {
  return stripDiacritics(input.trim().toLowerCase()).replace(/\s+/g, " ");
}

/** Normalizace číselné odpovědi: čárka → tečka, mezery pryč. */
export function normalizeNumericAnswer(input: string): string {
  const t = input.trim().replace(/\s/g, "").replace(",", ".");
  const n = parseFloat(t);
  if (Number.isNaN(n)) return normalizeTextAnswer(input);
  return String(n);
}

export function answersMatch(expected: string, userInput: string): boolean {
  const expN = parseFloat(expected.replace(",", "."));
  const userRaw = userInput.trim().replace(/\s/g, "").replace(",", ".");
  const userN = parseFloat(userRaw);
  if (!Number.isNaN(expN) && !Number.isNaN(userN)) {
    return Math.abs(expN - userN) < 0.01 + Math.abs(expN) * 1e-9;
  }
  return normalizeTextAnswer(userInput) === normalizeTextAnswer(expected);
}
