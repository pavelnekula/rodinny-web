import type { KapitolaId, Obtiznost, Priklad } from "@/data/delitelnost";
import {
  delitele,
  faktorySeznam,
  gcd,
  gcd3,
  jeNasobek,
  jePrvocislo,
  lcm,
  lcm3,
  pocetDelitelu,
  prvociselnyRozklad,
  randomInt,
  soucetCislic,
} from "@/lib/delitelnostMath";

function anoNe(zadani: string, ano: boolean, vysv: string): Priklad {
  return {
    zadani,
    odpoved: ano ? "Ano" : "Ne",
    vysvetleni: vysv,
    typ: "ano-ne",
  };
}

function vypocet(z: string, o: number, v: string): Priklad {
  return {
    zadani: z,
    odpoved: String(o),
    vysvetleni: v,
    typ: "vypocet",
  };
}

function doplneni(z: string, o: string, v: string, hint?: string): Priklad {
  const p: Priklad = { zadani: z, odpoved: o, vysvetleni: v, typ: "doplneni" };
  if (hint) p.hint = hint;
  return p;
}

/** Výběr více možností — `odpoved` je seřazený seznam správných hodnot oddělený čárkou. */
function multiVyber(
  z: string,
  odpovedSerazene: string,
  v: string,
  moznosti: string[],
  spravne: string[],
): Priklad {
  return {
    zadani: z,
    odpoved: odpovedSerazene,
    vysvetleni: v,
    typ: "multi-vyber",
    moznosti,
    spravneMoznosti: spravne,
  };
}

export function generujNasobek(o: Obtiznost): Priklad {
  /** Občas doplňování číslice (dělitelnost 2 nebo 5) — propojení s násobky/paritou. */
  if (randomInt(0, 99) < 14) {
    const div = randomInt(0, 1) === 0 ? 2 : 5;
    const d = generujDoplneniCislice(o, div);
    if (d) return d;
  }
  if (o === "lehka") {
    const y = randomInt(2, 5);
    const k = randomInt(1, 10);
    const x = y * k;
    const ok = jeNasobek(x, y);
    return anoNe(
      `Je číslo ${x} násobkem čísla ${y}?`,
      ok,
      ok
        ? `${x} = ${k}·${y}, tedy je násobkem ${y}.`
        : `${x} po dělení ${y} dává zbytek — není násobkem.`,
    );
  }
  if (o === "stredni") {
    const y = randomInt(2, 12);
    const m = [1, 2, 3, 4, 5].map((k) => k * y);
    const odp = m.join(", ");
    return doplneni(
      `Napiš prvních pět násobků čísla ${y} (oddělte čárkou, např. 7, 14, 21, 28, 35).`,
      odp,
      `Násobky ${y} jsou ${y}, ${2 * y}, ${3 * y}, ${4 * y}, ${5 * y}, …`,
    );
  }
  const a = randomInt(4, 20);
  const b = randomInt(4, 20);
  const n = lcm(a, b);
  return vypocet(
    `Jaký je nejmenší společný násobek čísel ${a} a ${b}?`,
    n,
    `NSN(${a}, ${b}) = ${n}. Společný násobek musí dělit obě čísla beze zbytku a být nejmenší takový kladný.`,
  );
}

export function generujDelitel(o: Obtiznost): Priklad {
  if (randomInt(0, 99) < 28) {
    return generujVsechnaDělitele(o);
  }
  if (o === "lehka") {
    const x = randomInt(4, 30);
    const p = pocetDelitelu(x);
    return vypocet(
      `Kolik má číslo ${x} kladných dělitelů? (spočítej i 1 a ${x}.)`,
      p,
      `Dělitelé ${x} jsou: ${delitele(x).join(", ")} — celkem ${p}.`,
    );
  }
  if (o === "stredni") {
    const x = randomInt(12, 60);
    const d = delitele(x);
    return doplneni(
      `Vyjmenuj všechny dělitele čísla ${x} (od nejmenšího, oddělte čárkou).`,
      d.join(", "),
      `Úplný seznam dělitelů: ${d.join(", ")}.`,
    );
  }
  const y = randomInt(6, 99);
  const x = randomInt(2, 12);
  const ok = jeNasobek(y, x);
  return anoNe(
    `Je číslo ${x} dělitelem čísla ${y}?`,
    ok,
    ok
      ? `${y} : ${x} vyjde beze zbytku, tedy ${x} | ${y}.`
      : `Po dělení ${y} číslem ${x} zbývá zbytek — ${x} není dělitel ${y}.`,
  );
}

