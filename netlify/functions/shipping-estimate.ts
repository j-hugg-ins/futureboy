import type { Config, Context } from "@netlify/functions";
import { expectedShippingPence } from "./_shared/shipping";

export default async (_req: Request, context: Context) => {
  const country = context.geo?.country?.code ?? null;

  if (!country) {
    return Response.json({
      country: null,
      zone: null,
      label: null,
      amountPence: null,
    });
  }

  const estimate = expectedShippingPence(country);
  return Response.json({
    country,
    zone: estimate.zone,
    label: estimate.label,
    amountPence: estimate.amountPence,
  });
};

export const config: Config = {
  path: "/api/shipping-estimate",
};
