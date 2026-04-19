let audioCtx: AudioContext | null = null;

function ctx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  return audioCtx;
}

function beep(freq: number, dur: number, type: OscillatorType, gain: number) {
  const c = ctx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.value = gain;
  o.connect(g);
  g.connect(c.destination);
  const t = c.currentTime;
  o.start(t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.stop(t + dur + 0.05);
}

export function zvukSpravne(): void {
  beep(523.25, 0.12, "sine", 0.12);
  window.setTimeout(() => beep(659.25, 0.14, "sine", 0.1), 80);
}

export function zvukChybne(): void {
  beep(180, 0.2, "square", 0.06);
  window.setTimeout(() => beep(140, 0.22, "square", 0.05), 100);
}

export function zvukDokonceni(): void {
  const seq = [392, 523.25, 659.25, 783.99];
  seq.forEach((f, i) => {
    window.setTimeout(() => beep(f, 0.18, "triangle", 0.08), i * 120);
  });
}