export function generujDelitelnostSouctu(o: Obtiznost): Priklad {
  const k = randomInt(3, 9);
  const a = k * randomInt(2, 8);
  const b = k * randomInt(2, 8);
  const soucet = a + b;
  const ok = jeNasobek(soucet, k);
  if (o === "lehka") {
    return anoNe(
      `Obě čísla ${a} i ${b} jsou dělitelná ${k}. Je jejich součet ${soucet} také dělitelný ${k}?`,
      ok,
      ok
        ? `Součet dvou násobků ${k} je zase násobek ${k}: ${a}+${b}=${soucet}.`
        : `Součet násobků k je vždy násobek k.`,
    );
  }
  if (o === "stredni") {
    const r = randomInt(1, k - 1);
    const c = k * randomInt(2, 6) + r;
    const d = k * randomInt(2, 6);
    return anoNe(
      `Číslo ${c} dělitelné ${k} není, číslo ${d} ano. Je součet ${c + d} dělitelný ${k}?`,
      jeNasobek(c + d, k),
      `Zbytek ${c} po dělení ${k} je ${c % k}, u ${d} je 0. Součet zbytků je ${(c + d) % k}.`,
    );
  }
  const x = randomInt(4, 14);
  const y = randomInt(4, 14);
  const p = x * y;
  return anoNe(
    `Je součin ${x}·${y} = ${p} dělitelný ${x} i ${y}?`,
    true,
    `Součin je násobek každého z činitelů.`,
  );
}

function delitelne2(n: number): boolean {
  return n % 2 === 0;
}
function delitelne5(n: number): boolean {
  return n % 5 === 0;
}
function delitelne10(n: number): boolean {
  return n % 10 === 0;
}

/**
 * Doplň jednu chybějící číslici (hvězdička) tak, aby číslo bylo dělitelné daným dělitelem.
 */
export function generujDoplneniCislice(
  o: Obtiznost,
  divisor: 2 | 3 | 4 | 5 | 8 | 9 | 10,
): Priklad | null {
  const len =
    o === "lehka" ? randomInt(3, 4) : o === "stredni" ? randomInt(4, 5) : randomInt(4, 6);
  for (let attempt = 0; attempt < 120; attempt++) {
    const digits: number[] = [randomInt(1, 9)];
    for (let i = 1; i < len; i++) digits.push(randomInt(0, 9));
    const hole = randomInt(0, len - 1);
    const candidates: number[] = [];
    for (let d = 0; d <= 9; d++) {
      const copy = [...digits];
      copy[hole] = d;
      const val = Number(copy.join(""));
      if (val % divisor === 0) candidates.push(d);
    }
    if (candidates.length === 0) continue;
    const dispSpaced = digits
      .map((dig, i) => (i === hole ? "*" : String(dig)))
      .join(" ");
    const sumKnown = digits.reduce((s, dig, i) => s + (i === hole ? 0 : dig), 0);
    const odp = [...new Set(candidates)].sort((a, b) => a - b).join(", ");
    let vysv = "";
    if (divisor === 2) {
      vysv = `Sudé číslo končí 0, 2, 4, 6 nebo 8 — na místě * mohou být číslice: ${odp}.`;
    } else if (divisor === 5) {
      vysv = `Dělitelnost pěti: poslední číslice je 0 nebo 5.`;
    } else if (divisor === 10) {
      vysv = `Dělitelnost deseti: poslední číslice musí být 0.`;
    } else if (divisor === 3) {
      vysv = `Součet číslic musí dělit 3. Součet známých číslic (kde není *) je ${sumKnown}.`;
    } else if (divisor === 9) {
      vysv = `Součet číslic musí dělit 9. Součet známých číslic je ${sumKnown}.`;
    } else if (divisor === 4) {
      vysv = `Dvojice posledních číslic (s doplněnou *) musí tvořit číslo dělitelné 4.`;
    } else {
      vysv = `Trojice posledních číslic musí dávat číslo dělitelné 8.`;
    }
    const zadani = `Jakou číslici můžeš doplnit místo * ? Číslo zapsané jako ${dispSpaced} (bez mezer) má být dělitelné ${divisor}. Napiš všechna řešení oddělená čárkou (např. 1, 4, 7).`;
    return doplneni(
      zadani,
      odp,
      vysv,
      "Tip: Dosad číslice 0–9 a ověř dělením nebo znaky dělitelnosti.",
    );
  }
  return null;
}

