"use client";

import { useCallback, useRef } from "react";

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  return new AC();
}

function playTone(
  ctx: AudioContext,
  freq: number,
  duration: number,
  gain = 0.12,
) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(freq, ctx.currentTime);
  g.gain.setValueAtTime(0.0001, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  o.connect(g);
  g.connect(ctx.destination);
  o.start(ctx.currentTime);
  o.stop(ctx.currentTime + duration + 0.05);
}

export function useFyzikaSounds() {
  const ctxRef = useRef<AudioContext | null>(null);

  const ctx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = getCtx();
    return ctxRef.current;
  }, []);

  const playCorrect = useCallback(() => {
    const c = ctx();
    if (!c) return;
    if (c.state === "suspended") void c.resume();
    playTone(c, 920, 0.1, 0.1);
    window.setTimeout(() => playTone(c, 1200, 0.1, 0.08), 60);
  }, [ctx]);

  const playWrong = useCallback(() => {
    const c = ctx();
    if (!c) return;
    if (c.state === "suspended") void c.resume();
    playTone(c, 160, 0.2, 0.11);
  }, [ctx]);

  const playPairFound = useCallback(() => {
    const c = ctx();
    if (!c) return;
    if (c.state === "suspended") void c.resume();
    playTone(c, 660, 0.08, 0.1);
    window.setTimeout(() => playTone(c, 990, 0.1, 0.09), 50);
  }, [ctx]);

  const playFanfare = useCallback(() => {
    const c = ctx();
    if (!c) return;
    if (c.state === "suspended") void c.resume();
    const notes = [392, 523.25, 659.25, 783.99];
    let t = 0;
    for (const f of notes) {
      window.setTimeout(() => playTone(c, f, 0.16, 0.1), t);
      t += 110;
    }
  }, [ctx]);

  return { playCorrect, playWrong, playPairFound, playFanfare };
}
