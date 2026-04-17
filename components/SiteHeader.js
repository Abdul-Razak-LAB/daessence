"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10 }} onClick={closeMenu}>
          <Image src="/assets/Da-Essence-Logo-Final.svg" alt="Da Essence" width={132} height={36} priority />
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="nav-toggle-line" />
          <span className="nav-toggle-line" />
          <span className="nav-toggle-line" />
        </button>

        <nav id="primary-nav" className={`nav-links ${menuOpen ? "is-open" : ""}`} aria-label="Primary">
          <Link href="/products" onClick={closeMenu}>
            Product
          </Link>
          <Link href="/cart" onClick={closeMenu}>
            Cart
          </Link>
          <Link href="/about" onClick={closeMenu}>
            About
          </Link>
          <Link href="/contact" onClick={closeMenu}>
            Contact
          </Link>
          <Link href="/policies" onClick={closeMenu}>
            Policies
          </Link>
        </nav>
      </div>
    </header>
  );
}
