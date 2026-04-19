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

const stepperBtn =
  "app-btn-pill flex h-11 min-w-[2.75rem] items-center justify-center border border-app-input-border bg-app-input px-3 text-lg font-semibold text-app-fg transition hover:border-app-border-hover disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent";

const stepperInput =
  "app-field h-11 w-14 text-center text-base font-semibold tabular-nums focus-visible:outline-none";

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
        <p className="text-sm font-medium text-app-fg">{label}</p>
        <p className="text-xs font-light text-app-muted">{sublabel}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={dec}
          disabled={disabled || value <= 0}
          aria-label={`Snížit počet – ${label}`}
          className={stepperBtn}
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
          className={stepperInput}
        />
        <button
          type="button"
          onClick={inc}
          disabled={disabled || value >= MAX_BOTTLES}
          aria-label={`Zvýšit počet – ${label}`}
          className={stepperBtn}
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

  const radioCard =
    "flex cursor-pointer items-start gap-3 rounded-[18px] border border-app-border bg-app-card p-4 transition hover:border-app-border-hover has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-app-accent";

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
              className="app-card p-6 sm:p-8"
            >
              <h3 className="text-lg font-semibold text-app-fg">
                {wine.name}
              </h3>
              <div className="mt-6 space-y-6 border-t border-app-divider pt-6">
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
        <legend className="text-base font-semibold text-app-fg">
          Doprava
        </legend>
        <div className="space-y-3">
          {DELIVERY_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className={radioCard}
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
                className="mt-1 h-4 w-4 shrink-0 accent-app-accent"
              />
              <span className="text-sm font-light leading-relaxed text-app-fg">
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
            className="block text-sm font-medium text-app-fg"
          >
            E-mail <span className="text-app-muted">(povinné)</span>
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
            className="app-field mt-2 w-full px-4 py-3 text-base focus-visible:outline-none"
            placeholder="vas@email.cz"
          />
        </div>
        <div>
          <label
            htmlFor="wine-order-note"
            className="block text-sm font-medium text-app-fg"
          >
            Poznámka <span className="text-app-muted">(volitelné)</span>
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
            className="app-field mt-2 w-full resize-y px-4 py-3 text-base font-light focus-visible:outline-none"
            placeholder="Doplňující informace k objednávce…"
          />
        </div>
      </div>

      <div className="border-t border-app-divider pt-8">
        <p className="text-2xl font-semibold tracking-tight text-app-fg">
          Celkem: {formatCZK(total)}
        </p>

        {status === "success" ? (
          <p
            className="mt-6 rounded-[18px] border border-app-border bg-app-card px-4 py-3 text-base font-light text-app-fg"
            role="status"
          >
            Objednávka byla odeslána. Brzy se ozveme!
          </p>
        ) : null}
        {status === "error" ? (
          <p
            className="mt-6 rounded-[18px] border border-app-border bg-app-card px-4 py-3 text-base font-light text-app-fg"
            role="alert"
          >
            Něco se nepovedlo. Zkuste to prosím znovu nebo napište přímo na{" "}
            <a
              href="mailto:pavelnekula@gmail.com"
              className="font-medium text-app-accent underline-offset-2 hover:underline"
            >
              pavelnekula@gmail.com
            </a>
          </p>
        ) : null}

        {total === 0 ? (
          <p className="mt-4 text-sm font-light text-app-muted">
            Vyberte prosím alespoň jednu lahev.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitDisabled}
          className="app-btn-pill app-btn-primary mt-6 w-full px-8 py-4 text-base disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg sm:w-auto sm:min-w-[12rem]"
        >
          {submitting ? "Odesílám…" : "Odeslat"}
        </button>
      </div>
    </form>
  );
}
