export const metadata = {
  title: "Policies | Da Essence",
};

export default function PoliciesPage() {
  return (
    <div className="container section grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
      <article className="card" style={{ padding: 18 }}>
        <h2 style={{ marginTop: 0 }}>Shipping Policy</h2>
        <p>Orders are processed within 24-48 hours. Delivery windows vary by destination and carrier.</p>
      </article>
      <article className="card" style={{ padding: 18 }}>
        <h2 style={{ marginTop: 0 }}>Returns Policy</h2>
        <p>Unused items can be returned within 14 days. Contact support with your order number for assistance.</p>
      </article>
      <article className="card" style={{ padding: 18 }}>
        <h2 style={{ marginTop: 0 }}>Privacy Policy</h2>
        <p>We only store required order and communication data. We do not sell customer personal information.</p>
      </article>
      <article className="card" style={{ padding: 18 }}>
        <h2 style={{ marginTop: 0 }}>Terms</h2>
        <p>By using this website, you agree to our product usage, ordering, and support terms.</p>
      </article>
    </div>
  );
}
