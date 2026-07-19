import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <ul className="footer-links">
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
        <p className="footer-copy">© {new Date().getFullYear()} Futureboy</p>
      </div>
    </footer>
  );
}
