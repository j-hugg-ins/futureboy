import { Link } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";
import type { Product } from "../lib/types";

export function ProductCard({ product }: { product: Product }) {
  const { formatMoney } = useCurrency();

  return (
    <Link to={`/product/${product.handle}`} className="product-card">
      <div className="product-card__media">
        <img src={product.images[0]} alt={product.title} loading="lazy" />
        {!product.available ? <span className="sold-out-badge">Sold out</span> : null}
      </div>
      <div className="product-card__meta">
        <span className="product-card__title">
          <span className="product-card__style">{product.style}</span>
          <span className="product-card__name">{product.name}</span>
        </span>
        <span className="product-card__price">
          {formatMoney(product.pricePence)}
        </span>
      </div>
    </Link>
  );
}
