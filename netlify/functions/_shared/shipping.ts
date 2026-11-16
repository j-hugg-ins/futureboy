import shippingRates from "../../../src/data/shipping.json";

export type ShippingZone = "uk" | "europe" | "row";

export const EUROPE_COUNTRIES = [
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "IS",
  "LI",
  "NO",
  "CH",
  "MC",
  "AD",
  "SM",
  "VA",
] as const;

/** Broad Stripe-supported set minus GB and Europe tier. */
export const ROW_COUNTRIES = [
  "US",
  "CA",
  "AU",
  "NZ",
  "JP",
  "KR",
  "SG",
  "HK",
  "TW",
  "MX",
  "BR",
  "AR",
  "CL",
  "CO",
  "PE",
  "ZA",
  "AE",
  "SA",
  "IL",
  "IN",
  "TH",
  "MY",
  "ID",
  "PH",
  "VN",
  "TR",
  "UA",
  "RS",
  "BA",
  "MK",
  "AL",
  "MD",
  "GE",
  "AM",
  "AZ",
  "KZ",
  "CN",
  "MO",
  "PR",
  "GU",
  "BM",
  "KY",
  "GI",
  "IM",
  "JE",
  "GG",
  "FO",
  "GL",
  "AW",
  "CW",
  "SX",
  "BQ",
  "TT",
  "BB",
  "JM",
  "BS",
  "DO",
  "CR",
  "PA",
  "UY",
  "PY",
  "EC",
  "BO",
  "CR",
  "EG",
  "MA",
  "TN",
  "NG",
  "KE",
  "GH",
  "MU",
  "SC",
  "QA",
  "KW",
  "BH",
  "OM",
  "JO",
  "LB",
  "PK",
  "BD",
  "LK",
  "NP",
  "FJ",
  "PG",
  "NC",
  "PF",
  "WS",
  "TO",
  "VU",
] as const;

const EUROPE_SET = new Set<string>(EUROPE_COUNTRIES);

export function zoneFromCountry(
  country: string | null | undefined,
): ShippingZone {
  const code = (country || "").trim().toUpperCase();
  if (code === "GB") return "uk";
  if (EUROPE_SET.has(code)) return "europe";
  return "row";
}

export function rateForZone(zone: ShippingZone) {
  return shippingRates[zone];
}

export function expectedShippingPence(country: string | null | undefined) {
  const zone = zoneFromCountry(country);
  return {
    zone,
    amountPence: shippingRates[zone].amountPence,
    label: shippingRates[zone].label,
  };
}

/** Deduped Stripe allowed-country list for all zones. */
export function allAllowedCountries(): string[] {
  return [...new Set(["GB", ...EUROPE_COUNTRIES, ...ROW_COUNTRIES])];
}

export function allShippingOptions() {
  return (Object.keys(shippingRates) as ShippingZone[]).map((zone) => {
    const rate = shippingRates[zone];
    return {
      zone,
      label: `${rate.label} shipping`,
      amount: rate.amountPence,
    };
  });
}
