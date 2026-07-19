export type ShippingZone = "uk" | "europe" | "row";

export type Accordion = {
  id: string;
  title: string;
  body: string;
};

export type Product = {
  id: string;
  handle: string;
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

export const SHIPPING = {
  uk: {
    id: "uk",
    label: "United Kingdom",
    amountPence: 0,
  },
  europe: {
    id: "europe",
    label: "Europe",
    amountPence: 1000,
  },
  row: {
    id: "row",
    label: "Rest of world",
    amountPence: 2000,
  },
} as const;

export const PRICE_PENCE = 4500;

export function formatGBP(pence: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(pence / 100);
}
