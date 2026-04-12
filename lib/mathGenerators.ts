/** Čisté generátory příkladů pro modul Matematika (Tinuška). */

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ——— Cvičení 1: doplň číslo ———

export type FillKind = "result" | "first" | "second";

export type FillProblem = {
  kind: FillKind;
  op: "+" | "-" | "×";
  a: number;
  b: number;
  /** Pro kind=result: výsledek; pro first/second: známý výsledek rovnice */
  result: number;
  answer: number;
};

function genFillResult(): FillProblem {
  const op = Math.random() < 0.5 ? "+" : "-";
  if (op === "+") {
    const a = randomInt(1, 98);
    const b = randomInt(1, 99 - a);
    return { kind: "result", op, a, b, result: a + b, answer: a + b };
  }
  const a = randomInt(2, 99);
  const b = randomInt(1, a - 1);
  return { kind: "result", op, a, b, result: a - b, answer: a - b };
}

function genFillFirst(): FillProblem {
  const op = Math.random() < 0.5 ? "+" : "-";
  if (op === "+") {
    const b = randomInt(1, 97);
    const result = randomInt(b + 1, 99);
    const a = result - b;
    return { kind: "first", op, a, b, result, answer: a };
  }
  const b = randomInt(1, 49);
  const result = randomInt(1, 99 - b);
  const first = result + b;
  if (first > 99) return genFillFirst();
  return { kind: "first", op, a: first, b, result, answer: first };
}

function genFillSecond(): FillProblem {
  const op = Math.random() < 0.5 ? "+" : "-";
  if (op === "+") {
    const a = randomInt(1, 97);
    const result = randomInt(a + 1, 99);
    const second = result - a;
    return { kind: "second", op, a, b: second, result, answer: second };
  }
  const a = randomInt(3, 99);
  const result = randomInt(1, a - 2);
  const second = a - result;
  if (second < 1 || second > 99) return genFillSecond();
  return { kind: "second", op, a, b: second, result, answer: second };
}

export function generateFillProblems(count = 8): FillProblem[] {
  const gens = [genFillResult, genFillFirst, genFillSecond];
  const out: FillProblem[] = [];
  for (let i = 0; i < count; i++) {
    const g = gens[i % 3]!;
    let p = g();
    let guard = 0;
    while (guard++ < 50) {
      if (p.answer >= 1 && p.answer <= 99 && p.result >= 0 && p.result <= 99) {
        out.push(p);
        break;
      }
      p = g();
    }
    if (out.length <= i) out.push(genFillResult());
  }
  return out;
}

export function fillProblemLabel(p: FillProblem): { left: string; op: string; mid?: string; right: string; eq: string } {
  const opChar = p.op === "×" ? "×" : p.op;
  if (p.kind === "result") {
    return {
      left: String(p.a),
      op: opChar,
      mid: String(p.b),
      right: "",
      eq: "?",
    };
  }
  if (p.kind === "first") {
    return { left: "?", op: opChar, mid: String(p.b), right: "", eq: String(p.result) };
  }
  return { left: String(p.a), op: opChar, mid: "?", right: "", eq: String(p.result) };
}

// ——— Cvičení 3: písemné odčítání ———

export type WrittenProblem = {
  minuend: number;
  subtrahend: number;
  result: number;
};

export function generateWrittenProblems(count = 4): WrittenProblem[] {
  const out: WrittenProblem[] = [];
  for (let i = 0; i < count; i++) {
    const minuend = randomInt(20, 99);
    const subtrahend = randomInt(10, minuend - 1);
    out.push({
      minuend,
      subtrahend,
      result: minuend - subtrahend,
    });
  }
  return out;
}

// ——— Cvičení 4: závorky ———

export type BracketKind = "parenDiv" | "mulAdd" | "parenMul";

export type BracketProblem = {
  kind: BracketKind;
  /** Čitelný text příkladu (bez =) */
  expression: string;
  answer: number;
};

function genParenDiv(): BracketProblem {
  for (let t = 0; t < 80; t++) {
    const innerA = randomInt(2, 40);
    const innerB = randomInt(2, 40);
    const sum = innerA + innerB;
    const divisors: number[] = [];
    for (let d = 2; d <= Math.min(sum, 20); d++) {
      if (sum % d === 0) divisors.push(d);
    }
    if (divisors.length === 0) continue;
    const c = divisors[randomInt(0, divisors.length - 1)]!;
    const ans = sum / c;
    if (ans >= 1 && ans <= 100) {
      return {
        kind: "parenDiv",
        expression: `(${innerA} + ${innerB}) : ${c}`,
        answer: ans,
      };
    }
  }
  return { kind: "parenDiv", expression: "(9 + 6) : 3", answer: 5 };
}

