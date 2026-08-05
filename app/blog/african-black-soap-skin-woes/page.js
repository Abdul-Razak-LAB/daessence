import Link from "next/link";

export const metadata = {
  title: "How To Use African Black Soap To Treat Your Most Frustrating Skin Woes | Da Essence",
  description: "A practical guide to using African black soap for irritation, clogged pores, dryness, and dull skin with a gentle, natural routine.",
};

export default function AfricanBlackSoapSkinWoesPage() {
  return (
    <div className="container section">
      <article className="card" style={{ padding: "2rem" }}>
        <p className="eyebrow">Ingredient guide</p>
        <h1>How To Use African Black Soap To Treat Your Most Frustrating Skin Woes</h1>
        <p style={{ color: "#5f665b", lineHeight: 1.8 }}>
          African black soap has long been valued for its deep cleansing properties and natural plant-based ingredients.
          When used thoughtfully, it can help ease some of the most common skin frustrations, from excess oil and clogged pores
          to irritation and dull, tired-looking skin.
        </p>

        <h2>Start with a gentle approach</h2>
        <p style={{ color: "#5f665b", lineHeight: 1.8 }}>
          If your skin is sensitive, begin by using the soap only once a day and avoid scrubbing. A brief cleanse followed by a
          light moisturizer helps protect your skin barrier while still reaping the benefits of the soap’s purifying properties.
        </p>

        <h2>For oily or congested skin</h2>
        <p style={{ color: "#5f665b", lineHeight: 1.8 }}>
          Use African black soap on the T-zone or areas prone to breakouts, then rinse thoroughly with lukewarm water. Follow with a
          lightweight hydrating layer to maintain balance and reduce the likelihood of over-drying.
        </p>

        <h2>For dryness and irritation</h2>
        <p style={{ color: "#5f665b", lineHeight: 1.8 }}>
          If your skin feels dry or easily irritated, keep usage to a few times per week and pair it with a soothing moisturizer after
          cleansing. The goal is to cleanse without stripping the skin’s natural oils.
        </p>

        <h2>Build a simple routine</h2>
        <ul>
          <li>Cleanse gently with African black soap in the morning or evening.</li>
          <li>Follow with a hydrating toner or aloe-based mist if your skin needs extra comfort.</li>
          <li>Seal in moisture with a lightweight cream or shea butter-rich moisturizer.</li>
          <li>Patch test first, especially if you have sensitive skin.</li>
        </ul>

        <p style={{ color: "#5f665b", lineHeight: 1.8 }}>
          African black soap works best when it supports a balanced routine instead of replacing hydration. Used with care, it can
          help you feel cleaner, calmer, and more confident in your skin.
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
