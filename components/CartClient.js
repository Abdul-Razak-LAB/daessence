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
  const [loading, setLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState("");

  function toEmptyCart(snapshot) {
    return {
      id: snapshot.id,
      email: snapshot.email || null,
      status: snapshot.status || "active",
      items: [],
      totals: {
        subtotalCents: 0,
        discountCents: 0,
        shippingCents: 0,
        totalCents: 0,
      },
    };
  }

  async function createFreshCart() {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: localStorage.getItem("da_cart_email") || undefined }),
    });

    if (!res.ok) {
      throw new Error("Unable to create a new cart right now.");
    }

    const data = await res.json();
    localStorage.setItem("da_cart_id", data.id);
    window.dispatchEvent(new Event("da_cart_updated"));
    return toEmptyCart(data);
  }

  async function loadCart() {
    try {
      setLoading(true);
      const id = localStorage.getItem("da_cart_id");

      if (!id) {
        const fresh = await createFreshCart();
        setCart(fresh);
        setError("");
        return;
      }

      const res = await fetch(`/api/cart?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        setCart(data);
        setError("");
        return;
      }

      if (res.status === 404) {
        localStorage.removeItem("da_cart_id");
        window.dispatchEvent(new Event("da_cart_updated"));
        const fresh = await createFreshCart();
        setCart(fresh);
        setError("Your previous cart expired, so we created a new one.");
        return;
      }

      setError("Unable to load cart right now. Please try again.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load cart right now.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function updateItem(itemId, quantity) {
    try {
      setUpdatingItemId(itemId);
      setError("");

      const nextQuantity = Math.max(0, Math.min(20, quantity));
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: nextQuantity }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error?.message || "Unable to update item.");
        return;
      }

      await loadCart();
      window.dispatchEvent(new Event("da_cart_updated"));
    } finally {
      setUpdatingItemId("");
    }
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

  if (loading) {
    return <p>Loading cart...</p>;
  }

  if (!cart) {
    return <p>{error || "No cart yet. Visit product page to add items."}</p>;
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
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => updateItem(item.id, item.quantity - 1)}
                    disabled={updatingItemId === item.id}
                  >
                    -
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => updateItem(item.id, item.quantity + 1)}
                    disabled={updatingItemId === item.id || item.quantity >= 20}
                  >
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
