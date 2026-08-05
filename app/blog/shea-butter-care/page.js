import Link from "next/link";

export const metadata = {
  title: "The Benefits of Shea Butter in Daily Care | Da Essence",
  description: "Learn how shea butter nourishes skin after cleansing and supports long-lasting softness.",
};

export default function SheaButterCarePage() {
  return (
    <div className="container section">
      <article className="card" style={{ padding: "2rem" }}>
        <p className="eyebrow">Ingredient story</p>
        <h1>The Benefits of Shea Butter in Daily Care</h1>
        <p style={{ color: "#5f665b", lineHeight: 1.8 }}>
          Shea butter delivers deep nourishment and helps restore skin softness after cleansing. It smooths texture and protects
          skin barrier function in natural skincare rituals.
        </p>
        <h2>Why it matters</h2>
        <ul>
          <li>Helps seal in moisture after washing.</li>
          <li>Supports skin resilience and comfort.</li>
          <li>Works well with botanical cleansing ingredients.</li>
        </ul>
        <p style={{ color: "#5f665b", lineHeight: 1.8 }}>
          Da Essence uses shea butter as a soothing element so your skincare routine feels gentle and replenishing.
        </p>
        <footer style={{ marginTop: "2rem" }}>
          <Link href="/blog" className="btn btn-secondary">
            Back to Journal
          </Link>
        </footer>
      </article>
    </div>
  );
}
