"use client";

import { useCallback } from "react";
import { pickPreferredEnglishVoice } from "./pickEnglishVoice";

function utterEnglish(
  text: string,
  opts: { rate: number; pitch?: number },
) {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  if (!synth) return;

  const speakOnce = () => {
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickPreferredEnglishVoice(synth.getVoices());
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = "en-US";
    }
    utterance.rate = opts.rate;
    utterance.pitch = opts.pitch ?? 1;
    synth.speak(utterance);
  };

  const voices = synth.getVoices();
  if (voices.length === 0) {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.clearTimeout(fallbackTimer);
      synth.removeEventListener("voiceschanged", onVoices);
      speakOnce();
    };
    const onVoices = () => finish();
    synth.addEventListener("voiceschanged", onVoices);
    const fallbackTimer = window.setTimeout(finish, 600);
    return;
  }
  speakOnce();
}

/**
 * Web Speech API – výslovnost anglického textu (en-US).
 */
export function useSpeech() {
  /** Standardní přehrání (kartičky / tlačítko). */
  const speak = useCallback((text: string) => {
    utterEnglish(text, { rate: 0.82 });
  }, []);

  /** Pomaleji a srozumitelněji — výuka, kontrola překladu. */
  const speakSlow = useCallback((text: string) => {
    utterEnglish(text, { rate: 0.58, pitch: 1 });
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis?.cancel();
  }, []);

  return { speak, speakSlow, stop };
}
