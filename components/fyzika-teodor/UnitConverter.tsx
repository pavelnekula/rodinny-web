"use client";

import { useCallback, useMemo, useState } from "react";
import {
  convertLength,
  convertMass,
  convertSpeed,
  convertTemp,
  convertTime,
  convertVolume,
  type LengthU,
  type MassU,
  type SpeedU,
  type TempU,
  type TimeU,
  type VolumeU,
} from "@/lib/fyzika/conversions";
import { answersMatch } from "@/lib/fyzika/normalizeAnswer";
import { useFyzikaSounds } from "./useFyzikaSounds";

const TABS = [
  { id: "length", label: "Délka" },
  { id: "mass", label: "Hmotnost" },
  { id: "volume", label: "Objem" },
  { id: "time", label: "Čas" },
  { id: "speed", label: "Rychlost" },
  { id: "temp", label: "Teplota" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function UnitConverter() {
  const [tab, setTab] = useState<TabId>("length");
  const { playCorrect, playWrong } = useFyzikaSounds();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 border-b border-slate-700 pb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              tab === t.id
                ? "bg-cyan-600 text-white shadow-[0_0_16px_rgba(34,211,238,0.35)]"
                : "bg-app-card text-app-subtle hover:bg-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "length" ? (
        <LengthPanel playCorrect={playCorrect} playWrong={playWrong} />
      ) : null}
      {tab === "mass" ? (
        <MassPanel playCorrect={playCorrect} playWrong={playWrong} />
      ) : null}
      {tab === "volume" ? (
        <VolumePanel playCorrect={playCorrect} playWrong={playWrong} />
      ) : null}
      {tab === "time" ? (
        <TimePanel playCorrect={playCorrect} playWrong={playWrong} />
      ) : null}
      {tab === "speed" ? (
        <SpeedPanel playCorrect={playCorrect} playWrong={playWrong} />
      ) : null}
      {tab === "temp" ? (
        <TempPanel playCorrect={playCorrect} playWrong={playWrong} />
      ) : null}
    </div>
  );
}

function Ladder({ labels }: { labels: string[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1 text-xs text-app-muted sm:text-sm">
      {labels.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 ? <span className="text-cyan-500">→</span> : null}
          <span className="rounded-md border border-slate-600 bg-app-card px-2 py-1 text-app-fg">
            {l}
          </span>
        </span>
      ))}
    </div>
  );
}

type PanelProps = {
  playCorrect: () => void;
  playWrong: () => void;
};

function LengthPanel({ playCorrect, playWrong }: PanelProps) {
  const units: LengthU[] = ["mm", "cm", "dm", "m", "km"];
  const labels = ["mm", "cm", "dm", "m", "km"];
  const [v, setV] = useState("1");
  const [from, setFrom] = useState<LengthU>("m");
  const [to, setTo] = useState<LengthU>("cm");
  const num = parseFloat(v.replace(",", ".")) || 0;
  const out = convertLength(num, from, to);

  const [drillQ, setDrillQ] = useState(() => randomLengthDrill());
  const [drillIn, setDrillIn] = useState("");
  const [drillPts, setDrillPts] = useState(0);

  const newDrill = useCallback(() => {
    setDrillQ(randomLengthDrill());
    setDrillIn("");
  }, []);

  const checkDrill = useCallback(() => {
    if (answersMatch(drillQ.expected, drillIn)) {
      playCorrect();
      setDrillPts((p) => p + 1);
      newDrill();
    } else {
      playWrong();
    }
  }, [drillQ, drillIn, playCorrect, playWrong, newDrill]);

  return (
    <div className="space-y-6">
      <Ladder labels={labels} />
      <p className="text-center text-xs text-app-muted">
        ×10 mezi mm→cm→dm→m, ×1000 m→km
      </p>
      <ConverterRow
        value={v}
        onValue={setV}
        from={from}
        to={to}
        onFrom={(x) => setFrom(x as LengthU)}
        onTo={(x) => setTo(x as LengthU)}
        unitOptions={units}
        result={out}
      />
      <DrillSection
        question={drillQ.q}
        input={drillIn}
        onInput={setDrillIn}
        onCheck={checkDrill}
        onNew={newDrill}
        points={drillPts}
      />
    </div>
  );
}

function randomLengthDrill(): { q: string; expected: string } {
  const units: LengthU[] = ["mm", "cm", "dm", "m", "km"];
  const a = units[Math.floor(Math.random() * units.length)]!;
  let b = units[Math.floor(Math.random() * units.length)]!;
  while (b === a) b = units[Math.floor(Math.random() * units.length)]!;
  const val = [1, 10, 100, 0.1][Math.floor(Math.random() * 4)]!;
  const res = convertLength(val, a, b);
  const expected = Number.isInteger(res) ? String(res) : res.toFixed(4).replace(/\.?0+$/, "");
  return {
    q: `Převeď ${val} ${a} na ${b}. (číslo)`,
    expected,
  };
}

