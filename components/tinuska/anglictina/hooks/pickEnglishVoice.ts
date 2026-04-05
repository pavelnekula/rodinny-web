/**
 * Vybere nejvhodnější anglický hlas (typicky en-US / en-GB, lokální systémový).
 * Web Speech API — kvalita závisí na OS a nainstalovaných hlasech.
 */
export function pickPreferredEnglishVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
  if (!voices.length) return null;

  const en = voices.filter((v) => {
    const lang = v.lang.toLowerCase();
    return lang.startsWith("en");
  });
  if (!en.length) return null;

  const nativeLike = en.filter((v) => {
    const lang = v.lang.toLowerCase();
    return (
      lang.startsWith("en-us") ||
      lang.startsWith("en-gb") ||
      lang.startsWith("en-au") ||
      lang.startsWith("en-ca") ||
      lang === "en"
    );
  });
  const pool = nativeLike.length ? nativeLike : en;

  const score = (v: SpeechSynthesisVoice) => {
    let s = 0;
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();

    // Preferovat lokální / offline hlasy (kde API podporuje)
    const any = v as SpeechSynthesisVoice & { localService?: boolean };
    if (any.localService === true) s += 4;

    if (lang.startsWith("en-us") || lang === "en-us") s += 3;
    if (lang.startsWith("en-gb")) s += 3;

    // Windows / Edge / známé přirozenější hlasy
    if (
      /microsoft|google|apple|natural|neural|premium|enhanced/i.test(name) ||
      /microsoft|google|apple/i.test(v.voiceURI)
    ) {
      s += 3;
    }
    if (
      /zira|jenny|aria|guy|samantha|daniel|karen|victoria|hazel|sonia|mark|thomas|ryan|emma|olivia|libby|clara|madison|andrew|brandon|michelle|natalie|aaron|benjamin|christopher|eva|amelie|richard|susan|linda/i.test(
        name,
      )
    ) {
      s += 2;
    }

    return s;
  };

  return [...pool].sort((a, b) => score(b) - score(a))[0] ?? null;
}
