import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProduct } from "../lib/products";
import { SHIPPING, formatGBP, type ShippingZone } from "../lib/types";

export function CartPage() {
  const {
    items,
    shippingZone,
    setShippingZone,
    setQuantity,
    removeItem,
    subtotalPence,
  } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = SHIPPING[shippingZone];
  const total = subtotalPence + shipping.amountPence;

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ handle: i.handle, quantity: i.quantity })),
          shippingZone,
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout");
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container cart-page">
        <h1>Cart</h1>
        <p className="empty">Your cart is empty.</p>
        <Link to="/">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1>Cart</h1>
      <ul className="cart-list">
        {items.map((item) => {
          const product = getProduct(item.handle);
          if (!product) return null;
          return (
            <li key={item.handle} className="cart-row">
              <Link to={`/product/${product.handle}`} className="cart-row__thumb">
                <img src={product.images[0]} alt="" />
              </Link>
              <div className="cart-row__info">
                <h2>
                  <Link to={`/product/${product.handle}`}>{product.title}</Link>
                </h2>
                <p className="cart-row__price">{formatGBP(product.pricePence)}</p>
                <div className="qty">
                  <button
                    type="button"
                    className="btn"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity(item.handle, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    className="btn"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity(item.handle, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => removeItem(item.handle)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className="cart-row__line">
                {formatGBP(product.pricePence * item.quantity)}
              </p>
            </li>
          );
        })}
      </ul>

      <div className="cart-summary">
        <p className="cart-summary__label">Shipping destination</p>
        <div
          className="shipping-options"
          role="radiogroup"
          aria-label="Shipping zone"
        >
          {(Object.keys(SHIPPING) as ShippingZone[]).map((zone) => (
            <label key={zone} className="shipping-option">
              <span>
                <input
                  type="radio"
                  name="shipping"
                  checked={shippingZone === zone}
                  onChange={() => setShippingZone(zone)}
                />
                {SHIPPING[zone].label}
              </span>
              <span>
                {SHIPPING[zone].amountPence === 0
                  ? "Free"
                  : formatGBP(SHIPPING[zone].amountPence)}
              </span>
            </label>
          ))}
        </div>

        <dl className="cart-totals">
          <dt>Subtotal</dt>
          <dd>{formatGBP(subtotalPence)}</dd>
          <dt>Shipping</dt>
          <dd>
            {shipping.amountPence === 0
              ? "Free"
              : formatGBP(shipping.amountPence)}
          </dd>
          <dt>Total</dt>
          <dd>{formatGBP(total)}</dd>
        </dl>

        <button
          type="button"
          className="btn"
          disabled={loading}
          onClick={checkout}
        >
          {loading ? "Redirecting…" : "Checkout with Stripe"}
        </button>
        {error ? <p className="error">{error}</p> : null}
      </div>
    </div>
  );
}
