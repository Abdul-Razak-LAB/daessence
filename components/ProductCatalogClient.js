"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const variants = [
  { key: "gold", name: "Da Essence Gold", image: "/assets/da-essence-gold.jpg" },
  { key: "plus", name: "Da Essence Plus", image: "/assets/da-essence-plus.jpg" },
  { key: "shea", name: "Da Essence Shea Butter", image: "/assets/da-essence-shea-butter.jpg" },
  { key: "bar", name: "Da Essence Bar Soap", image: "/assets/bar-soap.jpg" },
  { key: "standard2", name: "Da Essence Standard 2", image: "/assets/da-essence-standard-2.jpg" },
  { key: "shower", name: "Da Essence Shower Gel", image: "/assets/shower-gel.jpg" },
];

async function ensureCart() {
  const existingId = localStorage.getItem("da_cart_id");
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
    body: JSON.stringify({ email: localStorage.getItem("da_cart_email") || undefined }),
  });

  const cart = await response.json();
  if (!cart.id) {
    throw new Error("Could not create cart");
  }

  localStorage.setItem("da_cart_id", cart.id);
  return cart.id;
}

export function ProductCatalogClient({ baseProductId, displayPrice }) {
  const [loadingKey, setLoadingKey] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function buyNow(variantKey) {
    if (!baseProductId) {
      setError("Product is not available yet. Please seed product data.");
      return;
    }

    try {
      setLoadingKey(variantKey);
      setError("");

      const cartId = await ensureCart();
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId,
          productId: baseProductId,
          quantity: 1,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error?.message || "Unable to add item to cart");
      }

      router.push("/checkout");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to complete action");
    } finally {
      setLoadingKey("");
    }
  }

  return (
    <div className="container section">
      <h1 style={{ marginTop: 0 }}>Da Essence Products</h1>
      <p style={{ color: "#5f665b", marginTop: 0 }}>
        Choose your preferred Da Essence product presentation. Buy Now adds the item to cart and takes you to checkout for payment.
      </p>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
        {variants.map((item) => (
          <article key={item.key} className="card" style={{ padding: 12, display: "grid", gap: 10 }}>
            <Image
              src={item.image}
              alt={item.name}
              width={480}
              height={480}
              style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 12, border: "1px solid #d8cfbb" }}
            />
            <h3 style={{ margin: 0 }}>{item.name}</h3>
            <p style={{ margin: 0, color: "#0f5c44", fontWeight: 700 }}>{displayPrice}</p>
            <button className="btn btn-primary" onClick={() => buyNow(item.key)} disabled={loadingKey === item.key}>
              {loadingKey === item.key ? "Adding..." : "Buy Now"}
            </button>
          </article>
        ))}
      </div>

      {error ? <p style={{ color: "#7f1d1d" }}>{error}</p> : null}
    </div>
  );
}
