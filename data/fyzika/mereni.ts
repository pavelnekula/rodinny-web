import type { TopicContent } from "./types";

export const mereniContent: TopicContent = {
  slug: "mereni",
  lecture: [
    {
      id: "co-je-fyzika",
      title: "Co je fyzika?",
      paragraphs: [
        "Fyzika zkoumá přírodu kolem nás: pohyb, síly, energii, světlo, teplotu, elektrinu…",
        "Pomáhá nám chápat, proč věci padají, jak funguje mobil i proč se voda vaří při 100 °C.",
      ],
    },
    {
      id: "veliciny",
      title: "Fyzikální veličiny",
      paragraphs: [
        "Veličina popisuje vlastnost, kterou můžeme měřit nebo počítat.",
        "Základní příklady: délka (jak je něco dlouhé), hmotnost (kolik to „váží“), čas, teplota, objem.",
      ],
    },
    {
      id: "si",
      title: "Jednotky SI",
      paragraphs: [
        "Mezinárodní soustava SI má základní jednotky: metr (m) pro délku, kilogram (kg) pro hmotnost, sekunda (s) pro čas, kelvin (K) pro teplotu (vedle stupně Celsia).",
        "Od nich odvozujeme další jednotky (např. newton pro sílu).",
      ],
      formula: "Základ: m, kg, s, A, K, mol, cd",
    },
    {
      id: "meridla",
      title: "Měřidla",
      paragraphs: [
        "📏 Pravítko → délka · ⚖️ váhy → hmotnost · ⏱️ stopky → čas · 🌡️ teploměr → teplota · odměrný válec → objem kapaliny.",
      ],
    },
    {
      id: "chyby",
      title: "Jak správně měřit a chyby",
      paragraphs: [
        "Měření vždy má malou nejistotu: špatné přiložení pravítka, zrak pod úhlem, rozkolísané ručičky.",
        "Opakuj měření, používej správné měřítko a zapisuj jednotky — bez nich je číslo k ničemu.",
      ],
    },
  ],
  exercises: [
    {
      id: "m1",
      question: "Kolik metrů je 250 cm?",
      expected: "2.5",
      hint: "1 m = 100 cm, dělíš stem.",
      steps: [
        { title: "Vzorec", detail: "metry = centimetry ÷ 100" },
        { title: "Dosazení", detail: "250 ÷ 100 = 2,5" },
        { title: "Výsledek", detail: "2,5 m (zapis 2.5)" },
      ],
    },
    {
      id: "m2",
      question: "Kolik centimetrů je 3,4 m?",
      expected: "340",
      hint: "Násobíš stem.",
      steps: [
        { title: "Vzorec", detail: "cm = m × 100" },
        { title: "Dosazení", detail: "3,4 × 100 = 340" },
        { title: "Výsledek", detail: "340 cm" },
      ],
    },
    {
      id: "m3",
      question: "Kolik gramů je 2,5 kg?",
      expected: "2500",
      hint: "1 kg = 1000 g.",
      steps: [
        { title: "Vzorec", detail: "g = kg × 1000" },
        { title: "Dosazení", detail: "2,5 × 1000 = 2500" },
        { title: "Výsledek", detail: "2500 g" },
      ],
    },
    {
      id: "m4",
      question: "Kolik kilogramů je 8000 g?",
      expected: "8",
      hint: "Dělíš tisícem.",
      steps: [
        { title: "Vzorec", detail: "kg = g ÷ 1000" },
        { title: "Dosazení", detail: "8000 ÷ 1000 = 8" },
        { title: "Výsledek", detail: "8 kg" },
      ],
    },
    {
      id: "m5",
      question: "Kolik sekund je 4 minuty?",
      expected: "240",
      hint: "1 min = 60 s.",
      steps: [
        { title: "Vzorec", detail: "s = min × 60" },
        { title: "Dosazení", detail: "4 × 60 = 240" },
        { title: "Výsledek", detail: "240 s" },
      ],
    },
    {
      id: "m6",
      question: "Kolik minut je 90 sekund?",
      expected: "1.5",
      hint: "Dělíš šedesátkou.",
      steps: [
        { title: "Vzorec", detail: "min = s ÷ 60" },
        { title: "Dosazení", detail: "90 ÷ 60 = 1,5" },
        { title: "Výsledek", detail: "1,5 min" },
      ],
    },
    {
      id: "m7",
      question: "Kolik litrů je 3500 ml?",
      expected: "3.5",
      hint: "1 l = 1000 ml.",
      steps: [
        { title: "Vzorec", detail: "l = ml ÷ 1000" },
        { title: "Dosazení", detail: "3500 ÷ 1000 = 3,5" },
        { title: "Výsledek", detail: "3,5 l" },
      ],
    },
    {
      id: "m8",
      question: "Kolik mililitrů je 0,25 l?",
      expected: "250",
      hint: "Násobíš tisícem.",
      steps: [
        { title: "Vzorec", detail: "ml = l × 1000" },
        { title: "Dosazení", detail: "0,25 × 1000 = 250" },
        { title: "Výsledek", detail: "250 ml" },
      ],
    },
    {
      id: "m9",
      question: "Kolik metrů je 7 km?",
      expected: "7000",
      hint: "1 km = 1000 m.",
      steps: [
        { title: "Vzorec", detail: "m = km × 1000" },
        { title: "Dosazení", detail: "7 × 1000 = 7000" },
        { title: "Výsledek", detail: "7000 m" },
      ],
    },
    {
      id: "m10",
      question: "Kolik kilometrů je 500 m?",
      expected: "0.5",
      hint: "Dělíš tisícem.",
      steps: [
        { title: "Vzorec", detail: "km = m ÷ 1000" },
        { title: "Dosazení", detail: "500 ÷ 1000 = 0,5" },
        { title: "Výsledek", detail: "0,5 km" },
      ],
    },
  ],
  pexeso: [
    {
      id: "p1",
      sideA: "délka",
      sideB: "metr (m)",
      explanation: "Délku v SI měříme v metrech.",
    },
    {
      id: "p2",
      sideA: "hmotnost",
      sideB: "kilogram (kg)",
      explanation: "Hmotnost základně v kilogramech.",
    },
    {
      id: "p3",
      sideA: "čas",
      sideB: "sekunda (s)",
      explanation: "Čas v sekundách je základ SI.",
    },
    {
      id: "p4",
      sideA: "teplota (SI)",
      sideB: "kelvin (K)",
      explanation: "V SI je teplota v kelvinech; ve škole často °C.",
    },
    {
      id: "p5",
      sideA: "objem",
      sideB: "metr krychlový (m³)",
      explanation: "Objem prostoru v m³; kapaliny často v litrech.",
    },
    {
      id: "p6",
      sideA: "pravítko",
      sideB: "měří délku",
      explanation: "Pravítko používáš na délku v mm, cm…",
    },
    {
      id: "p7",
      sideA: "váhy",
      sideB: "měří hmotnost",
      explanation: "Váhy porovnávají nebo ukazují hmotnost.",
    },
    {
      id: "p8",
      sideA: "stopky",
      sideB: "měří čas",
      explanation: "Stopky měří časový interval.",
    },
    {
      id: "p9",
      sideA: "teploměr",
      sideB: "měří teplotu",
      explanation: "Teplota = jak „horké“ je něco.",
    },
    {
      id: "p10",
      sideA: "značka m",
      sideB: "metr",
      explanation: "Malé m znamená metr.",
    },
  ],
};
