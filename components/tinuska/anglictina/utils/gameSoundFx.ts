"use client";

/** Jednotné zvukové efekty (Web Audio API), bez externích souborů. */

let ctxRef: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  if (!ctxRef) ctxRef = new AC();
  return ctxRef;
}

function tone(
  freq: number,
  duration: number,
  gain = 0.12,
  type: OscillatorType = "sine",
) {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, ctx.currentTime);
  g.gain.setValueAtTime(0.0001, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  o.connect(g);
  g.connect(ctx.destination);
  o.start(ctx.currentTime);
  o.stop(ctx.currentTime + duration + 0.05);
}

export type PlaySoundKind =
  | "correct"
  | "wrong"
  | "click"
  | "complete"
  | "achievement"
  | "tick"
  | "fanfare";

export function playSound(kind: PlaySoundKind) {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume();

  switch (kind) {
    case "correct":
      tone(880, 0.1, 0.11);
      window.setTimeout(() => tone(1100, 0.12, 0.09), 70);
      break;
    case "wrong":
      tone(180, 0.22, 0.1);
      break;
    case "click":
      tone(520, 0.05, 0.06);
      break;
    case "complete":
      tone(659, 0.12, 0.09);
      window.setTimeout(() => tone(784, 0.14, 0.08), 100);
      break;
    case "achievement":
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        window.setTimeout(() => tone(f, 0.16, 0.09), i * 90);
      });
      break;
    case "tick":
      tone(660, 0.04, 0.05);
      break;
    case "fanfare": {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      let t = 0;
      for (const f of notes) {
        window.setTimeout(() => tone(f, 0.18, 0.1), t);
        t += 120;
      }
      break;
    }
    default:
      break;
  }
}
