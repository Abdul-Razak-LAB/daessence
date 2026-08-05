import Link from "next/link";

export const metadata = {
  title: "How to Build a Natural Skincare Routine | Da Essence",
  description: "A simple and effective natural skincare routine featuring Da Essence soap and botanical support.",
};

export default function NaturalSkincareRoutinePage() {
  return (
    <div className="container section">
      <article className="card" style={{ padding: "2rem" }}>
        <p className="eyebrow">Guide</p>
        <h1>How to Build a Natural Skincare Routine</h1>
        <p style={{ color: "#5f665b", lineHeight: 1.8 }}>
          A natural routine begins with gentle cleansing, followed by hydration and care from plant-based ingredients. Da Essence
          products are designed to support this flow without harsh additives.
        </p>
        <h2>Routine steps</h2>
        <ol>
          <li>Cleanse with Da Essence soap to remove impurities and balance skin.</li>
          <li>Rinse and pat dry gently to preserve moisture.</li>
          <li>Apply a lightweight botanical moisturizer or serum for hydration.</li>
          <li>Use the routine consistently for visible glow and comfort.</li>
        </ol>
        <p style={{ color: "#5f665b", lineHeight: 1.8 }}>
          Keep routines simple, focus on quality ingredients, and build consistency around gentle, nourishing care.
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
