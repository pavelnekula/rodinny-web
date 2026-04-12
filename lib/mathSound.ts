/** Krátké tóny přes Web Audio API (bez externích souborů). */

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

export function playBeep(
  freq = 520,
  durationMs = 0.08,
  type: OscillatorType = "sine",
  volume = 0.12,
): void {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  osc.connect(gain);
  gain.connect(ctx.destination);
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);
  osc.start(now);
  osc.stop(now + durationMs / 1000 + 0.02);
}

export function playCorrectTone(): void {
  playBeep(660, 0.1, "sine", 0.14);
  setTimeout(() => playBeep(880, 0.08, "sine", 0.1), 60);
}

export function playWrongTone(): void {
  playBeep(180, 0.15, "triangle", 0.12);
}

export function playTickTone(): void {
  playBeep(440, 0.05, "square", 0.06);
}

export function playFanfare(): void {
  playBeep(523, 0.12, "sine", 0.1);
  setTimeout(() => playBeep(659, 0.12, "sine", 0.1), 100);
  setTimeout(() => playBeep(784, 0.18, "sine", 0.12), 220);
}

/** Pětiminutovky: krátký tón po správné odpovědi */
export function playPetiminutovkaCorrect(): void {
  playBeep(880, 80, "sine", 0.11);
}

/** Pětiminutovky: tón po špatné odpovědi */
export function playPetiminutovkaWrong(): void {
  playBeep(220, 150, "sine", 0.12);
}
