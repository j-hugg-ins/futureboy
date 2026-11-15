export type OrderLine = {
  description: string;
  quantity: number;
  amountPence: number;
};

export type OrderEmailData = {
  lines: OrderLine[];
  shippingPence: number | null;
  amountTotalPence: number;
  customerEmail?: string;
  customerName?: string;
  addressLines: string[];
  dashboardUrl?: string;
};

export function publicBase() {
  return (process.env.PUBLIC_URL || "https://futureboy.uk").replace(/\/$/, "");
}

export function formatGBP(pence: number) {
  return `£${(pence / 100).toFixed(2)}`;
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
  return order.shippingPence != null ? formatGBP(order.shippingPence) : "—";
}

function orderTableRows(order: OrderEmailData) {
  const productRows = order.lines.map((line) => {
    const qty = line.quantity || 1;
    const label =
      qty > 1 ? `${qty}× ${line.description}` : line.description || "Item";
    return { label, amount: formatGBP(line.amountPence || 0) };
  });

  return [
    ...productRows,
    { label: "Shipping", amount: shippingAmount(order) },
    {
      label: "Total",
      amount: formatGBP(order.amountTotalPence || 0),
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
          `• ${line.quantity}× ${line.description} — ${formatGBP(line.amountPence || 0)}`,
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
      html: `<p style="margin:0 0 16px;">Thanks so much for grabbing a few of my hats. I hope you dig them as much as I do. Futureboy is just me and my passion for caps so I really appreciate the support.</p>
<p style="margin:0 0 4px;">Cheers!</p>
<p style="margin:0;">J.</p>`,
      text: [
        "Thanks so much for grabbing a few of my hats. I hope you dig them as much as I do. Futureboy is just me and my passion for caps so I really appreciate the support.",
        "",
        "Cheers!",
        "",
        "J.",
      ].join("\n"),
    };
  }

  return {
    html: `<p style="margin:0 0 16px;">Thanks so much for grabbing one of my hats. I hope you dig it as much as I do. Futureboy is just me and my passion for hats so I really appreciate the support.</p>
<p style="margin:0 0 4px;">Cheers!</p>
<p style="margin:0;">J.</p>`,
    text: [
      "Thanks so much for grabbing one of my hats. I hope you dig it as much as I do. Futureboy is just me and my passion for hats so I really appreciate the support.",
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
  const total = formatGBP(order.amountTotalPence || 0);
  const addressBlock = order.addressLines.join("\n");
  const dashboardUrl = order.dashboardUrl || "https://dashboard.stripe.com/";

  const bodyHtml = `
      <p style="margin:0 0 12px;">New Futureboy order from ${escapeHtml(order.customerEmail || "unknown")}.</p>
      <p style="margin:0 0 4px;font-size:13px;color:#666666;">Ship to</p>
      <p style="margin:0;white-space:pre-line;">${escapeHtml(addressBlock)}</p>
      <p style="margin:20px 0 0;"><a href="${escapeHtml(dashboardUrl)}" style="color:#262626;">Open in Stripe</a></p>`;

  return {
    subject: `Futureboy sale — ${total}`,
    html: brandEmailHtml({
      headline: "New order",
      bodyHtml,
      order,
    }),
    text: [
      "New Futureboy order",
      "",
      lineSummary(order),
      "",
      orderTableText(order),
      "",
      "Ship to:",
      ...order.addressLines,
      "",
      `Customer: ${order.customerEmail || "—"}`,
      `Stripe Dashboard: ${dashboardUrl}`,
      "",
      footerText(false),
    ].join("\n"),
  };
}

export function buildCustomerEmail(order: OrderEmailData): BuiltEmail {
  const total = formatGBP(order.amountTotalPence || 0);
  const qty = totalQuantity(order);
  const name = firstName(order);
  const headline = `Everyone always got the sense that ${name} was going places…`;
  const body = customerBodyCopy(qty);
  const addressBlock = order.addressLines.join("\n");

  const afterTableHtml = `
      <p style="margin:20px 0 0;font-size:13px;color:#666666;">Ship to</p>
      <p style="margin:4px 0 0;white-space:pre-line;">${escapeHtml(addressBlock)}</p>`;

  return {
    subject: `Thanks for your Futureboy order — ${total}`,
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