/** Test série: u čísla vyber všechny dělitele z dané množiny. */
export function generujTestSerie(
  o: Obtiznost,
  deliteleKTestu: number[],
): Priklad {
  const maxN = o === "lehka" ? 100 : o === "stredni" ? 500 : 1000;
  const n = randomInt(12, maxN);
  const moznosti = deliteleKTestu.map(String);
  const spravne = deliteleKTestu
    .filter((d) => n % d === 0)
    .map(String)
    .sort((a, b) => Number(a) - Number(b));
  const odpoved = spravne.join(", ");
  const vysvetleni = deliteleKTestu
    .map((d) => {
      const ok = n % d === 0;
      return `${d}: ${ok ? `ano (${n} je dělitelné ${d})` : "ne"}`;
    })
    .join(" | ");
  const zadani = `Číslo ${n} — vyber všechny čísla z nabídky, které jsou jeho děliteli: ${moznosti.join(", ")}. (Klikni na všechna platná a potvrď.)`;
  return multiVyber(zadani, odpoved, vysvetleni, moznosti, spravne);
}

/** Všechny dělitele jednoho čísla nebo společné dělitele dvojice (těžká). */
export function generujVsechnaDělitele(o: Obtiznost): Priklad {
  if (o === "lehka") {
    const pool = [16, 18, 24, 28, 30, 32, 36];
    const x = pool[randomInt(0, pool.length - 1)]!;
    const d = delitele(x);
    return doplneni(
      `Vyjmenuj všechny dělitele čísla ${x} (od nejmenšího, oddělte čárkou).`,
      d.join(", "),
      `Hledej páry: každý dělitel jde „do páru“ s číslem ${x}/d. Dělitelé: ${d.join(", ")}.`,
      `Tip: Začni u 1 a ${x}, pak zkoušej 2, 3, … až zhruba do √${x}.`,
    );
  }
  if (o === "stredni") {
    const x = randomInt(36, 72);
    const d = delitele(x);
    return doplneni(
      `Vyjmenuj všechny dělitele čísla ${x} (od nejmenšího, oddělte čárkou).`,
      d.join(", "),
      `Úplný seznam: ${d.join(", ")} (je jich ${d.length}).`,
    );
  }
  const a = randomInt(24, 72);
  const b = randomInt(24, 72);
  const g = gcd(a, b);
  const spolecne = delitele(g);
  return doplneni(
    `Jaké jsou VŠECHNY společné dělitele čísel ${a} a ${b}? (od nejmenšího, čárky.)`,
    spolecne.join(", "),
    `NSD(${a}, ${b}) = ${g}. Společné dělitele obou čísel jsou právě všichni dělitelé ${g}: ${spolecne.join(", ")}.`,
  );
}

function generujRozkladSOveřením(o: Obtiznost): Priklad {
  const n =
    o === "lehka"
      ? randomInt(12, 50)
      : o === "stredni"
        ? randomInt(50, 150)
        : randomInt(150, 500);
  const f = faktorySeznam(n);
  const seznam = f.join(", ");
  const soucin = f.reduce((a, b) => a * b, 1);
  const rText = prvociselnyRozklad(n);
  const ov = f.map(String).join(" × ");
  return doplneni(
    `Rozlož číslo ${n} na součin prvočísel (čárky, od nejmenšího) a ověř součinem.`,
    seznam,
    `Rozklad: ${rText}. Ověření: ${ov} = ${soucin} ${soucin === n ? "✓" : ""}.`,
    "Tip: Zkus nejdřív dělit 2, pak 3, 5, 7, … dokud to jde.",
  );
}