function genMulAdd(): BracketProblem {
  for (let t = 0; t < 80; t++) {
    const a = randomInt(1, 30);
    const b = randomInt(2, 12);
    const c = randomInt(2, 12);
    const ans = a + b * c;
    if (ans >= 1 && ans <= 100) {
      return {
        kind: "mulAdd",
        expression: `${a} + ${b} · ${c}`,
        answer: ans,
      };
    }
  }
  return { kind: "mulAdd", expression: "2 + 8 · 7", answer: 58 };
}

function genParenMul(): BracketProblem {
  for (let t = 0; t < 80; t++) {
    const innerA = randomInt(10, 40);
    const innerB = randomInt(1, innerA - 1);
    const diff = innerA - innerB;
    const m = randomInt(2, 12);
    const ans = diff * m;
    if (ans >= 1 && ans <= 100) {
      return {
        kind: "parenMul",
        expression: `(${innerA} − ${innerB}) · ${m}`,
        answer: ans,
      };
    }
  }
  return { kind: "parenMul", expression: "(17 − 8) · 2", answer: 18 };
}

export function generateBracketProblems(count = 6): BracketProblem[] {
  const gens = [genParenDiv, genMulAdd, genParenMul];
  const out: BracketProblem[] = [];
  for (let i = 0; i < count; i++) {
    out.push(gens[i % 3]!());
  }
  return out;
}

// ——— Bleskovky: obtížnosti ———

export type BleskDifficulty = "easy" | "medium" | "hard";

export type BleskProblem =
  | { type: "fill"; problem: FillProblem }
  | { type: "bracket"; problem: BracketProblem };

function bleskMediumFill(): BleskProblem {
  const op = Math.random() < 0.45 ? "+" : Math.random() < 0.5 ? "-" : "×";
  if (op === "×") {
    const a = randomInt(2, 12);
    const b = randomInt(2, 12);
    return {
      type: "fill",
      problem: {
        kind: "result",
        op: "×",
        a,
        b,
        result: a * b,
        answer: a * b,
      },
    };
  }
  if (op === "+") {
    const a = randomInt(10, 89);
    const b = randomInt(10, 99 - a);
    return {
      type: "fill",
      problem: {
        kind: "result",
        op: "+",
        a,
        b,
        result: a + b,
        answer: a + b,
      },
    };
  }
  const a = randomInt(20, 99);
  const b = randomInt(10, a - 10);
  return {
    type: "fill",
    problem: {
      kind: "result",
      op: "-",
      a,
      b,
      result: a - b,
      answer: a - b,
    },
  };
}

export function generateBleskProblem(difficulty: BleskDifficulty): BleskProblem {
  if (difficulty === "easy") {
    return { type: "fill", problem: genFillResult() };
  }
  if (difficulty === "medium") {
    if (Math.random() < 0.55) return bleskMediumFill();
    return { type: "bracket", problem: genParenDiv() };
  }
  const r = Math.random();
  if (r < 0.28) return bleskMediumFill();
  if (r < 0.5) return { type: "bracket", problem: genParenDiv() };
  if (r < 0.72) return { type: "bracket", problem: genMulAdd() };
  if (r < 0.9) return { type: "bracket", problem: genParenMul() };
  return { type: "fill", problem: genFillFirst() };
}

/** Odpověď pro kontrolu bleskovkového příkladu */
export function bleskExpectedAnswer(p: BleskProblem): number {
  if (p.type === "fill") return p.problem.answer;
  return p.problem.answer;
}

/** Krátký text jednoho příkladu na obrazovku */
export function bleskDisplayLine(p: BleskProblem): string {
  if (p.type === "bracket") return `${p.problem.expression} = ?`;
  const fp = p.problem;
  if (fp.kind === "result") {
    if (fp.op === "×") return `${fp.a} × ${fp.b} = ?`;
    return `${fp.a} ${fp.op} ${fp.b} = ?`;
  }
  if (fp.kind === "first") return `? ${fp.op} ${fp.b} = ${fp.result}`;
  return `${fp.a} ${fp.op} ? = ${fp.result}`;
}

// ——— Matematické karty ———

export type CardDifficulty = "easy" | "medium" | "hard";

export type MathCardFace = {
  id: string;
  pairId: string;
  text: string;
};

/** Počet párů podle obtížnosti (3×4 / 4×4 / 4×5) */
export function cardPairCount(diff: CardDifficulty): number {
  if (diff === "easy") return 6;
  if (diff === "medium") return 8;
  return 10;
}

