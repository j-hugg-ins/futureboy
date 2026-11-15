import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <ul className="footer-links">
          <li>
            <a
              className="link-tab"
              href="https://www.instagram.com/futureboy.uk"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          </li>
          <li>
            <Link className="link-tab" to="/policies/shipping">
              Shipping
            </Link>
          </li>
          <li>
            <Link className="link-tab" to="/policies/refund">
              Refunds
            </Link>
          </li>
          <li>
            <Link className="link-tab" to="/policies/privacy">
              Privacy
            </Link>
          </li>
          <li>
            <Link className="link-tab" to="/policies/terms">
              Terms
            </Link>
          </li>
        </ul>
        <p className="footer-copy">
          {__APP_VERSION__} © Futureboy {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
