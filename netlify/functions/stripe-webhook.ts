import type { Config, Context } from "@netlify/functions";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

async function sendSaleEmail(session: Stripe.Checkout.Session) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.SALE_NOTIFY_EMAIL;
  const from =
    process.env.SALE_NOTIFY_FROM || "Futureboy <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.warn("Skipping sale email — RESEND_API_KEY or SALE_NOTIFY_EMAIL missing");
    return;
  }

  const stripe = getStripe();
  const full = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items", "payment_intent"],
  });

  const paymentId =
    typeof full.payment_intent === "string"
      ? full.payment_intent
      : full.payment_intent?.id;

  const isTest = (process.env.STRIPE_SECRET_KEY || "").includes("test");
  const dashboardUrl = paymentId
    ? `https://dashboard.stripe.com/${isTest ? "test/" : ""}payments/${paymentId}`
    : `https://dashboard.stripe.com/${isTest ? "test/" : ""}checkout/sessions/${full.id}`;

  const lines =
    full.line_items?.data
      .map(
        (li) =>
          `• ${li.quantity}× ${li.description} — £${((li.amount_total || 0) / 100).toFixed(2)}`,
      )
      .join("\n") || "• (no line items)";

  const ship = full.shipping_cost
    ? `£${((full.shipping_cost.amount_total || 0) / 100).toFixed(2)}`
    : "—";

  const address = full.customer_details?.address;
  const addressBlock = address
    ? [
        full.customer_details?.name,
        address.line1,
        address.line2,
        [address.city, address.postal_code].filter(Boolean).join(" "),
        address.country,
      ]
        .filter(Boolean)
        .join("\n")
    : "No address";

  const subject = `Futureboy sale — £${((full.amount_total || 0) / 100).toFixed(2)}`;
  const text = [
    "New Futureboy order",
    "",
    lines,
    "",
    `Shipping: ${ship}`,
    `Total: £${((full.amount_total || 0) / 100).toFixed(2)}`,
    `Customer: ${full.customer_details?.email || "—"}`,
    "",
    "Ship to:",
    addressBlock,
    "",
    `Stripe Dashboard: ${dashboardUrl}`,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend failed: ${res.status} ${body}`);
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
      await sendSaleEmail(session);
    } catch (err) {
      console.error("Sale email failed", err);
      return new Response("Email failed", { status: 500 });
    }
  }

  return Response.json({ received: true });
};

export const config: Config = {
  path: "/api/stripe-webhook",
};