export function generujZnaky102(o: Obtiznost): Priklad {
  const rot = randomInt(0, 99);
  if (rot < 28) {
    const div = randomInt(0, 1) === 0 ? 2 : 5;
    const d = generujDoplneniCislice(o, div);
    if (d) return d;
  }
  if (rot < 48) {
    return generujTestSerie(o, [2, 3, 5, 10]);
  }
  const n =
    o === "lehka"
      ? randomInt(10, 120)
      : o === "stredni"
        ? randomInt(50, 999)
        : randomInt(200, 9999);
  const typ = randomInt(0, 2);
  if (typ === 0) {
    return anoNe(
      `Je číslo ${n} dělitelné dvěma?`,
      delitelne2(n),
      `Poslední číslice ${n % 10} je ${n % 2 === 0 ? "sudá" : "lichá"}, tedy ${delitelne2(n) ? "ano" : "ne"}.`,
    );
  }
  if (typ === 1) {
    return anoNe(
      `Je číslo ${n} dělitelné pěti?`,
      delitelne5(n),
      `U pětky stačí poslední číslice 0 nebo 5 — zde ${n % 10}.`,
    );
  }
  return anoNe(
    `Je číslo ${n} dělitelné deseti?`,
    delitelne10(n),
    `Musí končit nulou a být sudé — poslední číslice je ${n % 10}.`,
  );
}

function delitelne4(n: number): boolean {
  if (n < 0) return delitelne4(-n);
  return n % 4 === 0;
}
function delitelne8(n: number): boolean {
  if (n < 0) return delitelne8(-n);
  return n % 8 === 0;
}

export function generujZnaky48(o: Obtiznost): Priklad {
  const rot = randomInt(0, 99);
  if (rot < 28) {
    const div = randomInt(0, 1) === 1 ? 8 : 4;
    const d = generujDoplneniCislice(o, div);
    if (d) return d;
  }
  if (rot < 48) {
    return generujTestSerie(o, [2, 4, 8]);
  }
  const n =
    o === "lehka"
      ? randomInt(20, 200)
      : o === "stredni"
        ? randomInt(100, 2000)
        : randomInt(500, 9999);
  const osm = randomInt(0, 1) === 1;
  if (osm) {
    return anoNe(
      `Je ${n} dělitelné osmi?`,
      delitelne8(n),
      `Trojice posledních číslic musí tvořit číslo dělitelné 8 (nebo 000).`,
    );
  }
  return anoNe(
    `Je ${n} dělitelné čtyřmi?`,
    delitelne4(n),
    `Dvojice posledních číslic musí být dělitelná 4.`,
  );
}

function delitelne3(n: number): boolean {
  return soucetCislic(n) % 3 === 0;
}
function delitelne9(n: number): boolean {
  return soucetCislic(n) % 9 === 0;
}

export function generujZnaky93(o: Obtiznost): Priklad {
  const rot = randomInt(0, 99);
  if (rot < 28) {
    const div = randomInt(0, 1) === 1 ? 9 : 3;
    const d = generujDoplneniCislice(o, div);
    if (d) return d;
  }
  if (rot < 48) {
    return generujTestSerie(o, [2, 3, 6, 9]);
  }
  const n =
    o === "lehka"
      ? randomInt(30, 200)
      : o === "stredni"
        ? randomInt(100, 999)
        : randomInt(500, 9999);
  const dev = randomInt(0, 1) === 1;
  const s = soucetCislic(n);
  if (dev) {
    return anoNe(
      `Je ${n} dělitelné devítkou? (součet číslic je ${s})`,
      delitelne9(n),
      `Číslo je dělitelné 9 právě když je součet jeho číslic dělitelný 9.`,
    );
  }
  return anoNe(
    `Je ${n} dělitelné trojkou? (součet číslic je ${s})`,
    delitelne3(n),
    `Trojka: součet číslic musí být dělitelný 3.`,
  );
}

