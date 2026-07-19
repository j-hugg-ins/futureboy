import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";

const policies: Record<string, { title: string; body: ReactNode }> = {
  shipping: {
    title: "Shipping policy",
    body: (
      <>
        <p>
          Hats ship from the UK. Choose your shipping zone at checkout — the
          destination countries for that zone are locked in Stripe Checkout so
          the rate matches the address.
        </p>
        <h2>Rates</h2>
        <ul>
          <li>
            <strong>United Kingdom</strong> — free
          </li>
          <li>
            <strong>Europe</strong> — £10
          </li>
          <li>
            <strong>Rest of world</strong> — £20
          </li>
        </ul>
        <p>
          Dispatch times vary with how busy I am (this is a small hobby brand).
          You’ll get tracking when it’s available.
        </p>
      </>
    ),
  },
  refund: {
    title: "Refund policy",
    body: (
      <>
        <p>
          If something arrives damaged or wrong, get in touch via the{" "}
          <Link to="/contact">contact form</Link> with photos and I’ll sort a
          replacement or refund.
        </p>
        <p>
          Because hats are worn close to the head, unworn items in original
          condition may be returnable within 14 days of delivery — email first
          before sending anything back.
        </p>
      </>
    ),
  },
  privacy: {
    title: "Privacy policy",
    body: (
      <>
        <p>
          Futureboy collects the minimum needed to run the shop: contact form
          messages (via Netlify Forms) and order/payment details processed by
          Stripe.
        </p>
        <p>
          We don’t sell your data. Payment card details never touch our servers
          — they’re handled by Stripe Checkout.
        </p>
        <p>
          For questions about your data, use the{" "}
          <Link to="/contact">contact form</Link>.
        </p>
      </>
    ),
  },
  terms: {
    title: "Terms of service",
    body: (
      <>
        <p>
          By buying from Futureboy you agree that products are described in good
          faith, prices are in GBP, and shipping rates are as listed at
          checkout.
        </p>
        <p>
          Colours may vary slightly from photos depending on your screen.
          Availability can change; sold-out items stay listed but can’t be
          purchased until restocked.
        </p>
      </>
    ),
  },
};

export function PolicyPage() {
  const { slug = "" } = useParams();
  const policy = policies[slug];

  if (!policy) {
    return (
      <div className="container policy-page">
        <h1>Not found</h1>
        <Link to="/">Home</Link>
      </div>
    );
  }

  return (
    <div className="container policy-page">
      <h1>{policy.title}</h1>
      <div className="prose">{policy.body}</div>
    </div>
  );
}