export function cardGridCols(diff: CardDifficulty): number {
  if (diff === "easy") return 3;
  return 4;
}

export function cardGridRows(diff: CardDifficulty): number {
  if (diff === "easy") return 4;
  if (diff === "medium") return 4;
  return 5;
}

function makeExprForValue(target: number, variant: number): string {
  if (target <= 18 && variant % 2 === 0) {
    const a = randomInt(1, target - 1);
    return `${a} + ${target - a}`;
  }
  if (target <= 81) {
    for (let a = 2; a <= 9; a++) {
      if (target % a === 0) {
        const b = target / a;
        if (b >= 2 && b <= 12) return `${a} × ${b}`;
      }
    }
  }
  const a = randomInt(1, Math.max(1, target - 2));
  return `${a} + ${target - a}`;
}

export function generateMathCardDeck(diff: CardDifficulty): MathCardFace[] {
  const pairs = cardPairCount(diff);
  const faces: MathCardFace[] = [];
  let idx = 0;

  const resultPairs = Math.ceil(pairs / 2);
  const equivPairs = pairs - resultPairs;

  for (let i = 0; i < resultPairs; i++) {
    const a = randomInt(2, 12);
    const b = randomInt(2, 12);
    const op = Math.random() < 0.5 ? "+" : "×";
    let value: number;
    let expr: string;
    if (op === "+") {
      value = Math.min(99, a + b);
      expr = `${a} + ${b}`;
    } else {
      value = a * b;
      expr = `${a} × ${b}`;
    }
    const pid = `r${idx++}`;
    faces.push({ id: `${pid}-a`, pairId: pid, text: expr });
    faces.push({ id: `${pid}-b`, pairId: pid, text: String(value) });
  }

  for (let i = 0; i < equivPairs; i++) {
    const target = randomInt(8, 48);
    const e1 = makeExprForValue(target, i);
    let e2 = makeExprForValue(target, i + 7);
    let guard = 0;
    while (e1 === e2 && guard++ < 20) {
      e2 = makeExprForValue(target, i + guard);
    }
    const pid = `e${idx++}`;
    faces.push({ id: `${pid}-a`, pairId: pid, text: e1 });
    faces.push({ id: `${pid}-b`, pairId: pid, text: e2 });
  }

  // Fisher–Yates shuffle
  for (let i = faces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [faces[i], faces[j]] = [faces[j]!, faces[i]!];
  }

  return faces;
}

// ——— Pětiminutovky ———

export type MathExampleCategory = "nasobilka" | "deleni" | "scitani" | "odcitani";

export type MathExampleMissing = "result" | "first" | "second";

export type MathExample = {
  display: string;
  answer: number;
  category: MathExampleCategory;
  a: number;
  b: number;
  operator: "×" | ":" | "+" | "−";
  missingPosition: MathExampleMissing;
};

/** Klíč pro deduplikaci v rámci soutěže (posledních 20 příkladů). */
export function petiminutovkaHistoryKey(ex: MathExample): string {
  return `${ex.category}:${ex.a}:${ex.b}:${ex.missingPosition}`;
}

/** Paměť posledních 20 příkladů — stejná trojice (kategorie, a, b, missing) se neopakuje. */
export class PetiminutovkaRing20 {
  private keys: string[] = [];

  has(key: string): boolean {
    return this.keys.includes(key);
  }

  add(key: string): void {
    this.keys.push(key);
    if (this.keys.length > 20) this.keys.shift();
  }
}

const BLANK = "___";

function pickNasobilkaFactors(): { a: number; b: number } {
  for (let t = 0; t < 60; t++) {
    const a = randomInt(2, 10);
    const b = randomInt(2, 10);
    if (a * b <= 100) return { a, b };
  }
  return { a: 5, b: 6 };
}

export function generateNasobilka(variant: MathExampleMissing): MathExample {
  const { a, b } = pickNasobilkaFactors();
  const prod = a * b;
  if (variant === "result") {
    return {
      display: `${a} × ${b} = ${BLANK}`,
      answer: prod,
      category: "nasobilka",
      a,
      b,
      operator: "×",
      missingPosition: "result",
    };
  }
  if (variant === "first") {
    return {
      display: `${BLANK} × ${b} = ${prod}`,
      answer: a,
      category: "nasobilka",
      a,
      b,
      operator: "×",
      missingPosition: "first",
    };
  }
  return {
    display: `${a} × ${BLANK} = ${prod}`,
    answer: b,
    category: "nasobilka",
    a,
    b,
    operator: "×",
    missingPosition: "second",
  };
}

