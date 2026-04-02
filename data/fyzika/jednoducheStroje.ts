import type { TopicContent } from "./types";

export const jednoducheStrojeContent: TopicContent = {
  slug: "jednoduche-stroje",
  lecture: [
    {
      id: "paka",
      title: "Páka",
      paragraphs: [
        "Páka má rameno síly a rameno zátěže. Rovnováha: F₁·a₁ = F₂·a₂ (síla × rameno).",
        "Rovnoramenná: ramena stejná. Nerovnoramenná: kratší rameno = větší síla.",
      ],
      formula: "F₁ · a₁ = F₂ · a₂",
    },
    {
      id: "kladka",
      title: "Kladka",
      paragraphs: [
        "Pevná kladka mění směr síly. Volná kladka může snížit potřebnou sílu (ideálně polovina při správném uspořádání).",
      ],
    },
    {
      id: "rovina",
      title: "Nakloněná rovina",
      paragraphs: [
        "Čím delší sklon pro stejnou výšku, tím menší síla potřebná k tahu — ale táhneš delší dráhu.",
      ],
    },
    {
      id: "zlate",
      title: "Zlaté pravidlo mechaniky",
      paragraphs: [
        "Co ušetříš na síle, „zaplatíš“ na dráze — práce se neztratí, jen se přerozdělí.",
      ],
    },
  ],
  exercises: [
    {
      id: "j1",
      question: "F₁=20 N, a₁=3 m, a₂=2 m. Najdi F₂ při rovnováze (N).",
      expected: "30",
      hint: "F₁·a₁ = F₂·a₂",
      steps: [
        { title: "Úprava", detail: "F₂ = F₁·a₁/a₂" },
        { title: "Dosazení", detail: "20×3/2 = 30" },
        { title: "Výsledek", detail: "30 N" },
      ],
    },
    {
      id: "j2",
      question: "F₂=50 N, a₁=1 m, a₂=5 m. F₁ při rovnováze?",
      expected: "250",
      hint: "F₁ = F₂·a₂/a₁",
      steps: [
        { title: "Dosazení", detail: "50×5/1 = 250" },
        { title: "Výsledek", detail: "250 N" },
      ],
    },
    {
      id: "j3",
      question: "Nůžky jsou hlavně _____. (paka/kladka)",
      expected: "paka",
      hint: "Dvě ramena kolem čepu.",
      steps: [{ title: "Výsledek", detail: "páka" }],
    },
    {
      id: "j4",
      question: "Otvírák na láhev často používá _____. (paka/šroub)",
      expected: "paka",
      hint: "Páčíš víčko.",
      steps: [{ title: "Výsledek", detail: "páka" }],
    },
    {
      id: "j5",
      question: "Houpačka na kladině: _____. (paka/vozik)",
      expected: "paka",
      hint: "Osa otáčení uprostřed.",
      steps: [{ title: "Výsledek", detail: "páka" }],
    },
    {
      id: "j6",
      question: "Šroub je kombinace skloněné roviny a _____. (kolo/kladin)",
      expected: "kolo",
      hint: "Závit je šikmá plocha.",
      steps: [{ title: "Výsledek", detail: "kolo na hřídeli / šroub" }],
    },
    {
      id: "j7",
      question: "Ideálně: poloviční síla = ____ násobná dráha.",
      expected: "dvojnásobná",
      hint: "Zlaté pravidlo.",
      steps: [{ title: "Výsledek", detail: "dvojnásobná" }],
    },
    {
      id: "j8",
      question: "Klin u sekery zvyšuje _____. (tlak/silu)",
      expected: "tlak",
      hint: "Malá plocha čepele.",
      steps: [{ title: "Výsledek", detail: "tlak (p = F/S)" }],
    },
    {
      id: "j9",
      question: "a₁=4 m, a₂=1 m, F₂=8 N. F₁?",
      expected: "2",
      hint: "F₁·4 = 8·1",
      steps: [
        { title: "Dosazení", detail: "F₁ = 8/4 = 2" },
        { title: "Výsledek", detail: "2 N" },
      ],
    },
    {
      id: "j10",
      question: "Pevná kladka hlavně mění _____. (smer/silu)",
      expected: "smer",
      hint: "Táhneš dolů místo nahoru.",
      steps: [{ title: "Výsledek", detail: "směr" }],
    },
  ],
  pexeso: [
    { id: "jp1", sideA: "páka", sideB: "houpačka", explanation: "Osa + dvě ramena." },
    { id: "jp2", sideA: "klín", sideB: "sekera", explanation: "Ostrý klín štípe." },
    { id: "jp3", sideA: "kladka", sideB: "zvedání břemen", explanation: "Lano přes kladku." },
    { id: "jp4", sideA: "nakloněná rovina", sideB: "nájezd na auto", explanation: "Šikmá plocha." },
    { id: "jp5", sideA: "kolo na hřídeli", sideB: "kolo od kola", explanation: "Mechanická výhoda." },
    { id: "jp6", sideA: "šroub", sideB: "stoupací šroub", explanation: "Závit = sklon." },
    { id: "jp7", sideA: "F₁·a₁ = F₂·a₂", sideB: "zákon páky", explanation: "Momentová rovnováha." },
    { id: "jp8", sideA: "nůžky", sideB: "dvojitá páka", explanation: "Dvě páky spojené." },
    { id: "jp9", sideA: "kolečko na zavazadle", sideB: "kladka", explanation: "Kolečko jako kladka." },
    { id: "jp10", sideA: "otvírák", sideB: "páka", explanation: "Páčení víčka." },
  ],
};