export function generujPrvocisla(o: Obtiznost): Priklad {
  const n =
    o === "lehka"
      ? randomInt(2, 40)
      : o === "stredni"
        ? randomInt(2, 100)
        : randomInt(50, 199);
  const p = jePrvocislo(n);
  return anoNe(
    `Je číslo ${n} prvočíslo?`,
    p,
    p
      ? `${n} nemá žádného dělitele mezi 2 a √${n}.`
      : `${n} lze rozložit — není prvočíslo.`,
  );
}

export function generujRozklad(o: Obtiznost): Priklad {
  if (randomInt(0, 99) < 42) {
    return generujRozkladSOveřením(o);
  }
  const n =
    o === "lehka"
      ? randomInt(12, 60)
      : o === "stredni"
        ? randomInt(40, 200)
        : randomInt(100, 999);
  const r = prvociselnyRozklad(n);
  const seznam = faktorySeznam(n).join(", ");
  return doplneni(
    `Rozlož číslo ${n} na prvočinitele. Napiš prvočinitele oddělené čárkou od nejmenšího (např. 2, 2, 3).`,
    seznam,
    `Kanonický zápis mocnin: ${r}. Tvoje odpověď je seznam prvočinitelů včetně opakování.`,
  );
}

export function generujSpolecnyDelitel(o: Obtiznost): Priklad {
  if (o !== "lehka" && randomInt(0, 99) < 55) {
    const p = [3, 5, 7][randomInt(0, 2)]!;
    const maxK = o === "stredni" ? 10 : 18;
    const a = p * randomInt(2, maxK);
    const b = p * randomInt(2, maxK);
    const c = p * randomInt(2, maxK);
    const g3 = gcd3(a, b, c);
    return vypocet(
      `Urči největšího společného dělitele čísel ${a}, ${b} a ${c}.`,
      g3,
      `NSD(${a}, ${b}, ${c}) = ${g3}. Všechna tři čísla sdílejí alespoň faktor ${p} (nebo větší společný rozklad).`,
    );
  }
  const a =
    o === "lehka"
      ? randomInt(6, 40)
      : o === "stredni"
        ? randomInt(12, 80)
        : randomInt(30, 180);
  const b =
    o === "lehka"
      ? randomInt(6, 40)
      : o === "stredni"
        ? randomInt(12, 80)
        : randomInt(30, 180);
  const g = gcd(a, b);
  return vypocet(
    `Urči největšího společného dělitele čísel ${a} a ${b}.`,
    g,
    `NSD(${a}, ${b}) = ${g}.`,
  );
}

export function generujSoudelaNesoudela(o: Obtiznost): Priklad {
  const a =
    o === "lehka"
      ? randomInt(4, 24)
      : o === "stredni"
        ? randomInt(10, 60)
        : randomInt(20, 120);
  const b =
    o === "lehka"
      ? randomInt(4, 24)
      : o === "stredni"
        ? randomInt(10, 60)
        : randomInt(20, 120);
  const sou = gcd(a, b) > 1;
  return anoNe(
    `Jsou čísla ${a} a ${b} soudělná? (mají společného dělitele většího než 1)`,
    sou,
    sou
      ? `NSD(${a}, ${b}) = ${gcd(a, b)} > 1, jsou soudělná.`
      : `NSD je 1 — jsou nesoudělná.`,
  );
}

export function generujSpolecnyNasobek(o: Obtiznost): Priklad {
  if (o !== "lehka" && randomInt(0, 99) < 55) {
    if (o === "stredni") {
      const pool = [
        [2, 3, 6],
        [2, 4, 8],
        [3, 4, 6],
      ];
      const [a, b, c] = pool[randomInt(0, pool.length - 1)]!;
      const l = lcm3(a, b, c);
      return vypocet(
        `Jaký je nejmenší společný násobek čísel ${a}, ${b} a ${c}?`,
        l,
        `NSN(${a}, ${b}, ${c}) = ${l}.`,
      );
    }
    const a = randomInt(3, 12);
    const b = randomInt(3, 12);
    const c = randomInt(3, 12);
    const l = lcm3(a, b, c);
    return vypocet(
      `Jaký je nejmenší společný násobek čísel ${a}, ${b} a ${c}?`,
      l,
      `NSN(${a}, ${b}, ${c}) = ${l}.`,
    );
  }
  const a =
    o === "lehka"
      ? randomInt(3, 12)
      : o === "stredni"
        ? randomInt(4, 20)
        : randomInt(8, 35);
  const b =
    o === "lehka"
      ? randomInt(3, 12)
      : o === "stredni"
        ? randomInt(4, 20)
        : randomInt(8, 35);
  const l = lcm(a, b);
  return vypocet(
    `Jaký je nejmenší společný násobek čísel ${a} a ${b}?`,
    l,
    `NSN(${a}, ${b}) = ${l}.`,
  );
}

