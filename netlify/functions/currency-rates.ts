import type { Config, Context } from "@netlify/functions";
import {
  defaultCurrencyFromCountry,
  getRatesFromGbp,
  PRESENTMENT_CURRENCIES,
} from "./_shared/currency";

export default async (_req: Request, context: Context) => {
  try {
    const country = context.geo?.country?.code ?? null;
    const ratesFromGbp = await getRatesFromGbp();
    return Response.json({
      country,
      defaultCurrency: defaultCurrencyFromCountry(country),
      currencies: PRESENTMENT_CURRENCIES,
      ratesFromGbp,
      asOf: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return Response.json(
      {
        error: err instanceof Error ? err.message : "Currency rates unavailable",
      },
      { status: 500 },
    );
  }
};

export const config: Config = {
  path: "/api/currency-rates",
};
