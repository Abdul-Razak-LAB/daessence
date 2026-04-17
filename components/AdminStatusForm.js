"use client";

import { useState } from "react";

export function AdminStatusForm() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("packed");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrierName, setCarrierName] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setMessage("Updating...");

    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status, trackingNumber, carrierName }),
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data?.error?.message || "Failed to update order.");
      return;
    }

    setMessage(`Order ${data.orderNumber} updated to ${data.status}.`);
  }

  return (
    <form className="card" style={{ padding: 18 }} onSubmit={onSubmit}>
      <h2 style={{ marginTop: 0 }}>Admin: Update Order Status</h2>
      <div className="field">
        <label htmlFor="orderId">Order ID (UUID)</label>
        <input id="orderId" value={orderId} onChange={(e) => setOrderId(e.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="status">Status</label>
        <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">pending</option>
          <option value="paid">paid</option>
          <option value="packed">packed</option>
          <option value="shipped">shipped</option>
          <option value="delivered">delivered</option>
          <option value="cancelled">cancelled</option>
          <option value="refunded">refunded</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="carrier">Carrier Name</label>
        <input id="carrier" value={carrierName} onChange={(e) => setCarrierName(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="tracking">Tracking Number</label>
        <input id="tracking" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="token">Admin Token (if required)</label>
        <input id="token" type="password" value={token} onChange={(e) => setToken(e.target.value)} />
      </div>
      <button className="btn btn-primary">Update Status</button>
      {message ? <p>{message}</p> : null}
    </form>
  );
}
