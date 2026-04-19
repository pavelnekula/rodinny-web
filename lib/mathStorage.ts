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
  /** Nový formát pětiminutovek — čas kola ve stopkách */
  timeSec?: number;
};

/** Jedna chyba v historii kola (LocalStorage `math_petiminutovky_history`). */
export type PetiminutovkaHistoryChyba = {
  priklad: string;
  odpoved: number | null;
  spravne: number;
  category: string;
  missingPosition: string;
};

export type PetiminutovkaHistoryEntry = {
  id: string;
  datum: string;
  typ: PetiminutovkaTyp;
  cas_sekundy: number;
  celkem: 20;
  spravne: number;
  spatne: number;
  chyby: PetiminutovkaHistoryChyba[];
};

export type PetiminutovkaRekordyMap = Partial<
  Record<PetiminutovkaTyp, { cas: number; spravne: number }>
>;

const PET_HISTORY_KEY = "math_petiminutovky_history";
const PET_REKORDY_KEY = "math_petiminutovky_rekordy";

/** Starý zápis `math_petiminutovky_record_*` bez času — nepoužívá se k porovnání času. */
const LEGACY_CAS_SENTINEL = 999_999;

function betterPetRun(
  a: { cas: number; spravne: number },
  b: { cas: number; spravne: number },
): boolean {
  if (a.spravne === 20 && b.spravne === 20) return a.cas < b.cas;
  if (a.spravne === 20 && b.spravne < 20) return true;
  if (a.spravne < 20 && b.spravne === 20) return false;
  if (a.spravne !== b.spravne) return a.spravne > b.spravne;
  return a.cas < b.cas;
}

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

export function getPetiminutovkaRekordy(): PetiminutovkaRekordyMap {
  return readJson<PetiminutovkaRekordyMap>(PET_REKORDY_KEY) ?? {};
}

/** Nejlepší uložený výkon pro typ (čas + počet správně z 20). */
export function getPetiminutovkaRekord(
  typ: PetiminutovkaTyp,
): { cas: number; spravne: number } | null {
  const fromMap = getPetiminutovkaRekordy()[typ];
  if (fromMap) return fromMap;
  const legacy = readNum(PET_KEYS.record(typ));
  if (legacy != null && legacy > 0 && legacy <= 20) {
    return { cas: LEGACY_CAS_SENTINEL, spravne: legacy };
  }
  return null;
}

/** Nejvyšší počet správně v uloženém rekordu (hvězdy v přehledu matematiky). */
export function getPetiminutovkaRecord(typ: PetiminutovkaTyp): number | null {
  const r = getPetiminutovkaRekord(typ);
  return r ? r.spravne : null;
}

export function setPetiminutovkaRecordIfBetter(
  typ: PetiminutovkaTyp,
  correct: number,
): boolean {
  if (typeof window === "undefined") return false;
  const prevRek = getPetiminutovkaRekord(typ);
  const prevNum = prevRek?.spravne ?? readNum(PET_KEYS.record(typ)) ?? -1;
  if (correct > prevNum) {
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
  opts?: { timeSec?: number; skipLegacyCorrectCount?: boolean },
): { isNewRecord: boolean } {
  if (typeof window === "undefined") return { isNewRecord: false };
  const date = new Date().toISOString();
  const z: PetiminutovkaZaznam = { date, correct, wrong };
  pushLastFive(typ, z);
  writeNum(PET_KEYS.lastCorrect(typ), correct);
  const isNewRecord = opts?.skipLegacyCorrectCount
    ? false
    : setPetiminutovkaRecordIfBetter(typ, correct);

  const runs = readJson<PetiminutovkaRunLog[]>(PET_KEYS.runs) ?? [];
  runs.unshift({
    date,
    typ,
    correct,
    wrong,
    ...(opts?.timeSec != null ? { timeSec: opts.timeSec } : {}),
  });
  writeJson(PET_KEYS.runs, runs.slice(0, 200));

  return { isNewRecord };
}

export function appendPetiminutovkaHistory(entry: PetiminutovkaHistoryEntry): void {
  if (typeof window === "undefined") return;
  const list = readJson<PetiminutovkaHistoryEntry[]>(PET_HISTORY_KEY) ?? [];
  list.unshift(entry);
  writeJson(PET_HISTORY_KEY, list.slice(0, 200));
}

/** Aktualizuje `math_petiminutovky_rekordy` — lepší = 20/20 s kratším časem, jinak vyšší počet správně / při shodě kratší čas. */
export function mergePetiminutovkaRekord(
  typ: PetiminutovkaTyp,
  run: { cas: number; spravne: number },
): void {
  if (typeof window === "undefined") return;
  const m: PetiminutovkaRekordyMap = { ...getPetiminutovkaRekordy() };
  const prev = m[typ] ?? null;
  if (prev == null || betterPetRun(run, prev)) {
    m[typ] = run;
    writeJson(PET_REKORDY_KEY, m);
  }
}

/** Historie + rekordy + graf (bez zápisu do legacy `math_petiminutovky_record_*`). */
export function finalizePetiminutovkaRound(entry: PetiminutovkaHistoryEntry): void {
  appendPetiminutovkaHistory(entry);
  mergePetiminutovkaRekord(entry.typ, {
    cas: entry.cas_sekundy,
    spravne: entry.spravne,
  });
  savePetiminutovkaRun(entry.typ, entry.spravne, entry.spatne, {
    timeSec: entry.cas_sekundy,
    skipLegacyCorrectCount: true,
  });
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