function MassPanel({ playCorrect, playWrong }: PanelProps) {
  const units: MassU[] = ["mg", "g", "dag", "kg", "t"];
  const [v, setV] = useState("1");
  const [from, setFrom] = useState<MassU>("kg");
  const [to, setTo] = useState<MassU>("g");
  const num = parseFloat(v.replace(",", ".")) || 0;
  const out = convertMass(num, from, to);

  const [drillQ, setDrillQ] = useState(() => randomMassDrill());
  const [drillIn, setDrillIn] = useState("");
  const [drillPts, setDrillPts] = useState(0);
  const newDrill = useCallback(() => {
    setDrillQ(randomMassDrill());
    setDrillIn("");
  }, []);
  const checkDrill = useCallback(() => {
    if (answersMatch(drillQ.expected, drillIn)) {
      playCorrect();
      setDrillPts((p) => p + 1);
      newDrill();
    } else playWrong();
  }, [drillQ, drillIn, playCorrect, playWrong, newDrill]);

  return (
    <div className="space-y-6">
      <Ladder labels={["mg", "g", "dag", "kg", "t"]} />
      <ConverterRow
        value={v}
        onValue={setV}
        from={from}
        to={to}
        onFrom={(x) => setFrom(x as MassU)}
        onTo={(x) => setTo(x as MassU)}
        unitOptions={units}
        result={out}
      />
      <DrillSection
        question={drillQ.q}
        input={drillIn}
        onInput={setDrillIn}
        onCheck={checkDrill}
        onNew={newDrill}
        points={drillPts}
      />
    </div>
  );
}

function randomMassDrill(): { q: string; expected: string } {
  const units: MassU[] = ["mg", "g", "dag", "kg", "t"];
  const a = units[Math.floor(Math.random() * units.length)]!;
  let b = units[Math.floor(Math.random() * units.length)]!;
  while (b === a) b = units[Math.floor(Math.random() * units.length)]!;
  const val = [1, 1000, 0.5][Math.floor(Math.random() * 3)]!;
  const res = convertMass(val, a, b);
  const expected = Number.isInteger(res) ? String(res) : String(Math.round(res * 1e6) / 1e6);
  return { q: `Převeď ${val} ${a} na ${b}.`, expected };
}

function VolumePanel({ playCorrect, playWrong }: PanelProps) {
  const units: VolumeU[] = ["ml", "cl", "dl", "l", "hl", "cm3", "dm3", "m3"];
  const [v, setV] = useState("1");
  const [from, setFrom] = useState<VolumeU>("l");
  const [to, setTo] = useState<VolumeU>("ml");
  const num = parseFloat(v.replace(",", ".")) || 0;
  const out = convertVolume(num, from, to);
  const [drillQ, setDrillQ] = useState(() => randomVolDrill());
  const [drillIn, setDrillIn] = useState("");
  const [drillPts, setDrillPts] = useState(0);
  const newDrill = useCallback(() => {
    setDrillQ(randomVolDrill());
    setDrillIn("");
  }, []);
  const checkDrill = useCallback(() => {
    if (answersMatch(drillQ.expected, drillIn)) {
      playCorrect();
      setDrillPts((p) => p + 1);
      newDrill();
    } else playWrong();
  }, [drillQ, drillIn, playCorrect, playWrong, newDrill]);

  return (
    <div className="space-y-6">
      <Ladder labels={["ml", "cl", "dl", "l", "hl"]} />
      <p className="text-center text-xs text-app-muted">
        1 dm³ = 1 l, 1 m³ = 1000 l, 1 ml = 1 cm³
      </p>
      <ConverterRow
        value={v}
        onValue={setV}
        from={from}
        to={to}
        onFrom={(x) => setFrom(x as VolumeU)}
        onTo={(x) => setTo(x as VolumeU)}
        unitOptions={units}
        result={out}
      />
      <DrillSection
        question={drillQ.q}
        input={drillIn}
        onInput={setDrillIn}
        onCheck={checkDrill}
        onNew={newDrill}
        points={drillPts}
      />
    </div>
  );
}

