import type { Config, Context } from "@netlify/functions";
import Stripe from "stripe";
import products from "../../src/data/products.json";
import {
  EUROPE_COUNTRIES,
  PRICE_PENCE,
  ROW_COUNTRIES,
  type ShippingZone,
} from "./_shared/shipping";

type BasketLine = { handle: string; quantity: number };

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

function shippingFor(zone: ShippingZone) {
  if (zone === "uk") {
    return {
      label: "UK shipping",
      amount: 0,
      countries: ["GB"],
    };
  }
  if (zone === "europe") {
    return {
      label: "Europe shipping",
      amount: 1000,
      countries: [...EUROPE_COUNTRIES],
    };
  }
  return {
    label: "International shipping",
    amount: 2000,
    countries: [...ROW_COUNTRIES],
  };
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
      shippingZone?: ShippingZone;
    };

    const zone = body.shippingZone;
    if (zone !== "uk" && zone !== "europe" && zone !== "row") {
      return Response.json({ error: "Invalid shipping zone" }, { status: 400 });
    }

    const items = body.items ?? [];
    if (!items.length) {
      return Response.json({ error: "Cart is empty" }, { status: 400 });
    }

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
      const qty = Math.floor(Number(line.quantity));
      if (!Number.isFinite(qty) || qty < 1 || qty > 20) {
        return Response.json({ error: "Invalid quantity" }, { status: 400 });
      }

      line_items.push({
        quantity: qty,
        price_data: {
          currency: "gbp",
          unit_amount: PRICE_PENCE,
          product_data: {
            name: product.title,
            images: product.images.slice(0, 1).map((path) => {
              const base = process.env.URL || process.env.DEPLOY_PRIME_URL || "";
              return path.startsWith("http") ? path : `${base}${path}`;
            }),
            metadata: { sku: product.sku, handle: product.handle },
          },
        },
      });
    }

    const ship = shippingFor(zone);
    const origin = process.env.URL || process.env.DEPLOY_PRIME_URL || "http://localhost:8888";

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      shipping_address_collection: {
        allowed_countries: ship.countries as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: ship.amount, currency: "gbp" },
            display_name: ship.label,
          },
        },
      ],
      metadata: {
        shippingZone: zone,
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
