"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

async function ensureCart(email) {
  const existingId = typeof window !== "undefined" ? localStorage.getItem("da_cart_id") : null;
  if (existingId) {
    const check = await fetch(`/api/cart?id=${existingId}`);
    if (check.ok) {
      return existingId;
    }
    localStorage.removeItem("da_cart_id");
  }

  const response = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email || undefined }),
  });
  const responseText = await response.text();
  let cart;
  try {
    cart = JSON.parse(responseText);
  } catch {
    throw new Error(`Unable to create cart (HTTP ${response.status}). Please refresh and try again.`);
  }

  if (!response.ok) {
    throw new Error(cart?.error?.message || `Unable to create cart (HTTP ${response.status}).`);
  }

  if (cart.id) {
    localStorage.setItem("da_cart_id", cart.id);
    if (email) localStorage.setItem("da_cart_email", email);
    return cart.id;
  }

  throw new Error("Could not create cart");
}

export function AddToCartButton({ productId }) {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function onAdd() {
    try {
      setLoading(true);
      setMessage("");
      const cartId = await ensureCart(localStorage.getItem("da_cart_email") || undefined);

      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, productId, quantity: qty }),
      });

      if (!res.ok) {
        const responseText = await res.text();
        let err;
        try {
          err = JSON.parse(responseText);
        } catch {
          throw new Error(`Unable to add item (HTTP ${res.status}). Please refresh and try again.`);
        }
        throw new Error(err?.error?.message || "Unable to add item");
      }

      setMessage("Added to cart");
      window.dispatchEvent(new Event("da_cart_updated"));
      router.refresh();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <label htmlFor="qty">Qty</label>
        <input
          id="qty"
          type="number"
          min={1}
          max={20}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
          style={{ width: 80 }}
        />
      </div>
      <button className="btn btn-primary" onClick={onAdd} disabled={loading}>
        {loading ? "Adding..." : "Add to Cart"}
      </button>
      {message ? <small style={{ color: "#0f5c44" }}>{message}</small> : null}
    </div>
  );
}
