import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export function SuccessPage() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="static-page">
      <div className="static-page__inner">
        <h1 className="static-page__title">Thank you</h1>
        <div className="static-page__prose">
          <p>
            Payment is in. Stripe should ping you a receipt by email shortly. I
            am usually packing within a day, so you should not be left hanging.
          </p>
          <p>
            <Link to="/">Back to shop</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
