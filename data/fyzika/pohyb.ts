import type { TopicContent } from "./types";

export const pohybContent: TopicContent = {
  slug: "pohyb",
  lecture: [
    {
      id: "pohyb-zaklad",
      title: "Pohyb a vztažná soustava",
      paragraphs: [
        "Tělo je v pohybu, když se mění jeho poloha v čase vůči vybrané vztažné soustavě (např. vůči zemi).",
        "V autě sedíš v klidu vůči autu, ale vůči silnici jedeš.",
      ],
    },
    {
      id: "draha",
      title: "Dráha a trajektorie",
      paragraphs: [
        "Trajektorie je čára, kterou tělo vykreslí. Dráha je délka skutečně uražené cesty (skalár).",
      ],
    },
    {
      id: "rychlost",
      title: "Rychlost",
      paragraphs: [
        "Průměrná rychlost: kolik dráhy urazíš za jednotku času. Rovnoměrný pohyb: stále stejná rychlost po přímce.",
      ],
      formula: "v = s / t   (dráha / čas)",
    },
    {
      id: "prevod",
      title: "km/h a m/s",
      paragraphs: [
        "1 m/s = 3,6 km/h. Z m/s na km/h násobíš 3,6. Z km/h na m/s dělíš 3,6.",
      ],
      formula: "km/h = m/s × 3,6",
    },
    {
      id: "graf",
      title: "Graf s–t",
      paragraphs: [
        "Na ose x čas, na ose y dráha. Přímočará rostoucí přímka = rovnoměrný pohyb, směrnice souvisí s rychlostí.",
      ],
    },
  ],
  exercises: [
    {
      id: "ph1",
      question: "s = 120 m, t = 30 s. Rychlost v m/s?",
      expected: "4",
      hint: "v = s/t",
      steps: [
        { title: "Vzorec", detail: "v = s / t" },
        { title: "Dosazení", detail: "120 / 30 = 4" },
        { title: "Výsledek", detail: "4 m/s" },
      ],
    },
    {
      id: "ph2",
      question: "v = 10 m/s, t = 5 s. Dráha v m?",
      expected: "50",
      hint: "s = v·t",
      steps: [
        { title: "Vzorec", detail: "s = v × t" },
        { title: "Dosazení", detail: "10 × 5 = 50" },
        { title: "Výsledek", detail: "50 m" },
      ],
    },
    {
      id: "ph3",
      question: "s = 200 m, v = 8 m/s. Čas v s?",
      expected: "25",
      hint: "t = s/v",
      steps: [
        { title: "Vzorec", detail: "t = s / v" },
        { title: "Dosazení", detail: "200 / 8 = 25" },
        { title: "Výsledek", detail: "25 s" },
      ],
    },
    {
      id: "ph4",
      question: "18 km/h převeď na m/s (číslo).",
      expected: "5",
      hint: "Děl 3,6.",
      steps: [
        { title: "Vzorec", detail: "m/s = km/h ÷ 3,6" },
        { title: "Dosazení", detail: "18 / 3,6 = 5" },
        { title: "Výsledek", detail: "5 m/s" },
      ],
    },
    {
      id: "ph5",
      question: "15 m/s na km/h?",
      expected: "54",
      hint: "× 3,6",
      steps: [
        { title: "Dosazení", detail: "15 × 3,6 = 54" },
        { title: "Výsledek", detail: "54 km/h" },
      ],
    },
    {
      id: "ph6",
      question: "Auto 2 hodiny jede 140 km. Průměrná rychlost km/h?",
      expected: "70",
      hint: "km/h = km / h",
      steps: [
        { title: "Dosazení", detail: "140 / 2 = 70" },
        { title: "Výsledek", detail: "70 km/h" },
      ],
    },
    {
      id: "ph7",
      question: "v = s/t. Co je větší rychlost: 100 m za 20 s nebo 90 m za 15 s? Odpověz první nebo druha.",
      expected: "druha",
      hint: "Spočti obě.",
      steps: [
        { title: "První", detail: "100/20 = 5 m/s" },
        { title: "Druhá", detail: "90/15 = 6 m/s" },
        { title: "Výsledek", detail: "druha" },
      ],
    },
    {
      id: "ph8",
      question: "3600 m za 1 h = kolik m/s?",
      expected: "1",
      hint: "1 h = 3600 s",
      steps: [
        { title: "Dosazení", detail: "3600 m / 3600 s = 1" },
        { title: "Výsledek", detail: "1 m/s" },
      ],
    },
    {
      id: "ph9",
      question: "Kolo ujede 3 km za 10 min. Průměr km/h?",
      expected: "18",
      hint: "10 min = 1/6 h",
      steps: [
        { title: "Úprava", detail: "3 km za 10 min → za 60 min 18 km" },
        { title: "Výsledek", detail: "18 km/h" },
      ],
    },
    {
      id: "ph10",
      question: "Rovnoměrný pohyb: přímka na s–t grafu znamená konstantní _____. Jednoslovně: rychlost nebo cas?",
      expected: "rychlost",
      hint: "Konstantní sklon.",
      steps: [
        { title: "Výsledek", detail: "rychlost" },
      ],
    },
  ],
  pexeso: [
    { id: "q1", sideA: "v = s/t", sideB: "rychlost z dráhy a času", explanation: "Základní vztah." },
    { id: "q2", sideA: "s = v·t", sideB: "dráha", explanation: "Dráha = rychlost × čas." },
    { id: "q3", sideA: "t = s/v", sideB: "čas", explanation: "Čas z dráhy a rychlosti." },
    { id: "q4", sideA: "5 m/s", sideB: "rychlost chůze řádově", explanation: "Řádově pár m/s." },
    { id: "q5", sideA: "100 km/h", sideB: "auto na dálnici řádově", explanation: "Typická dálniční rychlost." },
    { id: "q6", sideA: "m/s × 3,6", sideB: "km/h", explanation: "Převod na km/h." },
    { id: "q7", sideA: "vztažná soustava", sideB: "vůči čemu měříš pohyb", explanation: "Bez soustavy nelze říct klid/pohyb." },
    { id: "q8", sideA: "trajektorie", sideB: "dráha čárou", explanation: "Geometrická křivka pohybu." },
    { id: "q9", sideA: "rovnoměrný pohyb", sideB: "konstantní v", explanation: "Stále stejná rychlost." },
    { id: "q10", sideA: "průměrná rychlost", sideB: "celková dráha / čas", explanation: "Celkově za výlet." },
  ],
};