function randomVolDrill(): { q: string; expected: string } {
  const units: VolumeU[] = ["ml", "l", "m3", "dl"];
  const a = units[Math.floor(Math.random() * units.length)]!;
  let b = units[Math.floor(Math.random() * units.length)]!;
  while (b === a) b = units[Math.floor(Math.random() * units.length)]!;
  const val = [1, 2, 500][Math.floor(Math.random() * 3)]!;
  const res = convertVolume(val, a, b);
  const expected = Number.isInteger(res) ? String(res) : String(Math.round(res * 1e6) / 1e6);
  return { q: `Převeď ${val} ${a} na ${b}.`, expected };
}

function TimePanel({ playCorrect, playWrong }: PanelProps) {
  const units: TimeU[] = ["s", "min", "h", "den"];
  const [v, setV] = useState("60");
  const [from, setFrom] = useState<TimeU>("s");
  const [to, setTo] = useState<TimeU>("min");
  const num = parseFloat(v.replace(",", ".")) || 0;
  const out = convertTime(num, from, to);
  const [drillQ, setDrillQ] = useState(() => randomTimeDrill());
  const [drillIn, setDrillIn] = useState("");
  const [drillPts, setDrillPts] = useState(0);
  const newDrill = useCallback(() => {
    setDrillQ(randomTimeDrill());
    setDrillIn("");
  }, []);
  const checkDrill = useCallback(() => {
    if (answersMatch(drillQ.expected, drillIn)) {
      playCorrect();
      setDrillPts((p) => p + 1);
      newDrill();
    } else playWrong();
  }, [drillQ, drillIn, playCorrect, playWrong, newDrill]);

  return (
    <div className="space-y-6">
      <Ladder labels={["s", "min", "h", "den"]} />
      <ConverterRow
        value={v}
        onValue={setV}
        from={from}
        to={to}
        onFrom={(x) => setFrom(x as TimeU)}
        onTo={(x) => setTo(x as TimeU)}
        unitOptions={units}
        result={out}
      />
      <DrillSection
        question={drillQ.q}
        input={drillIn}
        onInput={setDrillIn}
        onCheck={checkDrill}
        onNew={newDrill}
        points={drillPts}
      />
    </div>
  );
}

function randomTimeDrill(): { q: string; expected: string } {
  const a: TimeU = "min";
  const b: TimeU = "s";
  const val = [2, 5, 10][Math.floor(Math.random() * 3)]!;
  const res = convertTime(val, a, b);
  return { q: `Převeď ${val} min na sekundy.`, expected: String(res) };
}

function SpeedPanel({ playCorrect, playWrong }: PanelProps) {
  const units: SpeedU[] = ["ms", "kmh"];
  const [v, setV] = useState("10");
  const [from, setFrom] = useState<SpeedU>("ms");
  const [to, setTo] = useState<SpeedU>("kmh");
  const num = parseFloat(v.replace(",", ".")) || 0;
  const out = convertSpeed(num, from, to);
  const [drillQ, setDrillQ] = useState(() => randomSpeedDrill());
  const [drillIn, setDrillIn] = useState("");
  const [drillPts, setDrillPts] = useState(0);
  const newDrill = useCallback(() => {
    setDrillQ(randomSpeedDrill());
    setDrillIn("");
  }, []);
  const checkDrill = useCallback(() => {
    if (answersMatch(drillQ.expected, drillIn)) {
      playCorrect();
      setDrillPts((p) => p + 1);
      newDrill();
    } else playWrong();
  }, [drillQ, drillIn, playCorrect, playWrong, newDrill]);

  return (
    <div className="space-y-6">
      <p className="text-center text-sm text-app-accent">
        1 m/s = 3,6 km/h · km/h → m/s děl 3,6
      </p>
      <ConverterRow
        value={v}
        onValue={setV}
        from={from}
        to={to}
        onFrom={(x) => setFrom(x as SpeedU)}
        onTo={(x) => setTo(x as SpeedU)}
        unitOptions={units}
        result={out}
        formatUnit={(u) => (u === "ms" ? "m/s" : "km/h")}
      />
      <DrillSection
        question={drillQ.q}
        input={drillIn}
        onInput={setDrillIn}
        onCheck={checkDrill}
        onNew={newDrill}
        points={drillPts}
      />
    </div>
  );
}

function randomSpeedDrill(): { q: string; expected: string } {
  const ms = [5, 10, 20][Math.floor(Math.random() * 3)]!;
  const kmh = convertSpeed(ms, "ms", "kmh");
  return {
    q: `Kolik km/h je ${ms} m/s?`,
    expected: String(kmh),
  };
}

