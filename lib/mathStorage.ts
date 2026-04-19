const KEYS = {
  pocitani: "math_pocitani_best",
  pisemne: "math_pisemne_best",
  zavorky: "math_zavorky_best",
  bleskovky: "math_bleskovky_best",
  kartyStars: "math_karty_best_stars",
  kartyTime: "math_karty_best_time_sec",
} as const;

function readNum(key: string): number | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(key);
  if (v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function writeNum(key: string, n: number): void {
  window.localStorage.setItem(key, String(n));
}

export function getBestPocitani(): number | null {
  return readNum(KEYS.pocitani);
}

export function setBestPocitaniIfBetter(score: number, max: number): boolean {
  if (typeof window === "undefined") return false;
  const prev = readNum(KEYS.pocitani) ?? -1;
  if (score > prev && score <= max) {
    writeNum(KEYS.pocitani, score);
    return true;
  }
  return false;
}

export function getBestPisemne(): number | null {
  return readNum(KEYS.pisemne);
}

export function setBestPisemneIfBetter(score: number, max: number): boolean {
  if (typeof window === "undefined") return false;
  const prev = readNum(KEYS.pisemne) ?? -1;
  if (score > prev && score <= max) {
    writeNum(KEYS.pisemne, score);
    return true;
  }
  return false;
}

export function getBestZavorky(): number | null {
  return readNum(KEYS.zavorky);
}

export function setBestZavorkyIfBetter(score: number, max: number): boolean {
  if (typeof window === "undefined") return false;
  const prev = readNum(KEYS.zavorky) ?? -1;
  if (score > prev && score <= max) {
    writeNum(KEYS.zavorky, score);
    return true;
  }
  return false;
}

export function getBestBleskovky(): number | null {
  return readNum(KEYS.bleskovky);
}

export function setBestBleskovkyIfBetter(score: number): boolean {
  if (typeof window === "undefined") return false;
  const prev = readNum(KEYS.bleskovky) ?? -1;
  if (score > prev) {
    writeNum(KEYS.bleskovky, score);
    return true;
  }
  return false;
}

export type KartyBest = { stars: number; timeSec: number };

export function getBestKarty(): KartyBest | null {
  if (typeof window === "undefined") return null;
  const s = readNum(KEYS.kartyStars);
  const t = readNum(KEYS.kartyTime);
  if (s === null && t === null) return null;
  return { stars: s ?? 0, timeSec: t ?? 9999 };
}

/** Uloží, pokud jsou hvězdy vyšší, nebo stejné hvězdy a rychlejší čas */
export function setBestKartyIfBetter(stars: number, timeSec: number): boolean {
  if (typeof window === "undefined") return false;
  const prev = getBestKarty();
  if (!prev || stars > prev.stars || (stars === prev.stars && timeSec < prev.timeSec)) {
    writeNum(KEYS.kartyStars, stars);
    writeNum(KEYS.kartyTime, timeSec);
    return true;
  }
  return false;
}

/** 0–3 hvězdy podle skóre vůči max (cvičení) */
export function starsFromScore(score: number, max: number): number {
  if (max <= 0) return 0;
  const r = score / max;
  if (r >= 0.99) return 3;
  if (r >= 0.66) return 2;
  if (r >= 0.34) return 1;
  return 0;
}

/** Bleskovky: počet správných za 60 s */
export function starsFromBleskovky(count: number): number {
  if (count >= 18) return 3;
  if (count >= 10) return 2;
  if (count >= 4) return 1;
  return 0;
}

// ——— Pětiminutovky ———

export type PetiminutovkaTyp =
  | "nasobilka"
  | "deleni"
  | "scitani_odcitani"
  | "scitani_odcitani_do100"
  | "chybejici_cislo"
  | "all";

export type PetiminutovkaZaznam = {
  date: string;
  correct: number;
  wrong: number;
};

export type PetiminutovkaRunLog = {
  date: string;
  typ: PetiminutovkaTyp;
  correct: number;
  wrong: number;
};

const PET_KEYS = {
  record: (t: PetiminutovkaTyp) => `math_petiminutovky_record_${t}`,
  lastFive: (t: PetiminutovkaTyp) => `math_petiminutovky_last5_${t}`,
  lastCorrect: (t: PetiminutovkaTyp) => `math_petiminutovky_last_correct_${t}`,
  runs: "math_petiminutovky_runs",
} as const;

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getPetiminutovkaRecord(typ: PetiminutovkaTyp): number | null {
  return readNum(PET_KEYS.record(typ));
}

export function setPetiminutovkaRecordIfBetter(
  typ: PetiminutovkaTyp,
  correct: number,
): boolean {
  if (typeof window === "undefined") return false;
  const prev = readNum(PET_KEYS.record(typ)) ?? -1;
  if (correct > prev) {
    writeNum(PET_KEYS.record(typ), correct);
    return true;
  }
  return false;
}

export function getPetiminutovkaLastCorrect(typ: PetiminutovkaTyp): number | null {
  return readNum(PET_KEYS.lastCorrect(typ));
}

function pushLastFive(typ: PetiminutovkaTyp, z: PetiminutovkaZaznam): void {
  const cur = readJson<PetiminutovkaZaznam[]>(PET_KEYS.lastFive(typ)) ?? [];
  const next = [z, ...cur].slice(0, 5);
  writeJson(PET_KEYS.lastFive(typ), next);
}

/** Uloží výsledek soutěže, posledních 5, globální log a „minule“ pro srovnání. */
export function savePetiminutovkaRun(
  typ: PetiminutovkaTyp,
  correct: number,
  wrong: number,
): { isNewRecord: boolean } {
  if (typeof window === "undefined") return { isNewRecord: false };
  const date = new Date().toISOString();
  const z: PetiminutovkaZaznam = { date, correct, wrong };
  pushLastFive(typ, z);
  writeNum(PET_KEYS.lastCorrect(typ), correct);
  const isNewRecord = setPetiminutovkaRecordIfBetter(typ, correct);

  const runs = readJson<PetiminutovkaRunLog[]>(PET_KEYS.runs) ?? [];
  runs.unshift({
    date,
    typ,
    correct,
    wrong,
  });
  writeJson(PET_KEYS.runs, runs.slice(0, 200));

  return { isNewRecord };
}

export function getPetiminutovkaLastFive(
  typ: PetiminutovkaTyp,
): PetiminutovkaZaznam[] {
  return readJson<PetiminutovkaZaznam[]>(PET_KEYS.lastFive(typ)) ?? [];
}

export type PetiminutovkaGlobalStats = {
  totalRuns: number;
  totalExamples: number;
  avgAccuracyPct: number;
  recordCorrect: number;
  recordDate: string | null;
};

/** Stejné jako prázdný výsledek statistik — pro počáteční stav bez čtení LocalStorage při SSR. */
export const EMPTY_PETIMINUTOVKA_GLOBAL_STATS: PetiminutovkaGlobalStats = {
  totalRuns: 0,
  totalExamples: 0,
  avgAccuracyPct: 0,
  recordCorrect: 0,
  recordDate: null,
};

export function getPetiminutovkaGlobalStats(): PetiminutovkaGlobalStats {
  const runs = readJson<PetiminutovkaRunLog[]>(PET_KEYS.runs) ?? [];
  if (runs.length === 0) {
    return { ...EMPTY_PETIMINUTOVKA_GLOBAL_STATS };
  }
  let totalExamples = 0;
  let totalCorrect = 0;
  let recordCorrect = 0;
  let recordDate: string | null = null;
  for (const r of runs) {
    const tot = r.correct + r.wrong;
    totalExamples += tot;
    totalCorrect += r.correct;
    if (r.correct > recordCorrect) {
      recordCorrect = r.correct;
      recordDate = r.date;
    }
  }
  const avgAccuracyPct =
    totalExamples > 0
      ? Math.round((totalCorrect / totalExamples) * 1000) / 10
      : 0;
  return {
    totalRuns: runs.length,
    totalExamples,
    avgAccuracyPct,
    recordCorrect,
    recordDate,
  };
}

export function getPetiminutovkaRunsForChart(limit = 20): PetiminutovkaRunLog[] {
  const runs = readJson<PetiminutovkaRunLog[]>(PET_KEYS.runs) ?? [];
  return runs.slice(0, limit);
}

/** Hvězdy v přehledu matematiky podle nejlepšího rekordu v některém typu Pětiminutovek */
export function starsFromPetiminutovky(bestCorrect: number): number {
  if (bestCorrect >= 40) return 3;
  if (bestCorrect >= 25) return 2;
  if (bestCorrect >= 10) return 1;
  return 0;
}
