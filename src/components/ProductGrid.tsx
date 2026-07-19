import { ProductCard } from "./ProductCard";
import { allProducts } from "../lib/products";

export function ProductGrid() {
  return (
    <div className="product-grid">
      {allProducts.map((product) => (
        <ProductCard key={product.handle} product={product} />
      ))}
    </div>
  );
}
