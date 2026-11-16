import type Stripe from "stripe";
import fulfilment from "../../../src/data/fulfilment.json";
import products from "../../../src/data/products.json";
import {
  currencyMeta,
  isPresentmentCurrency,
} from "../../../src/lib/currency";
import { resolveSessionShipTo } from "./session-shipping";

const API_BASE = "https://api.parcel.royalmail.com/api/v1";

export type ClickAndDropResult =
  | {
      ok: true;
      orderIdentifier: number;
      orderReference: string;
      note: string;
    }
  | {
      ok: false;
      note: string;
    };

type ProductMeta = {
  handle?: string;
  sku?: string;
  title?: string;
};

function minorToMajor(minor: number, currency: string): number {
  const code = currency.toLowerCase();
  if (isPresentmentCurrency(code) && currencyMeta(code).zeroDecimal) {
    return Math.round(minor);
  }
  return Math.round(minor) / 100;
}

function truncate(value: string, max: number): string {
  return value.length <= max ? value : value.slice(0, max);
}

function orderReferenceFor(session: Stripe.Checkout.Session): string {
  const paymentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;
  if (paymentId) return truncate(paymentId, 40);
  return truncate(session.id, 40);
}

function resolveProduct(line: Stripe.LineItem): ProductMeta {
  const product = line.price?.product;
  if (product && typeof product !== "string" && !product.deleted) {
    const handle = product.metadata?.handle;
    const sku = product.metadata?.sku;
    const fromCatalogue = handle
      ? products.find((p) => p.handle === handle)
      : sku
        ? products.find((p) => p.sku === sku)
        : undefined;
    return {
      handle: handle || fromCatalogue?.handle,
      sku: sku || fromCatalogue?.sku,
      title: fromCatalogue?.title || product.name || line.description || "Item",
    };
  }

  const byTitle = products.find(
    (p) => p.title === line.description || p.title === line.price?.nickname,
  );
  return {
    handle: byTitle?.handle,
    sku: byTitle?.sku,
    title: byTitle?.title || line.description || "Item",
  };
}

function siteOrigin(): string {
  return (
    process.env.PUBLIC_URL ||
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    "https://futureboy.uk"
  ).replace(/\/$/, "");
}

