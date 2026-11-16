import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CurrencySwitcher } from "./CurrencySwitcher";

export function Header() {
  const { itemCount } = useCart();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header
      className={
        menuOpen
          ? "site-header site-header--solid is-menu-open"
          : "site-header site-header--solid"
      }
    >
      <div className="nav-left">
        <button
          ref={toggleRef}
          type="button"
          className="nav-menu-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="nav-menu-toggle__bars" aria-hidden>
            <span />
            <span />
            <span />
          </span>
        </button>

        <nav className="nav-primary" aria-label="Primary">
          <Link to="/">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>

      <Link to="/" className="brand-logo" aria-label="Futureboy home">
        <img
          className="brand-logo__img brand-logo__img--on-light"
          src="/brand/futureboy-logo-light-reg.svg"
          alt=""
          width={52}
          height={52}
        />
        <img
          className="brand-logo__img brand-logo__img--on-dark"
          src="/brand/futureboy-logo-dark-reg.svg"
          alt=""
          width={52}
          height={52}
        />
      </Link>

      <div className="nav-right">
        <div className="nav-tools">
          <CurrencySwitcher />
        </div>
        <Link
          to="/cart"
          className="cart-link"
          aria-label={itemCount > 0 ? `Cart, ${itemCount} items` : "Cart"}
        >
          Cart
          {itemCount > 0 ? (
            <span className="cart-count">[{itemCount}]</span>
          ) : null}
        </Link>
      </div>

      <div
        id={menuId}
        className={menuOpen ? "nav-panel is-open" : "nav-panel"}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <nav className="nav-panel__primary" aria-label="Primary">
          <Link to="/" onClick={closeMenu}>
            Shop
          </Link>
          <Link to="/about" onClick={closeMenu}>
            About
          </Link>
          <Link to="/contact" onClick={closeMenu}>
            Contact
          </Link>
        </nav>

        <div className="nav-panel__currency">
          <CurrencySwitcher />
        </div>

        <nav className="nav-panel__secondary" aria-label="Policies">
          <a
            href="https://www.instagram.com/futureboy.uk"
            target="_blank"
            rel="noreferrer"
            onClick={closeMenu}
          >
            Instagram
          </a>
          <Link to="/policies/shipping" onClick={closeMenu}>
            Shipping
          </Link>
          <Link to="/policies/refund" onClick={closeMenu}>
            Refunds
          </Link>
          <Link to="/policies/privacy" onClick={closeMenu}>
            Privacy
          </Link>
          <Link to="/policies/terms" onClick={closeMenu}>
            Terms
          </Link>
        </nav>
      </div>
    </header>
  );
}
