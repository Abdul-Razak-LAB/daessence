"use client";

import { useEffect, useRef, useState } from "react";
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
  const [cartCount, setCartCount] = useState(0);
  const headerRef = useRef(null);

  useEffect(() => {
    let isActive = true;

    async function syncCartCount() {
      const cartId = localStorage.getItem("da_cart_id");
      if (!cartId) {
        if (isActive) setCartCount(0);
        return;
      }

      try {
        const res = await fetch(`/api/cart?id=${cartId}`);
        if (!res.ok) {
          if (res.status === 404) {
            localStorage.removeItem("da_cart_id");
          }
          if (isActive) setCartCount(0);
          return;
        }

        const cart = await res.json();
        const nextCount = (cart.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
        if (isActive) setCartCount(nextCount);
      } catch {
        if (isActive) setCartCount(0);
      }
    }

    function onCartUpdated() {
      void syncCartCount();
    }

    void syncCartCount();
    window.addEventListener("da_cart_updated", onCartUpdated);
    window.addEventListener("storage", onCartUpdated);

    return () => {
      isActive = false;
      window.removeEventListener("da_cart_updated", onCartUpdated);
      window.removeEventListener("storage", onCartUpdated);
    };
  }, []);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!headerRef.current || headerRef.current.contains(event.target)) {
        return;
      }
      setMenuOpen(false);
    }

    function handleResize() {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("touchstart", handleOutsideClick);
    window.addEventListener("pointerdown", handleOutsideClick);
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("touchstart", handleOutsideClick);
      window.removeEventListener("pointerdown", handleOutsideClick);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  return (
    <header className="site-header" ref={headerRef}>
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
          onClick={toggleMenu}
        >
          <span className="nav-toggle-line" />
          <span className="nav-toggle-line" />
          <span className="nav-toggle-line" />
        </button>

        <nav
          id="primary-nav"
          className={`nav-links ${menuOpen ? "is-open" : ""}`}
          aria-label="Primary navigation"
          onClickCapture={closeMenu}
        >
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={closeMenu}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/cart"
            className="btn btn-nav-cta cart-link"
            onClick={closeMenu}
            aria-label={cartCount > 0 ? `Cart with ${cartCount} item${cartCount === 1 ? "" : "s"}` : "Cart"}
          >
            <span aria-hidden="true">🛒</span>
            {cartCount > 0 ? <span className="cart-badge">{cartCount}</span> : null}
          </Link>
        </nav>
      </div>
    </header>
  );
}
