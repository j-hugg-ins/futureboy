import currenciesData from "../data/currencies.json";

export type PresentmentCurrency = keyof typeof currenciesData.currencies;

export type CurrencyMeta = {
  code: PresentmentCurrency;
  label: string;
  symbol: string;
  zeroDecimal: boolean;
};

export const CURRENCY_CONFIG = currenciesData;
export const PRESENTMENT_CURRENCIES = Object.keys(
  currenciesData.currencies,
) as PresentmentCurrency[];

export function isPresentmentCurrency(
  value: string | null | undefined,
): value is PresentmentCurrency {
  return (
    !!value &&
    Object.prototype.hasOwnProperty.call(currenciesData.currencies, value)
  );
}

export function currencyMeta(code: PresentmentCurrency): CurrencyMeta {
  return currenciesData.currencies[code] as CurrencyMeta;
}

/** Map ISO country code to default presentment currency; fallback GBP. */
export function defaultCurrencyFromCountry(
  country: string | null | undefined,
): PresentmentCurrency {
  const code = (country || "").trim().toUpperCase();
  const mapped = (
    currenciesData.countryDefaults as Record<string, string>
  )[code];
  if (isPresentmentCurrency(mapped)) return mapped;
  return "gbp";
}

/**
 * Convert GBP pence (catalogue) to Stripe minor units in target currency.
 * JPY is zero-decimal (whole yen). Others use cents/pence equivalents.
 */
export function convertGbpPenceToMinor(
  penceGbp: number,
  currency: PresentmentCurrency,
  ratesFromGbp: Record<string, number>,
): number {
  const amount = Number(penceGbp);
  if (!Number.isFinite(amount)) return 0;
  if (currency === "gbp") return Math.round(amount);

  const rate =
    ratesFromGbp[currency] ??
    ratesFromGbp[currency.toUpperCase()] ??
    ratesFromGbp[currency.toLowerCase()];
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error(`Missing FX rate for ${currency}`);
  }

  const gbpMajor = amount / 100;
  const major = gbpMajor * rate;
  const meta = currencyMeta(currency);
  if (meta.zeroDecimal) return Math.round(major);
  return Math.round(major * 100);
}

/** True when rates payload can convert into the target currency. */
export function hasRateForCurrency(
  currency: PresentmentCurrency,
  ratesFromGbp: Record<string, number>,
): boolean {
  if (currency === "gbp") return true;
  const rate =
    ratesFromGbp[currency] ??
    ratesFromGbp[currency.toUpperCase()] ??
    ratesFromGbp[currency.toLowerCase()];
  return Number.isFinite(rate) && (rate as number) > 0;
}

/** Format catalogue GBP pence in a presentment currency using shared rates. */
export function formatCatalogueMoney(
  penceGbp: number,
  currency: PresentmentCurrency,
  ratesFromGbp: Record<string, number>,
  locale = "en-GB",
): string {
  const minor = convertGbpPenceToMinor(penceGbp, currency, ratesFromGbp);
  return formatMinorUnits(minor, currency, locale);
}

/** Lowercase currency keys so Stripe / ECB payloads merge cleanly. */
export function normalizeRatesFromGbp(
  rates: Record<string, number>,
): Record<string, number> {
  const out: Record<string, number> = { gbp: 1 };
  for (const [key, value] of Object.entries(rates)) {
    const code = key.toLowerCase();
    if (!Number.isFinite(value) || value <= 0) continue;
    out[code] = value;
  }
  return out;
}

/** Format amounts already in Stripe minor units for a currency. */
export function formatMinorUnits(
  minor: number,
  currency: string,
  locale = "en-GB",
): string {
  const code = currency.toLowerCase();
  const zeroDecimal =
    (isPresentmentCurrency(code) && currencyMeta(code).zeroDecimal) ||
    code === "jpy";
  const major = zeroDecimal ? minor : minor / 100;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code.toUpperCase(),
    maximumFractionDigits: zeroDecimal ? 0 : 2,
    minimumFractionDigits: zeroDecimal ? 0 : 2,
  }).format(major);
}
