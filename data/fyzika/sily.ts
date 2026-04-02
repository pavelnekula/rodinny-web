import type { TopicContent } from "./types";

export const silyContent: TopicContent = {
  slug: "sily",
  lecture: [
    {
      id: "sila-ucinky",
      title: "Co je síla",
      paragraphs: [
        "Síla je vektor: má velikost, směr a působiště. Může deformovat tělo nebo měnit jeho pohyb (zpomalit, zrychlit, ohnout).",
      ],
    },
    {
      id: "tihova",
      title: "Gravitační síla (tíha)",
      paragraphs: [
        "Na Zemi přibližně F_g = m · g, kde g ≈ 10 m/s² (zjednodušení pro výpočty v primě).",
      ],
      formula: "F_g = m · g",
    },
    {
      id: "newton",
      title: "Newton",
      paragraphs: [
        "Síla se měří v newtonech (N). 1 N je taková síla, která dá tělesu hmotnosti 1 kg zrychlení 1 m/s².",
      ],
    },
    {
      id: "treni",
      title: "Třecí síla",
      paragraphs: [
        "Brzdí pohyb při klouzání nebo valení — závisí na drsnosti a přítlaku.",
      ],
    },
    {
      id: "skladani",
      title: "Skládání sil",
      paragraphs: [
        "Stejný směr: sčítáš velikosti. Opačný směr: odčítáš. Výslednice určuje celkový účinek.",
      ],
    },
  ],
  exercises: [
    {
      id: "s1",
      question: "m = 5 kg, g = 10 N/kg. Tíha F v N?",
      expected: "50",
      hint: "F = m·g",
      steps: [
        { title: "Vzorec", detail: "F = m × g" },
        { title: "Dosazení", detail: "5 × 10 = 50" },
        { title: "Výsledek", detail: "50 N" },
      ],
    },
    {
      id: "s2",
      question: "F = 120 N, g = 10 N/kg. Hmotnost m v kg?",
      expected: "12",
      hint: "m = F/g",
      steps: [
        { title: "Vzorec", detail: "m = F / g" },
        { title: "Dosazení", detail: "120 / 10 = 12" },
        { title: "Výsledek", detail: "12 kg" },
      ],
    },
    {
      id: "s3",
      question: "Dvě síly 8 N a 5 N ve stejném směru. Výslednice?",
      expected: "13",
      hint: "Sečti.",
      steps: [
        { title: "Výsledek", detail: "13 N" },
      ],
    },
    {
      id: "s4",
      question: "8 N doprava, 5 N doleva. Velikost výslednice (N)?",
      expected: "3",
      hint: "Odčítej.",
      steps: [
        { title: "Výsledek", detail: "3 N ve směru větší síly." },
      ],
    },
    {
      id: "s5",
      question: "Hmotnost 60 kg na Měsíci g=1,6 N/kg. Tíha v N?",
      expected: "96",
      hint: "F = m·g",
      steps: [
        { title: "Dosazení", detail: "60 × 1,6 = 96" },
        { title: "Výsledek", detail: "96 N" },
      ],
    },
    {
      id: "s6",
      question: "m = 0,5 kg, g=10. F?",
      expected: "5",
      hint: "F=m·g",
      steps: [
        { title: "Výsledek", detail: "5 N" },
      ],
    },
    {
      id: "s7",
      question: "Jednotka síly je _____. (newton nebo kg)",
      expected: "newton",
      hint: "Po Isaacu Newtonovi.",
      steps: [
        { title: "Výsledek", detail: "newton" },
      ],
    },
    {
      id: "s8",
      question:
        "Šipka síly musí mít správný směr, počátek v _____. (jedno slovo: kde síla působí)",
      expected: "pusobiste",
      hint: "Kde síla působí.",
      steps: [
        { title: "Výsledek", detail: "působiště" },
      ],
    },
    {
      id: "s9",
      question: "20 N a 20 N proti sobě. Výslednice?",
      expected: "0",
      hint: "Vyruší se.",
      steps: [
        { title: "Výsledek", detail: "0 N" },
      ],
    },
    {
      id: "s10",
      question: "Brzdění auta: která síla zpomaluje? (treci nebo gravitacni)",
      expected: "treci",
      hint: "Mezi pneu a vozovkou.",
      steps: [
        { title: "Výsledek", detail: "třecí" },
      ],
    },
  ],
  pexeso: [
    { id: "r1", sideA: "gravitační síla", sideB: "jablko padá", explanation: "Zem přitahuje dolů." },
    { id: "r2", sideA: "třecí síla", sideB: "brzdění auta", explanation: "Tření mezi koly a silnicí." },
    { id: "r3", sideA: "síla", sideB: "newton (N)", explanation: "Jednotka síly." },
    { id: "r4", sideA: "hmotnost", sideB: "kilogram (kg)", explanation: "Kolik látky." },
    { id: "r5", sideA: "F = m·g", sideB: "tíha na Zemi", explanation: "Výpočet tíhy." },
    { id: "r6", sideA: "deformace", sideB: "účinek síly", explanation: "Síla může tělo zdeformovat." },
    { id: "r7", sideA: "změna pohybu", sideB: "účinek síly", explanation: "Druhý hlavní účinek síly." },
    { id: "r8", sideA: "vektor", sideB: "síla má směr", explanation: "Síla není jen číslo." },
    { id: "r9", sideA: "výslednice", sideB: "součet sil", explanation: "Jedna síla nahrazuje více sil." },
    { id: "r10", sideA: "g ≈ 10", sideB: "N/kg na Zemi", explanation: "Zjednodušená hodnota pro školu." },
  ],
};
