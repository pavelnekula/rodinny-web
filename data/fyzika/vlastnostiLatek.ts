import type { TopicContent } from "./types";

export const vlastnostiLatekContent: TopicContent = {
  slug: "vlastnosti-latek",
  lecture: [
    {
      id: "skupenstvi",
      title: "Tři skupenství",
      paragraphs: [
        "Pevné: drží tvar (kámen, led). Kapalné: tekou, přizpůsobí nádobě (voda, olej). Plynné: rozlézají se (vzduch, pára).",
      ],
    },
    {
      id: "hustota",
      title: "Hustota",
      paragraphs: [
        "Hustota ρ (ró) říká, kolik hmotnosti je v jednotce objemu. Čím větší hustota, tím „hutnější“ látka.",
      ],
      formula: "ρ = m / V  (hmotnost děleno objemem)",
    },
    {
      id: "tabulka",
      title: "Přibližné hustoty",
      paragraphs: [
        "Voda ≈ 1000 kg/m³, železo ≈ 7874 kg/m³, dřevo řádově 400–900 kg/m³, vzduch ≈ 1,2 kg/m³ (za normálních podmínek).",
      ],
    },
    {
      id: "plavani",
      title: "Proč plave nebo se potopí?",
      paragraphs: [
        "Pokud je hustota předmětu menší než hustota kapaliny, předmět plave. Jinak se potopí (pokud je těžší než vytlačená voda).",
      ],
    },
  ],
  exercises: [
    {
      id: "vl1",
      question: "ρ = m/V. Hmotnost 2700 kg, objem 1 m³. Jaká je hustota v kg/m³?",
      expected: "2700",
      hint: "ρ = m ÷ V",
      steps: [
        { title: "Vzorec", detail: "ρ = m / V" },
        { title: "Dosazení", detail: "2700 / 1" },
        { title: "Výsledek", detail: "2700 kg/m³ (hliník)" },
      ],
    },
    {
      id: "vl2",
      question: "Hustota 7800 kg/m³, objem 0,002 m³. Hmotnost v kg?",
      expected: "15.6",
      hint: "m = ρ · V",
      steps: [
        { title: "Vzorec", detail: "m = ρ × V" },
        { title: "Dosazení", detail: "7800 × 0,002 = 15,6" },
        { title: "Výsledek", detail: "15,6 kg" },
      ],
    },
    {
      id: "vl3",
      question: "Hmotnost 2 kg, hustota 800 kg/m³. Objem v m³?",
      expected: "0.0025",
      hint: "V = m / ρ",
      steps: [
        { title: "Vzorec", detail: "V = m / ρ" },
        { title: "Dosazení", detail: "2 / 800 = 0,0025" },
        { title: "Výsledek", detail: "0,0025 m³" },
      ],
    },
    {
      id: "vl4",
      question: "Voda má 1000 kg/m³, korková zátka 240 kg/m³. Plave?",
      expected: "ano",
      hint: "Porovnej hustoty.",
      steps: [
        { title: "Úvaha", detail: "240 < 1000" },
        { title: "Výsledek", detail: "Ano, plave." },
      ],
    },
    {
      id: "vl5",
      question: "Železo cca 7874 kg/m³ ve vodě 1000 kg/m³. Potopí se?",
      expected: "ano",
      hint: "Větší hustota než voda.",
      steps: [
        { title: "Úvaha", detail: "7874 > 1000" },
        { title: "Výsledek", detail: "Ano, potopí se." },
      ],
    },
    {
      id: "vl6",
      question: "m = 5 kg, V = 0,01 m³. ρ = ?",
      expected: "500",
      hint: "ρ = m/V",
      steps: [
        { title: "Dosazení", detail: "5 / 0,01 = 500" },
        { title: "Výsledek", detail: "500 kg/m³" },
      ],
    },
    {
      id: "vl7",
      question: "Objem 2 m³, hustota vzduchu 1,2 kg/m³. Hmotnost vzduchu v kg?",
      expected: "2.4",
      hint: "m = ρV",
      steps: [
        { title: "Dosazení", detail: "1,2 × 2 = 2,4" },
        { title: "Výsledek", detail: "2,4 kg" },
      ],
    },
    {
      id: "vl8",
      question: "Led má menší hustotu než voda. Plave led na vodě?",
      expected: "ano",
      hint: "Menší ρ než voda.",
      steps: [
        { title: "Výsledek", detail: "Ano." },
      ],
    },
    {
      id: "vl9",
      question: "ρ = 1000 kg/m³, m = 50 kg. Objem v m³?",
      expected: "0.05",
      hint: "V = m/ρ",
      steps: [
        { title: "Dosazení", detail: "50 / 1000 = 0,05" },
        { title: "Výsledek", detail: "0,05 m³" },
      ],
    },
    {
      id: "vl10",
      question: "Olej na vodě tvoří vrstvu nahoře. Má olej větší nebo menší hustotu než voda?",
      expected: "menší",
      hint: "Co je nahoře…",
      steps: [
        { title: "Výsledek", detail: "Menší hustotu než voda." },
      ],
    },
  ],
  pexeso: [
    { id: "x1", sideA: "voda", sideB: "≈ 1000 kg/m³", explanation: "Voda jako referenční hustota." },
    { id: "x2", sideA: "železo", sideB: "≈ 7874 kg/m³", explanation: "Kovy jsou velmi husté." },
    { id: "x3", sideA: "dřevo", sideB: "řádově stovky kg/m³", explanation: "Dřevo je lehčí než voda (typicky)." },
    { id: "x4", sideA: "vzduch", sideB: "≈ 1,2 kg/m³", explanation: "Plyn má malou hustotu." },
    { id: "x5", sideA: "pevné", sideB: "led", explanation: "Led je pevná voda." },
    { id: "x6", sideA: "kapalné", sideB: "voda", explanation: "Tekutina při pokojové teplotě." },
    { id: "x7", sideA: "plynné", sideB: "pára", explanation: "Vodní pára je plyn." },
    { id: "x8", sideA: "ρ = m/V", sideB: "hustota", explanation: "Definice hustoty." },
    { id: "x9", sideA: "plave", sideB: "ρ tělesa < ρ kapaliny", explanation: "Podmínka plavání." },
    { id: "x10", sideA: "objem", sideB: "m³ nebo l", explanation: "Objem měříme v m³ nebo litrech." },
  ],
};
