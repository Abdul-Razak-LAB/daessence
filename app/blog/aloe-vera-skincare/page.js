import Link from "next/link";

export const metadata = {
  title: "Why Aloe Vera Is a Skincare Essential | Da Essence",
  description: "Discover how aloe vera supports hydration, soothing, and gentle cleansing in your natural skincare routine.",
};

export default function AloeVeraSkincarePage() {
  return (
    <div className="container section">
      <article className="card" style={{ padding: "2rem" }}>
        <p className="eyebrow">Ingredient story</p>
        <h1>Why Aloe Vera Is a Skincare Essential</h1>
        <p style={{ color: "#5f665b", lineHeight: 1.8 }}>
          Aloe vera brings calming hydration and skin comfort to natural care routines. Its gel-like texture helps soothe irritation,
          reduce redness, and lock in moisture after cleansing with African soap.
        </p>
        <h2>Benefits for daily skincare</h2>
        <ul>
          <li>Helps restore moisture without feeling heavy.</li>
          <li>Calms skin after cleansing and environmental stress.</li>
          <li>Supports a balanced natural glow with gentle nourishment.</li>
        </ul>
        <p style={{ color: "#5f665b", lineHeight: 1.8 }}>
          At Da Essence, aloe vera is blended carefully so the African soap remains effective while helping skin feel soft and refreshed.
          This makes it ideal for sensitive and combination skin types.
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
