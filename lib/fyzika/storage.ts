const PREFIX = "fyzika-teodor-v1";

export type TopicProgress = {
  exercisesCompleted: number;
  exerciseIds: string[];
};

export type PexesoBest = {
  moves: number;
  centiSecs: number;
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function getProgressKey(): string {
  return `${PREFIX}-progress`;
}

export function loadAllProgress(): Record<string, TopicProgress> {
  return readJson<Record<string, TopicProgress>>(getProgressKey(), {});
}

export function saveTopicExerciseProgress(
  slug: string,
  totalExercises: number,
  completedIds: string[],
) {
  const all = loadAllProgress();
  all[slug] = {
    exercisesCompleted: completedIds.length,
    exerciseIds: completedIds,
  };
  writeJson(getProgressKey(), all);
}

export function getTopicProgress(
  slug: string,
  totalExercises: number,
): { done: number; total: number } {
  const p = loadAllProgress()[slug];
  const done = p?.exerciseIds?.length ?? 0;
  return { done: Math.min(done, totalExercises), total: totalExercises };
}

export function pexesoHighScoreKey(slug: string): string {
  return `${PREFIX}-pexeso-${slug}`;
}

export function loadPexesoBest(slug: string): PexesoBest | null {
  return readJson<PexesoBest | null>(pexesoHighScoreKey(slug), null);
}

/** Uloží, pokud je skóre lepší (méně tahů, při remíze kratší čas). */
export function savePexesoIfBetter(
  slug: string,
  moves: number,
  centiSecs: number,
) {
  const prev = loadPexesoBest(slug);
  if (!prev || moves < prev.moves || (moves === prev.moves && centiSecs < prev.centiSecs)) {
    writeJson(pexesoHighScoreKey(slug), { moves, centiSecs });
  }
}

const LAST_TOPIC_KEY = `${PREFIX}-last-topic`;

export function setLastTopic(slug: string) {
  writeJson(LAST_TOPIC_KEY, slug);
}

export function getLastTopic(): string | null {
  return readJson<string | null>(LAST_TOPIC_KEY, null);
}

/** Průměr poměru hotových cvičení v každém celku (0–1). */
export function averageExerciseRatio(
  topicSlugs: readonly string[],
  exerciseCountBySlug: Record<string, number>,
): number {
  const all = loadAllProgress();
  let acc = 0;
  for (const slug of topicSlugs) {
    const total = exerciseCountBySlug[slug] ?? 0;
    const done = all[slug]?.exerciseIds?.length ?? 0;
    acc += total > 0 ? Math.min(1, done / total) : 0;
  }
  return topicSlugs.length ? acc / topicSlugs.length : 0;
}
