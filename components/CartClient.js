"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function cents(v) {
  return `$${((v || 0) / 100).toFixed(2)}`;
}

export function CartClient() {
  const [cart, setCart] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState("");

  async function loadCart() {
    const id = localStorage.getItem("da_cart_id");
    if (!id) return;

    const res = await fetch(`/api/cart?id=${id}`);
    if (res.ok) {
      const data = await res.json();
      setCart(data);
      return;
    }

    if (res.status === 404) {
      localStorage.removeItem("da_cart_id");
      setCart(null);
      setError("Your previous cart expired. Add an item to create a new cart.");
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function updateItem(itemId, quantity) {
    const res = await fetch(`/api/cart/items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) {
      setError("Unable to update item.");
      return;
    }

    const data = await res.json();
    setCart(data.cart);
  }

  async function applyCoupon() {
    if (!couponCode.trim() || !cart?.id) return;

    const res = await fetch("/api/cart/apply-coupon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartId: cart.id, code: couponCode.trim() }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data?.error?.message || "Invalid coupon.");
      return;
    }

    const result = await res.json();
    setCart((prev) => (prev ? { ...prev, coupon: result.coupon, totals: result.totals } : prev));
    setError("");
  }

  const hasItems = useMemo(() => (cart?.items?.length || 0) > 0, [cart]);

  if (!cart) {
    return <p>No cart yet. Visit product page to add items.</p>;
  }

  return (
    <div className="card" style={{ padding: 18 }}>
      <h2 style={{ marginTop: 0 }}>Your Cart</h2>
      {!hasItems ? <p>Your cart is empty.</p> : null}
      {hasItems ? (
        <table className="table" aria-label="Cart items">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((item) => (
              <tr key={item.id}>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>{cents(item.unitPriceCents)}</td>
                <td>{cents(item.lineTotalCents)}</td>
                <td style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-secondary" onClick={() => updateItem(item.id, Math.max(0, item.quantity - 1))}>
                    -
                  </button>
                  <button className="btn btn-secondary" onClick={() => updateItem(item.id, item.quantity + 1)}>
                    +
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          placeholder="Coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          style={{ maxWidth: 240 }}
        />
        <button className="btn btn-secondary" onClick={applyCoupon}>
          Apply Coupon
        </button>
      </div>

      {error ? <p style={{ color: "#7f1d1d" }}>{error}</p> : null}

      <div style={{ marginTop: 16, borderTop: "1px solid #d8cfbb", paddingTop: 14 }}>
        <p>Subtotal: {cents(cart.totals?.subtotalCents || 0)}</p>
        <p>Discount: {cents(cart.totals?.discountCents || 0)}</p>
        <p><strong>Total: {cents(cart.totals?.totalCents || 0)}</strong></p>
      </div>

      <div style={{ marginTop: 16 }}>
        <Link href="/checkout" className="btn btn-primary" aria-disabled={!hasItems}>
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
