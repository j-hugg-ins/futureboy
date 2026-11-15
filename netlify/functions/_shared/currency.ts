import Stripe from "stripe";
import {
  convertGbpPenceToMinor,
  defaultCurrencyFromCountry,
  formatMinorUnits,
  isPresentmentCurrency,
  normalizeRatesFromGbp,
  PRESENTMENT_CURRENCIES,
  type PresentmentCurrency,
} from "../../../src/lib/currency";

export {
  convertGbpPenceToMinor,
  defaultCurrencyFromCountry,
  formatMinorUnits,
  isPresentmentCurrency,
  PRESENTMENT_CURRENCIES,
};
export type { PresentmentCurrency };

type RatesCache = {
  at: number;
  ratesFromGbp: Record<string, number>;
};

const CACHE_TTL_MS = 5 * 60 * 1000;
let ratesCache: RatesCache | null = null;

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

async function ratesFromStripe(): Promise<Record<string, number>> {
  const stripe = getStripe();
  const exchange = await stripe.exchangeRates.retrieve("gbp");
  const ratesFromGbp: Record<string, number> = { gbp: 1 };

  for (const code of PRESENTMENT_CURRENCIES) {
    if (code === "gbp") continue;
    const rate = exchange.rates[code] ?? exchange.rates[code.toUpperCase()];
    if (!Number.isFinite(rate) || rate <= 0) {
      throw new Error(`Stripe FX missing rate for ${code}`);
    }
    ratesFromGbp[code] = rate as number;
  }

  return ratesFromGbp;
}

/** ECB daily rates via Frankfurter; same shape as Stripe (units per 1 GBP). */
async function ratesFromFrankfurter(): Promise<Record<string, number>> {
  const symbols = PRESENTMENT_CURRENCIES.filter((c) => c !== "gbp")
    .map((c) => c.toUpperCase())
    .join(",");
  const res = await fetch(
    `https://api.frankfurter.app/latest?from=GBP&to=${symbols}`,
  );
  if (!res.ok) {
    throw new Error(`Frankfurter FX failed: ${res.status}`);
  }
  const data = (await res.json()) as { rates?: Record<string, number> };
  const ratesFromGbp = normalizeRatesFromGbp(data.rates || {});
  for (const code of PRESENTMENT_CURRENCIES) {
    if (code === "gbp") continue;
    if (!Number.isFinite(ratesFromGbp[code]) || ratesFromGbp[code] <= 0) {
      throw new Error(`Frankfurter FX missing rate for ${code}`);
    }
  }
  return ratesFromGbp;
}

/**
 * FX: units of each currency per 1 GBP. Always includes gbp: 1.
 * Prefer Stripe Exchange Rates; fall back to Frankfurter so display and
 * Checkout stay convertible if Stripe FX is unavailable.
 */
export async function getRatesFromGbp(opts?: {
  forceRefresh?: boolean;
}): Promise<Record<string, number>> {
  const now = Date.now();
  if (
    !opts?.forceRefresh &&
    ratesCache &&
    now - ratesCache.at < CACHE_TTL_MS
  ) {
    return ratesCache.ratesFromGbp;
  }

  let ratesFromGbp: Record<string, number>;
  try {
    ratesFromGbp = await ratesFromStripe();
  } catch (err) {
    console.warn("Stripe FX unavailable, using Frankfurter", err);
    ratesFromGbp = await ratesFromFrankfurter();
  }

  ratesFromGbp = normalizeRatesFromGbp(ratesFromGbp);
  ratesCache = { at: now, ratesFromGbp };
  return ratesFromGbp;
}

export function parsePresentmentCurrency(
  value: string | null | undefined,
): PresentmentCurrency | null {
  const code = (value || "").trim().toLowerCase();
  return isPresentmentCurrency(code) ? code : null;
}
