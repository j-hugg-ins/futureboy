import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { getProduct } from "../lib/products";

const iconStroke = 1.5;

type ShippingEstimate = {
  country: string | null;
  zone: string | null;
  label: string | null;
  amountPence: number | null;
};

export function CartPage() {
  const { items, setQuantity, removeItem, subtotalPence } = useCart();
  const { currency, formatMoney } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estimate, setEstimate] = useState<ShippingEstimate | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/shipping-estimate")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: ShippingEstimate | null) => {
        if (!cancelled) setEstimate(data);
      })
      .catch(() => {
        if (!cancelled) setEstimate(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const hasEstimate =
    estimate != null &&
    estimate.amountPence != null &&
    Number.isFinite(estimate.amountPence);

  const shippingPence = hasEstimate ? (estimate.amountPence as number) : null;
  const total =
    shippingPence != null ? subtotalPence + shippingPence : subtotalPence;

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency,
          items: items.map((i) => ({ handle: i.handle, quantity: i.quantity })),
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

  const shippingAmount = hasEstimate
    ? shippingPence === 0
      ? "Free"
      : formatMoney(shippingPence as number)
    : "TBC";

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
                <p className="cart-row__price">
                  {formatMoney(product.pricePence)}
                </p>
              </div>
              <div className="qty">
                <button
                  type="button"
                  className="btn btn--icon"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity(item.handle, item.quantity - 1)}
                >
                  <Minus size={14} strokeWidth={iconStroke} aria-hidden />
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  className="btn btn--icon"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity(item.handle, item.quantity + 1)}
                >
                  <Plus size={14} strokeWidth={iconStroke} aria-hidden />
                </button>
              </div>
              <p className="cart-row__line">
                {formatMoney(product.pricePence * item.quantity)}
              </p>
              <button
                type="button"
                className="btn btn--icon"
                aria-label="Remove from cart"
                onClick={() => removeItem(item.handle)}
              >
                <Trash2 size={14} strokeWidth={iconStroke} aria-hidden />
              </button>
            </li>
          );
        })}
      </ul>

      <div className="cart-summary">
        <dl className="cart-totals">
          <dt>Subtotal</dt>
          <dd>{formatMoney(subtotalPence)}</dd>
          <dt>Shipping</dt>
          <dd>
            {shippingAmount}
            <a
              href="#shipping-note"
              className="cart-shipping-asterisk"
              aria-label="Shipping estimate note"
            >
              *
            </a>
          </dd>
          <dt>Total</dt>
          <dd>
            {hasEstimate ? formatMoney(total) : formatMoney(subtotalPence)}
          </dd>
        </dl>

        <p id="shipping-note" className="cart-shipping-note">
          *{" "}
          {hasEstimate && estimate?.label
            ? `Estimate for your location (${estimate.label}). Exact rate confirms at checkout with your address.`
            : "Estimate where we can. Exact rate confirms at checkout with your address."}
        </p>

        <button
          type="button"
          className="btn"
          disabled={loading}
          onClick={checkout}
        >
          {loading ? "Redirecting…" : "Checkout"}
        </button>
        {error ? <p className="error">{error}</p> : null}
      </div>
    </div>
  );
}