export function generujZnakyDalsi(o: Obtiznost): Priklad {
  const n =
    o === "lehka"
      ? randomInt(20, 120)
      : o === "stredni"
        ? randomInt(50, 600)
        : randomInt(100, 2000);
  const typ = randomInt(0, 2);
  if (typ === 0) {
    const ok = n % 6 === 0;
    return anoNe(
      `Je ${n} dělitelné šestkou? (musí platit pravidla pro 2 i 3)`,
      ok,
      ok
        ? `Je sudé a součet číslic ${soucetCislic(n)} dělitelný 3.`
        : `Buď není sudé, nebo součet číslic není dělitelný 3.`,
    );
  }
  if (typ === 1) {
    const ok = n % 12 === 0;
    return anoNe(
      `Je ${n} dělitelné dvanácti? (4 a 3 současně)`,
      ok,
      `Musí být dělitelné 4 i 3.`,
    );
  }
  const ok = n % 11 === 0;
  return anoNe(
    `Je ${n} dělitelné 11? (u tříciferného čísla: střední = součet krajních)`,
    ok,
    `Alternativně: test dělení přímo.`,
  );
}

type Slovni = { zadani: string; o: string; typ: Priklad["typ"]; v: string };

const SLOVNI_POOL: Slovni[] = [
  {
    zadani:
      "V krabici je 48 bonbonů. Chceš je rozdělit do sáčků po stejném počtu větším než 1 a menším než 48. Kolik různých velikostí sáčku (počet bonbonů v jednom) můžeš zvolit?",
    o: String(delitele(48).filter((d) => d > 1 && d < 48).length),
    typ: "vypocet",
    v: "Jde o počet dělitelů 48 kromě 1 a 48.",
  },
  {
    zadani:
      "Dvě vlny na bazéně přijdou každých 4 s a 6 s. Po kolika sekundách poprvé přijdou obě najednou?",
    o: String(lcm(4, 6)),
    typ: "vypocet",
    v: `NSN(4, 6) = ${lcm(4, 6)} sekund.`,
  },
  {
    zadani:
      "Máš desetník 120 Kč a bonbony po 18 Kč. Bez vrácení — vydáš přesně celou částku, pokud je 120 dělitelné 18?",
    o: "Ne",
    typ: "ano-ne",
    v: "120 : 18 má zbytek — nevyjde přesně.",
  },
  {
    zadani:
      "Třída má 27 žáků. Mají stát v řadách se stejným počtem (více než 1 řada). Kolik možností (počet žáků v řadě) existuje?",
    o: String(delitele(27).filter((d) => d > 1 && d < 27).length),
    typ: "vypocet",
    v: "Dělitelé 27 kromě 1 a 27.",
  },
  {
    zadani:
      "Je součet 123 + 456 dělitelný třemi?",
    o: "Ano",
    typ: "ano-ne",
    v: `Součet číslic ${123 + 456} je dělitelný 3.`,
  },
  {
    zadani:
      "Plot má délku 84 m. Sloupky každých x metrů, x celé číslo >1. Kolik máš možností pro délku mezer x?",
    o: String(delitele(84).filter((d) => d > 1 && d < 84).length),
    typ: "vypocet",
    v: "Počet vlastních dělitelů 84.",
  },
  {
    zadani:
      "Číslo 91 je podle tebe prvočíslo?",
    o: "Ne",
    typ: "ano-ne",
    v: "91 = 7 × 13.",
  },
  {
    zadani:
      "Kolik je největší společný dělitel čísel 54 a 24?",
    o: String(gcd(54, 24)),
    typ: "vypocet",
    v: "Eukleidův algoritmus nebo rozklad.",
  },
  {
    zadani:
      "Jsou čísla 15 a 28 nesoudělná?",
    o: "Ano",
    typ: "ano-ne",
    v: `NSD(15,28)=${gcd(15, 28)} = 1.`,
  },
  {
    zadani:
      "Nejmenší společný násobek 14 a 21?",
    o: String(lcm(14, 21)),
    typ: "vypocet",
    v: "NSN = 42.",
  },
];

