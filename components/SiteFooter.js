import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner footer-grid">
        <section>
          <h3 className="footer-title">Da Essence</h3>
          <p className="footer-copy">
            Organic African skincare made with authentic ingredients and trusted product quality for daily glow and confidence.
          </p>
        </section>

        <section>
          <h3 className="footer-title">Contact Us</h3>
          <ul className="footer-list">
            <li>Ghana: +233 599 053 695</li>
            <li>Ghana: +233 208 466 039</li>
            <li>Nigeria: +234 703 313 6328</li>
            <li>
              <a href="mailto:daessenceorganic@gmail.com">daessenceorganic@gmail.com</a>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="footer-title">Information</h3>
          <ul className="footer-list footer-links">
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
            <li>
              <Link href="/products">Products</Link>
            </li>
            <li>
              <Link href="/policies">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/about/entrepreneurship-training">Entrepreneurship Training</Link>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="footer-title">Categories</h3>
          <ul className="footer-list footer-links">
            <li>
              <Link href="/products">Shower Gel</Link>
            </li>
            <li>
              <Link href="/products">Bar Soap</Link>
            </li>
            <li>
              <Link href="/products">New Products</Link>
            </li>
            <li>
              <Link href="/products">Paste</Link>
            </li>
          </ul>
        </section>
      </div>

      <div className="container footer-bottom">
        <p>Copyright © 2026 Organic African Soap with aloe vera | Da Essence</p>
      </div>
    </footer>
  );
}
