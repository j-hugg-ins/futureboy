import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export function Header() {
  const { itemCount } = useCart();

  return (
    <header className="site-header site-header--solid">
      <nav className="nav-left" aria-label="Primary">
        <a
          href="https://www.instagram.com/futureboy.uk"
          target="_blank"
          rel="noreferrer"
        >
          Instagram
        </a>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <Link to="/" className="brand-logo" aria-label="Futureboy home">
        <img
          className="brand-logo__img brand-logo__img--on-light"
          src="/brand/logo.png"
          alt=""
          width={52}
          height={52}
        />
        <img
          className="brand-logo__img brand-logo__img--on-dark"
          src="/brand/logo-on-dark.png"
          alt=""
          width={52}
          height={52}
        />
      </Link>

      <div className="nav-right">
        <Link
          to="/cart"
          className="cart-link"
          aria-label={itemCount > 0 ? `Cart, ${itemCount} items` : "Cart"}
        >
          Cart
          {itemCount > 0 ? <span className="cart-count">({itemCount})</span> : null}
        </Link>
      </div>
    </header>
  );
}