function TempPanel({ playCorrect, playWrong }: PanelProps) {
  const units: TempU[] = ["C", "K", "F"];
  const [v, setV] = useState("0");
  const [from, setFrom] = useState<TempU>("C");
  const [to, setTo] = useState<TempU>("K");
  const num = parseFloat(v.replace(",", ".")) || 0;
  const out = convertTemp(num, from, to);
  const [drillQ, setDrillQ] = useState(() => randomTempDrill());
  const [drillIn, setDrillIn] = useState("");
  const [drillPts, setDrillPts] = useState(0);
  const newDrill = useCallback(() => {
    setDrillQ(randomTempDrill());
    setDrillIn("");
  }, []);
  const checkDrill = useCallback(() => {
    if (answersMatch(drillQ.expected, drillIn)) {
      playCorrect();
      setDrillPts((p) => p + 1);
      newDrill();
    } else playWrong();
  }, [drillQ, drillIn, playCorrect, playWrong, newDrill]);

  return (
    <div className="space-y-6">
      <p className="text-center text-xs text-app-muted">
        K = °C + 273 · °F = °C×9/5 + 32
      </p>
      <ConverterRow
        value={v}
        onValue={setV}
        from={from}
        to={to}
        onFrom={(x) => setFrom(x as TempU)}
        onTo={(x) => setTo(x as TempU)}
        unitOptions={units}
        result={out}
        formatUnit={(u) => (u === "C" ? "°C" : u === "K" ? "K" : "°F")}
      />
      <DrillSection
        question={drillQ.q}
        input={drillIn}
        onInput={setDrillIn}
        onCheck={checkDrill}
        onNew={newDrill}
        points={drillPts}
      />
    </div>
  );
}

function randomTempDrill(): { q: string; expected: string } {
  const c = [0, 10, 25, 100][Math.floor(Math.random() * 4)]!;
  const expected = String(c + 273);
  return {
    q: `Kolik kelvinů je ${c} °C? (použij zjednodušení T = °C + 273)`,
    expected,
  };
}

function ConverterRow<T extends string>({
  value,
  onValue,
  from,
  to,
  onFrom,
  onTo,
  unitOptions,
  result,
  formatUnit = (u) => u,
}: {
  value: string;
  onValue: (v: string) => void;
  from: T;
  to: T;
  onFrom: (u: string) => void;
  onTo: (u: string) => void;
  unitOptions: readonly T[];
  result: number;
  formatUnit?: (u: T) => string;
}) {
  const pretty = useMemo(() => {
    if (!Number.isFinite(result)) return "—";
    if (Math.abs(result) >= 1e6 || (Math.abs(result) < 0.0001 && result !== 0)) {
      return result.toExponential(4);
    }
    return String(Math.round(result * 1e6) / 1e6);
  }, [result]);

  return (
    <div className="grid gap-4 rounded-2xl border border-slate-600 bg-app-card p-4 sm:grid-cols-2">
      <div>
        <label className="text-xs text-app-muted">Hodnota</label>
        <input
          value={value}
          onChange={(e) => onValue(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-600 bg-app-bg px-3 py-2 text-slate-100"
        />
        <label className="mt-3 block text-xs text-app-muted">Z jednotky</label>
        <select
          value={from}
          onChange={(e) => onFrom(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-600 bg-app-bg px-3 py-2 text-slate-100"
        >
          {unitOptions.map((u) => (
            <option key={u} value={u}>
              {formatUnit(u)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs text-app-muted">Výsledek</label>
        <div className="mt-1 rounded-lg border border-cyan-500/40 bg-cyan-950/30 px-3 py-3 font-mono text-lg text-cyan-200">
          {pretty}
        </div>
        <label className="mt-3 block text-xs text-app-muted">Do jednotky</label>
        <select
          value={to}
          onChange={(e) => onTo(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-600 bg-app-bg px-3 py-2 text-slate-100"
        >
          {unitOptions.map((u) => (
            <option key={u} value={u}>
              {formatUnit(u)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function DrillSection({
  question,
  input,
  onInput,
  onCheck,
  onNew,
  points,
}: {
  question: string;
  input: string;
  onInput: (v: string) => void;
  onCheck: () => void;
  onNew: () => void;
  points: number;
}) {
  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
      <p className="text-sm font-semibold text-emerald-300">Drill mód</p>
      <p className="mt-2 text-app-fg">{question}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <input
          value={input}
          onChange={(e) => onInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onCheck()}
          className="min-w-[8rem] flex-1 rounded-lg border border-slate-600 bg-app-bg px-3 py-2 text-slate-100"
        />
        <button
          type="button"
          onClick={onCheck}
          className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white"
        >
          Ověřit
        </button>
        <button
          type="button"
          onClick={onNew}
          className="rounded-lg border border-slate-500 px-4 py-2 text-app-subtle"
        >
          Nová úloha
        </button>
      </div>
      <p className="mt-2 text-xs text-app-muted">Body v drillu: {points}</p>
    </div>
  );
}
