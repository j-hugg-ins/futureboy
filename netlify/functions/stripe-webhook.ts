import type { Config, Context } from "@netlify/functions";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

function publicBase() {
  return (process.env.PUBLIC_URL || "https://futureboy.uk").replace(/\/$/, "");
}

function formatGBP(pence: number) {
  return `£${(pence / 100).toFixed(2)}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function totalQuantity(full: Stripe.Checkout.Session) {
  return (
    full.line_items?.data.reduce((sum, li) => sum + (li.quantity || 0), 0) || 0
  );
}

function firstName(full: Stripe.Checkout.Session) {
  return full.customer_details?.name?.split(" ")[0]?.trim() || "there";
}

function lineSummary(full: Stripe.Checkout.Session) {
  return (
    full.line_items?.data
      .map(
        (li) =>
          `• ${li.quantity}× ${li.description} — ${formatGBP(li.amount_total || 0)}`,
      )
      .join("\n") || "• (no line items)"
  );
}

function shippingAmount(full: Stripe.Checkout.Session) {
  return full.shipping_cost
    ? formatGBP(full.shipping_cost.amount_total || 0)
    : "—";
}

function shipToLines(full: Stripe.Checkout.Session) {
  const address = full.customer_details?.address;
  if (!address) return ["No address"];
  return [
    full.customer_details?.name,
    address.line1,
    address.line2,
    [address.city, address.postal_code].filter(Boolean).join(" "),
    address.country,
  ].filter(Boolean) as string[];
}

function orderTableRows(full: Stripe.Checkout.Session) {
  const productRows =
    full.line_items?.data.map((li) => {
      const qty = li.quantity || 1;
      const label =
        qty > 1
          ? `${qty}× ${li.description || "Item"}`
          : li.description || "Item";
      return { label, amount: formatGBP(li.amount_total || 0) };
    }) || [];

  return [
    ...productRows,
    { label: "Shipping", amount: shippingAmount(full) },
    { label: "Total", amount: formatGBP(full.amount_total || 0), bold: true },
  ];
}

function orderTableHtml(full: Stripe.Checkout.Session) {
  const rows = orderTableRows(full)
    .map(
      (row) => `
      <tr>
        <td style="padding:6px 12px 6px 0;font-size:${row.bold ? "15px" : "14px"};font-weight:${row.bold ? "600" : "400"};color:#262626;vertical-align:top;">${escapeHtml(row.label)}</td>
        <td style="padding:6px 0;font-size:${row.bold ? "15px" : "14px"};font-weight:${row.bold ? "600" : "400"};color:#262626;text-align:right;white-space:nowrap;vertical-align:top;">${escapeHtml(row.amount)}</td>
      </tr>`,
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:28px 0 8px;">
      ${rows}
    </table>`;
}

function orderTableText(full: Stripe.Checkout.Session) {
  return orderTableRows(full)
    .map((row) => `${row.label}: ${row.amount}`)
    .join("\n");
}

