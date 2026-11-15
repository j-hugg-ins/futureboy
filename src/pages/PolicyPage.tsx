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
            Everything goes out from the UK. I am usually packing within a day,
            and I will pass on tracking once the label exists. I am not a giant
            warehouse, so if something slips a bit, bear with me.
          </p>
          <p>
            The cart tries to guess shipping from where you seem to be. The real
            rate lands at checkout when you put your address in. The table below
            follows whatever currency you have picked on the site; I still price
            the shop in GBP underneath.
          </p>
          <h2>Rates</h2>
          {shippingRatesTable}
          <p>
            Those converted amounts can wander a little with the exchange rate.
            Checkout has the final say.
          </p>
        </>
      ),
    },
    refund: {
      title: "Refunds",
      body: (
        <>
          <p>
            If it turns up smashed, wrong, or somehow not what you ordered, tell
            me via the <Link to="/contact">contact form</Link> and send a couple
            of photos. I will sort a replacement or a refund without making you
            write an essay.
          </p>
          <p>
            Unworn stuff in the same nick it left in can come back within 14 days
            of delivery. Message me first though; do not just post a hat into the
            void and hope for the best.
          </p>
        </>
      ),
    },
    privacy: {
      title: "Privacy",
      body: (
        <>
          <p>
            I am not collecting a dossier on you. I keep contact-form messages,
            and whatever order bits Stripe needs so the payment actually works.
            That is about it.
          </p>
          <p>
            I do not sell your data, and I have no interest in trying. Your card
            never hits my servers; Stripe runs checkout.
          </p>
          <p>
            If you want to know what I hold, or want it gone, use the{" "}
            <Link to="/contact">contact form</Link> and I will sort it.
          </p>
        </>
      ),
    },
    terms: {
      title: "Terms",
      body: (
        <>
          <p>
            Order from me and you are buying the thing as it is described here,
            not a fantasy version of it. Prices live in GBP. You can poke around
            and pay in GBP, EUR, USD, CAD, or JPY with the switcher; checkout
            charges the converted total in whatever you picked. Shipping is the
            rate that matches your address when you check out.
          </p>
          <p>
            Screens lie a little about colour, so treat photos as a guide rather
            than gospel. Stock is pretty limited as I only produce small batch
            runs. I will re-stock from time to time but never sure when so
            basically, if you like something, snag it! :)
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
