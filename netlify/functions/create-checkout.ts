import type { Config, Context } from "@netlify/functions";
import Stripe from "stripe";
import products from "../../src/data/products.json";
import {
  convertGbpPenceToMinor,
  getRatesFromGbp,
  parsePresentmentCurrency,
  type PresentmentCurrency,
} from "./_shared/currency";
import { allAllowedCountries, allShippingOptions } from "./_shared/shipping";

type BasketLine = { handle: string; quantity: number };

/** Netlify reserves `URL`; prefer explicit PUBLIC_URL, then platform fallbacks. */
function siteOrigin() {
  return (
    process.env.PUBLIC_URL ||
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    "http://localhost:8888"
  );
}

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await req.json()) as {
      items?: BasketLine[];
      currency?: string;
    };

    const currency: PresentmentCurrency =
      parsePresentmentCurrency(body.currency) ?? "gbp";

    const items = body.items ?? [];
    if (!items.length) {
      return Response.json({ error: "Cart is empty" }, { status: 400 });
    }

    const ratesFromGbp = await getRatesFromGbp({ forceRefresh: true });
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const line of items) {
      const product = products.find((p) => p.handle === line.handle);
      if (!product) {
        return Response.json(
          { error: `Unknown product: ${line.handle}` },
          { status: 400 },
        );
      }
      if (!product.available) {
        return Response.json(
          { error: `${product.title} is sold out` },
          { status: 400 },
        );
      }
      const unitGbp = Math.floor(Number(product.pricePence));
      if (!Number.isFinite(unitGbp) || unitGbp < 1) {
        return Response.json(
          { error: `Invalid price for ${product.title}` },
          { status: 400 },
        );
      }
      const qty = Math.floor(Number(line.quantity));
      if (!Number.isFinite(qty) || qty < 1 || qty > 20) {
        return Response.json({ error: "Invalid quantity" }, { status: 400 });
      }

      const unitAmount = convertGbpPenceToMinor(unitGbp, currency, ratesFromGbp);
      if (!Number.isFinite(unitAmount) || unitAmount < 1) {
        return Response.json(
          { error: `Converted price too low for ${product.title}` },
          { status: 400 },
        );
      }

      line_items.push({
        quantity: qty,
        price_data: {
          currency,
          unit_amount: unitAmount,
          product_data: {
            name: product.title,
            images: product.images.slice(0, 1).map((path) => {
              const base = siteOrigin();
              return path.startsWith("http") ? path : `${base}${path}`;
            }),
            metadata: { sku: product.sku, handle: product.handle },
          },
        },
      });
    }

    const origin = siteOrigin();
    const countries = allAllowedCountries();
    const shipping_options = allShippingOptions().map((ship) => {
      const amount = convertGbpPenceToMinor(
        ship.amount,
        currency,
        ratesFromGbp,
      );
      return {
        shipping_rate_data: {
          type: "fixed_amount" as const,
          fixed_amount: { amount, currency },
          display_name: ship.label,
        },
      };
    });

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      shipping_address_collection: {
        allowed_countries:
          countries as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      shipping_options,
      metadata: {
        presentment_currency: currency,
        catalogue_base: "gbp",
      },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Checkout error" },
      { status: 500 },
    );
  }
};

export const config: Config = {
  path: "/api/create-checkout",
};
