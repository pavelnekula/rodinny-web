"use client";

import { useCallback, useMemo, useState } from "react";
import {
  DELIVERY_OPTIONS,
  WINES,
  formatCZK,
  isValidEmail,
  orderTotalKc,
  priceForTyp,
  type BottleTyp,
  type WineOrderLine,
} from "@/lib/wine-order";

type Counts = Record<string, { sklo: number; plast: number }>;

function initialCounts(): Counts {
  const o: Counts = {};
  for (const w of WINES) {
    o[w.id] = { sklo: 0, plast: 0 };
  }
  return o;
}

const MAX_BOTTLES = 99;

function linesFromCounts(counts: Counts): WineOrderLine[] {
  const lines: WineOrderLine[] = [];
  for (const w of WINES) {
    const c = counts[w.id];
    if (!c) continue;
    if (c.sklo > 0) {
      lines.push({ vinoId: w.id, typ: "sklo", pocet: c.sklo });
    }
    if (c.plast > 0) {
      lines.push({ vinoId: w.id, typ: "plast", pocet: c.plast });
    }
  }
  return lines;
}

type StepperProps = {
  label: string;
  sublabel: string;
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
};

function BottleStepper({
  label,
  sublabel,
  value,
  onChange,
  disabled,
}: StepperProps) {
  const dec = useCallback(() => {
    onChange(Math.max(0, value - 1));
  }, [value, onChange]);
  const inc = useCallback(() => {
    onChange(Math.min(MAX_BOTTLES, value + 1));
  }, [value, onChange]);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div>
        <p className="text-sm font-medium text-[#1a1a1a]">{label}</p>
        <p className="text-xs font-light text-[#6b7280]">{sublabel}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={dec}
          disabled={disabled || value <= 0}
          aria-label={`Snížit počet – ${label}`}
          className="flex h-11 min-w-[2.75rem] items-center justify-center rounded-lg border border-[#e5e7eb] bg-[#ffffff] text-lg font-semibold text-[#1a1a1a] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2"
        >
          −
        </button>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={MAX_BOTTLES}
          value={value}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") {
              onChange(0);
              return;
            }
            const n = parseInt(raw, 10);
            if (Number.isNaN(n)) return;
            onChange(Math.max(0, Math.min(MAX_BOTTLES, n)));
          }}
          aria-label={`Počet kusů – ${label}`}
          className="h-11 w-14 rounded-lg border border-[#e5e7eb] bg-[#ffffff] text-center text-base font-semibold tabular-nums text-[#1a1a1a] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2"
        />
        <button
          type="button"
          onClick={inc}
          disabled={disabled || value >= MAX_BOTTLES}
          aria-label={`Zvýšit počet – ${label}`}
          className="flex h-11 min-w-[2.75rem] items-center justify-center rounded-lg border border-[#e5e7eb] bg-[#ffffff] text-lg font-semibold text-[#1a1a1a] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function WineOrderForm() {
  const [counts, setCounts] = useState<Counts>(initialCounts);
  const [deliveryId, setDeliveryId] = useState<string>("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const lines = useMemo(() => linesFromCounts(counts), [counts]);
  const total = useMemo(() => orderTotalKc(lines), [lines]);

  const emailTrim = email.trim();
  const emailOk = emailTrim.length > 0 && isValidEmail(emailTrim);
  const deliveryOk = DELIVERY_OPTIONS.some((d) => d.id === deliveryId);

  const submitDisabled =
    submitting ||
    total === 0 ||
    !emailOk ||
    !deliveryOk;

  const setBottle = useCallback(
    (wineId: string, typ: BottleTyp, next: number) => {
      setCounts((prev) => ({
        ...prev,
        [wineId]: {
          ...prev[wineId],
          [typ]: Math.max(0, Math.min(MAX_BOTTLES, next)),
        },
      }));
      setStatus("idle");
    },
    [],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitDisabled) return;

    const payload = {
      items: lines,
      deliveryId,
      email: emailTrim,
      note: note.trim() || undefined,
    };

    setSubmitting(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/send-wine-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setStatus("success");
      setCounts(initialCounts());
      setDeliveryId("");
      setEmail("");
      setNote("");
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-10 space-y-10"
      noValidate
    >
      <div className="space-y-6">
        {WINES.map((wine) => {
          const c = counts[wine.id] ?? { sklo: 0, plast: 0 };
          return (
            <div
              key={wine.id}
              className="rounded-xl border border-[#e5e7eb] bg-[#ffffff] p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-[#1a1a1a]">
                {wine.name}
              </h3>
              <div className="mt-6 space-y-6 border-t border-[#e5e7eb] pt-6">
                <BottleStepper
                  label="Skleněná lahev 0,75 l"
                  sublabel={`${formatCZK(priceForTyp("sklo"))} / ks`}
                  value={c.sklo}
                  onChange={(n) => setBottle(wine.id, "sklo", n)}
                  disabled={submitting}
                />
                <BottleStepper
                  label="Plastová lahev 2 l"
                  sublabel={`${formatCZK(priceForTyp("plast"))} / ks`}
                  value={c.plast}
                  onChange={(n) => setBottle(wine.id, "plast", n)}
                  disabled={submitting}
                />
              </div>
            </div>
          );
        })}
      </div>

      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-[#1a1a1a]">
          Doprava
        </legend>
        <div className="space-y-3">
          {DELIVERY_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#e5e7eb] bg-[#ffffff] p-4 shadow-sm transition hover:bg-[#fafafa] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#3b82f6] has-[:focus-visible]:ring-offset-2"
            >
              <input
                type="radio"
                name="delivery"
                value={opt.id}
                checked={deliveryId === opt.id}
                onChange={() => {
                  setDeliveryId(opt.id);
                  setStatus("idle");
                }}
                disabled={submitting}
                className="mt-1 h-4 w-4 shrink-0 accent-[#1a1a1a]"
              />
              <span className="text-sm font-light leading-relaxed text-[#1a1a1a]">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="wine-order-email"
            className="block text-sm font-medium text-[#1a1a1a]"
          >
            E-mail <span className="text-[#6b7280]">(povinné)</span>
          </label>
          <input
            id="wine-order-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setStatus("idle");
            }}
            disabled={submitting}
            required
            className="mt-2 w-full rounded-lg border border-[#e5e7eb] bg-[#ffffff] px-4 py-3 text-base text-[#1a1a1a] shadow-sm focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2"
            placeholder="vas@email.cz"
          />
        </div>
        <div>
          <label
            htmlFor="wine-order-note"
            className="block text-sm font-medium text-[#1a1a1a]"
          >
            Poznámka <span className="text-[#6b7280]">(volitelné)</span>
          </label>
          <textarea
            id="wine-order-note"
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setStatus("idle");
            }}
            disabled={submitting}
            rows={4}
            className="mt-2 w-full resize-y rounded-lg border border-[#e5e7eb] bg-[#ffffff] px-4 py-3 text-base font-light text-[#1a1a1a] shadow-sm focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2"
            placeholder="Doplňující informace k objednávce…"
          />
        </div>
      </div>

      <div className="border-t border-[#e5e7eb] pt-8">
        <p className="text-2xl font-semibold tracking-tight text-[#1a1a1a]">
          Celkem: {formatCZK(total)}
        </p>

        {status === "success" ? (
          <p
            className="mt-6 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-base font-light text-[#1a1a1a]"
            role="status"
          >
            Objednávka byla odeslána. Brzy se ozveme!
          </p>
        ) : null}
        {status === "error" ? (
          <p
            className="mt-6 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-base font-light text-[#1a1a1a]"
            role="alert"
          >
            Něco se nepovedlo. Zkuste to prosím znovu nebo napište přímo na{" "}
            <a
              href="mailto:pavelnekula@gmail.com"
              className="font-medium text-[#3b82f6] underline-offset-2 hover:underline"
            >
              pavelnekula@gmail.com
            </a>
          </p>
        ) : null}

        {total === 0 ? (
          <p className="mt-4 text-sm font-light text-[#6b7280]">
            Vyberte prosím alespoň jednu lahev.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitDisabled}
          className="mt-6 w-full rounded-lg bg-[#1a1a1a] px-6 py-4 text-base font-semibold text-[#ffffff] shadow-sm transition hover:bg-[#374151] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2 sm:w-auto sm:min-w-[12rem]"
        >
          {submitting ? "Odesílám…" : "Odeslat"}
        </button>
      </div>
    </form>
  );
}