export function generujSlovniUlohy(o: Obtiznost): Priklad {
  const pick = SLOVNI_POOL[randomInt(0, SLOVNI_POOL.length - 1)]!;
  if (o === "tezka") {
    return {
      zadani: `${pick.zadani} (obtížnější varianta: zapiš i stručný důvod jednou větou.)`,
      odpoved: pick.o,
      vysvetleni: pick.v,
      typ: pick.typ === "ano-ne" ? "ano-ne" : "vypocet",
    };
  }
  return {
    zadani: pick.zadani,
    odpoved: pick.o,
    vysvetleni: pick.v,
    typ: pick.typ,
  };
}

export function generujOlympiad(o: Obtiznost): Priklad {
  const a = randomInt(14, 80);
  const b = randomInt(14, 80);
  const g = gcd(a, b);
  if (o === "lehka") {
    return vypocet(
      `Úloha typu olympiáda (lehčí): Urči největšího společného dělitele čísel ${a} a ${b}.`,
      g,
      `NSD(${a}, ${b}) = ${g}.`,
    );
  }
  if (o === "stredni") {
    const n = randomInt(200, 800);
    return anoNe(
      `Je součet číslic čísla ${n} dělitelný devítkou?`,
      soucetCislic(n) % 9 === 0,
      `Součet číslic je ${soucetCislic(n)}.`,
    );
  }
  const p = randomInt(11, 97);
  const ok = jePrvocislo(p);
  return anoNe(
    `Úloha (těžší): Platí, že ${p} je prvočíslo?`,
    ok,
    ok
      ? `${p} prošlo testem dělitelnosti do √${p}.`
      : `${p} má netriviální dělitele.`,
  );
}

export function generujSouhrnna(o: Obtiznost): Priklad {
  const pool = [
    () => generujNasobek(o),
    () => generujDelitel(o),
    () => generujZnaky102(o),
    () => generujZnaky93(o),
    () => generujSpolecnyDelitel(o),
    () => generujSpolecnyNasobek(o),
    () => generujTestSerie(o, [2, 3, 5, 10]),
    () => generujDoplneniCislice(o, randomInt(0, 1) === 0 ? 3 : 9) ?? generujZnaky93(o),
  ];
  return pool[randomInt(0, pool.length - 1)]!();
}

const GENERATORY: Record<
  KapitolaId,
  (obtiznost: Obtiznost) => Priklad
> = {
  nasobek: generujNasobek,
  delitel: generujDelitel,
  "delitelnost-souctu": generujDelitelnostSouctu,
  "znaky-10-5-2": generujZnaky102,
  "znaky-4-8": generujZnaky48,
  "znaky-9-3": generujZnaky93,
  prvocisla: generujPrvocisla,
  rozklad: generujRozklad,
  "spolecny-delitel": generujSpolecnyDelitel,
  "soudela-nesoudela": generujSoudelaNesoudela,
  "spolecny-nasobek": generujSpolecnyNasobek,
  "znaky-dalsi": generujZnakyDalsi,
  "slovni-ulohy": generujSlovniUlohy,
  olympiada: generujOlympiad,
  souhrnna: generujSouhrnna,
};

export function vygenerujPriklad(
  kapitolaId: KapitolaId,
  obtiznost: Obtiznost,
): Priklad {
  const g = GENERATORY[kapitolaId];
  if (!g) {
    return anoNe("Chyba dat — neznámá kapitola.", false, "Zkontroluj odkaz.");
  }
  return g(obtiznost);
}