function brandEmailHtml(opts: {
  headline?: string;
  bodyHtml: string;
  afterTableHtml?: string;
  full: Stripe.Checkout.Session;
  /** Customer emails get the legend line; seller alerts stay shorter. */
  customerFooter?: boolean;
}) {
  const logoUrl = `${publicBase()}/brand/futureboy-logo-light-reg.png`;
  const year = new Date().getFullYear();
  const headline = opts.headline
    ? `<h1 style="margin:0 0 24px;font-size:28px;line-height:1.25;font-weight:600;color:#262626;letter-spacing:-0.02em;">${escapeHtml(opts.headline)}</h1>`
    : "";
  const legend = opts.customerFooter
    ? `<p style="margin:16px 0 0;">You're receiving this email because you're a legend and just splashed some cash on the Futureboy website.</p>`
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
            <td align="center" style="padding:36px 28px 12px;">
              <img src="${logoUrl}" width="88" alt="Futureboy" style="display:block;width:88px;height:auto;border:0;" />
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
              ${headline}
              <div style="font-size:15px;line-height:1.55;color:#262626;">
                ${opts.bodyHtml}
              </div>
              ${orderTableHtml(opts.full)}
              ${opts.afterTableHtml || ""}
            </td>
          </tr>
          <tr>
            <td style="padding:28px 28px 36px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;color:#666666;text-align:center;">
              <p style="margin:0 0 4px;">© Futureboy ${year}.</p>
              <p style="margin:0;">Designed by J.</p>
              ${legend}
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

async function sendResendEmail(opts: {
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

async function sendOrderEmails(session: Stripe.Checkout.Session) {
  const apiKey = process.env.RESEND_API_KEY;
  const sellerTo = process.env.SALE_NOTIFY_EMAIL;
  const from =
    process.env.SALE_NOTIFY_FROM || "Futureboy <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn("Skipping order emails — RESEND_API_KEY missing");
    return;
  }

  const stripe = getStripe();
  const full = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items", "payment_intent"],
  });

  const total = formatGBP(full.amount_total || 0);
  const qty = totalQuantity(full);
  const name = firstName(full);
  const addressLines = shipToLines(full);
  const year = new Date().getFullYear();
  const sellerFooterText = [`© Futureboy ${year}.`, "Designed by J."].join("\n");
  const customerFooterText = [
    `© Futureboy ${year}.`,
    "Designed by J.",
    "",
    "You're receiving this email because you're a legend and just splashed some cash on the Futureboy website.",
  ].join("\n");

  if (sellerTo) {
    const paymentId =
      typeof full.payment_intent === "string"
        ? full.payment_intent
        : full.payment_intent?.id;

    const isTest = (process.env.STRIPE_SECRET_KEY || "").includes("test");
    const dashboardUrl = paymentId
      ? `https://dashboard.stripe.com/${isTest ? "test/" : ""}payments/${paymentId}`
      : `https://dashboard.stripe.com/${isTest ? "test/" : ""}checkout/sessions/${full.id}`;

    const sellerBodyHtml = `
      <p style="margin:0 0 12px;">New Futureboy order from ${escapeHtml(full.customer_details?.email || "unknown")}.</p>
      <p style="margin:0 0 4px;font-size:13px;color:#666666;">Ship to</p>
      <p style="margin:0;white-space:pre-line;">${escapeHtml(addressLines.join("\n"))}</p>
      <p style="margin:20px 0 0;"><a href="${escapeHtml(dashboardUrl)}" style="color:#262626;">Open in Stripe</a></p>`;

    await sendResendEmail({
      apiKey,
      from,
      to: sellerTo,
      subject: `Futureboy sale — ${total}`,
      html: brandEmailHtml({
        headline: "New order",
        bodyHtml: sellerBodyHtml,
        full,
      }),
      text: [
        "New Futureboy order",
        "",
        lineSummary(full),
        "",
        orderTableText(full),
        "",
        "Ship to:",
        ...addressLines,
        "",
        `Customer: ${full.customer_details?.email || "—"}`,
        `Stripe Dashboard: ${dashboardUrl}`,
        "",
        sellerFooterText,
      ].join("\n"),
    });
  } else {
    console.warn("Skipping seller email — SALE_NOTIFY_EMAIL missing");
  }

  const customerEmail = full.customer_details?.email?.trim();
  if (customerEmail) {
    const headline = `Everyone always got the sense that ${name} was going places…`;
    const body = customerBodyCopy(qty);
    const afterTableHtml = `
      <p style="margin:20px 0 0;font-size:13px;color:#666666;">Ship to</p>
      <p style="margin:4px 0 0;white-space:pre-line;">${escapeHtml(addressLines.join("\n"))}</p>`;

    await sendResendEmail({
      apiKey,
      from,
      to: customerEmail,
      subject: `Thanks for your Futureboy order — ${total}`,
      html: brandEmailHtml({
        headline,
        bodyHtml: body.html,
        afterTableHtml,
        full,
        customerFooter: true,
      }),
      text: [
        headline,
        "",
        body.text,
        "",
        orderTableText(full),
        "",
        "Ship to:",
        ...addressLines,
        "",
        customerFooterText,
      ].join("\n"),
    });
  } else {
    console.warn("Skipping customer email — no customer email on session");
  }
}

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const stripe = getStripe();
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.error(err);
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "invalid"}`,
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      await sendOrderEmails(session);
    } catch (err) {
      console.error("Order email failed", err);
      return new Response("Email failed", { status: 500 });
    }
  }

  return Response.json({ received: true });
};

export const config: Config = {
  path: "/api/stripe-webhook",
};
