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
      <p>Payment received. You will get a Stripe receipt by email shortly.</p>
      <p>I usually get orders out within 24 hours.</p>
      <p className="success-page__action">
        <Link to="/">Back to shop</Link>
      </p>
    </div>
  );
}
