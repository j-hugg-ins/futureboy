import shippingData from "../data/shipping.json";

export type ShippingZone = "uk" | "europe" | "row";

export type Accordion = {
  id: string;
  title: string;
  body: string;
};

export type Product = {
  id: string;
  handle: string;
  style: string;
  name: string;
  title: string;
  subtitle: string;
  sku: string;
  pricePence: number;
  available: boolean;
  description: string;
  descriptionHtml: string;
  accordions: Accordion[];
  images: string[];
};

export type CartItem = {
  handle: string;
  quantity: number;
};

export const SHIPPING = shippingData;

/** @deprecated Prefer useCurrency().formatMoney for presentment currency. */
export function formatGBP(pence: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(pence / 100);
}

/** Shared PDP accordion; amounts come from `src/data/shipping.json`. */
export function shippingAccordion(
  formatMoney: (penceGbp: number) => string = formatGBP,
  currency = "gbp",
): Accordion {
  const rates = (Object.keys(SHIPPING) as ShippingZone[])
    .map((zone) => {
      const { label, amountPence } = SHIPPING[zone];
      const amount = amountPence === 0 ? "Free" : formatMoney(amountPence);
      return `${label}: ${amount}`;
    })
    .join("\n");

  return {
    id: `shipping-${currency}`,
    title: "Shipping",
    body: `${rates}\n\nUsually ships within 24 hours. Final rate is set at checkout when your address is confirmed.`,
  };
}
