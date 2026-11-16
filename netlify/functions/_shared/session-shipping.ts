import type Stripe from "stripe";

export type SessionShipTo = {
  name?: string;
  email?: string;
  phone?: string;
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postal_code?: string | null;
  country: string;
};

type LooseAddress = {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
};

type LooseShipping = {
  name?: string | null;
  address?: LooseAddress | null;
};

/**
 * Prefer Checkout shipping collection (Link / quick pay included), then legacy
 * shipping_details, then customer_details.address.
 */
export function resolveSessionShipTo(
  session: Stripe.Checkout.Session,
): SessionShipTo | null {
  const customer = session.customer_details;
  const collected = (
    session as Stripe.Checkout.Session & {
      collected_information?: { shipping_details?: LooseShipping | null } | null;
    }
  ).collected_information?.shipping_details;

  const legacy = (
    session as Stripe.Checkout.Session & {
      shipping_details?: LooseShipping | null;
    }
  ).shipping_details;

  const candidates: Array<{
    name?: string | null;
    address?: LooseAddress | null;
  }> = [
    collected || {},
    legacy || {},
    {
      name: customer?.name,
      address: customer?.address || null,
    },
  ];

  for (const candidate of candidates) {
    const address = candidate.address;
    const line1 = address?.line1?.trim();
    const country = address?.country?.trim();
    if (!line1 || !country) continue;

    const city =
      address.city?.trim() ||
      address.state?.trim() ||
      address.postal_code?.trim();
    if (!city) continue;

    return {
      name: candidate.name?.trim() || customer?.name?.trim() || undefined,
      email: customer?.email?.trim() || undefined,
      phone: customer?.phone?.trim() || undefined,
      line1,
      line2: address.line2?.trim() || null,
      city,
      state: address.state?.trim() || null,
      postal_code: address.postal_code?.trim() || null,
      country: country.toUpperCase(),
    };
  }

  return null;
}

export function shipToLinesFromSession(
  session: Stripe.Checkout.Session,
): string[] {
  const shipTo = resolveSessionShipTo(session);
  if (!shipTo) {
    const fallback = session.customer_details;
    const address = fallback?.address;
    if (!address) return ["No address"];
    return [
      fallback?.name,
      address.line1,
      address.line2,
      [address.city, address.postal_code].filter(Boolean).join(" "),
      address.country,
    ].filter(Boolean) as string[];
  }

  return [
    shipTo.name,
    shipTo.line1,
    shipTo.line2,
    [shipTo.city, shipTo.postal_code].filter(Boolean).join(" "),
    shipTo.country,
  ].filter(Boolean) as string[];
}

export function shippingCountryFromSession(
  session: Stripe.Checkout.Session,
): string | null {
  return resolveSessionShipTo(session)?.country || null;
}