function pickDeleniFactors(): { a: number; b: number; dividend: number } {
  const a = randomInt(2, 10);
  const b = randomInt(2, 10);
  return { a, b, dividend: a * b };
}

export function generateDeleni(variant: MathExampleMissing): MathExample {
  const { a, b, dividend } = pickDeleniFactors();
  if (variant === "result") {
    return {
      display: `${dividend} : ${b} = ${BLANK}`,
      answer: a,
      category: "deleni",
      a,
      b,
      operator: ":",
      missingPosition: "result",
    };
  }
  if (variant === "first") {
    return {
      display: `${BLANK} : ${b} = ${a}`,
      answer: dividend,
      category: "deleni",
      a,
      b,
      operator: ":",
      missingPosition: "first",
    };
  }
  return {
    display: `${dividend} : ${BLANK} = ${a}`,
    answer: b,
    category: "deleni",
    a,
    b,
    operator: ":",
    missingPosition: "second",
  };
}

/** Násobky 10 od 10 do max (včetně), výsledek ≤ max. */
export function generateScitaniPo10(max: number): MathExample {
  const step = 10;
  const maxUnit = Math.floor(max / step);
  for (let t = 0; t < 80; t++) {
    const ka = randomInt(1, maxUnit);
    const kb = randomInt(1, maxUnit);
    const a = ka * step;
    const b = kb * step;
    if (a + b <= max && a > 0 && b > 0) {
      return {
        display: `${a} + ${b} = ${BLANK}`,
        answer: a + b,
        category: "scitani",
        a,
        b,
        operator: "+",
        missingPosition: "result",
      };
    }
  }
  return {
    display: `100 + 200 = ${BLANK}`,
    answer: 300,
    category: "scitani",
    a: 100,
    b: 200,
    operator: "+",
    missingPosition: "result",
  };
}

export function generateOdcitaniPo10(max: number): MathExample {
  const step = 10;
  const maxUnit = Math.floor(max / step);
  for (let t = 0; t < 80; t++) {
    const ka = randomInt(1, maxUnit);
    const kb = randomInt(0, ka);
    const a = ka * step;
    const b = kb * step;
    if (a - b >= 0 && a <= max) {
      return {
        display: `${a} − ${b} = ${BLANK}`,
        answer: a - b,
        category: "odcitani",
        a,
        b,
        operator: "−",
        missingPosition: "result",
      };
    }
  }
  return {
    display: `500 − 100 = ${BLANK}`,
    answer: 400,
    category: "odcitani",
    a: 500,
    b: 100,
    operator: "−",
    missingPosition: "result",
  };
}

export type PetiminutovkaMixedTyp =
  | "nasobilka"
  | "deleni"
  | "scitani_odcitani"
  | "all";

function randomMissing(): MathExampleMissing {
  const r = Math.random();
  if (r < 1 / 3) return "result";
  if (r < 2 / 3) return "first";
  return "second";
}

function tryPush(
  ring: PetiminutovkaRing20,
  ex: MathExample,
): MathExample | null {
  const k = petiminutovkaHistoryKey(ex);
  if (ring.has(k)) return null;
  ring.add(k);
  return ex;
}

function generateOneWithRing(
  ring: PetiminutovkaRing20,
  factory: () => MathExample,
): MathExample {
  for (let i = 0; i < 90; i++) {
    const ex = factory();
    const pushed = tryPush(ring, ex);
    if (pushed) return pushed;
  }
  const ex = factory();
  ring.add(petiminutovkaHistoryKey(ex));
  return ex;
}

export function generateMixed(
  typ: PetiminutovkaMixedTyp,
  ring: PetiminutovkaRing20,
): MathExample {
  if (typ === "nasobilka") {
    return generateOneWithRing(ring, () =>
      generateNasobilka(randomMissing()),
    );
  }
  if (typ === "deleni") {
    return generateOneWithRing(ring, () => generateDeleni(randomMissing()));
  }
  if (typ === "scitani_odcitani") {
    return generateOneWithRing(ring, () =>
      Math.random() < 0.5
        ? generateScitaniPo10(1000)
        : generateOdcitaniPo10(1000),
    );
  }
  const r = Math.random();
  if (r < 0.25) {
    return generateOneWithRing(ring, () =>
      generateNasobilka(randomMissing()),
    );
  }
  if (r < 0.5) {
    return generateOneWithRing(ring, () => generateDeleni(randomMissing()));
  }
  if (r < 0.75) {
    return generateOneWithRing(ring, () => generateScitaniPo10(1000));
  }
  return generateOneWithRing(ring, () => generateOdcitaniPo10(1000));
}
