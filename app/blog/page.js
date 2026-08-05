import Link from "next/link";

export const metadata = {
  title: "Journal | Da Essence",
  description: "Read ingredient stories, skincare rituals, and natural beauty advice from Da Essence.",
};

const posts = [
  {
    title: "Why Aloe Vera Is a Skincare Essential",
    summary:
      "Aloe vera supports hydration, soothes irritation, and works gently with natural African soap to keep skin balanced.",
    href: "/blog/aloe-vera-skincare",
    image: "/assets/aloe-vera-slices-skin-care-scaled.jpg",
  },
  {
    title: "How To Use African Black Soap To Treat Your Most Frustrating Skin Woes",
    summary:
      "Learn how to work African black soap into a gentle routine to calm irritation, support clarity, and reduce dryness without over-stripping the skin.",
    href: "/blog/african-black-soap-skin-woes",
    image: "/assets/blacksoap.jpg",
  },
  {
    title: "The Benefits of Shea Butter in Daily Care",
    summary:
      "Discover how shea butter restores softness and comfort after cleansing without leaving skin greasy.",
    href: "/blog/shea-butter-care",
    image: "/assets/product-slide5.jpg",
  },
  {
    title: "How to Build a Natural Skincare Routine",
    summary:
      "A simple, effective routine using Da Essence products for cleansing, nourishing, and maintaining a healthy glow.",
    href: "/blog/natural-skincare-routine",
    image: "/assets/remedies-to-cure-acne.jpg",
  },
];

export default function BlogPage() {
  return (
    <div className="container section blog-page-shell" style={{ paddingTop: 0 }}>
      <section className="blog-banner" style={{ marginBottom: "2rem" }}>
        <img src="/assets/blog%20banner.png" alt="Da Essence blog banner" />
      </section>

      <header className="blog-header" style={{ marginBottom: "2rem" }}>
        <p className="eyebrow">Journal</p>
        <h1>Natural skincare stories and ingredient education</h1>
        <p>
          Learn how Da Essence blends heritage ingredients, gentle formulations, and practical routines for lasting skin confidence.
        </p>
      </header>

      <div className="blog-grid">
        {posts.map((post) => (
          <article key={post.href} className="card blog-card">
            {post.image ? <img src={post.image} alt={post.title} className="blog-card-image" /> : null}
            <div className="blog-card-content">
              <h2>{post.title}</h2>
              <p>{post.summary}</p>
              <Link href={post.href} className="text-link">
                Read article
              </Link>
            </div>
          </article>
        ))}
      </div>

      <section className="card blog-cta" style={{ marginTop: "2rem" }}>
        <h2>Want product education and brand updates?</h2>
        <p>
          Visit our product pages and contact team for more details about ingredients, benefits, and the Da Essence journey.
        </p>
        <Link href="/products" className="btn btn-primary">
          Browse products
        </Link>
      </section>
    </div>
  );
}
