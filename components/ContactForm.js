"use client";

import { useState } from "react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("Sending...");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setStatus(data?.error?.message || "Unable to submit form.");
      return;
    }

    setStatus("Message received. We will get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <form className="card" style={{ padding: 18 }} onSubmit={onSubmit}>
      <h2 style={{ marginTop: 0 }}>Contact Support</h2>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" value={form.name} onChange={(e) => setField("name", e.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea id="message" rows={6} value={form.message} onChange={(e) => setField("message", e.target.value)} required />
      </div>
      <button className="btn btn-primary">Submit</button>
      {status ? <p style={{ marginBottom: 0 }}>{status}</p> : null}
    </form>
  );
}
