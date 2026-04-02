import type { TopicContent } from "./types";

export const teploContent: TopicContent = {
  slug: "teplo",
  lecture: [
    {
      id: "teplo-teplota",
      title: "Teplo vs teplota",
      paragraphs: [
        "Teplota říká, jak „horké“ je těleso (°C, K, °F). Teplo je energie, která při výměně přechází z tělesa na těleso.",
      ],
    },
    {
      id: "prevody-t",
      title: "Převody teplot",
      paragraphs: [
        "Kelvin: T(K) = t(°C) + 273. Fahrenheit: t(°F) = t(°C)·9/5 + 32.",
      ],
      formula: "T = t + 273  (°C → K)",
    },
    {
      id: "vymena",
      title: "Tepelná výměna",
      paragraphs: [
        "Vedení (dotyk), proudění (kapaliny, plyny), záření (slunce).",
      ],
    },
    {
      id: "skupenske",
      title: "Skupenské přeměny",
      paragraphs: [
        "Tání, tuhnutí, vypařování, kapalnění, sublimace (např. suchý led → plyn).",
      ],
    },
  ],
  exercises: [
    {
      id: "t1",
      question: "0 °C v kelvinech?",
      expected: "273",
      hint: "T = t + 273",
      steps: [{ title: "Výsledek", detail: "273 K" }],
    },
    {
      id: "t2",
      question: "100 °C v kelvinech?",
      expected: "373",
      hint: "+273",
      steps: [{ title: "Výsledek", detail: "373 K" }],
    },
    {
      id: "t3",
      question: "300 K ve °C?",
      expected: "27",
      hint: "t = T - 273",
      steps: [{ title: "Dosazení", detail: "300 - 273 = 27" }],
    },
    {
      id: "t4",
      question: "0 °C ve °F? (zrcadlově 32)",
      expected: "32",
      hint: "×9/5+32",
      steps: [{ title: "Výsledek", detail: "32 °F" }],
    },
    {
      id: "t5",
      question: "100 °C ve °F?",
      expected: "212",
      hint: "×9/5+32",
      steps: [{ title: "Dosazení", detail: "100×9/5+32=212" }],
    },
    {
      id: "t6",
      question: "212 °F ve °C?",
      expected: "100",
      hint: "(°F-32)×5/9",
      steps: [{ title: "Výsledek", detail: "100 °C" }],
    },
    {
      id: "t7",
      question: "Led v teplé vodě: led se _____. (taje/varí)",
      expected: "taje",
      hint: "Pevné → kapalné.",
      steps: [{ title: "Výsledek", detail: "taje" }],
    },
    {
      id: "t8",
      question: "Mokré prádlo schne: voda _____. (vypařuje se/tuhne)",
      expected: "vypařuje se",
      hint: "Kapalné → plynné.",
      steps: [{ title: "Výsledek", detail: "vypařuje se" }],
    },
    {
      id: "t9",
      question: "Bod mrazu vody °C?",
      expected: "0",
      hint: "Zamrzá.",
      steps: [{ title: "Výsledek", detail: "0 °C" }],
    },
    {
      id: "t10",
      question: "Bod varu vody °C (při normálním tlaku)?",
      expected: "100",
      hint: "Vaří se.",
      steps: [{ title: "Výsledek", detail: "100 °C" }],
    },
  ],
  pexeso: [
    { id: "tp1", sideA: "tání", sideB: "led → voda", explanation: "Pevné na kapalné." },
    { id: "tp2", sideA: "vypařování", sideB: "mokré prádlo schne", explanation: "Kapalné do plynu." },
    { id: "tp3", sideA: "0 °C", sideB: "bod mrazu vody", explanation: "Základní bod." },
    { id: "tp4", sideA: "100 °C", sideB: "bod varu vody", explanation: "Za normálního tlaku." },
    { id: "tp5", sideA: "tuhnutí", sideB: "voda → led", explanation: "Kapalné na pevné." },
    { id: "tp6", sideA: "kapalnění", sideB: "pára → voda", explanation: "Plyn na kapalinu." },
    { id: "tp7", sideA: "sublimace", sideB: "suchý led", explanation: "Přímo pevné → plyn." },
    { id: "tp8", sideA: "vedení tepla", sideB: "vařečka v hrnci", explanation: "Dotykem." },
    { id: "tp9", sideA: "záření", sideB: "slunce", explanation: "Bez média." },
    { id: "tp10", sideA: "Kelvin", sideB: "absolutní stupnice", explanation: "0 K = absolutní nula." },
  ],
};
