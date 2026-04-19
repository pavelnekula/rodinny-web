/** Čisté matematické pomůcky pro modul Dělitelnost (bez DOM, bez API). */

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function jeNasobek(x: number, y: number): boolean {
  if (y === 0) return false;
  return x % y === 0;
}

export function delitele(n: number): number[] {
  if (n < 1) return [];
  const out: number[] = [];
  for (let d = 1; d * d <= n; d++) {
    if (n % d === 0) {
      out.push(d);
      const q = n / d;
      if (q !== d) out.push(q);
    }
  }
  return out.sort((a, b) => a - b);
}

export function jePrvocislo(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  const lim = Math.floor(Math.sqrt(n));
  for (let d = 3; d <= lim; d += 2) {
    if (n % d === 0) return false;
  }
  return true;
}

export function prvociselnyRozklad(n: number): string {
  if (n < 2) return String(n);
  const parts: string[] = [];
  let x = n;
  for (let p = 2; p * p <= x; p++) {
    let k = 0;
    while (x % p === 0) {
      x /= p;
      k++;
    }
    if (k === 1) parts.push(String(p));
    else if (k > 1) parts.push(`${p}^${k}`);
  }
  if (x > 1) parts.push(String(x));
  return parts.join(" × ");
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 0;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs((a / gcd(a, b)) * b);
}

/** NSD tří přirozených čísel. */
export function gcd3(a: number, b: number, c: number): number {
  return gcd(gcd(a, b), c);
}

/** NSN tří přirozených čísel. */
export function lcm3(a: number, b: number, c: number): number {
  return lcm(lcm(a, b), c);
}

export function soucetCislic(n: number): number {
  return String(Math.abs(Math.floor(n)))
    .split("")
    .reduce((s, c) => s + Number(c), 0);
}

export function pocetDelitelu(n: number): number {
  return delitele(n).length;
}

/** Seznam prvočinitelů s opakováním (např. 12 → [2,2,3]). */
export function faktorySeznam(n: number): number[] {
  if (n < 2) return [n];
  const out: number[] = [];
  let x = n;
  for (let p = 2; p * p <= x; p++) {
    while (x % p === 0) {
      out.push(p);
      x /= p;
    }
  }
  if (x > 1) out.push(x);
  return out;
}
