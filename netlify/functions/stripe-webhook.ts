import type { Config, Context } from "@netlify/functions";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

function formatGBP(pence: number) {
  return `£${(pence / 100).toFixed(2)}`;
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

function shipToBlock(full: Stripe.Checkout.Session) {
  const address = full.customer_details?.address;
  if (!address) return "No address";
  return [
    full.customer_details?.name,
    address.line1,
    address.line2,
    [address.city, address.postal_code].filter(Boolean).join(" "),
    address.country,
  ]
    .filter(Boolean)
    .join("\n");
}

async function sendResendEmail(opts: {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  text: string;
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

  const lines = lineSummary(full);
  const ship = shippingAmount(full);
  const total = formatGBP(full.amount_total || 0);
  const addressBlock = shipToBlock(full);

  if (sellerTo) {
    const paymentId =
      typeof full.payment_intent === "string"
        ? full.payment_intent
        : full.payment_intent?.id;

    const isTest = (process.env.STRIPE_SECRET_KEY || "").includes("test");
    const dashboardUrl = paymentId
      ? `https://dashboard.stripe.com/${isTest ? "test/" : ""}payments/${paymentId}`
      : `https://dashboard.stripe.com/${isTest ? "test/" : ""}checkout/sessions/${full.id}`;

    await sendResendEmail({
      apiKey,
      from,
      to: sellerTo,
      subject: `Futureboy sale — ${total}`,
      text: [
        "New Futureboy order",
        "",
        lines,
        "",
        `Shipping: ${ship}`,
        `Total: ${total}`,
        `Customer: ${full.customer_details?.email || "—"}`,
        "",
        "Ship to:",
        addressBlock,
        "",
        `Stripe Dashboard: ${dashboardUrl}`,
      ].join("\n"),
    });
  } else {
    console.warn("Skipping seller email — SALE_NOTIFY_EMAIL missing");
  }

  const customerEmail = full.customer_details?.email?.trim();
  if (customerEmail) {
    const name = full.customer_details?.name?.split(" ")[0] || "there";
    await sendResendEmail({
      apiKey,
      from,
      to: customerEmail,
      subject: `Thanks for your Futureboy order — ${total}`,
      text: [
        `Hi ${name},`,
        "",
        "Thanks for your order. Payment went through and we're getting it ready to ship.",
        "",
        lines,
        "",
        `Shipping: ${ship}`,
        `Total: ${total}`,
        "",
        "Ship to:",
        addressBlock,
        "",
        "If anything looks off, just reply to this email.",
        "",
        "— Futureboy",
        "https://futureboy.uk",
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
