"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/policies", label: "Policies" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="brand-link" onClick={closeMenu}>
          <Image src="/assets/Da-Essence-Logo-Final.svg" alt="Da Essence logo" width={132} height={36} priority />
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="nav-toggle-line" />
          <span className="nav-toggle-line" />
          <span className="nav-toggle-line" />
        </button>

        <nav id="primary-nav" className={`nav-links ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={closeMenu}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/cart" className="btn btn-nav-cta" onClick={closeMenu} aria-label="Cart">
            🛒
          </Link>
        </nav>
      </div>
    </header>
  );
}
