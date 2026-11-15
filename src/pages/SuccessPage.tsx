import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export function SuccessPage() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="container success-page">
      <h1>Thank you</h1>
      <p>
        Payment is in. Stripe should ping you a receipt by email shortly. I am
        usually packing within a day, so you should not be left hanging.
      </p>
      <p className="success-page__action">
        <Link to="/">Back to shop</Link>
      </p>
    </div>
  );
}
