import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";
import { SHIPPING, type ShippingZone } from "../lib/types";

export function PolicyPage() {
  const { slug = "" } = useParams();
  const { currency, formatMoney } = useCurrency();

  const shippingRatesTable = (
    <table className="rates-table" key={currency}>
      <tbody>
        {(Object.keys(SHIPPING) as ShippingZone[]).map((zone) => {
          const { label, amountPence } = SHIPPING[zone];
          return (
            <tr key={`${zone}-${currency}`}>
              <td>{label}</td>
              <td>
                {amountPence === 0 ? "Free" : formatMoney(amountPence)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const policies: Record<string, { title: string; body: ReactNode }> = {
    shipping: {
      title: "Shipping",
      body: (
        <>
          <p>
            I ship everything from the UK. I usually get orders out within 24
            hours, and I will send tracking when I have it.
          </p>
          <p>
            Your cart may show an estimate based on where you are. I lock in the
            exact rate at checkout once your address is set. The rates below
            follow the currency you have selected (I set shop prices in GBP).
          </p>
          <h2>Rates</h2>
          {shippingRatesTable}
          <p>
            Amounts are estimates at current exchange rates. The exact value is
            calculated at checkout.
          </p>
        </>
      ),
    },
    refund: {
      title: "Refunds",
      body: (
        <>
          <p>
            If something arrives damaged or wrong, drop me a line via the{" "}
            <Link to="/contact">contact form</Link> with a couple of photos and
            I will sort a replacement or refund.
          </p>
          <p>
            I take returns on unworn items in original condition within 14 days
            of delivery. Please message me first before posting anything back.
          </p>
        </>
      ),
    },
    privacy: {
      title: "Privacy",
      body: (
        <>
          <p>
            I only keep what I need to run the shop: messages you send through
            the contact form, and the order details Stripe needs to take
            payment.
          </p>
          <p>
            I do not sell your data. Your card details never touch my servers;
            Stripe handles checkout.
          </p>
          <p>
            Questions about your data? Use the{" "}
            <Link to="/contact">contact form</Link> and I will help.
          </p>
        </>
      ),
    },
    terms: {
      title: "Terms",
      body: (
        <>
          <p>
            When you order from me, you are buying as described on the site. I
            set prices in GBP. You can browse and pay in GBP, EUR, USD, CAD, or
            JPY with the currency switcher; checkout charges the converted total
            in the currency you pick. Shipping is whatever rate applies to your
            address at checkout.
          </p>
          <p>
            Colours can look a bit different depending on your screen. Stock
            moves; if something is sold out I leave it listed but you cannot buy
            it until it is back.
          </p>
        </>
      ),
    },
  };

  const policy = policies[slug];

  if (!policy) {
    return (
      <div className="static-page">
        <div className="static-page__inner">
          <h1 className="static-page__title">Not found</h1>
          <p className="static-page__copy">
            <Link to="/">Home</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="static-page">
      <div className="static-page__inner">
        <h1 className="static-page__title">{policy.title}</h1>
        <div className="static-page__prose">{policy.body}</div>
      </div>
    </div>
  );
}
