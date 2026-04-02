import { Resend } from "resend";
import { NextResponse } from "next/server";
import {
  DELIVERY_IDS,
  WINE_IDS,
  deliveryLabelById,
  formatCZK,
  isValidEmail,
  lineTotal,
  orderTotalKc,
  wineNameById,
  type BottleTyp,
  type WineOrderLine,
} from "@/lib/wine-order";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function bottleDescription(typ: BottleTyp): string {
  return typ === "sklo" ? "Skleněná lahev 0,75 l" : "Plastová lahev 2 l";
}

function buildEmailText(params: {
  items: WineOrderLine[];
  deliveryLabel: string;
  email: string;
  note?: string;
}): string {
  const { items, deliveryLabel, email, note } = params;
  const lines: string[] = [
    "Nová objednávka vína – Sklep u Kapličky",
    "",
    "Objednané položky:",
  ];

  for (const row of items) {
    if (row.pocet <= 0) continue;
    const name = wineNameById(row.vinoId) ?? row.vinoId;
    const sub = bottleDescription(row.typ);
    const linePrice = lineTotal(row);
    lines.push(
      `- ${name} – ${sub} × ${row.pocet} ks = ${formatCZK(linePrice)}`,
    );
  }

  lines.push("");
  lines.push(`Celková cena: ${formatCZK(orderTotalKc(items))}`);
  lines.push("");
  lines.push(`Doprava: ${deliveryLabel}`);
  lines.push("");
  lines.push(`E-mail objednavatele: ${email}`);
  lines.push("");
  lines.push(
    `Poznámka: ${note && note.trim() ? note.trim() : "—"}`,
  );

  return lines.join("\n");
}

function buildEmailHtml(params: {
  items: WineOrderLine[];
  deliveryLabel: string;
  email: string;
  note?: string;
}): string {
  const { items, deliveryLabel, email, note } = params;
  const rows: string[] = [];
  for (const row of items) {
    if (row.pocet <= 0) continue;
    const name = wineNameById(row.vinoId) ?? row.vinoId;
    const sub = bottleDescription(row.typ);
    const linePrice = lineTotal(row);
    rows.push(
      `<tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-family:system-ui,sans-serif;font-size:14px;color:#1a1a1a;">${escapeHtml(name)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-family:system-ui,sans-serif;font-size:14px;color:#1a1a1a;">${escapeHtml(sub)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-family:system-ui,sans-serif;font-size:14px;color:#1a1a1a;text-align:right;">${row.pocet}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-family:system-ui,sans-serif;font-size:14px;color:#1a1a1a;text-align:right;">${escapeHtml(formatCZK(linePrice))}</td>
      </tr>`,
    );
  }

  const noteBlock =
    note && note.trim()
      ? `<p style="margin:16px 0 0;font-family:system-ui,sans-serif;font-size:14px;color:#1a1a1a;"><strong style="color:#6b7280;">Poznámka</strong><br />${escapeHtml(note.trim()).replace(/\n/g, "<br />")}</p>`
      : "";

  return `<!DOCTYPE html>
<html lang="cs">
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:24px;background:#ffffff;">
  <div style="max-width:560px;margin:0 auto;font-family:system-ui,-apple-system,sans-serif;color:#1a1a1a;">
    <h1 style="font-size:18px;font-weight:600;margin:0 0 16px;">Nová objednávka vína – Sklep u Kapličky</h1>
    <p style="margin:0 0 12px;font-size:14px;color:#6b7280;">Objednané položky</p>
    <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <thead>
        <tr style="background:#f9fafb;">
          <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:600;color:#6b7280;border-bottom:1px solid #e5e7eb;">Víno</th>
          <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:600;color:#6b7280;border-bottom:1px solid #e5e7eb;">Typ lahve</th>
          <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:600;color:#6b7280;border-bottom:1px solid #e5e7eb;">Ks</th>
          <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:600;color:#6b7280;border-bottom:1px solid #e5e7eb;">Cena</th>
        </tr>
      </thead>
      <tbody>${rows.join("")}</tbody>
    </table>
    <p style="margin:20px 0 0;font-size:16px;font-weight:600;">Celková cena: ${escapeHtml(formatCZK(orderTotalKc(items)))}</p>
    <p style="margin:12px 0 0;font-size:14px;"><strong style="color:#6b7280;">Doprava</strong><br />${escapeHtml(deliveryLabel)}</p>
    <p style="margin:12px 0 0;font-size:14px;"><strong style="color:#6b7280;">E-mail objednavatele</strong><br /><a href="mailto:${encodeURIComponent(email)}" style="color:#3b82f6;">${escapeHtml(email)}</a></p>
    ${noteBlock}
  </div>
</body>
</html>`;
}

