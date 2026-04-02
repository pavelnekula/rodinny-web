export type LengthU = "mm" | "cm" | "dm" | "m" | "km";
export type MassU = "mg" | "g" | "dag" | "kg" | "t";
export type VolumeU = "ml" | "cl" | "dl" | "l" | "hl" | "cm3" | "dm3" | "m3";
export type TimeU = "s" | "min" | "h" | "den";
export type SpeedU = "ms" | "kmh";
export type TempU = "C" | "K" | "F";

function lengthToM(v: number, u: LengthU): number {
  const k: Record<LengthU, number> = {
    mm: 0.001,
    cm: 0.01,
    dm: 0.1,
    m: 1,
    km: 1000,
  };
  return v * k[u];
}

function mToLength(m: number, u: LengthU): number {
  const k: Record<LengthU, number> = {
    mm: 1000,
    cm: 100,
    dm: 10,
    m: 1,
    km: 0.001,
  };
  return m * k[u];
}

function massToKg(v: number, u: MassU): number {
  const k: Record<MassU, number> = {
    mg: 1e-6,
    g: 0.001,
    dag: 0.01,
    kg: 1,
    t: 1000,
  };
  return v * k[u];
}

function kgToMass(kg: number, u: MassU): number {
  const k: Record<MassU, number> = {
    mg: 1e6,
    g: 1000,
    dag: 100,
    kg: 1,
    t: 0.001,
  };
  return kg * k[u];
}

function volumeToL(v: number, u: VolumeU): number {
  const k: Record<VolumeU, number> = {
    ml: 0.001,
    cl: 0.01,
    dl: 0.1,
    l: 1,
    hl: 100,
    cm3: 0.001,
    dm3: 1,
    m3: 1000,
  };
  return v * k[u];
}

function lToVolume(l: number, u: VolumeU): number {
  const k: Record<VolumeU, number> = {
    ml: 1000,
    cl: 100,
    dl: 10,
    l: 1,
    hl: 0.01,
    cm3: 1000,
    dm3: 1,
    m3: 0.001,
  };
  return l * k[u];
}

function timeToS(v: number, u: TimeU): number {
  const k: Record<TimeU, number> = {
    s: 1,
    min: 60,
    h: 3600,
    den: 86400,
  };
  return v * k[u];
}

function sToTime(s: number, u: TimeU): number {
  const k: Record<TimeU, number> = {
    s: 1,
    min: 1 / 60,
    h: 1 / 3600,
    den: 1 / 86400,
  };
  return s * k[u];
}

export function convertLength(value: number, from: LengthU, to: LengthU): number {
  return mToLength(lengthToM(value, from), to);
}

export function convertMass(value: number, from: MassU, to: MassU): number {
  return kgToMass(massToKg(value, from), to);
}

export function convertVolume(value: number, from: VolumeU, to: VolumeU): number {
  return lToVolume(volumeToL(value, from), to);
}

export function convertTime(value: number, from: TimeU, to: TimeU): number {
  return sToTime(timeToS(value, from), to);
}

/** m/s ↔ km/h */
export function convertSpeed(value: number, from: SpeedU, to: SpeedU): number {
  if (from === to) return value;
  if (from === "ms" && to === "kmh") return value * 3.6;
  return value / 3.6;
}

export function convertTemp(value: number, from: TempU, to: TempU): number {
  let c = value;
  if (from === "K") c = value - 273.15;
  else if (from === "F") c = ((value - 32) * 5) / 9;

  if (to === "C") return c;
  if (to === "K") return c + 273.15;
  return (c * 9) / 5 + 32;
}
