"use client";

import { useState } from "react";

export function TrainingInterestForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessGoal: "",
  });
  const [status, setStatus] = useState("");

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("Submitting...");

    const message = [
      "Entrepreneurship Training Interest",
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone || "N/A"}`,
      `Business Goal: ${form.businessGoal || "Not provided"}`,
    ].join("\n");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        message,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setStatus(data?.error?.message || "Unable to submit interest right now.");
      return;
    }

    setStatus("Interest registered successfully. Our training team will contact you soon.");
    setForm({ name: "", email: "", phone: "", businessGoal: "" });
  }

  return (
    <form className="card" style={{ padding: 18 }} onSubmit={onSubmit}>
      <h2 style={{ marginTop: 0 }}>Register Interest</h2>
      <div className="field">
        <label htmlFor="training-name">Full Name</label>
        <input id="training-name" value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="training-email">Email</label>
        <input id="training-email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="training-phone">Phone (optional)</label>
        <input id="training-phone" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="training-goal">Business Goal (optional)</label>
        <textarea
          id="training-goal"
          rows={4}
          value={form.businessGoal}
          onChange={(e) => updateField("businessGoal", e.target.value)}
          placeholder="Tell us what you want to achieve with the training"
        />
      </div>
      <button className="btn btn-primary">Submit Interest</button>
      {status ? <p style={{ marginBottom: 0 }}>{status}</p> : null}
    </form>
  );
}
