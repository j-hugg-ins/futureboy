import type { Config, Context } from "@netlify/functions";
import {
  buildCustomerEmail,
  buildSellerEmail,
  sampleOrder,
  sendResendEmail,
} from "./_shared/order-emails";

type PreviewKind = "one" | "two" | "seller" | "all";

function authorised(req: Request) {
  const expected = process.env.EMAIL_PREVIEW_SECRET;
  if (!expected) return false;

  const header =
    req.headers.get("x-email-preview-secret") ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    "";

  return header.length > 0 && header === expected;
}

function parseKind(req: Request): PreviewKind {
  const url = new URL(req.url);
  const raw = (url.searchParams.get("kind") || "all").toLowerCase();
  if (raw === "one" || raw === "two" || raw === "seller" || raw === "all") {
    return raw;
  }
  return "all";
}

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!process.env.EMAIL_PREVIEW_SECRET) {
    return new Response("EMAIL_PREVIEW_SECRET not configured", { status: 503 });
  }

  if (!authorised(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.SALE_NOTIFY_EMAIL;
  const from =
    process.env.SALE_NOTIFY_FROM || "Futureboy <onboarding@resend.dev>";

  if (!apiKey) {
    return new Response("RESEND_API_KEY missing", { status: 500 });
  }
  if (!to) {
    return new Response("SALE_NOTIFY_EMAIL missing", { status: 500 });
  }

  const kind = parseKind(req);
  const sent: string[] = [];

  try {
    if (kind === "seller" || kind === "all") {
      const seller = buildSellerEmail(sampleOrder("one"));
      await sendResendEmail({
        apiKey,
        from,
        to,
        subject: `[preview] ${seller.subject}`,
        html: seller.html,
        text: seller.text,
      });
      sent.push("seller");
    }

    if (kind === "one" || kind === "all") {
      const one = buildCustomerEmail(sampleOrder("one"));
      await sendResendEmail({
        apiKey,
        from,
        to,
        subject: `[preview] ${one.subject}`,
        html: one.html,
        text: one.text,
      });
      sent.push("customer-one");
    }

    if (kind === "two" || kind === "all") {
      const two = buildCustomerEmail(sampleOrder("two"));
      await sendResendEmail({
        apiKey,
        from,
        to,
        subject: `[preview] ${two.subject}`,
        html: two.html,
        text: two.text,
      });
      sent.push("customer-two");
    }
  } catch (err) {
    console.error("Email preview failed", err);
    return new Response(
      err instanceof Error ? err.message : "Email preview failed",
      { status: 500 },
    );
  }

  return Response.json({ ok: true, to, sent });
};

export const config: Config = {
  path: "/api/email-preview",
};
