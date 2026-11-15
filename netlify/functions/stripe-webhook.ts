import type { Config, Context } from "@netlify/functions";
import Stripe from "stripe";
import {
  buildCustomerEmail,
  buildSellerEmail,
  type OrderEmailData,
  sendResendEmail,
} from "./_shared/order-emails";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
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

function orderFromSession(full: Stripe.Checkout.Session): OrderEmailData {
  const paymentId =
    typeof full.payment_intent === "string"
      ? full.payment_intent
      : full.payment_intent?.id;

  const isTest = (process.env.STRIPE_SECRET_KEY || "").includes("test");
  const dashboardUrl = paymentId
    ? `https://dashboard.stripe.com/${isTest ? "test/" : ""}payments/${paymentId}`
    : `https://dashboard.stripe.com/${isTest ? "test/" : ""}checkout/sessions/${full.id}`;

  return {
    lines:
      full.line_items?.data.map((li) => ({
        description: li.description || "Item",
        quantity: li.quantity || 1,
        amountPence: li.amount_total || 0,
      })) || [],
    shippingPence: full.shipping_cost
      ? full.shipping_cost.amount_total || 0
      : null,
    amountTotalPence: full.amount_total || 0,
    customerEmail: full.customer_details?.email || undefined,
    customerName: full.customer_details?.name || undefined,
    addressLines: shipToLines(full),
    dashboardUrl,
  };
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
  const order = orderFromSession(full);

  if (sellerTo) {
    const seller = buildSellerEmail(order);
    await sendResendEmail({
      apiKey,
      from,
      to: sellerTo,
      ...seller,
    });
  } else {
    console.warn("Skipping seller email — SALE_NOTIFY_EMAIL missing");
  }

  const customerEmail = order.customerEmail?.trim();
  if (customerEmail) {
    const customer = buildCustomerEmail(order);
    await sendResendEmail({
      apiKey,
      from,
      to: customerEmail,
      ...customer,
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