function isBottleTyp(x: unknown): x is BottleTyp {
  return x === "sklo" || x === "plast";
}

function parseBody(data: unknown): {
  ok: true;
  items: WineOrderLine[];
  deliveryId: string;
  email: string;
  note?: string;
} | { ok: false; message: string } {
  if (data === null || typeof data !== "object") {
    return { ok: false, message: "Neplatný požadavek." };
  }
  const o = data as Record<string, unknown>;
  const itemsRaw = o.items;
  const deliveryId =
    typeof o.deliveryId === "string" ? o.deliveryId.trim() : "";
  const email = typeof o.email === "string" ? o.email.trim() : "";
  const note =
    typeof o.note === "string" ? o.note : undefined;

  if (!Array.isArray(itemsRaw)) {
    return { ok: false, message: "Chybí položky." };
  }

  const items: WineOrderLine[] = [];
  for (const row of itemsRaw) {
    if (row === null || typeof row !== "object") {
      return { ok: false, message: "Neplatná položka." };
    }
    const r = row as Record<string, unknown>;
    const vinoId = typeof r.vinoId === "string" ? r.vinoId : "";
    const typ = r.typ;
    const pocetRaw = r.pocet;
    if (!WINE_IDS.has(vinoId) || !isBottleTyp(typ)) {
      return { ok: false, message: "Neplatná položka." };
    }
    const pocet =
      typeof pocetRaw === "number" && Number.isFinite(pocetRaw)
        ? Math.floor(pocetRaw)
        : typeof pocetRaw === "string"
          ? parseInt(pocetRaw, 10)
          : NaN;
    if (!Number.isFinite(pocet) || pocet < 0 || pocet > 99) {
      return { ok: false, message: "Neplatný počet." };
    }
    items.push({ vinoId, typ, pocet });
  }

  const mergedMap = new Map<string, WineOrderLine>();
  for (const item of items) {
    const k = `${item.vinoId}:${item.typ}`;
    const ex = mergedMap.get(k);
    if (ex) {
      mergedMap.set(k, { ...item, pocet: ex.pocet + item.pocet });
    } else {
      mergedMap.set(k, { ...item });
    }
  }
  const merged = [...mergedMap.values()];

  if (!DELIVERY_IDS.has(deliveryId)) {
    return { ok: false, message: "Vyberte dopravu." };
  }
  if (!email || !isValidEmail(email)) {
    return { ok: false, message: "Zadejte platný e-mail." };
  }

  const positive = merged.filter((i) => i.pocet > 0);
  if (positive.length === 0) {
    return { ok: false, message: "Vyberte alespoň jednu lahev." };
  }

  return {
    ok: true,
    items: positive,
    deliveryId,
    email,
    note: note?.trim() || undefined,
  };
}

export async function POST(request: Request) {
  console.log("API KEY exists:", !!process.env.RESEND_API_KEY);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Chybí konfigurace e-mailu (RESEND_API_KEY)." },
      { status: 500 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Neplatný JSON." }, { status: 400 });
  }

  const parsed = parseBody(json);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.message }, { status: 400 });
  }

  const { items, deliveryId, email, note } = parsed;
  const deliveryLabel = deliveryLabelById(deliveryId);
  if (!deliveryLabel) {
    return NextResponse.json({ error: "Neplatná doprava." }, { status: 400 });
  }

  const text = buildEmailText({
    items,
    deliveryLabel,
    email,
    note,
  });
  const html = buildEmailHtml({
    items,
    deliveryLabel,
    email,
    note,
  });

  const to = [email, "pavelnekula@gmail.com"];

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "Nová objednávka vína – Sklep u Kapličky",
      html,
      text,
    });
    console.log("Resend result:", result);

    if (result.error) {
      console.error("Resend API error:", result.error);
      const errMsg =
        typeof result.error === "object" &&
        result.error !== null &&
        "message" in result.error &&
        typeof (result.error as { message?: string }).message === "string"
          ? (result.error as { message: string }).message
          : JSON.stringify(result.error);
      return NextResponse.json(
        { error: errMsg },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Resend chyba:", error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
