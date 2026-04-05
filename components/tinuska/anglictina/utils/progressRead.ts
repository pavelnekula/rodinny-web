const STORAGE_KEY = "tinuska-anglictina-progress-v1";

/** Čtení postupu slovíček bez hooku (achievements). */
export function readProgressWords(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === "number" && v >= 0 && Number.isFinite(v)) {
        out[k] = Math.floor(v);
      }
    }
    return out;
  } catch {
    return {};
  }
}
