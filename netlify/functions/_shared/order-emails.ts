import { formatMinorUnits } from "./currency";

export type OrderLine = {
  description: string;
  quantity: number;
  amountPence: number;
};

export type OrderEmailData = {
  lines: OrderLine[];
  /** Stripe minor units in `currency` (not always GBP pence). */
  shippingPence: number | null;
  amountTotalPence: number;
  /** ISO currency charged on the Checkout session. */
  currency?: string;
  customerEmail?: string;
  customerName?: string;
  addressLines: string[];
  dashboardUrl?: string;
  /** Present when paid shipping does not match address country zone. */
  shippingMismatch?: string | null;
  /** Click and Drop create-order result or skip/failure note. */
  clickAndDropNote?: string | null;
  /** False when create was skipped or failed; true on success. */
  clickAndDropOk?: boolean | null;
};

export function publicBase() {
  return (process.env.PUBLIC_URL || "https://futureboy.uk").replace(/\/$/, "");
}

export function formatOrderMoney(minor: number, currency = "gbp") {
  return formatMinorUnits(minor, currency);
}

/** @deprecated Prefer formatOrderMoney with session currency. */
export function formatGBP(pence: number) {
  return formatOrderMoney(pence, "gbp");
}

function money(order: OrderEmailData, minor: number) {
  return formatOrderMoney(minor, order.currency || "gbp");
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function totalQuantity(order: OrderEmailData) {
  return order.lines.reduce((sum, line) => sum + (line.quantity || 0), 0);
}

export function firstName(order: OrderEmailData) {
  return order.customerName?.split(" ")[0]?.trim() || "there";
}

function shippingAmount(order: OrderEmailData) {
  return order.shippingPence != null
    ? money(order, order.shippingPence)
    : "-";
}

function orderTableRows(order: OrderEmailData) {
  const productRows = order.lines.map((line) => {
    const qty = line.quantity || 1;
    const label =
      qty > 1 ? `${qty}× ${line.description}` : line.description || "Item";
    return { label, amount: money(order, line.amountPence || 0) };
  });

  return [
    ...productRows,
    { label: "Shipping", amount: shippingAmount(order) },
    {
      label: "Total",
      amount: money(order, order.amountTotalPence || 0),
      bold: true,
    },
  ];
}

function orderTableHtml(order: OrderEmailData) {
  const allRows = orderTableRows(order);
  const rows = allRows
    .map((row, index) => {
      const isLast = index === allRows.length - 1;
      const rule = isLast
        ? ""
        : "border-bottom:1px solid #666666;";
      return `
      <tr>
        <td style="padding:6px 12px 6px 0;${rule}font-size:${row.bold ? "15px" : "14px"};font-weight:${row.bold ? "600" : "400"};color:#262626;vertical-align:top;">${escapeHtml(row.label)}</td>
        <td style="padding:6px 0;${rule}font-size:${row.bold ? "15px" : "14px"};font-weight:${row.bold ? "600" : "400"};color:#262626;text-align:right;white-space:nowrap;vertical-align:top;">${escapeHtml(row.amount)}</td>
      </tr>`;
    })
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:32px 0 12px;">
      ${rows}
    </table>`;
}

function orderTableText(order: OrderEmailData) {
  return orderTableRows(order)
    .map((row) => `${row.label}: ${row.amount}`)
    .join("\n");
}

function lineSummary(order: OrderEmailData) {
  return (
    order.lines
      .map(
        (line) =>
          `• ${line.quantity}× ${line.description}: ${money(order, line.amountPence || 0)}`,
      )
      .join("\n") || "• (no line items)"
  );
}

function brandEmailHtml(opts: {
  headline?: string;
  bodyHtml: string;
  afterTableHtml?: string;
  order: OrderEmailData;
  customerFooter?: boolean;
}) {
  const logoUrl = `${publicBase()}/brand/futureboy-logo-light-reg.png`;
  const year = new Date().getFullYear();
  const headline = opts.headline
    ? `<h1 style="margin:0 0 24px;font-size:28px;line-height:1.25;font-weight:600;color:#262626;letter-spacing:-0.02em;">${escapeHtml(opts.headline)}</h1>`
    : "";
  const disclaimer = opts.customerFooter
    ? `<p style="margin:0 0 1.5em;text-wrap:balance;">You're receiving this email because you're a legend and just splashed some cash on the Futureboy website.</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Futureboy</title>
</head>
<body style="margin:0;padding:0;background:#ededed;color:#262626;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ededed;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background:#ffffff;">
          <tr>
            <td align="center" style="padding:44px 36px 8px;">
              <img src="${logoUrl}" width="62" alt="Futureboy" style="display:block;width:62px;height:auto;border:0;" />
            </td>
          </tr>
          <tr>
            <td style="padding:28px 36px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
              ${headline}
              <div style="font-size:15px;line-height:1.55;color:#262626;">
                ${opts.bodyHtml}
              </div>
              ${orderTableHtml(opts.order)}
              ${opts.afterTableHtml || ""}
            </td>
          </tr>
          <tr>
            <td style="padding:28px 36px 44px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.35;color:#666666;text-align:center;">
              ${disclaimer}
              <p style="margin:0;text-wrap:balance;">© Futureboy ${year}.<br />Designed by J.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function customerBodyCopy(qty: number) {
  if (qty >= 2) {
    return {
      html: `<p style="margin:0 0 16px;">Thanks so much for grabbing a few pieces. I hope you dig them as much as I do. Futureboy is just me, so I really appreciate the support.</p>
<p style="margin:0 0 4px;">Cheers!</p>
<p style="margin:0;">J.</p>`,
      text: [
        "Thanks so much for grabbing a few pieces. I hope you dig them as much as I do. Futureboy is just me, so I really appreciate the support.",
        "",
        "Cheers!",
        "",
        "J.",
      ].join("\n"),
    };
  }

  return {
    html: `<p style="margin:0 0 16px;">Thanks so much for grabbing something from the shop. I hope you dig it as much as I do. Futureboy is just me, so I really appreciate the support.</p>
<p style="margin:0 0 4px;">Cheers!</p>
<p style="margin:0;">J.</p>`,
    text: [
      "Thanks so much for grabbing something from the shop. I hope you dig it as much as I do. Futureboy is just me, so I really appreciate the support.",
      "",
      "Cheers!",
      "",
      "J.",
    ].join("\n"),
  };
}

function footerText(customerFooter: boolean) {
  const year = new Date().getFullYear();
  const copyright = [`© Futureboy ${year}.`, "Designed by J."].join("\n");
  if (!customerFooter) return copyright;
  return [
    "You're receiving this email because you're a legend and just splashed some cash on the Futureboy website.",
    "",
    copyright,
  ].join("\n");
}

export type BuiltEmail = {
  subject: string;
  html: string;
  text: string;
};

export function buildSellerEmail(order: OrderEmailData): BuiltEmail {
  const total = money(order, order.amountTotalPence || 0);
  const addressBlock = order.addressLines.join("\n");
  const dashboardUrl = order.dashboardUrl || "https://dashboard.stripe.com/";

  const mismatchHtml = order.shippingMismatch
    ? `<p style="margin:0 0 12px;padding:10px 12px;background:#f8e8e4;color:#8b1e1e;">Shipping check: ${escapeHtml(order.shippingMismatch)}</p>`
    : "";

  const clickAndDropFailed = order.clickAndDropOk === false;
  const clickAndDropHtml = order.clickAndDropNote
    ? `<p style="margin:0 0 12px;padding:10px 12px;background:${clickAndDropFailed ? "#f8e8e4" : "#eef6ee"};color:${clickAndDropFailed ? "#8b1e1e" : "#1e5a2a"};">Click and Drop: ${escapeHtml(order.clickAndDropNote)}</p>`
    : "";

  const bodyHtml = `
      ${mismatchHtml}
      ${clickAndDropHtml}
      <p style="margin:0 0 12px;">New Futureboy order from ${escapeHtml(order.customerEmail || "unknown")}.</p>
      <p style="margin:0 0 4px;font-size:13px;color:#666666;">Ship to</p>
      <p style="margin:0;white-space:pre-line;">${escapeHtml(addressBlock)}</p>
      <p style="margin:20px 0 0;"><a href="${escapeHtml(dashboardUrl)}" style="color:#262626;">Open in Stripe</a></p>`;

  const subjectBits = [
    order.shippingMismatch ? "shipping check" : null,
    clickAndDropFailed ? "Click and Drop" : null,
  ].filter(Boolean);
  const subject = subjectBits.length
    ? `Futureboy sale: ${total} (${subjectBits.join(", ")})`
    : `Futureboy sale: ${total}`;

  return {
    subject,
    html: brandEmailHtml({
      headline: "New order",
      bodyHtml,
      order,
    }),
    text: [
      "New Futureboy order",
      "",
      order.shippingMismatch
        ? `Shipping check: ${order.shippingMismatch}`
        : null,
      order.shippingMismatch ? "" : null,
      order.clickAndDropNote
        ? `Click and Drop: ${order.clickAndDropNote}`
        : null,
      order.clickAndDropNote ? "" : null,
      lineSummary(order),
      "",
      orderTableText(order),
      "",
      "Ship to:",
      ...order.addressLines,
      "",
      `Customer: ${order.customerEmail || "-"}`,
      `Stripe Dashboard: ${dashboardUrl}`,
      "",
      footerText(false),
    ]
      .filter((line) => line != null)
      .join("\n"),
  };
}

export function buildCustomerEmail(order: OrderEmailData): BuiltEmail {
  const total = money(order, order.amountTotalPence || 0);
  const qty = totalQuantity(order);
  const name = firstName(order);
  const headline = `Everyone always got the sense that ${name} was going places…`;
  const body = customerBodyCopy(qty);
  const addressBlock = order.addressLines.join("\n");

  const afterTableHtml = `
      <p style="margin:20px 0 0;font-size:13px;color:#666666;">Ship to</p>
      <p style="margin:4px 0 0;white-space:pre-line;">${escapeHtml(addressBlock)}</p>`;

  return {
    subject: `Thanks for your Futureboy order: ${total}`,
    html: brandEmailHtml({
      headline,
      bodyHtml: body.html,
      afterTableHtml,
      order,
      customerFooter: true,
    }),
    text: [
      headline,
      "",
      body.text,
      "",
      orderTableText(order),
      "",
      "Ship to:",
      ...order.addressLines,
      "",
      footerText(true),
    ].join("\n"),
  };
}

export async function sendResendEmail(opts: {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: opts.from,
      to: [opts.to],
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend failed: ${res.status} ${body}`);
  }
}

/** Sample orders for email preview / smoke without a real purchase. */
export function sampleOrder(kind: "one" | "two"): OrderEmailData {
  const addressLines = [
    "Alex Legend",
    "12 Example Street",
    "London E1 6AN",
    "GB",
  ];

  if (kind === "two") {
    return {
      currency: "gbp",
      lines: [
        {
          description: "Shermer Trucker",
          quantity: 1,
          amountPence: 4500,
        },
        {
          description: "Archive Trucker",
          quantity: 1,
          amountPence: 4500,
        },
      ],
      shippingPence: 0,
      amountTotalPence: 9000,
      customerEmail: "preview@futureboy.uk",
      customerName: "Alex Legend",
      addressLines,
      dashboardUrl: "https://dashboard.stripe.com/",
    };
  }

  return {
    currency: "gbp",
    lines: [
      {
        description: "Shermer Trucker",
        quantity: 1,
        amountPence: 4500,
      },
    ],
    shippingPence: 0,
    amountTotalPence: 4500,
    customerEmail: "preview@futureboy.uk",
    customerName: "Alex Legend",
    addressLines,
    dashboardUrl: "https://dashboard.stripe.com/",
  };
}
