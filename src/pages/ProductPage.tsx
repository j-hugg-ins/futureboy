import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { getProduct, relatedProducts } from "../lib/products";
import { formatGBP } from "../lib/types";

export function ProductPage() {
  const { handle = "" } = useParams();
  const product = getProduct(handle);
  const { addItem } = useCart();
  const [active, setActive] = useState(0);
  const [added, setAdded] = useState(false);
  const related = useMemo(() => relatedProducts(handle), [handle]);

  if (!product) {
    return (
      <div className="container cart-page">
        <h1>Not found</h1>
        <p className="empty">That hat isn’t here.</p>
        <Link to="/shop">Back to shop</Link>
      </div>
    );
  }

  const image = product.images[active] || product.images[0];

  return (
    <>
      <div className="container pdp">
        <div className="pdp-gallery">
          <div className="pdp-gallery__main">
            <img key={image} src={image} alt={product.title} />
          </div>
          <div className="pdp-thumbs">
            {product.images.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`View image ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => setActive(i)}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="pdp-info">
          <div className="pdp-buy">
            <div className="pdp-meta">
              <h1>{product.title}</h1>
              <p className="pdp-price">{formatGBP(product.pricePence)}</p>
            </div>

            <button
              type="button"
              className="btn"
              disabled={!product.available}
              onClick={() => {
                addItem(product.handle);
                setAdded(true);
              }}
            >
              {!product.available ? "Sold out" : added ? "Added to cart" : "Add to cart"}
            </button>

            <p className="pdp-note">Shipping calculated at checkout by destination.</p>
          </div>

          <p className="pdp-desc">{product.description}</p>

          <div className="accordion">
            {product.accordions.map((item) => (
              <details key={item.id} className="accordion-item">
                <summary>
                  <span>{item.title}</span>
                  <span className="accordion-item__icon" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div className="accordion-item__panel">
                  <p>{item.body}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      <section className="container related">
        <h2>You might also like these</h2>
        <div className="product-grid">
          {related.map((p) => (
            <ProductCard key={p.handle} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
