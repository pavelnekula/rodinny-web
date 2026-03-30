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

export function useGameSounds() {
  const ctxRef = useRef<AudioContext | null>(null);

  const ctx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = getCtx();
    return ctxRef.current;
  }, []);

  const playCorrect = useCallback(() => {
    const c = ctx();
    if (!c) return;
    if (c.state === "suspended") void c.resume();
    playTone(c, 880, 0.1, 0.11);
    window.setTimeout(() => playTone(c, 1100, 0.12, 0.09), 70);
  }, [ctx]);

  const playWrong = useCallback(() => {
    const c = ctx();
    if (!c) return;
    if (c.state === "suspended") void c.resume();
    playTone(c, 180, 0.22, 0.1);
  }, [ctx]);

  const playFanfare = useCallback(() => {
    const c = ctx();
    if (!c) return;
    if (c.state === "suspended") void c.resume();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    let t = 0;
    for (const f of notes) {
      window.setTimeout(() => playTone(c, f, 0.18, 0.1), t);
      t += 120;
    }
  }, [ctx]);

  return { playCorrect, playWrong, playFanfare };
}