export async function createClickAndDropOrder(
  session: Stripe.Checkout.Session,
): Promise<ClickAndDropResult> {
  const apiKey = process.env.CLICK_AND_DROP_API_KEY?.trim();
  if (!apiKey) {
    return {
      ok: false,
      note: "Click and Drop skipped: CLICK_AND_DROP_API_KEY is not set.",
    };
  }

  const shipTo = resolveSessionShipTo(session);
  if (!shipTo) {
    return {
      ok: false,
      note: "Click and Drop skipped: checkout session has no shipping address.",
    };
  }

  const currency = (session.currency || "gbp").toLowerCase();
  const lines = session.line_items?.data || [];
  if (!lines.length) {
    return {
      ok: false,
      note: "Click and Drop skipped: checkout session has no line items.",
    };
  }

  const contents = lines.map((line) => {
    const qty = Math.max(1, line.quantity || 1);
    const meta = resolveProduct(line);
    const lineTotal = line.amount_total ?? 0;
    const unitValue = minorToMajor(lineTotal / qty, currency);
    const productUrl = meta.handle
      ? `${siteOrigin()}/product/${meta.handle}`
      : undefined;

    return {
      name: truncate(meta.title || "Item", 800),
      quantity: qty,
      unitValue: Number(unitValue.toFixed(2)),
      unitWeightInGrams: fulfilment.weightGrams,
      customsDescription: truncate(fulfilment.customsDescription, 255),
      customsCode: fulfilment.customsCode,
      originCountryCode: fulfilment.originCountryCode,
      customsDeclarationCategory: fulfilment.customsDeclarationCategory,
      ...(productUrl ? { ContentsPieceURL: truncate(productUrl, 250) } : {}),
    };
  });

  const totalQty = contents.reduce((sum, item) => sum + item.quantity, 0);
  const weightInGrams = Math.max(
    1,
    fulfilment.weightGrams * Math.max(1, totalQty),
  );

  const goodsMinor = lines.reduce(
    (sum, line) => sum + (line.amount_total || 0),
    0,
  );
  const shippingMinor = session.shipping_cost?.amount_total ?? 0;
  const totalMinor = session.amount_total ?? goodsMinor + shippingMinor;

  const subtotal = minorToMajor(goodsMinor, currency);
  const shippingCostCharged = minorToMajor(shippingMinor, currency);
  const total = minorToMajor(totalMinor, currency);

  const orderReference = orderReferenceFor(session);
  const body = {
    items: [
      {
        orderReference,
        recipient: {
          address: {
            fullName: truncate(shipTo.name || "Customer", 210),
            addressLine1: truncate(shipTo.line1, 100),
            ...(shipTo.line2
              ? { addressLine2: truncate(shipTo.line2, 100) }
              : {}),
            city: truncate(shipTo.city, 100),
            ...(shipTo.state ? { county: truncate(shipTo.state, 100) } : {}),
            ...(shipTo.postal_code
              ? { postcode: truncate(shipTo.postal_code, 20) }
              : {}),
            countryCode: truncate(shipTo.country, 3),
          },
          ...(shipTo.email
            ? { emailAddress: truncate(shipTo.email, 254) }
            : {}),
          ...(shipTo.phone
            ? { phoneNumber: truncate(shipTo.phone, 25) }
            : {}),
        },
        packages: [
          {
            weightInGrams,
            packageFormatIdentifier: fulfilment.packageFormatIdentifier,
            contents,
          },
        ],
        orderDate: new Date(
          (session.created || Math.floor(Date.now() / 1000)) * 1000,
        ).toISOString(),
        subtotal: Number(subtotal.toFixed(2)),
        shippingCostCharged: Number(shippingCostCharged.toFixed(2)),
        total: Number(total.toFixed(2)),
        currencyCode: currency.toUpperCase(),
        deliveryTerm: fulfilment.deliveryTerm,
      },
    ],
  };

  let response: Response;
  try {
    response = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "network error";
    return {
      ok: false,
      note: `Click and Drop request failed: ${message}`,
    };
  }

  const rawText = await response.text();
  let payload: {
    successCount?: number;
    errorsCount?: number;
    createdOrders?: Array<{
      orderIdentifier?: number;
      orderReference?: string;
    }>;
    failedOrders?: Array<{
      orderReference?: string;
      errors?: Array<{ message?: string; errorCode?: string }>;
      code?: string;
      message?: string;
    }>;
    message?: string;
    title?: string;
  } = {};

  if (rawText) {
    try {
      payload = JSON.parse(rawText) as typeof payload;
    } catch {
      payload = {};
    }
  }

  if (!response.ok) {
    const failed = payload.failedOrders?.[0];
    const detail =
      failed?.errors?.map((e) => e.message || e.errorCode).filter(Boolean).join("; ") ||
      failed?.message ||
      payload.message ||
      payload.title ||
      rawText.slice(0, 240) ||
      response.statusText;
    return {
      ok: false,
      note: `Click and Drop HTTP ${response.status}: ${detail}`,
    };
  }

  if ((payload.errorsCount || 0) > 0 || !payload.createdOrders?.length) {
    const failed = payload.failedOrders?.[0];
    const detail =
      failed?.errors?.map((e) => e.message || e.errorCode).filter(Boolean).join("; ") ||
      failed?.message ||
      "order was not created";
    return {
      ok: false,
      note: `Click and Drop rejected order: ${detail}`,
    };
  }

  const created = payload.createdOrders[0];
  const orderIdentifier = created.orderIdentifier;
  if (orderIdentifier == null) {
    return {
      ok: false,
      note: "Click and Drop response missing orderIdentifier.",
    };
  }

  return {
    ok: true,
    orderIdentifier,
    orderReference: created.orderReference || orderReference,
    note: `Click and Drop order ${orderIdentifier} created. Print the label in the portal.`,
  };
}
