import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <section>
          <h3 className="footer-title">Da Essence</h3>
          <p className="footer-copy">
            Organic African skincare made with authentic ingredients, gentle aloe vera care, and trusted support across Ghana and Nigeria.
          </p>
        </section>

        <section>
          <h3 className="footer-title">Contact</h3>
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
          <h3 className="footer-title">Explore</h3>
          <ul className="footer-list footer-links">
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/products">Products</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/policies">Privacy Policy</Link>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-list footer-links">
            <li>
              <Link href="/products">New Arrivals</Link>
            </li>
            <li>
              <Link href="/products">Best Sellers</Link>
            </li>
            <li>
              <Link href="/products">Bundles</Link>
            </li>
            <li>
              <Link href="/about/entrepreneurship-training">Training</Link>
            </li>
          </ul>
        </section>
      </div>

      <div className="container footer-bottom">
        <p>Copyright © 2026 Da Essence</p>
        <p>Secure checkout • Fast support • Natural skincare.</p>
      </div>
    </footer>
  );
}
