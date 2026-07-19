import { Link } from "react-router-dom";
import type { Product } from "../lib/types";
import { formatGBP } from "../lib/types";

export function ProductCard({ product }: { product: Product }) {
  const label = product.title.replace(" — ", " · ");

  return (
    <Link to={`/product/${product.handle}`} className="product-card">
      <div className="product-card__media">
        <img src={product.images[0]} alt={product.title} loading="lazy" />
        {!product.available ? <span className="sold-out-badge">Sold out</span> : null}
      </div>
      <div className="product-card__meta">
        <span className="product-card__name">{label}</span>
        <span className="product-card__price">{formatGBP(product.pricePence)}</span>
      </div>
    </Link>
  );
}
