"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CheckoutForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    stateRegion: "",
    postalCode: "",
    countryCode: "GH",
  });

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const cartId = localStorage.getItem("da_cart_id");
      if (!cartId) throw new Error("No active cart.");

      const payload = {
        cartId,
        customer: {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone || undefined,
        },
        shippingAddress: {
          line1: form.line1,
          line2: form.line2 || undefined,
          city: form.city,
          stateRegion: form.stateRegion || undefined,
          postalCode: form.postalCode || undefined,
          countryCode: form.countryCode,
        },
        billingSameAsShipping: true,
        payment: {
          provider: "placeholder",
          paymentMethodId: "manual-ok",
        },
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message || "Checkout failed");
      }

      const result = await res.json();
      localStorage.removeItem("da_cart_id");
      localStorage.setItem("da_cart_email", form.email);
      router.push(`/order/${result.order.orderNumber}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card" style={{ padding: 18 }} onSubmit={onSubmit}>
      <h2 style={{ marginTop: 0 }}>Checkout</h2>

      <div className="field">
        <label htmlFor="fullName">Full Name</label>
        <input id="fullName" value={form.fullName} onChange={(e) => setField("fullName", e.target.value)} required />
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} required />
      </div>

      <div className="field">
        <label htmlFor="phone">Phone (optional)</label>
        <input id="phone" value={form.phone} onChange={(e) => setField("phone", e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="line1">Address Line 1</label>
        <input id="line1" value={form.line1} onChange={(e) => setField("line1", e.target.value)} required />
      </div>

      <div className="field">
        <label htmlFor="line2">Address Line 2</label>
        <input id="line2" value={form.line2} onChange={(e) => setField("line2", e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="city">City</label>
        <input id="city" value={form.city} onChange={(e) => setField("city", e.target.value)} required />
      </div>

      <div className="field">
        <label htmlFor="stateRegion">State/Region</label>
        <input id="stateRegion" value={form.stateRegion} onChange={(e) => setField("stateRegion", e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="postalCode">Postal Code</label>
        <input id="postalCode" value={form.postalCode} onChange={(e) => setField("postalCode", e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="countryCode">Country Code</label>
        <input
          id="countryCode"
          value={form.countryCode}
          onChange={(e) => setField("countryCode", e.target.value.toUpperCase())}
          maxLength={2}
          required
        />
      </div>

      <button className="btn btn-primary" disabled={loading}>
        {loading ? "Processing..." : "Place Order"}
      </button>

      {error ? <p style={{ color: "#7f1d1d" }}>{error}</p> : null}
    </form>
  );
}
